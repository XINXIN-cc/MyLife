// Cloudflare Pages Function: GET /api/health
import { memoryEnabled, json, corsHeaders } from './_lib/store.js'

export async function onRequestGet(context) {
  const env = context.env
  return json({
    status: 'ok',
    model: env.DEEPSEEK_MODEL || 'deepseek-chat',
    ai: !!env.DEEPSEEK_API_KEY,
    memory: memoryEnabled(env),
    treehole: memoryEnabled(env),
    sync: memoryEnabled(env),
    platform: 'cloudflare',
  })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}
