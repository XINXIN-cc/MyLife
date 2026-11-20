<template>
  <div class="app-shell" :class="{ 'drawer-open': drawerOpen }">
    <!-- ========== 桌面侧栏（≥900px 显示） ========== -->
    <aside class="desktop-sider" :class="{ collapsed }" v-if="!isMobile">
      <div class="h-full flex flex-col" :style="{ background: 'var(--lw-sidebar, rgba(255,255,255,0.85))' }">
        <!-- 用户头像区（替代品牌） -->
        <div class="flex items-center gap-3 px-4 py-4 border-b shrink-0 cursor-pointer transition-colors hover:bg-gray-50" :style="{ borderColor: 'var(--lw-border)' }" @click="router.push('/settings')">
          <div class="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0" :style="{ background: avatarBg }">
            <img v-if="isImageAvatar" :src="userStore.user?.avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%" />
            <span v-else style="color:#fff;font-weight:600;font-size:16px">{{ (userStore.user?.nickname || 'U')[0] }}</span>
          </div>
          <transition name="fade"><div v-if="!collapsed" class="overflow-hidden min-w-0">
            <div class="font-semibold text-sm whitespace-nowrap truncate" :style="{ color: 'var(--lw-text)' }">{{ userStore.user?.nickname || '用户' }}</div>
            <div class="text-xs whitespace-nowrap truncate" :style="{ color: 'var(--lw-text-secondary)' }">
              {{ userStore.user?.aiName ? `AI: ${userStore.user.aiName}` : '点击进入设置' }}
            </div>
          </div></transition>
        </div>

        <!-- 菜单 -->
        <nav class="flex-1 overflow-y-auto py-2">
          <!-- 首页 -->
          <div
            class="menu-item"
            :class="{ active: activeKey === 'Start' }"
            @click="handleMenuClick('Start')"
          >
            <n-icon size="20"><HomeOutline /></n-icon>
            <span v-if="!collapsed" class="menu-label">首页</span>
          </div>

          <!-- 分组菜单 -->
          <template v-for="g in groupsVisible" :key="g.key">
            <div v-if="!collapsed" class="menu-group-title">{{ g.name }}</div>
            <div
              v-for="item in g.children"
              :key="item.key"
              class="menu-item"
              :class="{ active: activeKey === item.key }"
              @click="handleMenuClick(item.key)"
            >
              <n-icon size="20"><component :is="item.icon" /></n-icon>
              <span v-if="!collapsed" class="menu-label">{{ item.name }}</span>
            </div>
          </template>

          <!-- 我的与设置 -->
          <div class="h-px mx-4 my-2" :style="{ background: 'var(--lw-border)' }"></div>
          <div class="menu-item" :class="{ active: activeKey === 'Settings' }" @click="handleMenuClick('Settings')">
            <n-icon size="20"><SettingsOutline /></n-icon>
            <span v-if="!collapsed" class="menu-label">我的与设置</span>
          </div>
        </nav>

        <!-- 折叠按钮 -->
        <div class="border-t p-3 flex justify-center shrink-0" :style="{ borderColor: 'var(--lw-border)' }">
          <n-button text circle @click="collapsed = !collapsed">
            <template #icon><n-icon size="18"><ChevronBack v-if="!collapsed" /><ChevronForward v-else /></n-icon></template>
          </n-button>
        </div>
      </div>
    </aside>

    <!-- ========== 主区域 ========== -->
    <main class="main-frame">
      <!-- 顶部栏（简洁） -->
      <div class="top-bar">
        <div class="flex items-center gap-2">
          <template v-if="isMobile">
            <n-button text circle size="small" @click="drawerOpen = true">
              <template #icon><n-icon size="20"><MenuOutline /></n-icon></template>
            </n-button>
          </template>
          <span class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">{{ currentTitle }}</span>
        </div>
        <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ dateStr }}</span>
      </div>

      <!-- 主内容 -->
      <div class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <!-- ========== 移动端 Drawer ========== -->
    <div class="mobile-drawer-mask" :class="{ open: drawerOpen }" @click="drawerOpen = false" v-if="isMobile"></div>
    <aside class="mobile-drawer" :class="{ open: drawerOpen }" v-if="isMobile">
      <div class="p-4 flex items-center gap-3 border-b" :style="{ borderColor: 'var(--lw-border)' }">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg shrink-0" :style="{ background: 'var(--lw-primary)' }">
          <n-avatar round size="small" :style="{ background: avatarBg }">
            <img v-if="isImageAvatar" :src="userStore.user.avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%" />
            <span v-else-if="isColorAvatar" style="color:#fff;font-weight:600">{{ (userStore.user?.nickname || 'U')[0] }}</span>
            <span v-else style="color:var(--lw-text-secondary)">U</span>
          </n-avatar>
        </div>
        <div>
          <div class="font-semibold" :style="{ color: 'var(--lw-text)' }">{{ userStore.user?.nickname || '用户' }}</div>
          <div class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">ID: {{ userStore.user?.id }}</div>
        </div>
      </div>

      <div class="py-2 overflow-y-auto" style="height: calc(100% - 80px)">
        <div
          class="m-menu-item"
          :class="{ active: activeKey === 'Start' }"
          @click="go('Start'); drawerOpen = false"
        >
          <n-icon size="20"><HomeOutline /></n-icon>
          <span>首页</span>
        </div>

        <template v-for="g in groupsVisible" :key="g.key">
          <div class="m-menu-group-title">{{ g.name }}</div>
          <div
            v-for="item in g.children"
            :key="item.key"
            class="m-menu-item"
            :class="{ active: activeKey === item.key }"
            @click="go(item.key); drawerOpen = false"
          >
            <n-icon size="20"><component :is="item.icon" /></n-icon>
            <span>{{ item.name }}</span>
          </div>
        </template>

        <div class="m-menu-item" :class="{ active: activeKey === 'Settings' }" @click="go('Settings'); drawerOpen = false">
          <n-icon size="20"><SettingsOutline /></n-icon>
          <span>我的与设置</span>
        </div>

        <div class="m-menu-item" style="color: var(--lw-error)" @click="handleLogout">
          <n-icon size="20"><LogOutOutline /></n-icon>
          <span>退出登录</span>
        </div>
      </div>
    </aside>

    <!-- 桌面宠物 -->
    <DesktopPet v-if="!isMobile" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'
