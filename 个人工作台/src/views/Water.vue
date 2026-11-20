<template>
  <div class="space-y-5">
    <!-- 1. Hero 水瓶区 -->
    <div class="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center">
      <!-- SVG 水瓶 -->
      <div class="flex justify-center md:justify-start">
        <svg viewBox="0 0 84 148" width="160" height="282" class="water-bottle-svg">
          <defs>
            <clipPath id="bottleClip">
              <path d="M24 22 h36 v12 c0 7 6 11 6 20 v76 a12 12 0 0 1-12 12 h-24 a12 12 0 0 1-12-12 v-76 c0-9 6-13 6-20 z"/>
            </clipPath>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" style="stop-color:var(--lw-primary); stop-opacity:0.85"/>
              <stop offset="100%" style="stop-color:var(--lw-primary); stop-opacity:0.95"/>
            </linearGradient>
          </defs>
          <!-- 瓶身外轮廓 -->
          <path d="M24 22 h36 v12 c0 7 6 11 6 20 v76 a12 12 0 0 1-12 12 h-24 a12 12 0 0 1-12-12 v-76 c0-9 6-13 6-20 z" fill="rgba(255,255,255,0.8)"/>
          <!-- 水位 -->
          <g clip-path="url(#bottleClip)">
            <rect
              class="water-fill"
              x="0"
              :y="waterFillY"
              width="84"
              :height="148 - waterFillY"
              fill="url(#waterGrad)"
            />
          </g>
          <!-- 瓶身描边 -->
          <path d="M24 22 h36 v12 c0 7 6 11 6 20 v76 a12 12 0 0 1-12 12 h-24 a12 12 0 0 1-12-12 v-76 c0-9 6-13 6-20 z" fill="none" style="stroke:var(--lw-primary); stroke-width:2.5; stroke-linejoin:round; opacity:0.55"/>
          <!-- 瓶盖 -->
          <rect x="28" y="8" width="28" height="14" rx="5" style="fill:var(--lw-primary); opacity:0.75"/>
          <!-- 刻度线 -->
          <line x1="66" y1="70" x2="72" y2="70" style="stroke:var(--lw-primary); stroke-width:2; opacity:0.3; stroke-linecap:round"/>
          <line x1="66" y1="92" x2="74" y2="92" style="stroke:var(--lw-primary); stroke-width:2; opacity:0.3; stroke-linecap:round"/>
          <line x1="66" y1="114" x2="72" y2="114" style="stroke:var(--lw-primary); stroke-width:2; opacity:0.3; stroke-linecap:round"/>
        </svg>
      </div>

      <!-- 水量信息 + 按钮 -->
      <div class="space-y-4">
        <div>
          <div class="text-4xl font-bold" :style="{ color: 'var(--lw-primary)' }">
            {{ count }}<span class="text-base font-normal ml-1" :style="{ color: 'var(--lw-text-secondary)' }">/ {{ goal }} 杯</span>
          </div>
          <div class="text-sm mt-1" :style="{ color: 'var(--lw-text-secondary)' }">
            约 {{ Math.round(count * 250) }} / 2000 ml
          </div>
        </div>
        <div class="w-full h-2 rounded-full overflow-hidden" :style="{ background: 'var(--lw-bg)' }">
          <div
            class="h-full rounded-full transition-all duration-500"
            :style="{
              width: percent + '%',
              background: 'linear-gradient(90deg, var(--lw-primary), var(--lw-primary-soft))',
            }"
          ></div>
        </div>
        <div class="text-sm" :style="{ color: percent >= 100 ? 'var(--lw-primary)' : 'var(--lw-text-secondary)' }">
          {{ nextTip }}
        </div>

        <div class="flex gap-3 pt-2">
          <n-button type="primary" size="large" @click="addWater" class="!px-6">
            <template #icon><n-icon><AddOutline /></n-icon></template>
            喝了一杯
          </n-button>
          <n-button size="large" @click="count > 0 && undoLast" :disabled="count === 0">
            <template #icon><n-icon><RemoveOutline /></n-icon></template>
            撤销
          </n-button>
        </div>
      </div>
    </div>

    <!-- 2. 三统计卡 -->
    <div class="grid grid-cols-3 gap-3">
      <n-card :bordered="false" class="text-center">
        <div class="text-2xl font-bold" :style="{ color: 'var(--lw-primary)' }">{{ stats.streak }}</div>
        <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">连续达标</div>
      </n-card>
      <n-card :bordered="false" class="text-center">
        <div class="text-2xl font-bold" :style="{ color: 'var(--lw-primary)' }">{{ stats.month }}</div>
        <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">本月达标</div>
      </n-card>
      <n-card :bordered="false" class="text-center">
        <div class="text-2xl font-bold" :style="{ color: 'var(--lw-primary)' }">{{ stats.total }}</div>
        <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">累计打卡</div>
      </n-card>
    </div>

    <!-- 3. 今日时间表 + 记录 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- 时间表 -->
      <n-card :bordered="false">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <n-icon size="16" :style="{ color: 'var(--lw-primary)' }"><TimeOutline /></n-icon>
            <span class="font-medium text-sm" :style="{ color: 'var(--lw-text)' }">今日饮水时间表</span>
          </div>
          <span class="text-xs" :style="{ color: 'var(--lw-text-tertiary)' }">可补卡 {{ makeups }} 次</span>
        </div>
        <div class="space-y-2 max-h-80 overflow-auto">
          <div
            v-for="(t, i) in schedule"
            :key="i"
            class="flex items-center justify-between p-2.5 rounded-lg transition-all"
            :style="{ background: checkedSlots[i] ? 'color-mix(in srgb, var(--lw-primary) 8%, var(--lw-card))' : 'var(--lw-bg)' }"
          >
            <div class="flex items-center gap-2">
              <div
                class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-medium"
                :style="{
                  background: checkedSlots[i] ? 'var(--lw-primary)' : 'transparent',
                  color: checkedSlots[i] ? '#fff' : 'var(--lw-text-tertiary)',
                  border: checkedSlots[i] ? 'none' : '1.5px solid var(--lw-border)',
                }"
              >
                <n-icon v-if="checkedSlots[i]" size="12"><CheckmarkOutline /></n-icon>
                <span v-else>{{ i + 1 }}</span>
              </div>
              <span class="text-sm" :style="{ color: checkedSlots[i] ? 'var(--lw-primary)' : 'var(--lw-text)' }">{{ t }}</span>
            </div>
            <span v-if="checkedSlots[i]" class="text-xs" :style="{ color: 'var(--lw-primary)' }">✓</span>
          </div>
        </div>
      </n-card>

      <!-- 喝水记录 + 提醒 -->
      <n-card :bordered="false">
        <div class="font-medium mb-3 text-sm flex items-center gap-2" :style="{ color: 'var(--lw-text)' }">
          <n-icon size="16" :style="{ color: 'var(--lw-primary)' }"><WaterOutline /></n-icon>
          今日喝水记录
        </div>
        <div v-if="recordsRaw.length === 0" class="text-center py-8 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
          还没有喝水记录，先来一杯吧
        </div>
        <div v-else class="space-y-1.5 max-h-56 overflow-auto mb-4">
          <div
            v-for="r in recordsRaw"
            :key="r.id"
            class="flex items-center justify-between p-2 rounded-lg"
            :style="{ background: 'var(--lw-bg)' }"
          >
            <div class="flex items-center gap-2">
              <n-icon size="15" :style="{ color: 'var(--lw-primary)' }"><WaterOutline /></n-icon>
              <span class="text-sm" :style="{ color: 'var(--lw-text)' }">第 {{ r.index }} 杯</span>
            </div>
            <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ r.time }}</span>
          </div>
        </div>

        <div class="pt-3 border-t flex items-center justify-between" :style="{ borderColor: 'var(--lw-border)' }">
          <div>
            <div class="text-sm" :style="{ color: 'var(--lw-text)' }">到点提醒</div>
            <div class="text-xs mt-0.5" :style="{ color: 'var(--lw-text-secondary)' }">浏览器通知提醒你喝水</div>
          </div>
          <n-switch v-model:value="reminderEnabled" size="small" />
        </div>
      </n-card>
    </div>

    <div class="text-xs text-center py-2" :style="{ color: 'var(--lw-text-tertiary)' }">
      每杯约 250ml，一天 2000ml。小口慢饮比一次灌下去更好吸收～
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useMessage, NIcon } from 'naive-ui'
import { AddOutline, RemoveOutline, WaterOutline, TimeOutline, CheckmarkOutline } from '@vicons/ionicons5'
import { getStore, setStore, genId, todayStr } from '@/utils/storage'

