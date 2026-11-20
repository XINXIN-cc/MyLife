# -*- coding: utf-8 -*-
"""
生活工作台 - AI 对话后端
使用 FastAPI + LangChain 调用 DeepSeek API，支持流式输出和长期记忆
"""
import os
import json
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

load_dotenv()

app = FastAPI(title="生活工作台 AI 后端")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 记忆存储目录
MEMORY_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(MEMORY_DIR, exist_ok=True)

DEFAULT_SYSTEM_PROMPT = """你是一个全能、温暖的 AI 伙伴，既能共情陪伴，也能解决实际问题。

## 你能做什么（全方向）
1. **情感陪伴**：倾听、共情、安慰、鼓励、给情绪支持
2. **学习辅导**：解释知识点、讲题、学习方法、制定学习计划、外语练习
3. **技术问答**：编程问题、代码解释、调试思路、技术选型建议
4. **生活建议**：时间管理、健康饮食、运动健身、睡眠改善、人际关系
5. **创意脑暴**：写文案、想点子、起名、写故事、润色文字
6. **知识科普**：科学、历史、地理、文化、心理学等各类常识问答
7. **实用工具**：翻译、总结文章、列提纲、写邮件、做表格
8. **闲聊打趣**：玩梗、猜谜语、讲冷笑话、聊兴趣爱好

## 语气风格
- 默认自然、亲切、像朋友聊天，不要太官方太说教
- 根据问题灵活调整：技术问题专业清晰；情感问题温暖柔软；创意问题活泼有趣
- 回复简洁，不要长篇大论；复杂问题再展开

## 重要规则
- 不要每次结尾都问"还有什么想说的"、"想聊点什么"这类引导语
- 根据用户输入的方向自然回应，该专业就专业，该轻松就轻松
- 只有用户明确说"不知道聊什么"、"无聊"时才主动引导话题
- 如果用户问了超出你能力范围的问题（如实时新闻、具体网址、需要联网的内容），坦诚说不知道，但可以帮分析思路"""


# ===== 数据模型 =====
class ChatRequest(BaseModel):
    user_id: str
    messages: list
    system_prompt: str = DEFAULT_SYSTEM_PROMPT
    health_context: dict | None = None  # 今日健康数据（可选）


# ===== 记忆管理 =====
def get_memory_path(user_id):
    return os.path.join(MEMORY_DIR, f"memory_{user_id}.json")


def load_memory(user_id):
    """加载用户记忆"""
    path = get_memory_path(user_id)
    if not os.path.exists(path):
        return []
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def save_memory(user_id, memories):
    """保存用户记忆"""
    path = get_memory_path(user_id)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(memories, f, ensure_ascii=False, indent=2)


def add_memory(user_id, content):
    """添加一条记忆（去重）"""
    memories = load_memory(user_id)
    # 避免重复
    if any(m["content"] == content for m in memories):
        return
    memories.append({"content": content, "created_at": __import__("time").time()})
    # 最多保留 50 条
    memories = memories[-50:]
    save_memory(user_id, memories)


def get_llm():
    return ChatOpenAI(
        model=os.getenv("DEEPSEEK_MODEL", "deepseek-chat"),
        api_key=os.getenv("DEEPSEEK_API_KEY"),
        base_url=os.getenv("DEEPSEEK_BASE_URL", "https://api.deepseek.com/v1"),
        temperature=0.85,
        streaming=True,
        max_tokens=2048,
    )


def convert_messages(messages, system_prompt):
    result = [SystemMessage(content=system_prompt)]
    for m in messages:
        if m["role"] == "user":
            result.append(HumanMessage(content=m["content"]))
        elif m["role"] == "assistant":
            result.append(AIMessage(content=m["content"]))
    return result


