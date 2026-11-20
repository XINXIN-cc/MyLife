import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getDefaultEnabledModules } from '@/config/modules'

export const useUserStore = defineStore('user', () => {
  // ===== 状态 =====
  const user = ref(null) // { account, phone, nickname, interests: [], enabledModules: [] }
  const isInitialized = ref(false)

  // ===== 计算属性 =====
  const isLoggedIn = computed(() => !!user.value)
  const hasSelectedInterests = computed(() => {
    return !!user.value && Array.isArray(user.value.interests) && user.value.interests.length > 0
  })

  // ===== 方法 =====
  // 注入默认测试账号（首次运行时）
  function seedDefaultUser() {
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    const exists = Object.values(users).find((u) => u.phone === '13800000000')
    if (!exists) {
      const interests = ['plan', 'fitness', 'food', 'water', 'relax', 'study']
      users['10000001'] = {
        account: '10000001',
        phone: '13800000000',
        password: 'test123',
        nickname: '测试用户',
        interests,
        enabledModules: getDefaultEnabledModules(interests),
        avatar: '😊',
        aiName: '小暖',
        pet: { type: 'cat', name: '咪咪', enabled: false },
      }
      localStorage.setItem('lw_users', JSON.stringify(users))
    }
  }

  // 从 localStorage 初始化
  function initFromStorage() {
    if (isInitialized.value) return
    seedDefaultUser()
    const saved = localStorage.getItem('lw_current_user')
    if (saved) {
      try {
        user.value = JSON.parse(saved)
      } catch (e) {
        user.value = null
      }
    }
    isInitialized.value = true
  }

  // 生成 8 位随机数字账号
  function generateAccount() {
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    let account
    do {
      account = String(Math.floor(10000000 + Math.random() * 90000000))
    } while (users[account])
    return account
  }

  // 注册
  function register(phone, password, nickname) {
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    const exists = Object.values(users).find((u) => u.phone === phone)
    if (exists) {
      return { success: false, message: '该手机号已被注册' }
    }
    const account = generateAccount()
    users[account] = {
      account,
      phone,
      password,
      nickname: nickname || phone,
      interests: [],
      enabledModules: [],
      avatar: '😊',
      aiName: '小暖',
      pet: { type: 'cat', name: '咪咪', enabled: false },
    }
    localStorage.setItem('lw_users', JSON.stringify(users))
    return { success: true, account }
  }

  // 登录
  function login(phone, password) {
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    const u = Object.values(users).find((u) => u.phone === phone)
    if (!u) {
      return { success: false, message: '该手机号未注册' }
    }
    if (u.password !== password) {
      return { success: false, message: '密码错误' }
    }
    user.value = {
      account: u.account,
      phone: u.phone,
      nickname: u.nickname,
      interests: u.interests || [],
      // 兼容旧用户：如果没有 enabledModules，根据兴趣标签初始化
      enabledModules: u.enabledModules?.length ? u.enabledModules : getDefaultEnabledModules(u.interests || []),
      avatar: u.avatar || '😊',
      aiName: u.aiName || '小暖',
      pet: u.pet || { type: 'cat', name: '咪咪', enabled: false },
    }
    localStorage.setItem('lw_current_user', JSON.stringify(user.value))
    return { success: true }
  }

  // 登出
  function logout() {
    user.value = null
    localStorage.removeItem('lw_current_user')
  }

  // 保存兴趣标签，并根据兴趣初始化启用模块
  function saveInterests(interests) {
    if (!user.value) return
    const enabledModules = getDefaultEnabledModules(interests)
    user.value.interests = interests
    user.value.enabledModules = enabledModules
    localStorage.setItem('lw_current_user', JSON.stringify(user.value))
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    if (users[user.value.account]) {
      users[user.value.account].interests = interests
      users[user.value.account].enabledModules = enabledModules
      localStorage.setItem('lw_users', JSON.stringify(users))
    }
  }

  // 更新启用的功能模块
  function setEnabledModules(modules) {
    if (!user.value) return
    user.value.enabledModules = modules
    localStorage.setItem('lw_current_user', JSON.stringify(user.value))
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    if (users[user.value.account]) {
      users[user.value.account].enabledModules = modules
      localStorage.setItem('lw_users', JSON.stringify(users))
    }
  }

  // 更新昵称
  function updateNickname(nickname) {
    if (!user.value) return
    user.value.nickname = nickname
    localStorage.setItem('lw_current_user', JSON.stringify(user.value))
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    if (users[user.value.account]) {
      users[user.value.account].nickname = nickname
      localStorage.setItem('lw_users', JSON.stringify(users))
    }
  }

  // 更新头像
  function updateAvatar(avatar) {
    if (!user.value) return
    user.value.avatar = avatar
    localStorage.setItem('lw_current_user', JSON.stringify(user.value))
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    if (users[user.value.account]) {
      users[user.value.account].avatar = avatar
      localStorage.setItem('lw_users', JSON.stringify(users))
    }
  }

  // 更新 AI 名字
  function updateAiName(aiName) {
    if (!user.value) return
    user.value.aiName = aiName
    localStorage.setItem('lw_current_user', JSON.stringify(user.value))
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    if (users[user.value.account]) {
      users[user.value.account].aiName = aiName
      localStorage.setItem('lw_users', JSON.stringify(users))
    }
  }

  // 更新手机号
  function updatePhone(phone) {
    if (!user.value) return
    // 简单校验 11 位数字
    if (phone && !/^\d{11}$/.test(phone)) {
      return { success: false, message: '手机号应为 11 位数字' }
    }
    user.value.phone = phone
    localStorage.setItem('lw_current_user', JSON.stringify(user.value))
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    if (users[user.value.account]) {
      users[user.value.account].phone = phone
      localStorage.setItem('lw_users', JSON.stringify(users))
    }
    return { success: true }
  }

  // 更新宠物配置
  function updatePet(pet) {
    if (!user.value) return
    user.value.pet = { ...user.value.pet, ...pet }
    localStorage.setItem('lw_current_user', JSON.stringify(user.value))
    const users = JSON.parse(localStorage.getItem('lw_users') || '{}')
    if (users[user.value.account]) {
      users[user.value.account].pet = user.value.pet
      localStorage.setItem('lw_users', JSON.stringify(users))
    }
  }

  return {
    user,
    isLoggedIn,
    hasSelectedInterests,
    initFromStorage,
    register,
    login,
    logout,
    saveInterests,
    setEnabledModules,
    updateNickname,
    updateAvatar,
    updateAiName,
    updatePhone,
    updatePet,
  }
})
