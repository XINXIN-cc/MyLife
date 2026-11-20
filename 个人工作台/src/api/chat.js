import axios from 'axios'

/**
 * 流式对话请求
 * @param {Array} messages - 消息历史 [{role: 'user'|'assistant', content: '...'}]
 * @param {String} systemPrompt - AI 人设系统提示词
 * @param {Function} onChunk - 每收到一个 token 时的回调 (content) => void
 * @param {Function} onDone - 完成时的回调
 * @param {Function} onError - 出错时的回调
 */
export async function streamChat({ user_id, messages, systemPrompt, healthContext, onChunk, onDone, onError }) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        messages,
        system_prompt: systemPrompt,
        health_context: healthContext || null,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() // 保留最后一行可能不完整

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') {
          onDone?.()
          return
        }
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) {
            onError?.(new Error(parsed.error))
            return
          }
          if (parsed.content) {
            onChunk?.(parsed.content)
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
    onDone?.()
  } catch (e) {
    onError?.(e)
  }
}

/**
 * 检查后端是否可用
 */
export async function checkBackend() {
  try {
    const res = await axios.get('/api/health')
    return res.data
  } catch (e) {
    return null
  }
}
