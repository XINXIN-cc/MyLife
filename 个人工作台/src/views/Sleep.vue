<template>
  <div class="space-y-6">
    <!-- 今日睡眠记录 -->
    <n-card :bordered="false" size="medium" class="card-hover">
      <div class="flex items-center justify-between mb-4">
        <span class="font-medium text-base" :style="{ color: 'var(--lw-text)' }">今日睡眠</span>
        <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">{{ todayStr }}</span>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <div class="text-sm mb-2" :style="{ color: 'var(--lw-text-secondary)' }">入睡时间</div>
          <n-time-picker v-model:value="sleepTime" format="HH:mm" style="width: 100%" />
        </div>
        <div>
          <div class="text-sm mb-2" :style="{ color: 'var(--lw-text-secondary)' }">起床时间</div>
          <n-time-picker v-model:value="wakeTime" format="HH:mm" style="width: 100%" />
        </div>
      </div>

      <div class="mt-4 flex items-center gap-4">
        <n-button type="primary" @click="saveSleep">保存记录</n-button>
        <div class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
          时长：<span class="font-semibold" :style="{ color: 'var(--lw-primary)' }">{{ durationText }}</span>
        </div>
      </div>
    </n-card>

    <!-- 睡眠质量 -->
    <n-card :bordered="false" size="medium" class="card-hover">
      <div class="flex items-center justify-between mb-4">
        <span class="font-medium text-base" :style="{ color: 'var(--lw-text)' }">睡眠质量</span>
      </div>
      <div class="flex gap-3 mb-3">
        <div
          v-for="q in qualityOptions"
          :key="q.value"
          @click="quality = q.value"
          class="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all"
          :style="{
            background: quality === q.value ? 'var(--lw-primary)' : 'var(--lw-bg)',
            color: quality === q.value ? '#fff' : 'var(--lw-text)',
          }"
        >
          <n-icon size="16"><component :is="q.icon" /></n-icon>
          <span>{{ q.label }}</span>
        </div>
      </div>
      <n-input
        v-model:value="sleepNote"
        type="textarea"
        placeholder="睡前做了什么？有什么感受？（选填）"
        :rows="2"
        :autosize="{ minRows: 2, maxRows: 4 }"
      />
    </n-card>

    <!-- 近7天睡眠 -->
    <n-card :bordered="false" size="medium" class="card-hover">
      <div class="flex items-center justify-between mb-4">
        <span class="font-medium text-base" :style="{ color: 'var(--lw-text)' }">近 7 天睡眠</span>
        <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">平均 {{ avgHours.toFixed(1) }} 小时</span>
      </div>
      <div class="space-y-2">
        <div v-for="day in last7Days" :key="day.date" class="flex items-center gap-3">
          <span class="text-xs w-16 shrink-0" :style="{ color: 'var(--lw-text-secondary)' }">{{ day.label }}</span>
          <div class="flex-1 h-2 rounded-full overflow-hidden" :style="{ background: 'var(--lw-bg)' }">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{
                width: Math.min(100, day.hours / 10 * 100) + '%',
                background: day.hours >= 7 ? '#18A058' : day.hours >= 6 ? '#F0A020' : '#F07040',
              }"
            ></div>
          </div>
          <span class="text-xs w-12 text-right shrink-0" :style="{ color: 'var(--lw-text-secondary)' }">{{ day.hours }}h</span>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessage, NIcon } from 'naive-ui'
import { HeartOutline, HappyOutline, InformationCircleOutline, SadOutline, CloseCircleOutline } from '@vicons/ionicons5'
import { getStore, setStore, todayStr } from '@/utils/storage'

const message = useMessage()

const sleepTime = ref(null)
const wakeTime = ref(null)
const quality = ref(3)
const sleepNote = ref('')
const records = ref([])

const qualityOptions = [
  { value: 5, label: '很好', icon: HappyOutline },
  { value: 4, label: '不错', icon: HeartOutline },
  { value: 3, label: '一般', icon: InformationCircleOutline },
  { value: 2, label: '较差', icon: SadOutline },
  { value: 1, label: '失眠', icon: CloseCircleOutline },
]

function loadRecords() {
  records.value = getStore('sleep_records', [])
  const today = records.value.find((r) => r.date === todayStr())
  if (today) {
    sleepTime.value = today.sleepTime
    wakeTime.value = today.wakeTime
    quality.value = today.quality
    sleepNote.value = today.note || ''
  }
}

function calcHours(sleep, wake) {
  if (!sleep || !wake) return 0
  let h = wake / 3600000 - sleep / 3600000
  if (h < 0) h += 24
  return Math.round(h * 10) / 10
}

const durationText = computed(() => {
  const h = calcHours(sleepTime.value, wakeTime.value)
  if (h <= 0) return '—'
  return `${h} 小时`
})

function saveSleep() {
  if (!sleepTime.value || !wakeTime.value) {
    message.warning('请选择入睡和起床时间')
    return
  }
  const list = records.value.filter((r) => r.date !== todayStr())
  const hours = calcHours(sleepTime.value, wakeTime.value)
  list.unshift({
    date: todayStr(),
    sleepTime: sleepTime.value,
    wakeTime: wakeTime.value,
    hours,
    quality: quality.value,
    note: sleepNote.value,
    createdAt: Date.now(),
  })
  records.value = list
  setStore('sleep_records', list.slice(0, 100))

  // 联动打卡页的早睡：入睡时间 <= 23:00 就算早睡
  const sleepDate = new Date(sleepTime.value)
  const sleepHour = sleepDate.getHours() + sleepDate.getMinutes() / 60
  setStore('sleep_before', {
    date: todayStr(),
    done: sleepHour <= 23.0,
    sleepHour,
  })

  message.success(hours >= 7 ? '睡眠记录已保存，睡得不错！' : '睡眠记录已保存，记得早点休息哦')
}

const last7Days = computed(() => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const record = records.value.find((r) => r.date === ds)
    days.push({
      date: ds,
      label: i === 0 ? '今天' : `${d.getMonth() + 1}/${d.getDate()}`,
      hours: record?.hours || 0,
    })
  }
  return days
})

const avgHours = computed(() => {
  const scored = last7Days.value.filter((d) => d.hours > 0)
  if (scored.length === 0) return 0
  return scored.reduce((s, d) => s + d.hours, 0) / scored.length
})

onMounted(loadRecords)
</script>
