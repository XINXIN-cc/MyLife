// 本地数据存储工具 - 按用户的 8 位账号 ID 隔离数据

function getNamespace() {
  const user = localStorage.getItem('lw_current_user')
  if (user) {
    try {
      return `lw_${JSON.parse(user).account}`
    } catch {
      return 'lw_guest'
    }
  }
  return 'lw_guest'
}

export function getStore(key, defaultValue = []) {
  const ns = getNamespace()
  const raw = localStorage.getItem(`${ns}_${key}`)
  if (!raw) return defaultValue
  try {
    return JSON.parse(raw)
  } catch {
    return defaultValue
  }
}

export function setStore(key, value) {
  const ns = getNamespace()
  localStorage.setItem(`${ns}_${key}`, JSON.stringify(value))
}

export function removeStore(key) {
  const ns = getNamespace()
  localStorage.removeItem(`${ns}_${key}`)
}

// 生成唯一 ID
export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// 获取今日日期字符串 YYYY-MM-DD
export function todayStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 获取明日日期字符串
export function tomorrowStr() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
