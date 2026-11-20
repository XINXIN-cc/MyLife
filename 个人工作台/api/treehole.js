// Vercel Serverless Function: /api/treehole
// 公共匿名树洞 —— 所有人共享同一份云端数据（Upstash Redis）
// GET  : 拉取帖子列表（?visitorId=xxx 用于计算当前访客的点赞状态）
// POST : action=publish 发布 / action=like 点赞
//
// 隐私：不记录手机号/账号；匿名昵称由 visitorId 哈希稳定映射，同一访客固定一个马甲。
// 点赞用 visitorId 去重（同一访客对同一帖子可再点取消）。

import crypto from 'crypto'

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
const POSTS_KEY = 'lw:treehole:posts' // 全局公共 key，不按用户隔离 —— 大家都能看到
const MAX_POSTS = 200
const MAX_LEN = 500

const ANONYMOUS_NAMES = ['迷路的小猫', '熬夜的星星', '发呆的云朵', '想睡的熊猫', '漂流的瓶子', '匿名的小熊', '深夜的猫头鹰', '迷路的狐狸', '路过的风', '不打烊的月亮']
const AVATAR_COLORS = ['#7BA7C7', '#D4A5A5', '#9BB7A4', '#B8A9C9', '#E8B4A0', '#C5B4A0', '#A0B8C8', '#B0C4A0', '#C9A7B8', '#A8B5D0']
const AI_SYSTEM = '你是校园心情树洞里的暖心回应者。用温柔简短的一句话回应对方的倾诉，像朋友一样，20~60字。不要说教、不要反问、不要加引号、不要解释。只输出回应本身。'

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}
export function treeholeEnabled() { return !!(KV_URL && KV_TOKEN) }

function genId() { return Date.now().toString(36) + crypto.randomBytes(4).toString('hex') }

// 同一 visitorId 每次发布都对应同一个匿名马甲（更真实，也避免换名刷屏）
function identityFor(visitorId) {
  const h = crypto.createHash('sha256').update(String(visitorId || 'guest')).digest()
  const idx = h[0] % ANONYMOUS_NAMES.length
  return { nickname: ANONYMOUS_NAMES[idx], avatarChar: ANONYMOUS_NAMES[idx][0], avatarBg: AVATAR_COLORS[idx] }
}

// 对外输出：把内部 likedBy 数组折算成 likes / liked，不暴露访客 ID
function shapePosts(posts, visitorId) {
  return (posts || []).map((p) => {
    const likedBy = Array.isArray(p.likedBy) ? p.likedBy : []
    return {
      id: p.id,
      content: p.content,
      nickname: p.nickname || '匿名',
      avatarChar: p.avatarChar || '匿',
      avatarBg: p.avatarBg || '#9BB7A4',
      createdAt: p.createdAt || Date.now(),
      likes: likedBy.length,
      liked: likedBy.includes(String(visitorId || 'guest')),
      aiReply: p.aiReply || '',
    }
  })
}

async function loadPosts() {
  if (!treeholeEnabled()) return []
  try {
    const res = await fetch(`${KV_URL}/get/${POSTS_KEY}`, {
      headers: { Authorization: `Bearer ${KV_TOKEN}` },
    })
    if (!res.ok) return []
    const data = await res.json()
    if (!data.result) return []
    const arr = JSON.parse(data.result)
    return Array.isArray(arr) ? arr : []
  } catch { return [] }
}

async function savePosts(posts) {
  if (!treeholeEnabled()) return false
  try {
    const clean = (posts || []).slice(0, MAX_POSTS)
    const res = await fetch(`${KV_URL}/set/${POSTS_KEY}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'text/plain' },
      body: JSON.stringify(clean),
    })
    return res.ok
  } catch { return false }
}

// AI 暖心回应：配了 DeepSeek 就现生成，否则用固定语录兜底
async function makeAiReply(content) {
  const fallback = () => {
    const pool = [
      '抱抱你~ 不管发生什么，总会过去的。',
      '你不是一个人，很多人都有过类似的感受。',
      '辛苦了，今天也要好好吃饭好好睡觉呀。',
      '能说出来就已经很棒了。',
      '慢慢来，一切都会好起来的。',
      '你值得被温柔对待呀。',
      '加油，明天又是新的一天~',
    ]
    return pool[Math.floor(Math.random() * pool.length)]
  }
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) return fallback()
  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + apiKey },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
        stream: false,
        temperature: 0.9,
        max_tokens: 120,
        messages: [
          { role: 'system', content: AI_SYSTEM },
          { role: 'user', content: String(content).slice(0, MAX_LEN) },
        ],
      }),
    })
    if (!res.ok) return fallback()
    const data = await res.json()
    const text = (data.choices?.[0]?.message?.content || '').trim().replace(/^["'「『\s]+|["'」』\s]+$/g, '')
    return text ? text.slice(0, 150) : fallback()
  } catch { return fallback() }
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') { res.status(204).end(); return }

  const visitorId = String(req.query?.visitorId || req.body?.visitorId || 'guest')

  if (req.method === 'GET') {
    if (!treeholeEnabled()) {
      res.status(200).json({ posts: [], cloud: false, tip: '云端树洞未配置：请在 Vercel Storage 添加 Upstash Redis' })
      return
    }
    const posts = await loadPosts()
    res.status(200).json({ posts: shapePosts(posts, visitorId), cloud: true })
    return
  }

  if (req.method === 'POST') {
    if (!treeholeEnabled()) {
      res.status(503).json({ ok: false, error: '云端树洞未配置：请在 Vercel Storage 添加 Upstash Redis' })
      return
    }
    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
    body = body || {}
    const action = body.action
    const posts = await loadPosts()

    if (action === 'publish') {
      const content = String(body.content || '').trim().slice(0, MAX_LEN)
      if (!content) { res.status(400).json({ ok: false, error: '内容不能为空' }); return }
      const aiReply = await makeAiReply(content)
      const post = {
        id: genId(),
        content,
        ...identityFor(visitorId),
        createdAt: Date.now(),
        likedBy: [],
        aiReply,
      }
      posts.unshift(post)
      await savePosts(posts)
      res.status(200).json({ ok: true, posts: shapePosts(posts, visitorId) })
      return
    }

    if (action === 'like') {
      const post = posts.find((p) => p.id === body.postId)
      if (!post) { res.status(404).json({ ok: false, error: '帖子不存在' }); return }
      const likedBy = Array.isArray(post.likedBy) ? post.likedBy : []
      const i = likedBy.indexOf(visitorId)
      if (i >= 0) likedBy.splice(i, 1)
      else likedBy.push(visitorId)
      post.likedBy = likedBy
      await savePosts(posts)
      res.status(200).json({ ok: true, posts: shapePosts(posts, visitorId) })
      return
    }

    res.status(400).json({ ok: false, error: '未知操作，action 应为 publish 或 like' })
    return
  }

  res.status(405).json({ error: 'Method Not Allowed' })
}
