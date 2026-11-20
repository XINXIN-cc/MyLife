// Vercel Serverless Function: POST /api/chat
// 流式对话 + 云端记忆（注入 + 自动提取）+ 首条消息 AI 生成标题
// 密钥从 Vercel 环境变量读取，记忆存 Upstash Redis

import { loadMemory, addMemoryFromChat, genConversationTitle, memoryEnabled } from './_lib/store.js'

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function send(res, obj) {
  res.write('data: ' + JSON.stringify(obj) + '\n\n')
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') { res.status(204).end(); return }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'DEEPSEEK_API_KEY 未配置，请在 Vercel 项目 Settings → Environment Variables 添加' })
    return
  }

  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = {} }
  }
  body = body || {}
  const {
    messages = [], system_prompt, health_context,
    user_id, memory_enabled = true, is_first = false,
  } = body

  // 1) 读取云端记忆，注入 system prompt
  let systemContent = system_prompt || '你是一个温暖、专业的 AI 伙伴。'
  if (memory_enabled !== false && memoryEnabled() && user_id) {
    const memories = await loadMemory(user_id)
    if (memories.length) {
      const lines = memories.map(m => '- ' + m.content).join('\n')
      systemContent += '\n\n【关于用户的记忆（自然引用，不要刻意复述或标注）】\n' + lines
    }
  }

  // 2) 注入今日健康数据
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
    if (lines.length) {
      systemContent += '\n\n【今日健康状态（请在对话中适度关心，不要每条都提）】\n' + lines.join('\n')
    }
  }

  // 兼容前端 {role, text} 与后端 {role, content}
  const upstreamMessages = [
    { role: 'system', content: systemContent },
    ...messages
      .filter(m => m && (m.role === 'user' || m.role === 'assistant'))
      .map(m => ({ role: m.role, content: String(m.content != null ? m.content : (m.text || '')) })),
  ]

  // 取最后一条用户消息，供记忆提取 / 标题生成使用
  const lastUserText = [...messages].reverse().find(m => m && m.role === 'user')
  const userText = lastUserText ? String(lastUserText.content != null ? lastUserText.content : (lastUserText.text || '')) : ''

  try {
    const upstream = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey,
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        stream: true,
        temperature: 0.85,
        max_tokens: 2048,
        messages: upstreamMessages,
      }),
    })

    if (!upstream.ok) {
      const detail = await upstream.text()
      res.status(upstream.status).json({ error: 'DeepSeek 返回 ' + upstream.status + ': ' + detail.slice(0, 300) })
      return
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

    const reader = upstream.body.getReader()
    const decoder = new TextDecoder('utf-8')
    let buffer = ''
    let fullReply = ''

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
            send(res, { content })
          }
        } catch (e) { /* 忽略解析失败的行 */ }
      }
    }

    // 3) 对话结束后：AI 生成标题 + 提取记忆（失败不影响主对话）
    if (is_first && userText) {
      try {
        const title = await genConversationTitle(userText)
        if (title) send(res, { title })
      } catch (e) { /* ignore */ }
    }
    if (memory_enabled !== false && memoryEnabled() && user_id && userText) {
      try {
        const memories = await addMemoryFromChat(user_id, userText, fullReply)
        if (memories.length) send(res, { memory_count: memories.length })
      } catch (e) { /* ignore */ }
    }

    send(res, { done: true })
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (e) {
    if (!res.headersSent) {
      res.status(502).json({ error: '请求失败: ' + e.message })
    } else {
      send(res, { error: e.message })
      res.write('data: [DONE]\n\n')
      res.end()
    }
  }
}
