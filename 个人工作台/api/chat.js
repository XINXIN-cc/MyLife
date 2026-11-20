// Vercel Serverless Function: POST /api/chat
// 无状态转发到 DeepSeek，兼容前端 chat.js 的流式 SSE 协议
// 密钥从 Vercel 环境变量 DEEPSEEK_API_KEY 读取

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

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
  const { messages = [], system_prompt, health_context } = body

  // 构造 system prompt（注入今日健康数据，让 AI 能自然关心）
  let systemContent = system_prompt || '你是一个温暖、专业的 AI 伙伴。'
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
      systemContent += '\n\n【今日健康状态（请在对话中适度关心）】\n' + lines.join('\n')
    }
  }

  // 兼容前端 {role, text} 与后端 {role, content} 两种字段
  const upstreamMessages = [
    { role: 'system', content: systemContent },
    ...messages
      .filter(function (m) { return m && (m.role === 'user' || m.role === 'assistant') })
      .map(function (m) { return { role: m.role, content: String(m.content != null ? m.content : (m.text || '')) } })
  ]

  try {
    const upstream = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        stream: true,
        temperature: 0.85,
        max_tokens: 2048,
        messages: upstreamMessages
      })
    })

    if (!upstream.ok) {
      const detail = await upstream.text()
      res.status(upstream.status).json({ error: 'DeepSeek 返回 ' + upstream.status + ': ' + detail.slice(0, 300) })
      return
    }

    // 流式响应头
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
    res.setHeader('Cache-Control', 'no-cache, no-transform')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('X-Accel-Buffering', 'no')

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
          const content = j.choices && j.choices[0] && j.choices[0].delta && j.choices[0].delta.content
          if (content) res.write('data: ' + JSON.stringify({ content: content }) + '\n\n')
        } catch (e) { /* 忽略解析失败的行 */ }
      }
    }
    res.write('data: [DONE]\n\n')
    res.end()
  } catch (e) {
    if (!res.headersSent) {
      res.status(502).json({ error: '请求失败: ' + e.message })
    } else {
      res.write('data: ' + JSON.stringify({ error: e.message }) + '\n\n')
      res.write('data: [DONE]\n\n')
      res.end()
    }
  }
}