import { MODULES, MODULE_GROUPS, getDefaultEnabledModules } from '@/config/modules'
import DesktopPet from '@/components/DesktopPet.vue'
import {
  HomeOutline, ListOutline, CheckmarkCircleOutline, WaterOutline, HeartOutline,
  FlowerOutline, ChatbubbleEllipsesOutline, SettingsOutline,
  BookOutline, CalendarOutline, SchoolOutline, FlagOutline,
  ChevronBack, ChevronForward, LogOutOutline, MenuOutline,
  GlobeOutline, LeafOutline, MoonOutline, HappyOutline, CashOutline,
} from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const collapsed = ref(false)
const drawerOpen = ref(false)

// 响应式检测
const isMobile = ref(false)
function checkMobile() {
  isMobile.value = window.innerWidth <= 900
}
onMounted(() => { checkMobile(); window.addEventListener('resize', checkMobile) })
onUnmounted(() => window.removeEventListener('resize', checkMobile))

const dateStr = computed(() => {
  const d = new Date()
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return `${d.getMonth() + 1}月${d.getDate()}日 ${weeks[d.getDay()]}`
})

const currentTitle = computed(() => route.meta.title || '首页')
const activeKey = computed(() => route.name)

// 头像处理
const isImageAvatar = computed(() => userStore.user?.avatar?.startsWith('data:'))
const isColorAvatar = computed(() => userStore.user?.avatar?.startsWith('#'))
const avatarBg = computed(() => {
  if (isColorAvatar.value) return userStore.user.avatar
  if (isImageAvatar.value) return 'transparent'
  return 'var(--lw-primary)'
})

// 图标映射
const iconMap = {
  Start: HomeOutline, Checkin: CheckmarkCircleOutline, PlanGoals: ListOutline,
  Study: SchoolOutline, DiaryTreehole: GlobeOutline, Mood: HappyOutline,
  Knowledge: BookOutline, Calendar: CalendarOutline, Health: HeartOutline,
  Water: WaterOutline, Sleep: MoonOutline, Finance: CashOutline,
  Muyu: FlowerOutline, Chat: ChatbubbleEllipsesOutline, Settings: SettingsOutline,
}

