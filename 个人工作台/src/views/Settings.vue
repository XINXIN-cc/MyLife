<template>
  <div class="wx-page">
    <!-- ========== 顶部：头像大卡（点击编辑） ========== -->
    <div class="wx-hero" @click="profileDrawer = true">
      <div class="wx-hero-bg"></div>
      <div class="wx-hero-content">
        <div
          class="wx-avatar"
          :style="{ background: profileForm.avatar.startsWith('#') ? profileForm.avatar : 'rgba(255,255,255,0.3)' }"
        >
          <img v-if="profileForm.avatar.startsWith('data:')" :src="profileForm.avatar" class="w-full h-full object-cover" />
          <div v-else-if="profileForm.avatar.startsWith('#')" class="text-white font-semibold">{{ (profileForm.nickname || 'U')[0] }}</div>
          <span v-else style="color:#fff;font-weight:600">{{ (profileForm.nickname || 'U')[0] }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="wx-nickname">{{ profileForm.nickname || '未命名用户' }}</div>
          <div class="wx-sub">
            <span class="flex items-center gap-1">
              <n-icon size="13" color="rgba(255,255,255,0.7)"><SparklesOutline /></n-icon>
              AI：{{ profileForm.aiName || '小暖' }}
            </span>
            <span class="mx-1.5 opacity-50">·</span>
            <span>{{ userStore.user?.phone || '未绑定手机号' }}</span>
          </div>
        </div>
        <n-icon size="20" color="rgba(255,255,255,0.6)"><ChevronForwardOutline /></n-icon>
      </div>
    </div>

    <!-- ========== 分组 1：功能设置 ========== -->
    <div class="wx-group">
      <div class="wx-row" @click="themeDrawer = true">
        <div class="wx-row-icon" style="background: linear-gradient(135deg, #ff8fab, #ffc3a0)">
          <n-icon size="18" color="#fff"><ColorPaletteOutline /></n-icon>
        </div>
        <div class="flex-1">
          <div class="wx-row-label">主题配色</div>
          <div class="wx-row-value">{{ currentThemeName }}</div>
        </div>
        <n-icon size="16" class="wx-arrow"><ChevronForwardOutline /></n-icon>
      </div>
      <div class="wx-row" @click="petDrawer = true">
        <div class="wx-row-icon" style="background: linear-gradient(135deg, #a1c4fd, #c2e9fb)">
          <n-icon size="18" color="#fff"><PawOutline /></n-icon>
        </div>
        <div class="flex-1">
          <div class="wx-row-label">桌面宠物</div>
          <div class="wx-row-value">{{ petForm.enabled ? '已放出' : '未启用' }}</div>
        </div>
        <n-icon size="16" class="wx-arrow"><ChevronForwardOutline /></n-icon>
      </div>
      <div class="wx-row" @click="modulesDrawer = true">
        <div class="wx-row-icon" style="background: linear-gradient(135deg, #84fab0, #8fd3f4)">
          <n-icon size="18" color="#fff"><ConstructOutline /></n-icon>
        </div>
        <div class="flex-1">
          <div class="wx-row-label">功能管理</div>
          <div class="wx-row-value">{{ enabledModules.length }} 个模块启用</div>
        </div>
        <n-icon size="16" class="wx-arrow"><ChevronForwardOutline /></n-icon>
      </div>
      <!-- AI 记忆开关（点整行或开关都能切换） -->
      <div class="wx-row">
        <div class="wx-row-icon" style="background: linear-gradient(135deg, #fbc2eb, #a6c1ee)">
          <n-icon size="18" color="#fff"><SparklesOutline /></n-icon>
        </div>
        <div class="flex-1" @click="aiMemory = !aiMemory; onMemoryToggle()">
          <div class="wx-row-label">AI 记忆</div>
          <div class="wx-row-value">{{ aiMemory ? '已开启 · AI 会记住你说的重要信息' : '已关闭 · 不记录新记忆' }}</div>
        </div>
        <n-switch v-model:value="aiMemory" size="small" @update:value="onMemoryToggle" />
      </div>
    </div>

    <!-- ========== 分组 2：关于 ========== -->
    <div class="wx-group">
      <div class="wx-row" @click="aboutDrawer = true">
        <div class="wx-row-icon" style="background: linear-gradient(135deg, #d299c2, #fef9d7)">
          <n-icon size="18" color="#fff"><InformationCircleOutline /></n-icon>
        </div>
        <div class="flex-1">
          <div class="wx-row-label">关于</div>
          <div class="wx-row-value">生活工作台 v1.0</div>
        </div>
        <n-icon size="16" class="wx-arrow"><ChevronForwardOutline /></n-icon>
      </div>
    </div>

    <!-- ========== 底部：退出登录 ========== -->
    <div class="wx-group mt-4">
      <div class="wx-row wx-row-danger" @click="handleLogout">
        <div class="flex-1 text-center">退出登录</div>
      </div>
    </div>

    <div class="text-center mt-6 pb-6 text-xs" :style="{ color: 'var(--lw-text-tertiary)' }">
      生活工作台 · 轻量 · 自律 · 治愈
    </div>

    <!-- ========== Drawer：个人信息 ========== -->
    <n-drawer v-model:show="profileDrawer" :width="drawerW(400)" placement="right">
      <template #header><span class="font-semibold text-base">个人信息</span></template>
      <div class="space-y-4">
        <div class="flex items-center gap-4 p-3 rounded-xl" :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }">
          <div
            class="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden shrink-0"
            :style="{ background: profileForm.avatar.startsWith('#') ? profileForm.avatar : 'var(--lw-bg)' }"
          >
            <img v-if="profileForm.avatar.startsWith('data:')" :src="profileForm.avatar" class="w-full h-full object-cover" />
            <div v-else-if="profileForm.avatar.startsWith('#')" class="w-full h-full flex items-center justify-center text-white text-xl font-semibold">{{ (profileForm.nickname || 'U')[0] }}</div>
            <span v-else class="text-xl" :style="{ color: 'var(--lw-text-secondary)' }">U</span>
          </div>
          <div class="flex-1 space-y-2">
            <n-upload :show-file-list="false" accept="image/*" :custom-request="handleAvatarUpload">
              <n-button size="small">上传图片</n-button>
            </n-upload>
            <div class="flex gap-1.5 flex-wrap">
              <div
                v-for="a in AVATAR_OPTIONS"
                :key="a"
                @click="profileForm.avatar = a"
                class="w-6 h-6 rounded-full cursor-pointer transition-all hover:scale-110"
                :style="{ background: a, border: profileForm.avatar === a ? '2px solid var(--lw-primary)' : '1.5px solid var(--lw-border)' }"
              ></div>
            </div>
          </div>
        </div>
        <n-form label-placement="left" label-width="80">
          <n-form-item label="昵称">
            <n-input v-model:value="profileForm.nickname" />
          </n-form-item>
          <n-form-item label="AI 名字">
            <n-input v-model:value="profileForm.aiName" />
          </n-form-item>
          <n-form-item label="手机号">
            <n-input v-model:value="profileForm.phone" placeholder="11 位手机号" />
          </n-form-item>
          <n-form-item label="专属ID">
            <n-input :value="userStore.user?.account" disabled />
          </n-form-item>
          <n-button type="primary" block @click="saveProfile; profileDrawer = false">保存修改</n-button>
        </n-form>
      </div>
    </n-drawer>

    <!-- ========== Drawer：主题配色 ========== -->
    <n-drawer v-model:show="themeDrawer" :width="drawerW(460)" placement="right">
      <template #header><span class="font-semibold text-base">主题配色</span></template>
      <div class="space-y-6">
        <div v-for="cat in THEME_CATEGORIES" :key="cat.key">
          <div class="flex items-center gap-2 mb-3">
            <div class="w-1 h-3.5 rounded-full" :style="{ background: 'var(--lw-primary)' }"></div>
            <span class="text-sm font-medium">{{ cat.name }}</span>
            <span class="text-xs opacity-50">{{ categoryThemes(cat.key).length }} 套</span>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="t in categoryThemes(cat.key)"
              :key="t.id"
              @click="selectTheme(t.id)"
              class="theme-card cursor-pointer rounded-xl p-3 border-2 transition-all hover:-translate-y-0.5"
              :class="{ 'ring-2 ring-offset-2': themeStore.currentThemeId === t.id }"
              :style="{ borderColor: themeStore.currentThemeId === t.id ? 'var(--lw-primary)' : 'var(--lw-border)', background: t.bg }"
            >
              <div class="flex items-center gap-1 mb-2">
                <div class="w-4 h-4 rounded-full" :style="{ background: t.primary }"></div>
                <div class="w-4 h-4 rounded-full" :style="{ background: t.primarySoft }"></div>
                <div v-if="t.dot2 !== t.primarySoft" class="w-4 h-4 rounded-full" :style="{ background: t.dot2 }"></div>
              </div>
              <div class="text-sm font-medium" :style="{ color: t.text }">{{ t.name }}</div>
              <div class="text-xs mt-0.5" :style="{ color: t.textSecondary }">{{ t.desc }}</div>
              <div v-if="themeStore.currentThemeId === t.id" class="mt-2 text-xs font-medium flex items-center gap-1" :style="{ color: 'var(--lw-primary)' }">
                <n-icon size="12"><CheckmarkOutline /></n-icon>当前使用
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-drawer>

    <!-- ========== Drawer：桌面宠物 ========== -->
    <n-drawer v-model:show="petDrawer" :width="drawerW(400)" placement="right">
      <template #header><span class="font-semibold text-base">桌面宠物</span></template>
      <div class="space-y-4">
        <div class="flex items-center justify-between p-3 rounded-xl" :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center" :style="{ background: 'var(--lw-primary)' }">
              <n-icon size="20" color="#fff"><PawOutline /></n-icon>
            </div>
            <div>
              <div class="font-medium">{{ petForm.enabled ? '已放出' : '未启用' }}</div>
              <div class="text-xs opacity-60">宠物会在桌面陪伴你</div>
            </div>
          </div>
          <n-switch v-model:value="petForm.enabled" @update:value="savePet" />
        </div>
        <div v-if="petForm.enabled" class="space-y-3">
          <div class="text-sm font-medium">选择形象</div>
          <div class="grid grid-cols-4 gap-2">
            <div
              v-for="p in PET_TYPES"
              :key="p.key"
              @click="petForm.type = p.key; savePet()"
              class="p-3 rounded-xl border-2 cursor-pointer text-center transition-all"
              :class="{ 'ring-2': petForm.type === p.key }"
              :style="{ borderColor: petForm.type === p.key ? 'var(--lw-primary)' : 'var(--lw-border)' }"
            >
              <div class="text-2xl mb-1">{{ p.emoji }}</div>
              <div class="text-xs">{{ p.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </n-drawer>

    <!-- ========== Drawer：功能管理 ========== -->
    <n-drawer v-model:show="modulesDrawer" :width="drawerW(460)" placement="right">
      <template #header><span class="font-semibold text-base">功能管理</span></template>
      <div class="space-y-5">
        <p class="text-sm opacity-70">勾选你想在侧边栏显示的功能模块</p>
        <div v-for="group in MODULE_GROUPS" :key="group.key">
          <div class="flex items-center gap-2 mb-3 pb-1.5 border-b" :style="{ borderColor: 'var(--lw-border)' }">
            <div class="w-1 h-3.5 rounded-full" :style="{ background: 'var(--lw-primary)' }"></div>
            <span class="text-sm font-medium">{{ group.name }}</span>
            <span class="text-xs opacity-50">{{ groupModules(group.key).filter(m => enabledModules.includes(m.key)).length }}/{{ groupModules(group.key).length }}</span>
          </div>
          <div class="space-y-2">
            <div
              v-for="mod in groupModules(group.key)"
              :key="mod.key"
              @click="toggleModule(mod.key)"
              class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border"
              :style="{
                borderColor: enabledModules.includes(mod.key) ? 'color-mix(in srgb, var(--lw-primary) 35%, var(--lw-border))' : 'var(--lw-border)',
                background: enabledModules.includes(mod.key) ? 'color-mix(in srgb, var(--lw-primary) 6%, var(--lw-card))' : 'var(--lw-card)',
              }"
            >
              <div class="flex items-center gap-3">
                <n-icon size="18" :style="{ color: 'var(--lw-primary)' }">
                  <component :is="MODULE_ICONS[mod.key] || StarOutline" />
                </n-icon>
                <span class="text-sm">{{ mod.name }}</span>
              </div>
              <n-switch :value="enabledModules.includes(mod.key)" @update:value="toggleModule(mod.key)" />
            </div>
          </div>
        </div>
        <div class="flex gap-2 pt-2">
          <n-button type="primary" @click="saveModules">保存</n-button>
          <n-button @click="resetToInterests">按兴趣重置</n-button>
        </div>
      </div>
    </n-drawer>

    <!-- ========== Drawer：关于 ========== -->
    <n-drawer v-model:show="aboutDrawer" :width="drawerW(380)" placement="right">
      <template #header><span class="font-semibold text-base">关于</span></template>
      <div class="space-y-4 text-sm">
        <div class="text-center py-4">
          <div class="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-white text-2xl mb-3" :style="{ background: 'var(--lw-primary)' }">生</div>
          <div class="font-semibold text-base">生活工作台</div>
          <div class="text-xs opacity-60 mt-1">Version 1.0.0</div>
        </div>
        <div class="p-3 rounded-xl space-y-2" :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }">
          <div class="flex justify-between"><span class="opacity-60">专属 ID</span><span>{{ userStore.user?.account }}</span></div>
          <div class="flex justify-between"><span class="opacity-60">手机号</span><span>{{ userStore.user?.phone || '未绑定' }}</span></div>
        </div>
        <p class="opacity-70 text-xs leading-relaxed">
          面向大学生的轻量生活工作台。温和、不焦虑、鼓励成长。
          让每一个小小的自律，都变成看得见的进步。
        </p>
      </div>
    </n-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import {
  PawOutline, ChevronForwardOutline, SparklesOutline,
  ColorPaletteOutline, CheckmarkOutline, ConstructOutline, InformationCircleOutline, StarOutline,
} from '@vicons/ionicons5'
import { useUserStore } from '@/store/user'
import { useThemeStore, themes, THEME_CATEGORIES } from '@/store/theme'
import { getStore, setStore } from '@/utils/storage'
import { MODULES, MODULE_GROUPS, getDefaultEnabledModules } from '@/config/modules'
import { PET_TYPES, AVATAR_OPTIONS } from '@/config/pets'
import { MODULE_ICONS } from '@/config/icons'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()
const themeStore = useThemeStore()