const message = useMessage()
const goal = 8
const defaultSchedule = ['08:00', '09:30', '11:00', '12:30', '14:30', '16:00', '18:00', '20:00']

const count = ref(0)
const recordsRaw = ref([])
const schedule = ref([...defaultSchedule])
const reminderEnabled = ref(false)

// 统计数据
const stats = ref({ streak: 0, month: 0, total: 0 })

// 根据喝水记录的**实际时间**匹配时间表打勾
// 每个 slot 窗口 = slot 前 30 分钟 ~ slot 后到下一个 slot 前 15 分钟
const checkedSlots = computed(() => {
  const recordMinutes = recordsRaw.value.map(r => {
    const [h, m] = r.time.split(':').map(Number)
    return h * 60 + m
  }).sort((a, b) => a - b)

  return schedule.value.map((slot, i) => {
    const [sh, sm] = slot.split(':').map(Number)
    const slotMin = sh * 60 + sm
    // 窗口下限：slot 前 30 分钟
    const windowStart = slotMin - 30
    // 窗口上限：有下一个 slot → 下一个 slot 前 15 分钟；最后一个 → 23:59
    let windowEnd = 23 * 60 + 59
    if (i < schedule.value.length - 1) {
      const [nh, nm] = schedule.value[i + 1].split(':').map(Number)
      windowEnd = nh * 60 + nm - 15
    }
    return recordMinutes.some(rm => rm >= windowStart && rm <= windowEnd)
  })
})

