<template>
  <div class="space-y-5">
    <div>
      <h1 class="text-xl font-semibold" :style="{ color: 'var(--lw-text)' }">今日打卡</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--lw-text-secondary)' }">完成今日的小目标，坚持就是胜利</p>
    </div>

    <!-- 今日进度 -->
    <n-card :bordered="false">
      <div class="flex items-center gap-6">
        <n-progress type="circle" :percentage="completionPercent" :stroke-width="12" />
        <div>
          <div class="text-lg font-medium mb-1" :style="{ color: 'var(--lw-text)' }">
            今日完成 {{ completedCount }}/{{ habits.length }} 项
          </div>
          <div class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
            {{ completionPercent >= 100 ? '太棒了，全部完成！' : '继续加油，你可以的' }}
          </div>
        </div>
      </div>
    </n-card>

    <!-- 打卡项 -->
    <n-grid :cols="2" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
      <n-grid-item v-for="h in habits" :key="h.id">
        <n-card class="card-hover cursor-pointer" :bordered="false" @click="toggleHabit(h.id)">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <n-icon size="28" :style="{ color: 'var(--lw-primary)' }">
                <component :is="CHECKIN_ICONS[h.icon]" />
              </n-icon>
              <div>
                <div class="font-medium" :style="{ color: 'var(--lw-text)' }">{{ h.name }}</div>
                <div class="text-xs mt-0.5" :style="{ color: 'var(--lw-text-secondary)' }">{{ h.desc }}</div>
              </div>
            </div>
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
              :style="{
                background: h.done ? 'var(--lw-primary)' : 'var(--lw-bg)',
                color: h.done ? '#fff' : 'var(--lw-text-secondary)',
              }"
            >
              <n-icon v-if="h.done" size="20"><CheckmarkOutline /></n-icon>
              <n-icon v-else size="20"><EllipseOutline /></n-icon>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 连续打卡 -->
    <n-card :bordered="false">
      <div class="flex items-center gap-4">
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center"
          :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, var(--lw-card))' }"
        >
          <n-icon size="28" :style="{ color: 'var(--lw-primary)' }"><FlameOutline /></n-icon>
        </div>
        <div>
          <div class="font-medium" :style="{ color: 'var(--lw-text)' }">已连续打卡 {{ streak }} 天</div>
          <div class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">保持下去，养成好习惯</div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useMessage, NIcon } from 'naive-ui'
import { CheckmarkOutline, EllipseOutline, FlameOutline } from '@vicons/ionicons5'
import { getStore, setStore, todayStr } from '@/utils/storage'
import { CHECKIN_ICONS } from '@/config/icons'

const message = useMessage()

const goalConfig = {
  water: { goal: 8, label: '杯', source: 'water' },
  read: { goal: 30, label: '分钟', source: 'read_minutes' },
  sport: { goal: 30, label: '分钟', source: 'sport_minutes' },
  sleep: { goal: 23 * 60, label: '前睡觉', source: 'sleep_before' }, // 23:00 = 23*60 分钟
}

const defaultHabits = [
  { id: 'water', name: '喝水', desc: '喝够 8 杯水', icon: 'water', auto: true },
  { id: 'read', name: '阅读', desc: '阅读 30 分钟', icon: 'read', auto: true },
  { id: 'sport', name: '运动', desc: '运动 30 分钟', icon: 'sport', auto: true },
  { id: 'sleep', name: '早睡', desc: '23 点前睡觉', icon: 'sleep', auto: true },
]

const habits = ref([])
const streak = ref(0)

// 从各数据源自动计算每个习惯的完成状态
function computeAutoHabit(id) {
  const today = todayStr()
  const cfg = goalConfig[id]
  if (!cfg) return false

  if (id === 'water') {
    const w = getStore('water', { date: '', count: 0 })
    return w.date === today && (w.count || 0) >= cfg.goal
  }
  if (id === 'read') {
    const r = getStore('read_minutes', { date: '', minutes: 0 })
    return r.date === today && (r.minutes || 0) >= cfg.goal
  }
  if (id === 'sport') {
    const s = getStore('sport_minutes', { date: '', minutes: 0 })
    return s.date === today && (s.minutes || 0) >= cfg.goal
  }
  if (id === 'sleep') {
    // 如果今天标记过早睡（有记录且时间 <= 23:00）
    const s = getStore('sleep_before', { date: '', done: false })
    return s.date === today && s.done === true
  }
  return false
}

function load() {
  const today = todayStr()
  const saved = getStore('checkin', {})
  let savedHabits = saved.date === today ? (saved.habits || []) : []

  // 合并：自动习惯从数据源算 done，其他用保存的
  habits.value = defaultHabits.map((def) => {
    const saved = savedHabits.find((s) => s.id === def.id)
    let done = false
    if (def.auto) {
      done = computeAutoHabit(def.id)
    } else {
      done = saved?.done || false
    }
    return { ...def, done }
  })

  // 连续天数（从历史算）
  const allDoneHistory = getStore('checkin_history', [])
  let s = 0
  const sorted = [...allDoneHistory].sort((a, b) => b.date.localeCompare(a.date))
  for (const d of sorted) {
    if (d.allDone) s++
    else break
  }
  // 如果今天全完成，也加上
  if (habits.value.every((h) => h.done)) s = Math.max(s, 1)
  streak.value = s
}

function save() {
  const today = todayStr()
  const allDone = habits.value.every((h) => h.done)
  setStore('checkin', {
    date: today,
    habits: habits.value,
    streak: allDone ? Math.max(streak.value, 1) : streak.value,
  })
  // 保存每日历史
  let history = getStore('checkin_history', [])
  const idx = history.findIndex((d) => d.date === today)
  if (idx >= 0) history[idx].allDone = allDone
  else history.push({ date: today, allDone })
  history = history.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 90)
  setStore('checkin_history', history)
}

const completedCount = computed(() => habits.value.filter((h) => h.done).length)
const completionPercent = computed(() =>
  habits.value.length ? Math.round((completedCount.value / habits.value.length) * 100) : 0
)

function toggleHabit(id) {
  const h = habits.value.find((x) => x.id === id)
  if (!h) return
  if (h.auto) {
    // 自动习惯：显示提示引导去对应页面，不让手动乱点
    const tips = {
      water: '去喝水页面点击「喝了一杯」，喝够 8 杯就会自动打卡',
      read: '去知识与阅读页面记录阅读时间',
      sport: '去健康中心记录运动',
      sleep: '睡前在设置或睡眠页面标记早睡',
    }
    message.info(tips[id] || '这个项目会自动从对应页面同步')
    return
  }
  h.done = !h.done
  save()
  if (h.done) {
    message.success(`${h.name} 打卡成功`)
  }
}

// 挂载后每隔 3 秒自动刷新一次（响应喝水/运动等页面的变化）
let refreshTimer = null
onMounted(() => {
  load()
  refreshTimer = setInterval(load, 3000)
})
onBeforeUnmount(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})
</script>
