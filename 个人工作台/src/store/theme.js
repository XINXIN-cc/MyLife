import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

// 13 套主题，分 3 类
// pattern: 空字符串=无图案(纯背景色), 'dots'=小波点, 'gingham'=格纹, 'plaid'=野餐布格纹
// patternColor: 图案叠加色（半透明），自动注入 body::before / body::after 的 background-image
export const THEME_CATEGORIES = [
  { key: 'basic', name: '基础款' },
  { key: 'duo', name: '双色氛围' },
  { key: 'pattern', name: '韩系图案' },
]

export const themes = [
  // ========== 基础款 ==========
  {
    id: 'blue-gray', name: '简约蓝灰', category: 'basic',
    desc: '柔和蓝灰，干净克制',
    primary: '#4a6b8f', primaryHover: '#3d5675', primarySoft: '#9cc0e2',
    bg: '#f5f7fa', card: '#ffffff',
    text: '#2c3e50', textSecondary: '#6b7280', textTertiary: '#a0a7b0',
    border: '#e5e7eb', sidebar: '#ffffff',
    dot: '#9cc0e2', dot2: '#eaf2fb',
    pattern: '', patternColor: '',
  },
  {
    id: 'korean', name: '韩系奶白', category: 'basic',
    desc: '温润奶白，温柔治愈',
    primary: '#a8b5a0', primaryHover: '#8fa085', primarySoft: '#c5d1be',
    bg: '#faf8f5', card: '#ffffff',
    text: '#3d3d3d', textSecondary: '#8a8a8a', textTertiary: '#b5b5b5',
    border: '#ebe7e0', sidebar: '#fdfcfb',
    dot: '#a8b5a0', dot2: '#f5f1ea',
    pattern: '', patternColor: '',
  },
  {
    id: 'mori', name: '森系抹茶', category: 'basic',
    desc: '清新绿意，自然放松',
    primary: '#7ba87f', primaryHover: '#659068', primarySoft: '#a5c5a8',
    bg: '#f4f7f2', card: '#ffffff',
    text: '#2d3a2e', textSecondary: '#6b7a6d', textTertiary: '#a5b0a7',
    border: '#e0e8de', sidebar: '#f8faf7',
    dot: '#97d6c8', dot2: '#e6f5ef',
    pattern: '', patternColor: '',
  },
  {
    id: 'sakura', name: '樱花淡粉', category: 'basic',
    desc: '柔和粉色，少女心动',
    primary: '#d4a5a5', primaryHover: '#c08e8e', primarySoft: '#e5c4c4',
    bg: '#faf5f5', card: '#ffffff',
    text: '#4a3a3a', textSecondary: '#9a8a8a', textTertiary: '#c5b8b8',
    border: '#f0e3e3', sidebar: '#fdf8f8',
    dot: '#f0aecc', dot2: '#fbeaf2',
    pattern: '', patternColor: '',
  },
  {
    id: 'midnight', name: '深夜墨蓝', category: 'basic',
    desc: '沉静深蓝，专注高效',
    primary: '#5b7a9e', primaryHover: '#4a6685', primarySoft: '#7e9cc0',
    bg: '#1e2530', card: '#283040',
    text: '#e0e6ed', textSecondary: '#9aa5b5', textTertiary: '#6a7585',
    border: '#3a4354', sidebar: '#232b38',
    dot: '#5b7a9e', dot2: '#3a4354',
    pattern: '', patternColor: '',
  },

  // ========== 双色氛围 ==========
  {
    id: 'sunset', name: '海盐日落', category: 'duo',
    desc: '珊瑚 × 金黄，元气满满',
    primary: '#e88b6e', primaryHover: '#d07459', primarySoft: '#f5c66f',
    bg: '#fdf8f2', card: '#ffffff',
    text: '#3d2e2a', textSecondary: '#8a7a72', textTertiary: '#b5a8a0',
    border: '#f0e5dc', sidebar: '#fefaf5',
    dot: '#f28b70', dot2: '#f5c66f',
    pattern: '', patternColor: '',
  },
  {
    id: 'matcha', name: '抹茶焦糖', category: 'duo',
    desc: '绿意 × 暖棕，文艺复古',
    primary: '#8faa72', primaryHover: '#789060', primarySoft: '#d39a67',
    bg: '#f6f4ef', card: '#ffffff',
    text: '#33302a', textSecondary: '#7a7265', textTertiary: '#a5a095',
    border: '#e8e3d6', sidebar: '#faf7f0',
    dot: '#8faa72', dot2: '#d39a67',
    pattern: '', patternColor: '',
  },
  {
    id: 'berry', name: '莓果气泡', category: 'duo',
    desc: '玫红 × 葡萄紫，甜酷混搭',
    primary: '#d968a0', primaryHover: '#c4508a', primarySoft: '#8e78d6',
    bg: '#f9f5fa', card: '#ffffff',
    text: '#3a2c3a', textSecondary: '#857a90', textTertiary: '#b0a8b8',
    border: '#ede4f0', sidebar: '#fcf8fd',
    dot: '#d968a0', dot2: '#8e78d6',
    pattern: '', patternColor: '',
  },
  {
    id: 'aurora', name: '极光夜色', category: 'duo',
    desc: '青绿 × 星云紫，梦幻高级',
    primary: '#4ca9a4', primaryHover: '#3a918c', primarySoft: '#8977ce',
    bg: '#f4f6f9', card: '#ffffff',
    text: '#2c3440', textSecondary: '#727885', textTertiary: '#9fa4b0',
    border: '#e4e8ef', sidebar: '#f8fafc',
    dot: '#4ca9a4', dot2: '#8977ce',
    pattern: '', patternColor: '',
  },

  // ========== 韩系图案 ==========
  {
    id: 'cherry', name: '樱桃苏打', category: 'pattern',
    desc: '小樱桃点点，俏皮可爱',
    primary: '#c94f55', primaryHover: '#b03e44', primarySoft: '#6f9278',
    bg: '#fef6f4', card: '#ffffff',
    text: '#3a2c2c', textSecondary: '#857272', textTertiary: '#b0a0a0',
    border: '#f3e0dd', sidebar: '#fff8f6',
    dot: '#c94f55', dot2: '#6f9278',
    pattern: 'dots', patternColor: '#c94f55',
  },
  {
    id: 'gingham', name: '韩系小格纹', category: 'pattern',
    desc: '温柔小格子，韩系感拉满',
    primary: '#719181', primaryHover: '#5d7a6e', primarySoft: '#d6a5a8',
    bg: '#f4f6f4', card: '#ffffff',
    text: '#2f3633', textSecondary: '#707873', textTertiary: '#a0a5a0',
    border: '#e4e8e3', sidebar: '#f8faf8',
    dot: '#719181', dot2: '#d6a5a8',
    pattern: 'gingham', patternColor: '#719181',
  },
  {
    id: 'butter', name: '黄油野餐布', category: 'pattern',
    desc: '经典野餐格，明媚清新',
    primary: '#7893b8', primaryHover: '#627a9e', primarySoft: '#d7ad3c',
    bg: '#fdfbf4', card: '#ffffff',
    text: '#333a44', textSecondary: '#7a8290', textTertiary: '#a5aab5',
    border: '#ece6d4', sidebar: '#fefcf6',
    dot: '#d7ad3c', dot2: '#7893b8',
    pattern: 'plaid', patternColor: '#d7ad3c',
  },
  {
    id: 'pinkdot', name: '草莓奶昔点', category: 'pattern',
    desc: '小粉点，软萌可爱',
    primary: '#d989a5', primaryHover: '#c5708c', primarySoft: '#f2cdd8',
    bg: '#fff6f8', card: '#ffffff',
    text: '#3d2c32', textSecondary: '#887278', textTertiary: '#b0a0a5',
    border: '#f5e2e7', sidebar: '#fff8fa',
    dot: '#d989a5', dot2: '#f2cdd8',
    pattern: 'dots', patternColor: '#d989a5',
  },
]

