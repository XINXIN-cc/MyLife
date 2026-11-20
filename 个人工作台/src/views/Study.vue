<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl font-semibold" :style="{ color: 'var(--lw-text)' }">学习中心</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--lw-text-secondary)' }">专注当下，点滴积累</p>
    </div>

    <n-tabs type="line" animated>
      <!-- 专注计时 -->
      <n-tab-pane name="focus" tab="专注计时">
        <n-card :bordered="false" class="mt-4">
          <div class="flex flex-col items-center py-8">
            <!-- 圆环计时器 -->
            <div class="relative w-64 h-64 flex items-center justify-center mb-8">
              <svg class="absolute inset-0 -rotate-90" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="var(--lw-border)" stroke-width="10" />
                <circle
                  cx="100" cy="100" r="90" fill="none"
                  :stroke="isBreak ? 'var(--lw-success)' : 'var(--lw-primary)'"
                  stroke-width="10" stroke-linecap="round"
                  :stroke-dasharray="565.48"
                  :stroke-dashoffset="565.48 * (1 - progress)"
                  style="transition: stroke-dashoffset 1s linear"
                />
              </svg>
              <div class="text-center">
                <div class="text-5xl font-light tabular-nums" :style="{ color: 'var(--lw-text)' }">{{ formatTime }}</div>
                <div class="text-sm mt-2" :style="{ color: 'var(--lw-text-secondary)' }">
                  {{ isBreak ? '休息中' : '专注中' }}
                </div>
              </div>
            </div>

            <!-- 控制按钮 -->
            <div class="flex gap-3 mb-6">
              <n-button v-if="!running" type="primary" size="large" round @click="start">开始</n-button>
              <n-button v-else size="large" round @click="pause">暂停</n-button>
              <n-button size="large" round @click="reset">重置</n-button>
            </div>

            <!-- 模式切换 -->
            <n-radio-group v-model:value="mode" @update:value="onModeChange" size="small">
              <n-radio-button value="work">专注 25 分钟</n-radio-button>
              <n-radio-button value="break">休息 5 分钟</n-radio-button>
            </n-radio-group>

            <!-- 今日统计 -->
            <div class="grid grid-cols-3 gap-8 mt-8 text-center">
              <div>
                <div class="text-3xl font-light" :style="{ color: 'var(--lw-primary)' }">{{ todayCount }}</div>
                <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">今日专注次数</div>
              </div>
              <div>
                <div class="text-3xl font-light" :style="{ color: 'var(--lw-success)' }">{{ totalMinutes }}</div>
                <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">今日专注分钟</div>
              </div>
              <div>
                <div class="text-3xl font-light" :style="{ color: 'var(--lw-warning)' }">{{ totalCount }}</div>
                <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">累计专注次数</div>
              </div>
            </div>
          </div>
        </n-card>
      </n-tab-pane>

      <!-- 课程列表 -->
      <n-tab-pane name="courses" tab="课程列表">
        <n-card :bordered="false" class="mt-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">共 {{ courses.length }} 门课程</span>
            <n-button type="primary" size="small" @click="showCourseModal = true">+ 新增课程</n-button>
          </div>
          <div v-if="courses.length === 0" class="text-center py-12" :style="{ color: 'var(--lw-text-secondary)' }">
            <div class="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, transparent)' }">
              <n-icon size="32" :style="{ color: 'var(--lw-primary)' }"><BookOutline /></n-icon>
            </div>
            <p>还没有课程，添加一个开始学习吧</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="c in courses"
              :key="c.id"
              class="card-hover p-4 rounded-xl cursor-pointer"
              :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="font-medium" :style="{ color: 'var(--lw-text)' }">{{ c.title }}</div>
                  <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">{{ c.teacher || '未指定讲师' }}</div>
                </div>
                <n-tag :type="c.done ? 'success' : 'info'" size="small" round>{{ c.done ? '已完成' : '进行中' }}</n-tag>
              </div>
              <div class="flex items-center justify-between mt-3">
                <n-progress type="line" :percentage="c.progress" :color="'var(--lw-primary)'" :show-indicator="false" style="flex: 1; margin-right: 12px" />
                <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ c.progress }}%</span>
              </div>
              <div class="flex gap-2 mt-3">
                <n-button size="tiny" type="primary" ghost @click="updateProgress(c)">更新进度</n-button>
                <n-button size="tiny" type="error" text @click="deleteCourse(c)">删除</n-button>
              </div>
            </div>
          </div>
        </n-card>
      </n-tab-pane>
    </n-tabs>

    <!-- 新增课程弹窗 -->
    <n-modal v-model:show="showCourseModal" preset="card" title="新增课程" style="width: 420px">
      <n-form label-placement="top">
        <n-form-item label="课程名称">
          <n-input v-model:value="courseForm.title" placeholder="输入课程名称" />
        </n-form-item>
        <n-form-item label="讲师（选填）">
          <n-input v-model:value="courseForm.teacher" placeholder="输入讲师姓名" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="showCourseModal = false">取消</n-button>
        <n-button type="primary" @click="addCourse">添加</n-button>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMessage, useDialog, NIcon } from 'naive-ui'
