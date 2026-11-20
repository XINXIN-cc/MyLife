<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl font-semibold" :style="{ color: 'var(--lw-text)' }">我的日历</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--lw-text-secondary)' }">日聚合回顾，看见时间的痕迹</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-[1fr_360px] gap-4">
      <!-- 左侧：月历 -->
      <div class="min-w-0">
        <n-card :bordered="false">
          <!-- 月份切换 -->
          <div class="flex items-center justify-between mb-4">
            <n-button text size="small" @click="prevMonth">‹ 上月</n-button>
            <span class="text-lg font-medium" :style="{ color: 'var(--lw-text)' }">{{ currentYear }} 年 {{ currentMonth + 1 }} 月</span>
            <n-button text size="small" @click="nextMonth">下月 ›</n-button>
          </div>

          <!-- 星期标题 -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div v-for="w in weekLabels" :key="w" class="text-center text-xs py-2" :style="{ color: 'var(--lw-text-secondary)' }">{{ w }}</div>
          </div>

          <!-- 日期网格 -->
          <div class="grid grid-cols-7 gap-1">
            <div
              v-for="(day, i) in calendarDays"
              :key="i"
              @click="day.inMonth && selectDay(day)"
              class="aspect-square rounded-lg flex flex-col items-center justify-center text-sm cursor-pointer transition-all duration-200 relative"
              :style="{
                background: day.date === selectedDate ? 'var(--lw-primary)' : day.isToday ? 'color-mix(in srgb, var(--lw-primary) 12%, white)' : 'transparent',
                color: day.date === selectedDate ? 'white' : day.inMonth ? 'var(--lw-text)' : 'var(--lw-border)',
                opacity: day.inMonth ? 1 : 0.4,
              }"
              :class="{ 'hover:bg-gray-100': day.inMonth && day.date !== selectedDate }"
            >
              <span>{{ day.day }}</span>
              <!-- 当日有记录的标记 -->
              <div v-if="day.hasRecord" class="absolute bottom-1 w-1 h-1 rounded-full" :style="{ background: day.date === selectedDate ? 'white' : 'var(--lw-success)' }"></div>
            </div>
          </div>
        </n-card>
      </div>

      <!-- 右侧：当日回顾 -->
      <div class="min-w-0">
        <n-card :bordered="false">
          <div class="text-sm mb-4" :style="{ color: 'var(--lw-text-secondary)' }">{{ selectedDateLabel }}</div>

          <div v-if="!selectedRecord" class="text-center py-12" :style="{ color: 'var(--lw-text-secondary)' }">
            <div class="text-4xl mb-3">📅</div>
            <p>选择一个日期查看回顾</p>
          </div>

          <div v-else class="space-y-4">
            <!-- 心情 -->
            <div v-if="selectedRecord.mood">
              <div class="text-xs mb-1" :style="{ color: 'var(--lw-text-secondary)' }">心情</div>
              <div class="text-3xl">{{ selectedRecord.mood }}</div>
            </div>

            <!-- 计划完成 -->
            <div v-if="selectedRecord.planCount">
              <div class="text-xs mb-1" :style="{ color: 'var(--lw-text-secondary)' }">计划完成</div>
              <n-progress type="line" :percentage="selectedRecord.planRate" :color="'var(--lw-primary)'" />
              <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">{{ selectedRecord.planDone }}/{{ selectedRecord.planCount }} 项</div>
            </div>

            <!-- 喝水 -->
            <div v-if="selectedRecord.water">
              <div class="text-xs mb-1" :style="{ color: 'var(--lw-text-secondary)' }">喝水</div>
              <span class="text-sm" :style="{ color: 'var(--lw-text)' }">{{ selectedRecord.water }} / 8 杯</span>
            </div>

            <!-- 日记 -->
            <div v-if="selectedRecord.diaryTitle">
              <div class="text-xs mb-1" :style="{ color: 'var(--lw-text-secondary)' }">日记</div>
              <div class="p-3 rounded-lg text-sm" :style="{ background: 'var(--lw-bg)', color: 'var(--lw-text)' }">{{ selectedRecord.diaryTitle }}</div>
            </div>

            <!-- 鼓励语 -->
            <div class="pt-3 border-t text-center text-sm" :style="{ borderColor: 'var(--lw-border)', color: 'var(--lw-text-secondary)' }">
              <span class="mr-1">·</span>{{ dailyQuote }}
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getStore } from '@/utils/storage'

const weekLabels = ['日', '一', '二', '三', '四', '五', '六']

const today = new Date()
const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth())
const selectedDate = ref(formatDateStr(today))

// 鼓励句子
const quotes = [
  '每一天都是新的开始',
  '你已经做得很好了',
  '慢慢来，一切都来得及',
  '保持热爱，奔赴山海',
  '今天的你比昨天更好',
  '好好吃饭，好好睡觉',
  '每一步都算数',
]

const dailyQuote = computed(() => {
  const seed = selectedDate.value.split('-').reduce((s, n) => s + parseInt(n), 0)
  return quotes[seed % quotes.length]
})

// 日历日期
const calendarDays = computed(() => {
  const year = currentYear.value
  const month = currentMonth.value
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()
  const days = []

  // 上月填充
  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i
    days.push({ day: d, inMonth: false, date: formatDateStr(new Date(year, month - 1, d)) })
  }
  // 本月
  for (let d = 1; d <= daysInMonth; d++) {
    const date = formatDateStr(new Date(year, month, d))
    days.push({
      day: d,
      inMonth: true,
      date,
      isToday: date === formatDateStr(today),
      hasRecord: hasRecordForDate(date),
    })
  }
  // 下月填充
  const remaining = 42 - days.length
  for (let d = 1; d <= remaining; d++) {
    days.push({ day: d, inMonth: false, date: formatDateStr(new Date(year, month + 1, d)) })
  }
  return days
})

// 当日记录
const selectedRecord = ref(null)

function selectDay(day) {
  selectedDate.value = day.date
  loadDayRecord(day.date)
}

function loadDayRecord(date) {
  const record = { mood: null, planCount: 0, planDone: 0, planRate: 0, water: 0, diaryTitle: '' }
  // 计划
  const dailyGoals = getStore('goals_daily_' + date, [])
  if (dailyGoals.length) {
    record.planCount = dailyGoals.length
    record.planDone = dailyGoals.filter((g) => g.done).length
    record.planRate = Math.round((record.planDone / record.planCount) * 100)
  }
  // 喝水
  const waterData = getStore('water_' + date, null)
  if (waterData) record.water = waterData.count || 0
  // 日记
  const diaries = getStore('diaries', [])
  const diary = diaries.find((d) => formatDateStr(new Date(d.createdAt)) === date)
  if (diary) {
    record.diaryTitle = diary.title || '无标题'
    record.mood = diary.mood
  }
  selectedRecord.value = record
}

function hasRecordForDate(date) {
  const dailyGoals = getStore('goals_daily_' + date, [])
  if (dailyGoals.length) return true
  const waterData = getStore('water_' + date, null)
  if (waterData && waterData.count) return true
  const diaries = getStore('diaries', [])
  return diaries.some((d) => formatDateStr(new Date(d.createdAt)) === date)
}

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

function formatDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const selectedDateLabel = computed(() => {
  const [y, m, d] = selectedDate.value.split('-')
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const date = new Date(selectedDate.value)
  return `${y}年${parseInt(m)}月${parseInt(d)}日 ${weeks[date.getDay()]}`
})

onMounted(() => loadDayRecord(selectedDate.value))
</script>
