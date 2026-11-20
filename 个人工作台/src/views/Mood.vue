<template>
  <div class="space-y-6">
    <!-- 今日心情 -->
    <n-card :bordered="false" size="medium" class="card-hover">
      <div class="flex items-center justify-between mb-4">
        <span class="font-medium text-base" :style="{ color: 'var(--lw-text)' }">今日心情</span>
        <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">{{ todayStr }}</span>
      </div>
      <div class="grid grid-cols-5 gap-3">
        <div
          v-for="m in moods"
          :key="m.value"
          @click="selectMood(m.value)"
          class="cursor-pointer flex flex-col items-center gap-1 p-3 rounded-xl transition-all"
          :style="{
            background: todayMood === m.value ? 'color-mix(in srgb, var(--lw-primary) 12%, var(--lw-card))' : 'var(--lw-bg)',
            border: todayMood === m.value ? '1.5px solid var(--lw-primary)' : '1.5px solid transparent',
          }"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center transition-all"
            :style="{ background: m.color + '22', border: '1.5px solid ' + m.color + '55' }"
          >
            <n-icon size="22" :style="{ color: m.color }"><component :is="m.icon" /></n-icon>
          </div>
          <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ m.label }}</span>
        </div>
      </div>
      <div v-if="todayMood" class="mt-4">
        <n-input
          v-model:value="moodNote"
          type="textarea"
          placeholder="今天发生了什么？记录一下吧~（选填）"
          :rows="2"
          :autosize="{ minRows: 2, maxRows: 4 }"
          @blur="saveTodayMood"
        />
      </div>
    </n-card>

    <!-- 情绪趋势 -->
    <n-card :bordered="false" size="medium" class="card-hover">
      <div class="flex items-center justify-between mb-4">
        <span class="font-medium text-base" :style="{ color: 'var(--lw-text)' }">近 7 天情绪趋势</span>
      </div>
      <div class="space-y-2">
        <div v-for="day in last7Days" :key="day.date" class="flex items-center gap-3">
          <span class="text-xs w-12 shrink-0" :style="{ color: 'var(--lw-text-secondary)' }">{{ day.label }}</span>
          <div class="flex-1 h-2 rounded-full overflow-hidden" :style="{ background: 'var(--lw-bg)' }">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: (day.score / 5 * 100) + '%',
                background: day.color,
              }"
            ></div>
          </div>
          <span class="text-xs w-8 text-right shrink-0" :style="{ color: day.color }">
            <n-icon size="14" v-if="day.icon"><component :is="day.icon" /></n-icon>
            <span v-else>·</span>
          </span>
        </div>
      </div>
      <div class="mt-4 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
        平均心情指数：<span class="font-semibold" :style="{ color: 'var(--lw-primary)' }">{{ avgMood.toFixed(1) }}</span> / 5.0
      </div>
    </n-card>

    <!-- 心情日历 -->
    <n-card :bordered="false" size="medium" class="card-hover">
      <div class="flex items-center justify-between mb-4">
        <span class="font-medium text-base" :style="{ color: 'var(--lw-text)' }">心情日历</span>
      </div>
      <div class="grid grid-cols-7 gap-2">
        <div v-for="d in monthDays" :key="d.date" class="aspect-square flex items-center justify-center rounded-lg text-sm" :style="{ background: d.color }">
          <n-icon v-if="d.icon" size="14" :style="{ color: d.textColor }"><component :is="d.icon" /></n-icon>
          <span v-else :style="{ color: 'var(--lw-text-tertiary)' }">{{ d.day }}</span>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessage, NIcon } from 'naive-ui'
import { HappyOutline, InformationCircleOutline, SadOutline, CloseCircleOutline } from '@vicons/ionicons5'
import { getStore, setStore, todayStr } from '@/utils/storage'

const message = useMessage()

const moods = [
  { value: 5, label: '超棒', icon: HappyOutline, color: '#52C41A' },
  { value: 4, label: '不错', icon: HappyOutline, color: '#18A058' },
  { value: 3, label: '一般', icon: InformationCircleOutline, color: '#F0A020' },
  { value: 2, label: '低落', icon: SadOutline, color: '#F07040' },
  { value: 1, label: '糟糕', icon: CloseCircleOutline, color: '#D03050' },
]

const moodRecords = ref([])
const todayMood = ref(null)
const moodNote = ref('')

function loadMoods() {
  moodRecords.value = getStore('mood_records', [])
  const today = moodRecords.value.find((r) => r.date === todayStr())
  if (today) {
    todayMood.value = today.value
    moodNote.value = today.note || ''
  }
}

function selectMood(val) {
  todayMood.value = val
  saveTodayMood()
  message.success('已记录今日心情')
}

function saveTodayMood() {
  const list = moodRecords.value.filter((r) => r.date !== todayStr())
  list.unshift({
    date: todayStr(),
    value: todayMood.value,
    note: moodNote.value,
    createdAt: Date.now(),
  })
  moodRecords.value = list
  setStore('mood_records', list.slice(0, 100))
}

// 近7天
const last7Days = computed(() => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const record = moodRecords.value.find((r) => r.date === ds)
    const m = record ? moods.find((x) => x.value === record.value) : null
    days.push({
      date: ds,
      label: i === 0 ? '今天' : `${d.getMonth() + 1}/${d.getDate()}`,
      score: record?.value || 0,
      icon: m?.icon || null,
      color: m?.color || 'var(--lw-bg)',
    })
  }
  return days
})

const avgMood = computed(() => {
  const scored = last7Days.value.filter((d) => d.score > 0)
  if (scored.length === 0) return 0
  return scored.reduce((s, d) => s + d.score, 0) / scored.length
})

// 本月日历
const monthDays = computed(() => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const arr = []
  for (let i = 0; i < firstDay; i++) arr.push({ day: '', icon: null, color: 'transparent', textColor: 'transparent' })
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const record = moodRecords.value.find((r) => r.date === ds)
    const m = record ? moods.find((x) => x.value === record.value) : null
    arr.push({
      day: d,
      date: ds,
      icon: m?.icon || null,
      color: m ? m.color + '22' : 'var(--lw-bg)',
      textColor: m?.color || 'var(--lw-text-tertiary)',
    })
  }
  return arr
})

onMounted(loadMoods)
</script>
