// 云端记忆存储（Upstash Redis REST API，零第三方依赖）
// 在 Vercel 项目 Storage 里添加 Upstash Redis 后，会自动注入下面两个环境变量
// 兼容新旧两套命名：KV_REST_API_* （Vercel KV）与 UPSTASH_REDIS_REST_*

import crypto from 'crypto'

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
const KEY_PREFIX = 'lw:mem:'
const MAX_MEMORIES = 50

export function memoryEnabled() {
  return !!(KV_URL && KV_TOKEN)
}

// 用 sha256 做 key，避免手机号明文存在 Redis 里
function memoryKey(userId) {
  const raw = String(userId || 'guest')
  return KEY_PREFIX + crypto.createHash('sha256').update(raw).digest('hex').slice(0, 20)
}

export async function loadMemory(userId) {
  if (!memoryEnabled()) return []
  try {
    const res = await fetch(`${KV_URL}/get/${memoryKey(userId)}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.result) return []
    const arr = JSON.parse(data.result)
    return Array.isArray(arr) ? arr : []
  } catch (e) {
    return []
  }
}

export async function saveMemory(userId, memories) {
  if (!memoryEnabled()) return false
  try {
    const clean = (memories || []).slice(-MAX_MEMORIES)
    const res = await fetch(`${KV_URL}/set/${memoryKey(userId)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'text/plain' },
      body: JSON.stringify(clean),
    })
    return res.ok
  } catch (e) {
    return false
  }
}

// 从一轮对话里提取值得长期记住的信息，写入云端（去重、限量）
export async function addMemoryFromChat(userId, userText, aiReply) {
  if (!memoryEnabled() || !userText) return []
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return []

  const extractPrompt = `从下面的对话里，提取用户明确说过的、值得长期记住的个人信息（如姓名、身份、偏好、习惯、目标、重要事实）。
规则：
- 只提取用户说过的陈述句，不要提取疑问句，不要提取 AI 说的话
- 每条 8~40 字，简短清楚
- 最多 3 条，没有就只回复「无」
- 每条单独一行，不要编号、不要符号

用户说：${String(userText).slice(0, 800)}
AI 回复：${String(aiReply || '').slice(0, 800)}

值得记住的信息：`

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        stream: false,
        temperature: 0.3,
        max_tokens: 300,
        messages: [{ role: 'user', content: extractPrompt }],
      }),
    })
    if (!res.ok) return []
    const data = await res.json()
    const text = (data.choices?.[0]?.message?.content || '').trim()
    if (!text || text === '无' || text.startsWith('无\n')) return []

    const lines = text.split('\n')
      .map(l => l.replace(/^[\s\-•*0-9.、]+/, '').trim())
      .filter(l => l.length >= 4 && l.length <= 60 && l !== '无')
      .slice(0, 3)
    if (!lines.length) return []

    const memories = await loadMemory(userId)
    let changed = false
    for (const line of lines) {
      if (!memories.some(m => m.content === line)) {
        memories.push({ content: line, created_at: Date.now() })
        changed = true
      }
    }
    if (changed) await saveMemory(userId, memories)
    return memories
  } catch (e) {
    return []
  }
}

// 给首条消息生成会话标题
export async function genConversationTitle(userText) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return ''
  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        stream: false,
        temperature: 0.5,
        max_tokens: 40,
        messages: [
          { role: 'user', content: `用 4~10 个中文字符概括下面这段话的主题，只输出标题本身，不要引号、标点和解释。\n\n${String(userText).slice(0, 300)}` },
        ],
      }),
    })
    if (!res.ok) return ''
    const data = await res.json()
    const title = (data.choices?.[0]?.message?.content || '').trim()
      .replace(/^["'「『\s]+|["'」』\s]+$/g, '')
      .slice(0, 20)
    return title
  } catch (e) {
    return ''
  }
}