// 抽屉宽度跟随屏幕：手机上不超过 92vw，避免超出屏幕点不到
const viewportW = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
function onResize() { viewportW.value = window.innerWidth }
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
const drawerW = (px) => Math.min(px, Math.floor(viewportW.value * 0.92))

// Drawer 开关
const profileDrawer = ref(false)
const themeDrawer = ref(false)
const petDrawer = ref(false)
const modulesDrawer = ref(false)
const aboutDrawer = ref(false)

const profileForm = ref({
  nickname: userStore.user?.nickname || '',
  avatar: userStore.user?.avatar || '#a8b5a0',
  aiName: userStore.user?.aiName || '小暖',
  phone: userStore.user?.phone || '',
})

const petForm = ref({ ...(userStore.user?.pet || { type: 'cat', name: '咪咪', enabled: false }) })

const enabledModules = ref([...(userStore.user?.enabledModules || [])])

// AI 记忆开关（与聊天页共用同一个 key）
const aiMemory = ref(getStore('chat_memory_enabled', true))
function onMemoryToggle() {
  setStore('chat_memory_enabled', aiMemory.value)
  message.success(aiMemory.value ? 'AI 记忆已开启' : 'AI 记忆已关闭')
}

const currentThemeName = computed(() => {
  const t = themes.find(x => x.id === themeStore.currentThemeId)
  return t ? t.name : '默认蓝灰'
})