export const useThemeStore = defineStore('theme', () => {
  const currentThemeId = ref(localStorage.getItem('lw_theme') || 'blue-gray')

  const currentTheme = ref(themes.find((t) => t.id === currentThemeId.value) || themes[0])

  function applyTheme(theme) {
    currentTheme.value = theme
    currentThemeId.value = theme.id
    localStorage.setItem('lw_theme', theme.id)

    const root = document.documentElement
    root.style.setProperty('--lw-primary', theme.primary)
    root.style.setProperty('--lw-primary-hover', theme.primaryHover)
    root.style.setProperty('--lw-primary-soft', theme.primarySoft || theme.primary)
    root.style.setProperty('--lw-bg', theme.bg)
    root.style.setProperty('--lw-card', theme.card)
    root.style.setProperty('--lw-text', theme.text)
    root.style.setProperty('--lw-text-secondary', theme.textSecondary)
    root.style.setProperty('--lw-text-tertiary', theme.textTertiary || theme.textSecondary)
    root.style.setProperty('--lw-border', theme.border)
    root.style.setProperty('--lw-sidebar', theme.sidebar)
    root.style.setProperty('--lw-success', '#52c41a')
    root.style.setProperty('--lw-warning', '#faad14')
    root.style.setProperty('--lw-error', '#f5222d')

    // 装饰色（body 光斑/圈圈用）— 从 primary 派生出两个柔和色
    const decor1 = theme.decor1 || theme.primary
    const decor2 = theme.decor2 || theme.primaryHover
    root.style.setProperty('--lw-decor-1', decor1)
    root.style.setProperty('--lw-decor-2', decor2)

    // 设置 data-theme 方便 CSS 写特定主题覆盖
    document.body.setAttribute('data-theme', theme.id)

    // body 背景色 + 图案叠加
    const pat = theme.pattern
    const pc = theme.patternColor || 'transparent'
    let bgLayer = theme.bg

    if (pat === 'dots') {
      bgLayer = `radial-gradient(circle, ${pc}55 1.5px, transparent 1.5px) 0 0 / 16px 16px, ${theme.bg}`
    } else if (pat === 'gingham') {
      bgLayer = `linear-gradient(${pc}33 1px, transparent 1px) 0 0 / 18px 18px, linear-gradient(90deg, ${pc}33 1px, transparent 1px) 0 0 / 18px 18px, ${theme.bg}`
    } else if (pat === 'plaid') {
      bgLayer = `linear-gradient(${pc}40 2px, transparent 2px) 0 0 / 28px 28px, linear-gradient(90deg, ${pc}40 2px, transparent 2px) 0 0 / 28px 28px, linear-gradient(${pc}22 1px, transparent 1px) 0 0 / 14px 14px, linear-gradient(90deg, ${pc}22 1px, transparent 1px) 0 0 / 14px 14px, ${theme.bg}`
    }

    document.body.style.background = bgLayer
    document.body.style.backgroundAttachment = 'fixed'
    document.body.style.color = theme.text
  }

  function setTheme(themeId) {
    const theme = themes.find((t) => t.id === themeId)
    if (theme) {
      applyTheme(theme)
    }
  }

  function init() {
    applyTheme(currentTheme.value)
  }

  return {
    currentTheme,
    currentThemeId,
    themes,
    setTheme,
    init,
  }
})