import { BookOutline } from '@vicons/ionicons5'
import { getStore, setStore, genId, todayStr } from '@/utils/storage'

const message = useMessage()
const dialog = useDialog()

// ===== 专注计时 =====
const WORK_TIME = 25 * 60
const BREAK_TIME = 5 * 60
const mode = ref('work')
const running = ref(false)
const secondsLeft = ref(WORK_TIME)
const isBreak = computed(() => mode.value === 'break')
const progress = computed(() => {
  const total = isBreak.value ? BREAK_TIME : WORK_TIME
  return secondsLeft.value / total
})
const formatTime = computed(() => {
  const m = Math.floor(secondsLeft.value / 60)
  const s = secondsLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

let timer = null
function start() {
  if (running.value) return
  running.value = true
  timer = setInterval(() => {
    if (secondsLeft.value > 0) {
      secondsLeft.value--
    } else {
      clearInterval(timer)
      running.value = false
      onComplete()
    }
  }, 1000)
}

function pause() {
  running.value = false
  clearInterval(timer)
}

function reset() {
  pause()
  secondsLeft.value = isBreak.value ? BREAK_TIME : WORK_TIME
}

function onModeChange() {
  reset()
}

function onComplete() {
  if (isBreak.value) {
    message.success('休息结束，继续加油！')
    mode.value = 'work'
    secondsLeft.value = WORK_TIME
  } else {
    message.success('专注完成，休息一下吧！')
    recordFocus()
    mode.value = 'break'
    secondsLeft.value = BREAK_TIME
  }
}

// ===== 专注记录 =====
const focusRecords = ref([])
function recordFocus() {
  const today = todayStr()
  focusRecords.value.push({ id: genId(), date: today, minutes: 25, createdAt: Date.now() })
  setStore('focus_records', focusRecords.value)
}

const todayRecords = computed(() => focusRecords.value.filter((r) => r.date === todayStr()))
const todayCount = computed(() => todayRecords.value.length)
const totalMinutes = computed(() => todayRecords.value.reduce((s, r) => s + r.minutes, 0))
const totalCount = computed(() => focusRecords.value.length)

// ===== 课程 =====
const courses = ref([])
const showCourseModal = ref(false)
const courseForm = ref({ title: '', teacher: '' })

function loadCourses() {
  courses.value = getStore('courses', [])
}

function saveCourses() {
  setStore('courses', courses.value)
}

function addCourse() {
  if (!courseForm.value.title.trim()) return message.warning('请输入课程名称')
  courses.value.push({
    id: genId(),
    title: courseForm.value.title.trim(),
    teacher: courseForm.value.teacher.trim(),
    progress: 0,
    done: false,
    createdAt: Date.now(),
  })
  saveCourses()
  courseForm.value = { title: '', teacher: '' }
  showCourseModal.value = false
  message.success('课程已添加')
}

function updateProgress(c) {
  dialog.info({
    title: '更新进度',
    content: `当前进度：${c.progress}%`,
    positiveText: '完成',
    negativeText: '取消',
    onPositiveClick: () => {
      c.progress = 100
      c.done = true
      saveCourses()
      message.success('课程已标记完成')
    },
  })
}

function deleteCourse(c) {
  courses.value = courses.value.filter((x) => x.id !== c.id)
  saveCourses()
  message.success('已删除')
}

onMounted(() => {
  focusRecords.value = getStore('focus_records', [])
  loadCourses()
})

onUnmounted(() => clearInterval(timer))
</script>
