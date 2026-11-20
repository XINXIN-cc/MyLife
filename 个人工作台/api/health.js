// Vercel Serverless Function: GET /api/health
// 健康检查：确认 AI 后端与云端记忆是否就绪
import { memoryEnabled } from './_lib/store.js'
import { treeholeEnabled } from './treehole.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') { res.status(204).end(); return }
  res.status(200).json({
    status: 'ok',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    ai: !!process.env.DEEPSEEK_API_KEY,
    memory: memoryEnabled(),
    treehole: treeholeEnabled(),
  })
}