const percent = computed(() => Math.min(100, Math.round((count.value / goal) * 100)))
const waterFillY = computed(() => 148 - (148 * percent.value / 100))

const makeups = computed(() => Math.max(0, 3 - Math.max(0, goal - count.value)))

const nextTip = computed(() => {
  if (percent.value >= 100) return '今日目标完成！水分充足，皮肤会谢谢你'
  if (percent.value >= 75) return '已经很棒了，还差一点点就到目标'
  if (percent.value >= 50) return '过半了，继续保持，你做得很好'
  if (percent.value >= 25) return '喝了 1/4 了，继续加油'
  return '今天还没怎么喝水哦，先来一杯吧'
})

function load() {
  const today = todayStr()
  const saved = getStore('water', { date: '', count: 0, records: [], schedule: defaultSchedule })
  if (saved.date !== today) {
    count.value = 0
    recordsRaw.value = []
    schedule.value = [...defaultSchedule]
    save()
  } else {
    count.value = saved.count || 0
    recordsRaw.value = saved.records || []
    schedule.value = saved.schedule || [...defaultSchedule]
  }
  reminderEnabled.value = getStore('water_reminder', false)
  loadStats()
}

function loadStats() {
  const allHistory = getStore('water_history', [])
  // 统计 total
  stats.value.total = allHistory.reduce((sum, d) => sum + (d.count || 0), 0)
  // 本月达标
  const now = new Date()
  const monthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  stats.value.month = allHistory.filter(d => d.date.startsWith(monthPrefix) && d.count >= goal).length
  // 连续达标
  let streak = 0
  const sorted = [...allHistory].sort((a, b) => b.date.localeCompare(a.date))
  for (const d of sorted) {
    if (d.count >= goal) streak++
    else break
  }
  // 如果今天已经达标，也加上
  if (count.value >= goal && !allHistory.find(d => d.date === todayStr())) streak++
  stats.value.streak = streak
}

function save() {
  setStore('water', {
    date: todayStr(),
    count: count.value,
    records: recordsRaw.value,
    schedule: schedule.value,
  })
}

function saveHistory() {
  const today = todayStr()
  let history = getStore('water_history', [])
  const idx = history.findIndex(d => d.date === today)
  if (idx >= 0) history[idx].count = count.value
  else history.push({ date: today, count: count.value })
  // 只保留最近 90 天
  history = history.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 90)
  setStore('water_history', history)
}

function addWater() {
  if (count.value >= goal) {
    message.info('今日目标已完成，适量饮水哦')
    return
  }
  count.value++
  const now = new Date()
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  recordsRaw.value.unshift({ id: genId(), index: count.value, time })
  save()
  if (count.value === goal) {
    message.success('今日喝水目标达成！水分充足 💧')
  }
}

function undoLast() {
  if (recordsRaw.value.length === 0) return
  recordsRaw.value.shift()
  count.value = Math.max(0, count.value - 1)
  save()
}

// 每次喝水/撤销都刷新统计 + 保存历史
watch(count, () => {
  saveHistory()
  loadStats()
})

watch(reminderEnabled, (v) => {
  setStore('water_reminder', v)
  if (v) {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }
})

onMounted(load)
</script>

<style scoped>
.water-bottle-svg {
  filter: drop-shadow(0 6px 20px color-mix(in srgb, var(--lw-primary) 25%, transparent));
  transition: filter 0.35s ease;
}

.water-fill {
  transition: y 0.6s cubic-bezier(0.4, 0, 0.2, 1), height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
