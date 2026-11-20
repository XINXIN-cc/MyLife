// Cloudflare Pages Function: /api/treehole
// 公共匿名树洞 —— 所有人共享（Upstash Redis），访客稳定马甲 + 点赞去重
import { memoryEnabled, sha256hex, kvGet, kvSet, warmReply, json, corsHeaders, genId } from './_lib/store.js'

const POSTS_KEY = 'lw:treehole:posts'
const MAX_POSTS = 200
const MAX_LEN = 500
const NAMES = ['迷路的小猫', '熬夜的星星', '发呆的云朵', '想睡的熊猫', '漂流的瓶子', '匿名的小熊', '深夜的猫头鹰', '迷路的狐狸', '路过的风', '不打烊的月亮']
const COLORS = ['#7BA7C7', '#D4A5A5', '#9BB7A4', '#B8A9C9', '#E8B4A0', '#C5B4A0', '#A0B8C8', '#B0C4A0', '#C9A7B8', '#A8B5D0']

async function loadPosts(env) {
  try {
    const raw = await kvGet(env, POSTS_KEY)
    if (!raw) return []
    const arr = JSON.parse(raw)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

async function savePosts(env, posts) {
  try {
    return await kvSet(env, POSTS_KEY, JSON.stringify((posts || []).slice(0, MAX_POSTS)))
  } catch { return false }
}

async function identityFor(visitorId) {
  const hex = await sha256hex(visitorId || 'guest')
  const idx = parseInt(hex.slice(0, 2), 16) % NAMES.length
  return { nickname: NAMES[idx], avatarChar: NAMES[idx][0], avatarBg: COLORS[idx] }
}

function shape(posts, visitorId) {
  return (posts || []).map((p) => {
    const likedBy = Array.isArray(p.likedBy) ? p.likedBy : []
    return {
      id: p.id, content: p.content,
      nickname: p.nickname || '匿名', avatarChar: p.avatarChar || '匿', avatarBg: p.avatarBg || '#9BB7A4',
      createdAt: p.createdAt || Date.now(),
      likes: likedBy.length, liked: likedBy.includes(visitorId),
      aiReply: p.aiReply || '',
    }
  })
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

export async function onRequestGet(context) {
  const env = context.env
  const url = new URL(context.request.url)
  const visitorId = url.searchParams.get('visitorId') || 'guest'
  if (!memoryEnabled(env)) return json({ posts: [], cloud: false, tip: '云端树洞未配置：请绑定 KV_REST_API_URL/TOKEN' })
  const posts = await loadPosts(env)
  return json({ posts: shape(posts, visitorId), cloud: true })
}

export async function onRequestPost(context) {
  const env = context.env
  if (!memoryEnabled(env)) return json({ ok: false, error: '云端树洞未配置：请绑定 KV_REST_API_URL/TOKEN' }, 503)
  let body = {}
  try { body = await context.request.json() } catch { /* ignore */ }
  const visitorId = String(body.visitorId || 'guest')
  const posts = await loadPosts(env)

  if (body.action === 'publish') {
    const content = String(body.content || '').trim().slice(0, MAX_LEN)
    if (!content) return json({ ok: false, error: '内容不能为空' }, 400)
    const post = {
      id: genId(), content,
      ...(await identityFor(visitorId)),
      createdAt: Date.now(), likedBy: [],
      aiReply: await warmReply(env, content),
    }
    posts.unshift(post)
    await savePosts(env, posts)
    return json({ ok: true, posts: shape(posts, visitorId) })
  }

  if (body.action === 'like') {
    const post = posts.find((p) => p.id === body.postId)
    if (!post) return json({ ok: false, error: '帖子不存在' }, 404)
    const likedBy = Array.isArray(post.likedBy) ? post.likedBy : []
    const i = likedBy.indexOf(visitorId)
    if (i >= 0) likedBy.splice(i, 1)
    else likedBy.push(visitorId)
    post.likedBy = likedBy
    await savePosts(env, posts)
    return json({ ok: true, posts: shape(posts, visitorId) })
  }

  return json({ ok: false, error: '未知操作，action 应为 publish 或 like' }, 400)
}
