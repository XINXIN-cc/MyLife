import axios from 'axios'

/**
 * 流式对话请求
 * @param {Array} messages - 消息历史 [{role: 'user'|'assistant', content: '...'}]
 * @param {String} systemPrompt - AI 人设系统提示词
 * @param {Function} onTitle - 收到 AI 生成的会话标题时回调 (title) => void
 * @param {Function} onChunk - 每收到一个 token 时的回调 (content) => void
 * @param {Function} onDone - 完成时的回调
 * @param {Function} onError - 出错时的回调
 */
export async function streamChat({
  user_id, messages, systemPrompt, healthContext, memoryEnabled = true, isFirst = false,
  onTitle, onChunk, onDone, onError,
}) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        messages,
        system_prompt: systemPrompt,
        health_context: healthContext || null,
        memory_enabled: memoryEnabled,
        is_first: isFirst,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    let finished = false
    const finish = () => {
      if (finished) return
      finished = true
      onDone?.()
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop()

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed.startsWith('data:')) continue
        const data = trimmed.slice(5).trim()
        if (data === '[DONE]') {
          finish()
          return
        }
        try {
          const parsed = JSON.parse(data)
          if (parsed.error) { onError?.(new Error(parsed.error)); return }
          if (parsed.title) onTitle?.(parsed.title)
          if (parsed.content) onChunk?.(parsed.content)
          if (parsed.done) finish()
        } catch (e) { /* 忽略解析错误 */ }
      }
    }
    finish()
  } catch (e) {
    onError?.(e)
  }
}

/** 检查后端是否可用 */
export async function checkBackend() {
  try {
    const res = await axios.get('/api/health')
    return res.data
  } catch (e) {
    return null
  }
}

/** 获取云端记忆列表 */
export async function fetchMemories(userId) {
  const res = await axios.get('/api/memory', { params: { user_id: userId } })
  return { memories: res.data.memories || [], cloud: !!res.data.cloud, tip: res.data.tip }
}

/** 删除单条记忆（index=-1 清空） */
export async function deleteMemory(userId, index = -1) {
  const res = await axios.delete('/api/memory', { params: { user_id: userId, index } })
  return res.data
}
