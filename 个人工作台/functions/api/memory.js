// Cloudflare Pages Function: /api/memory
// GET 读取 / DELETE 删除（按手机号哈希隔离）
import { memoryEnabled, loadMemory, saveMemory, userKey, json, corsHeaders } from './_lib/store.js'

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function onRequestGet(context) {
  const env = context.env
  const url = new URL(context.request.url)
  const raw = url.searchParams.get('user_id') || 'guest'
  if (!memoryEnabled(env)) {
    return json({ memories: [], cloud: false, tip: '云端记忆未配置：请在 Cloudflare Pages → Settings → Functions → KV 绑定，并添加 KV_REST_API_URL/TOKEN 环境变量' })
  }
  const key = await userKey(raw)
  const memories = await loadMemory(env, key)
  return json({ memories, cloud: true })
}

export async function onRequestDelete(context) {
  const env = context.env
  const url = new URL(context.request.url)
  const raw = url.searchParams.get('user_id') || 'guest'
  let indexParam = url.searchParams.get('index')
  if (indexParam === null) {
    try { const b = await context.request.json(); indexParam = b.index } catch { /* ignore */ }
  }
  if (!memoryEnabled(env)) return json({ ok: false, error: '云端记忆未配置' }, 503)
  const key = await userKey(raw)
  const memories = await loadMemory(env, key)
  const index = Number(indexParam ?? -1)
  let next
  if (index === -1) next = []
  else if (Number.isInteger(index) && index >= 0 && index < memories.length) next = memories.filter((_, i) => i !== index)
  else next = memories
  await saveMemory(env, key, next)
  return json({ ok: true, count: next.length, memories: next })
}
