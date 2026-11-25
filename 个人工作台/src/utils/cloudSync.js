// 云端数据同步：把整份本地数据打包上传/下载，实现手机/电脑跨设备一致
// 数据按手机号哈希隔离；存储时用「规范化 key」（去掉账号前缀），
// 这样手机和电脑注册出不同 8 位账号也能对上同一份数据。
import { getStore, setStore } from './storage'

const PHONE_KEY = 'lw_sync_phone'
const SYNC_TIME_KEY = 'lw_sync_time'
const PULLING_FLAG = 'lw_sync_pulling'
const PROFILE_MTIME_KEY = 'lw_profile_mtime' // 本地资料最后修改时间：用于和云端比对，谁新谁生效

let pushTimer = null
let lastPushHash = ''

function currentPhone() {
  try {
    const u = JSON.parse(localStorage.getItem('lw_current_user') || 'null')
    return u?.phone || localStorage.getItem(PHONE_KEY) || ''
  } catch { return localStorage.getItem(PHONE_KEY) || '' }
}

function isPulling() { return localStorage.getItem(PULLING_FLAG) === '1' }

// 收集当前账号的所有业务数据（规范化：去掉 lw_<account>_ 前缀）
function collectData() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('lw_current_user') || 'null') } catch { return null } })()
  const account = user?.account || ''
  const prefix = account ? `lw_${account}_` : ''
  const store = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (!k) continue
    // 只收当前账号命名空间下的业务数据
    if (prefix && k.startsWith(prefix)) {
      store[k.slice(prefix.length)] = safeParse(localStorage.getItem(k))
    }
  }
  return {
    profile: user,
    store,
    theme: localStorage.getItem('lw_theme') || '',
    visits: safeParse(localStorage.getItem('lw_page_visits')),
    profileMtime: Number(localStorage.getItem(PROFILE_MTIME_KEY) || 0),
  }
}

function safeParse(s) {
  if (s == null) return null
  try { return JSON.parse(s) } catch { return s }
}

// 把云端数据写回本地（写回当前账号命名空间）
function applyData(data) {
  if (!data || typeof data !== 'object') return
  const user = (() => { try { return JSON.parse(localStorage.getItem('lw_current_user') || 'null') } catch { return null } })()
  const account = user?.account || ''
  const prefix = account ? `lw_${account}_` : ''
  // 标记拉取中，避免 setStore 触发回传造成循环
  localStorage.setItem(PULLING_FLAG, '1')
  try {
    if (data.profile && typeof data.profile === 'object') {
      // 谁的资料更晚修改，谁生效——避免云端旧资料把本地刚改的覆盖回去
      const localMtime = Number(localStorage.getItem(PROFILE_MTIME_KEY) || 0)
      const cloudMtime = Number(data.profileMtime || 0)
      // 本地有修改记录且不比云端旧 → 保留本地资料；否则用云端补齐
      const keepLocal = localMtime > 0 && localMtime >= cloudMtime
      const merged = keepLocal
        ? { ...(data.profile || {}), ...(user || {}), account: account || data.profile.account }
        : { ...(user || {}), ...data.profile, account: account || data.profile.account }
      localStorage.setItem('lw_current_user', JSON.stringify(merged))
      if (!keepLocal && cloudMtime > 0) localStorage.setItem(PROFILE_MTIME_KEY, String(cloudMtime))
    }
    if (data.store && typeof data.store === 'object') {
      for (const [k, v] of Object.entries(data.store)) {
        if (prefix) localStorage.setItem(prefix + k, JSON.stringify(v))
      }
    }
    if (typeof data.theme === 'string' && data.theme) localStorage.setItem('lw_theme', data.theme)
    if (data.visits) localStorage.setItem('lw_page_visits', JSON.stringify(data.visits))
    localStorage.setItem(SYNC_TIME_KEY, String(data.updatedAt || Date.now()))
  } finally {
    localStorage.removeItem(PULLING_FLAG)
  }
}

// 上传整份数据（防抖）
export function schedulePush() {
  if (isPulling()) return // 拉取触发的写入不记时间，避免把云端回灌误当成本地改动
  // 本地资料发生改动，立即记录时间（哪怕还没上传，刷新时也能保住新值）
  localStorage.setItem(PROFILE_MTIME_KEY, String(Date.now()))
  const phone = currentPhone()
  if (!phone) return
  clearTimeout(pushTimer)
  pushTimer = setTimeout(() => doPush(phone), 1500)
}

async function doPush(phone) {
  const data = collectData()
  const hash = JSON.stringify(data)
  if (hash === lastPushHash) return // 无变化不传
  try {
    const res = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: phone, data }),
    })
    const out = await res.json()
    if (out.ok) {
      lastPushHash = hash
      localStorage.setItem(SYNC_TIME_KEY, String(out.updatedAt || Date.now()))
    }
  } catch (e) { /* 离线时静默失败，不影响本地使用 */ }
}

// 拉取云端数据覆盖本地。force=true 时即使拉取中标记存在也执行
export async function pullCloud(force = false) {
  const phone = currentPhone()
  if (!phone) return { ok: false, reason: '未登录' }
  if (isPulling() && !force) return { ok: false, reason: '拉取中' }
  localStorage.setItem(PULLING_FLAG, '1')
  try {
    const res = await fetch(`/api/sync?user=${encodeURIComponent(phone)}`)
    const out = await res.json()
    if (!out.ok || !out.cloud) return { ok: false, reason: out.message || '云端不可用' }
    if (out.data) {
      applyData(out.data)
      // 同步成功后重置 push 基线，避免紧接着误判为变更再传一遍
      lastPushHash = JSON.stringify(collectData())
      return { ok: true, hasData: true, updatedAt: out.updatedAt }
    }
    // 云端无数据 -> 把本地现有数据首次上传
    lastPushHash = ''
    await doPush(phone)
    return { ok: true, hasData: false, reason: '已上传本地数据' }
  } catch (e) {
    return { ok: false, reason: '网络异常' }
  } finally {
    localStorage.removeItem(PULLING_FLAG)
  }
}

// 记录当前同步手机号（登录/注册时调用）
export function rememberPhone(phone) {
  if (phone) localStorage.setItem(PHONE_KEY, phone)
}
