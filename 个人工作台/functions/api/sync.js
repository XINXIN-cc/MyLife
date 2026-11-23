// Cloudflare Pages Function: 整份用户数据云端同步
// GET  /api/sync?user=<手机号>  -> { ok, cloud, data, updatedAt }
// POST /api/sync  { user, data } -> { ok, updatedAt }
// 数据按手机号哈希隔离（不明文），复用 CF KV / Upstash
import { memoryEnabled, kvGet, kvSet, userKey, json, corsHeaders } from './_lib/store.js'

const SYNC_PREFIX = 'lw:sync:'
const MAX_BYTES = 4 * 1024 * 1024 // 单份数据上限 4MB

function syncKey(hash) { return SYNC_PREFIX + hash }

export async function onRequestGet(context) {
  const { env, request } = context
  const url = new URL(request.url)
  const rawUser = url.searchParams.get('user') || ''
  if (!memoryEnabled(env)) return json({ ok: false, cloud: false, message: '云端存储未配置', data: null })
  if (!rawUser) return json({ ok: false, cloud: true, message: '缺少 user 参数', data: null })

  try {
    const hash = await userKey(rawUser)
    const raw = await kvGet(env, syncKey(hash))
    if (!raw) return json({ ok: true, cloud: true, data: null, updatedAt: 0 })
    const payload = JSON.parse(raw)
    return json({
      ok: true,
      cloud: true,
      data: payload.data || null,
      updatedAt: payload.updatedAt || 0,
    })
  } catch (e) {
    return json({ ok: false, cloud: true, message: '读取失败', data: null })
  }
}

export async function onRequestPost(context) {
  const { env, request } = context
  if (!memoryEnabled(env)) return json({ ok: false, cloud: false, message: '云端存储未配置' })

  let body
  try { body = await request.json() } catch { return json({ ok: false, message: '请求格式错误' }) }
  const rawUser = body.user || ''
  const data = body.data
  if (!rawUser) return json({ ok: false, message: '缺少 user 参数' })
  if (!data || typeof data !== 'object') return json({ ok: false, message: '缺少 data' })

  const text = JSON.stringify(data)
  if (text.length > MAX_BYTES) return json({ ok: false, message: '数据过大，无法同步' })

  try {
    const hash = await userKey(rawUser)
    const updatedAt = Date.now()
    const payload = JSON.stringify({ data, updatedAt })
    const saved = await kvSet(env, syncKey(hash), payload)
    if (!saved) return json({ ok: false, message: '写入云端失败' })
    return json({ ok: true, updatedAt })
  } catch (e) {
    return json({ ok: false, message: '写入云端异常' })
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}
