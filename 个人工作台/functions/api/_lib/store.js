// Cloudflare Pages Functions 共享存储（Upstash Redis REST API，零依赖）
// 环境变量从 context.env 读取；Web Crypto 替代 node:crypto
// 兼容 KV_REST_API_* 与 UPSTASH_REDIS_REST_* 两套命名

// 优先用 Cloudflare 原生 KV（env.WORKBENCH_KV），没有则退回 Upstash REST
// 两种都能用时优先原生（更快、免外部密钥）
function nativeKV(env) { return env.WORKBENCH_KV || null }
function kv(env) {
  return {
    url: env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL || '',
    token: env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN || '',
  }
}
export function memoryEnabled(env) {
  if (nativeKV(env)) return true
  const k = kv(env)
  return !!(k.url && k.token)
}

// 统一读：原生 KV 优先
export async function kvGet(env, key) {
  const nk = nativeKV(env)
  if (nk) { try { return await nk.get(key) } catch { return null } }
  const { url, token } = kv(env)
  if (!url || !token) return null
  try {
    const res = await fetch(`${url}/get/${key}`, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return null
    const data = await res.json()
    return data.result || null
  } catch { return null }
}

// 统一写：原生 KV 优先
export async function kvSet(env, key, value) {
  const nk = nativeKV(env)
  if (nk) { try { await nk.put(key, value); return true } catch { return false } }
  const { url, token } = kv(env)
  if (!url || !token) return false
  try {
    const res = await fetch(`${url}/set/${key}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'text/plain' },
      body: value,
    })
    return res.ok
  } catch { return false }
}

export async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s || '')))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function memoryKey(userId) { return 'lw:mem:' + userId } // userId 已是哈希后的 hex

export async function loadMemory(env, userIdHash) {
  if (!memoryEnabled(env)) return []
  try {
    const raw = await kvGet(env, memoryKey(userIdHash))
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

export async function saveMemory(env, userIdHash, memories) {
  if (!memoryEnabled(env)) return false
  try {
    const clean = (memories || []).slice(-50)
    return await kvSet(env, memoryKey(userIdHash), JSON.stringify(clean))
  } catch { return false }
}

// 前端传来的手机号 → 哈希 key（不明文存储）
export async function userKey(raw) { return (await sha256hex(String(raw || 'guest'))).slice(0, 20) }

const FALLBACK_REPLIES = [
  '抱抱你~ 不管发生什么，总会过去的。',
  '你不是一个人，很多人都有过类似的感受。',
  '辛苦了，今天也要好好吃饭好好睡觉呀。',
  '能说出来就已经很棒了。',
  '慢慢来，一切都会好起来的。',
  '你值得被温柔对待呀。',
  '加油，明天又是新的一天~',
]

export async function callDeepSeek(env, { messages, temperature = 0.85, max_tokens = 2048, stream = false }) {
  const apiKey = env.DEEPSEEK_API_KEY
  if (!apiKey) return null
  return fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
    body: JSON.stringify({
      model: env.DEEPSEEK_MODEL || 'deepseek-chat',
      stream,
      temperature,
      max_tokens,
      messages,
    }),
  })
}

export async function extractMemory(env, userIdHash, userText, aiReply) {
  if (!memoryEnabled(env) || !userText || !env.DEEPSEEK_API_KEY) return []
  const prompt = `从下面的对话里，提取用户明确说过的、值得长期记住的个人信息（如姓名、身份、偏好、习惯、目标、重要事实）。
规则：
- 只提取用户说过的陈述句，不要提取疑问句，不要提取 AI 说的话
- 每条 8~40 字，简短清楚
- 最多 3 条，没有就只回复「无」
- 每条单独一行，不要编号、不要符号

用户说：${String(userText).slice(0, 800)}
AI 回复：${String(aiReply || '').slice(0, 800)}

值得记住的信息：`
  try {
    const res = await callDeepSeek(env, {
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3, max_tokens: 300,
    })
    if (!res || !res.ok) return []
    const data = await res.json()
    const text = (data.choices?.[0]?.message?.content || '').trim()
    if (!text || text === '无' || text.startsWith('无\n')) return []
    const lines = text.split('\n').map((l) => l.replace(/^[\s\-•*0-9.、]+/, '').trim())
      .filter((l) => l.length >= 4 && l.length <= 60 && l !== '无').slice(0, 3)
    if (!lines.length) return []
    const memories = await loadMemory(env, userIdHash)
    let changed = false
    for (const line of lines) {
      if (!memories.some((m) => m.content === line)) {
        memories.push({ content: line, created_at: Date.now() }); changed = true
      }
    }
    if (changed) await saveMemory(env, userIdHash, memories)
    return memories
  } catch { return [] }
}

export async function genTitle(env, userText) {
  if (!env.DEEPSEEK_API_KEY) return ''
  try {
    const res = await callDeepSeek(env, {
      messages: [{ role: 'user', content: `用 4~10 个中文字符概括下面这段话的主题，只输出标题本身，不要引号、标点和解释。\n\n${String(userText).slice(0, 300)}` }],
      temperature: 0.5, max_tokens: 40,
    })
    if (!res || !res.ok) return ''
    const data = await res.json()
    return (data.choices?.[0]?.message?.content || '').trim()
      .replace(/^["'「『\s]+|["'」』\s]+$/g, '').slice(0, 20)
  } catch { return '' }
}

export async function warmReply(env, content) {
  if (!env.DEEPSEEK_API_KEY) return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
  try {
    const res = await callDeepSeek(env, {
      messages: [
        { role: 'system', content: '你是校园心情树洞里的暖心回应者。用温柔简短的一句话回应对方的倾诉，像朋友一样，20~60字。不要说教、不要反问、不要加引号、不要解释。只输出回应本身。' },
        { role: 'user', content: String(content).slice(0, 500) },
      ],
      temperature: 0.9, max_tokens: 120,
    })
    if (!res || !res.ok) throw new Error('ai')
    const data = await res.json()
    const text = (data.choices?.[0]?.message?.content || '').trim().replace(/^["'「『\s]+|["'」』\s]+$/g, '')
    return text ? text.slice(0, 150) : FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)]
  } catch { return FALLBACK_REPLIES[Math.floor(Math.random() * FALLBACK_REPLIES.length)] }
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}
export function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders(), 'Content-Type': 'application/json; charset=utf-8' },
  })
}
export function genId() {
  return (globalThis.crypto?.randomUUID?.() || (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)))
}