def build_system_prompt(user_id, base_prompt, health_ctx=None):
    """构建带记忆 + 健康数据的系统提示词"""
    memories = load_memory(user_id)
    parts = [base_prompt]

    # 记忆注入
    if memories:
        memory_text = "\n".join([f"- {m['content']}" for m in memories])
        parts.append(f"""
【关于用户的记忆】
以下是你之前了解到的关于用户的信息，请在对话中自然地引用：
{memory_text}
""")

    # 健康数据注入（让 AI 主动关心）
    if health_ctx:
        health_parts = []
        water = health_ctx.get("water")
        if water:
            health_parts.append(f"喝水进度：已喝 {water['count']}/{water['goal']} 杯（{water['percent']}%）")
        checkin = health_ctx.get("checkin")
        if checkin:
            health_parts.append(f"打卡进度：{checkin['done']}/{checkin['total']} 项，连续 {checkin['streak']} 天")
        mood = health_ctx.get("mood")
        if mood:
            health_parts.append(f"今日心情：{mood}")
        steps = health_ctx.get("steps")
        if steps:
            health_parts.append(f"步数：{steps}")

        if health_parts:
            health_text = "\n".join([f"- {h}" for h in health_parts])
            parts.append(f"""
【今日健康状态（请在对话中适度关心）】
{health_text}

你可以自然地提及这些数据，比如用户喝水没达标时提醒一下，心情不好时多陪她聊聊，但不要每条消息都硬塞数据。""")

    return "\n".join(parts)


async def extract_memory(user_id, user_message, ai_reply):
    """用 AI 从对话中提取关键记忆"""
    extract_prompt = f"""从下面的对话中提取用户的个人信息、偏好、重要事实等值得长期记住的内容。
只提取陈述句中的信息，不要提取疑问句。
如果没有值得记住的信息，只回复"无"。
每条记忆用一行表示，不要编号。

用户说：{user_message}
你回复：{ai_reply}

值得记住的信息："""

    llm = get_llm()
    try:
        resp = await llm.ainvoke([HumanMessage(content=extract_prompt)])
        text = resp.content.strip()
        if text and text != "无":
            for line in text.split("\n"):
                line = line.strip().lstrip("-•*0123456789. ")
                if line and len(line) > 2:
                    add_memory(user_id, line)
    except Exception as e:
        print(f"记忆提取失败: {e}")


# ===== 接口 =====
@app.post("/api/chat")
async def chat(request: ChatRequest):
    llm = get_llm()
    system_prompt = build_system_prompt(request.user_id, request.system_prompt, request.health_context)
    langchain_messages = convert_messages(request.messages, system_prompt)

    full_reply = ""

    async def generate():
        nonlocal full_reply
        try:
            async for chunk in llm.astream(langchain_messages):
                content = chunk.content
                if content:
                    full_reply += content
                    yield f"data: {json.dumps({'content': content}, ensure_ascii=False)}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)}, ensure_ascii=False)}\n\n"
            yield "data: [DONE]\n\n"

    # 对话结束后提取记忆（在后台异步执行，不阻塞流式返回）
    async def after_chat():
        user_msgs = [m for m in request.messages if m["role"] == "user"]
        if user_msgs:
            await extract_memory(request.user_id, user_msgs[-1]["content"], full_reply)

    import asyncio
    asyncio.create_task(after_chat())

    return StreamingResponse(generate(), media_type="text/event-stream")


@app.get("/api/memory")
async def get_memory(user_id: str):
    """获取用户记忆列表"""
    return {"memories": load_memory(user_id)}


@app.delete("/api/memory")
async def delete_memory(user_id: str, index: int = -1):
    """删除记忆。index=-1 清空全部，否则删除指定索引"""
    memories = load_memory(user_id)
    if index == -1:
        save_memory(user_id, [])
    elif 0 <= index < len(memories):
        memories.pop(index)
        save_memory(user_id, memories)
    return {"ok": True, "count": len(load_memory(user_id))}


@app.get("/api/health")
async def health():
    return {"status": "ok", "model": os.getenv("DEEPSEEK_MODEL", "deepseek-chat")}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