function categoryThemes(catKey) {
  return themes.filter(t => t.category === catKey)
}
function groupModules(groupKey) {
  return MODULES.filter(m => m.group === groupKey)
}
function toggleModule(key) {
  const idx = enabledModules.value.indexOf(key)
  if (idx >= 0) enabledModules.value.splice(idx, 1)
  else enabledModules.value.push(key)
}
function saveModules() {
  userStore.setEnabledModules([...enabledModules.value])
  message.success('功能设置已保存')
}
function resetToInterests() {
  const interests = userStore.user?.interests || []
  enabledModules.value = getDefaultEnabledModules(interests)
  message.info('已按兴趣标签重置')
}
function handleAvatarUpload({ file }) {
  const f = file.file
  if (!f.type.startsWith('image/')) return message.error('请上传图片文件')
  if (f.size > 2 * 1024 * 1024) return message.error('图片大小不能超过 2MB')
  const reader = new FileReader()
  reader.onload = (e) => { profileForm.value.avatar = e.target.result }
  reader.readAsDataURL(f)
}
function saveProfile() {
  userStore.updateNickname(profileForm.value.nickname)
  userStore.updateAvatar(profileForm.value.avatar)
  userStore.updateAiName(profileForm.value.aiName)
  const r = userStore.updatePhone(profileForm.value.phone)
  if (r && r.success === false) { message.warning(r.message); return }
  message.success('个人信息已更新')
}
function savePet() {
  userStore.updatePet(petForm.value)
}
function selectTheme(id) {
  themeStore.setTheme(id)
  message.success('主题已切换')
}
function handleLogout() {
  userStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.wx-page {
  width: 100%;
  padding: 0 0 24px;
}

/* ===== 顶部头像大卡 ===== */
.wx-hero {
  position: relative;
  margin: -16px -16px 20px;
  padding: 32px 24px 28px;
  cursor: pointer;
  overflow: hidden;
}
.wx-hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--lw-primary) 0%, color-mix(in srgb, var(--lw-primary) 50%, #fff) 100%);
  z-index: 0;
}
.wx-hero-bg::after {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: rgba(255,255,255,0.12);
}
.wx-hero-bg::before {
  content: '';
  position: absolute;
  left: -30px;
  bottom: -60px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
}
.wx-hero-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 18px;
}
.wx-avatar {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
  font-size: 26px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.15);
}
.wx-nickname {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.wx-sub {
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  margin-top: 6px;
  display: flex;
  align-items: center;
}

/* ===== 分组容器 ===== */
.wx-group {
  background: var(--lw-card);
  border-radius: 14px;
  margin-bottom: 12px;
  border: 1px solid var(--lw-border);
  overflow: hidden;
}

/* ===== 行 ===== */
.wx-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: background 0.15s;
  border-bottom: 1px solid var(--lw-border);
}
.wx-row:last-child {
  border-bottom: none;
}
.wx-row:active {
  background: color-mix(in srgb, var(--lw-primary) 8%, var(--lw-card));
}

.wx-row-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.wx-row-label {
  font-size: 14px;
  color: var(--lw-text);
  font-weight: 500;
}
.wx-row-value {
  font-size: 12px;
  color: var(--lw-text-tertiary);
  margin-top: 2px;
}
.wx-arrow {
  color: var(--lw-text-tertiary);
  flex-shrink: 0;
}

/* 退出登录 */
.wx-row-danger {
  justify-content: center;
  color: #e74c3c;
  font-weight: 500;
}
.wx-row-danger:active {
  background: rgba(231, 76, 60, 0.08);
}
</style>
