// Cloudflare Pages Function: POST /api/chat
// SSE 流式对话 + 云端记忆注入/提取 + 首条消息 AI 生成标题
import { memoryEnabled, loadMemory, userKey, callDeepSeek, extractMemory, genTitle, corsHeaders } from './_lib/store.js'

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

function sse(obj) {
  return 'data: ' + JSON.stringify(obj) + '\n\n'
}

export async function onRequestPost(context) {
  const env = context.env
  if (!env.DEEPSEEK_API_KEY) {
    return new Response(JSON.stringify({ error: 'DEEPSEEK_API_KEY 未配置，请在 Cloudflare Pages → Settings → Environment Variables 添加' }), {
      status: 500,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  let body = {}
  try { body = await context.request.json() } catch { body = {} }
  const {
    messages = [], system_prompt, health_context,
    user_id, memory_enabled = true, is_first = false,
  } = body

  // 1) 云端记忆注入 system prompt
  let systemContent = system_prompt || '你是一个温暖、专业的 AI 伙伴。'
  const userIdHash = user_id ? await userKey(user_id) : ''
  if (memory_enabled !== false && memoryEnabled(env) && userIdHash) {
    const memories = await loadMemory(env, userIdHash)
    if (memories.length) {
      systemContent += '\n\n【关于用户的记忆（自然引用，不要刻意复述或标注）】\n' + memories.map((m) => '- ' + m.content).join('\n')
    }
  }

  // 2) 今日健康数据注入
  if (health_context) {
    const lines = []
    if (health_context.water) {
      const w = health_context.water
      lines.push('喝水进度：已喝 ' + w.count + '/' + w.goal + ' 杯（' + w.percent + '%）')
    }
    if (health_context.checkin) {
      const c = health_context.checkin
      lines.push('打卡进度：' + c.done + '/' + c.total + ' 项，连续 ' + c.streak + ' 天')
    }
    if (lines.length) systemContent += '\n\n【今日健康状态（请在对话中适度关心，不要每条都提）】\n' + lines.join('\n')
  }

  const upstreamMessages = [
    { role: 'system', content: systemContent },
    ...messages.filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
      .map((m) => ({ role: m.role, content: String(m.content != null ? m.content : (m.text || '')) })),
  ]
  const lastUser = [...messages].reverse().find((m) => m && m.role === 'user')
  const userText = lastUser ? String(lastUser.content != null ? lastUser.content : (lastUser.text || '')) : ''

  const upstream = await callDeepSeek(env, { messages: upstreamMessages, temperature: 0.85, max_tokens: 2048, stream: true })
  if (!upstream || !upstream.ok) {
    const detail = upstream ? await upstream.text() : '无法连接 DeepSeek'
    return new Response(JSON.stringify({ error: 'DeepSeek 返回 ' + (upstream?.status || 'err') + ': ' + detail.slice(0, 300) }), {
      status: upstream?.status || 502,
      headers: { ...corsHeaders(), 'Content-Type': 'application/json; charset=utf-8' },
    })
  }

  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      let fullReply = ''
      try {
        const reader = upstream.body.getReader()
        const decoder = new TextDecoder('utf-8')
        let buffer = ''
        while (true) {
          const chunk = await reader.read()
          if (chunk.done) break
          buffer += decoder.decode(chunk.value, { stream: true })
          const parts = buffer.split('\n')
          buffer = parts.pop() || ''
          for (const line of parts) {
            const trimmed = line.trim()
            if (!trimmed.startsWith('data:')) continue
            const data = trimmed.slice(5).trim()
            if (!data || data === '[DONE]') continue
            try {
              const j = JSON.parse(data)
              const content = j.choices?.[0]?.delta?.content
              if (content) {
                fullReply += content
                controller.enqueue(encoder.encode(sse({ content })))
              }
            } catch { /* 忽略解析失败的行 */ }
          }
        }

        // 3) 会话结束后：AI 标题 + 提取记忆（失败不影响主对话）
        if (is_first && userText) {
          try {
            const title = await genTitle(env, userText)
            if (title) controller.enqueue(encoder.encode(sse({ title })))
          } catch { /* ignore */ }
        }
        if (memory_enabled !== false && memoryEnabled(env) && userIdHash && userText) {
          try {
            const memories = await extractMemory(env, userIdHash, userText, fullReply)
            if (memories.length) controller.enqueue(encoder.encode(sse({ memory_count: memories.length })))
          } catch { /* ignore */ }
        }

        controller.enqueue(encoder.encode(sse({ done: true })))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } catch (e) {
        controller.enqueue(encoder.encode(sse({ error: e.message })))
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      ...corsHeaders(),
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      'X-Accel-Buffering': 'no',
    },
  })
}