// 分组菜单
const groupsVisible = computed(() => {
  let enabled = userStore.user?.enabledModules || []
  if (enabled.length === 0) enabled = getDefaultEnabledModules(userStore.user?.interests || [])
  if (enabled.length === 0) enabled = ['PlanGoals', 'Checkin', 'Water', 'Muyu', 'DiaryTreehole', 'Chat']
  if (userStore.user && userStore.user.enabledModules?.length === 0) {
    userStore.user.enabledModules = enabled
  }
  return MODULE_GROUPS.map((g) => {
    const children = MODULES.filter((m) => m.group === g.key && enabled.includes(m.key)).map((m) => ({
      name: m.name, key: m.key, icon: iconMap[m.key] || ListOutline,
    }))
    return { name: g.name, key: g.key, children }
  }).filter((g) => g.children.length > 0)
})

const mobileTabs = computed(() => {
  const tabs = [
    { key: 'Start', label: '首页', icon: HomeOutline },
    { key: 'Checkin', label: '打卡', icon: CheckmarkCircleOutline },
    { key: 'Water', label: '喝水', icon: WaterOutline },
    { key: 'DiaryTreehole', label: '树洞', icon: GlobeOutline },
    { key: 'Settings', label: '我的', icon: SettingsOutline },
  ]
  return tabs
})

// key → 路由路径映射（驼峰 key 特殊处理）
const keyPathMap = {
  PlanGoals: '/plangoals', DiaryTreehole: '/diary',
}
function handleMenuClick(key) { go(key) }
function go(key) {
  if (key === 'Start') router.push('/')
  else if (keyPathMap[key]) router.push(keyPathMap[key])
  else router.push(`/${key.toLowerCase()}`)
}

function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* ===== 桌面侧栏样式 ===== */
.desktop-sider {
  height: 100vh;
  position: sticky;
  top: 0;
  border-right: 1px solid var(--lw-border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  margin: 2px 10px;
  border-radius: 12px;
  cursor: pointer;
  color: var(--lw-text-secondary);
  transition: all 0.2s ease;
  font-size: 14px;
}
.menu-item:hover {
  background: color-mix(in srgb, var(--lw-bg) 80%, white);
  color: var(--lw-primary);
}
.menu-item.active {
  background: color-mix(in srgb, var(--lw-primary) 14%, transparent);
  color: var(--lw-primary);
  font-weight: 600;
  position: relative;
}
.menu-item.active::before {
  content: '';
  position: absolute;
  left: -10px; top: 50%;
  transform: translateY(-50%);
  width: 3px; height: 18px;
  border-radius: 0 3px 3px 0;
  background: var(--lw-primary);
}
.menu-label { white-space: nowrap; overflow: hidden; }
.menu-group-title {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  padding: 16px 20px 6px;
  text-transform: uppercase;
  color: var(--lw-text-tertiary);
  opacity: 0.7;
}

/* ===== 手机端 Drawer 样式 ===== */
.m-menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px;
  cursor: pointer;
  color: var(--lw-text-secondary);
  transition: all 0.2s ease;
  font-size: 15px;
  border-left: 3px solid transparent;
}
.m-menu-item:hover { background: color-mix(in srgb, var(--lw-primary) 6%, transparent); color: var(--lw-text); }
.m-menu-item.active {
  background: color-mix(in srgb, var(--lw-primary) 10%, transparent);
  color: var(--lw-primary);
  border-left-color: var(--lw-primary);
  font-weight: 600;
}
.m-menu-group-title {
  font-size: 11px;
  padding: 16px 20px 4px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--lw-text-tertiary);
  opacity: 0.65;
}

/* ===== 底部 Tab Bar ===== */
.tab-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  font-size: 11px;
  color: var(--lw-text-tertiary);
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 6px 0;
}
.tab-item.active { color: var(--lw-primary); font-weight: 600; }
.pb-tabbar { padding-bottom: 20px; }

/* 折叠动画 */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
