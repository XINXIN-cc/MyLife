// Vercel Serverless Function: GET/DELETE /api/memory
// 云端记忆的读取与删除（按 user_id 隔离）
import { loadMemory, saveMemory, memoryEnabled } from './_lib/store.js'

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

export default async function handler(req, res) {
  cors(res)
  if (req.method === 'OPTIONS') { res.status(204).end(); return }

  const userId = String(req.query?.user_id || req.body?.user_id || 'guest')

  if (req.method === 'GET') {
    if (!memoryEnabled()) {
      res.status(200).json({ memories: [], cloud: false, tip: '云端记忆未配置：请在 Vercel Storage 添加 Upstash Redis' })
      return
    }
    const memories = await loadMemory(userId)
    res.status(200).json({ memories, cloud: true })
    return
  }

  if (req.method === 'DELETE') {
    if (!memoryEnabled()) {
      res.status(503).json({ ok: false, error: '云端记忆未配置' })
      return
    }
    const index = Number(req.query?.index ?? req.body?.index ?? -1)
    const memories = await loadMemory(userId)
    let next
    if (index === -1) next = []
    else if (Number.isInteger(index) && index >= 0 && index < memories.length) {
      next = memories.filter((_, i) => i !== index)
    } else {
      next = memories
    }
    await saveMemory(userId, next)
    res.status(200).json({ ok: true, count: next.length, memories: next })
    return
  }

  res.status(405).json({ error: 'Method Not Allowed' })
}
