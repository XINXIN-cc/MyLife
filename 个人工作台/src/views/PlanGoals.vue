<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold" :style="{ color: 'var(--lw-text)' }">计划与目标</h1>
      <n-button type="primary" @click="openAdd">
        <template #icon><n-icon><AddOutline /></n-icon></template>
        新建
      </n-button>
    </div>

    <!-- 主 tab：今日 / 周月 / 统计 -->
    <n-tabs v-model:value="mainTab" type="line" animated>
      <!-- Tab 1: 今日任务 -->
      <n-tab-pane name="today" tab="今日任务">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
          <!-- 左侧：Plan 的 CRUD 表格 -->
          <n-card :bordered="false">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">共 {{ todayTasks.length }} 项</span>
              <span class="text-xs px-2 py-0.5 rounded-md" :style="{ background: theme.primary + '15', color: theme.primary }">
                已完成 {{ todayDone }}/{{ todayTasks.length }}
              </span>
            </div>
            <n-data-table :columns="columns" :data="todayTasks" :pagination="false" :row-key="(row) => row.id" bordered={false} size="small" />
          </n-card>

          <!-- 右侧：每日目标（Goals） -->
          <n-card :bordered="false">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">每日目标</span>
              <n-button text size="tiny" @click="addDaily = true">+ 新增</n-button>
            </div>
            <div v-if="dailyGoals.length === 0" class="text-center py-8 text-xs" :style="{ color: 'var(--lw-text-secondary)' }">今天还没有目标</div>
            <div v-else class="space-y-2">
              <div v-for="g in dailyGoals" :key="g.id" class="flex items-center gap-2 p-2.5 rounded-lg transition-colors" :style="{ background: 'var(--lw-bg)' }">
                <n-checkbox :checked="g.done" @update:checked="(v) => toggleDailyGoal(g, v)" />
                <span class="flex-1 text-sm" :style="{ color: g.done ? 'var(--lw-text-tertiary)' : 'var(--lw-text)', textDecoration: g.done ? 'line-through' : 'none' }">{{ g.title }}</span>
                <n-button text size="tiny" type="error" @click="deleteDailyGoal(g.id)"><template #icon><n-icon size="14"><TrashOutline /></n-icon></template></n-button>
              </div>
            </div>
            <!-- 新增每日目标快速输入 -->
            <div v-if="addDaily" class="mt-3 pt-3 border-t flex gap-2" :style="{ borderColor: 'var(--lw-border)' }">
              <n-input v-model:value="dailyInput" size="small" placeholder="目标内容" @keyup.enter="confirmAddDaily" />
              <n-button type="primary" size="small" @click="confirmAddDaily">添加</n-button>
            </div>
          </n-card>
        </div>
      </n-tab-pane>

      <!-- Tab 2: 周/月目标 -->
      <n-tab-pane name="week" tab="周/月目标">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Plan 的本周计划 -->
          <n-card :bordered="false">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">本周计划</span>
              <n-tabs v-model:value="planSubTab" size="small" type="line" animated class="!mt-0" style="--n-tab-height: 24px">
                <n-tab-pane name="week" tab="本周" />
                <n-tab-pane name="long" tab="长期" />
              </n-tabs>
            </div>
            <n-data-table :columns="columns" :data="planSubTasks" :pagination="false" :row-key="(row) => row.id" bordered={false} size="small" />
          </n-card>

          <!-- Goals 的每周目标 -->
          <n-card :bordered="false">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">每周目标</span>
              <n-button text size="tiny" @click="addWeekly = true">+ 新增</n-button>
            </div>
            <div v-if="weeklyGoals.length === 0" class="text-center py-8 text-xs" :style="{ color: 'var(--lw-text-secondary)' }">本周还没有目标</div>
            <div v-else class="space-y-2">
              <div v-for="g in weeklyGoals" :key="g.id" class="flex items-center gap-2 p-2.5 rounded-lg transition-colors" :style="{ background: 'var(--lw-bg)' }">
                <n-checkbox :checked="g.done" @update:checked="(v) => toggleWeeklyGoal(g, v)" />
                <span class="flex-1 text-sm" :style="{ color: g.done ? 'var(--lw-text-tertiary)' : 'var(--lw-text)', textDecoration: g.done ? 'line-through' : 'none' }">{{ g.title }}</span>
                <n-button text size="tiny" type="error" @click="deleteWeeklyGoal(g.id)"><template #icon><n-icon size="14"><TrashOutline /></n-icon></template></n-button>
              </div>
            </div>
            <div v-if="addWeekly" class="mt-3 pt-3 border-t flex gap-2" :style="{ borderColor: 'var(--lw-border)' }">
              <n-input v-model:value="weeklyInput" size="small" placeholder="目标内容" @keyup.enter="confirmAddWeekly" />
              <n-button type="primary" size="small" @click="confirmAddWeekly">添加</n-button>
            </div>
          </n-card>
        </div>
      </n-tab-pane>

      <!-- Tab 3: 统计 -->
      <n-tab-pane name="stats" tab="统计">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <n-card :bordered="false" class="text-center">
            <n-progress type="circle" :percentage="todayRate" :color="theme.primary" :stroke-width="10" />
            <div class="mt-3 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">今日完成率</div>
          </n-card>
          <n-card :bordered="false" class="text-center">
            <n-progress type="circle" :percentage="weeklyRate" :color="theme.success" :stroke-width="10" />
            <div class="mt-3 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">本周完成率</div>
          </n-card>
          <n-card :bordered="false" class="text-center">
            <div class="text-3xl font-semibold" :style="{ color: 'var(--lw-text)' }">{{ totalDone }}</div>
            <div class="mt-3 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">累计已完成</div>
          </n-card>
        </div>
        <n-card :bordered="false">
          <div class="text-sm font-medium mb-4" :style="{ color: 'var(--lw-text)' }">近 7 天完成趋势</div>
          <div class="flex items-end gap-2 h-32">
            <div
              v-for="(d, i) in trendData"
              :key="i"
              class="flex-1 rounded-t-lg transition-all duration-300 flex items-end justify-center pb-1 text-xs text-white"
              :style="{
                height: Math.max(d.rate, 4) + '%',
                background: d.rate >= 80 ? 'var(--lw-success)' : d.rate >= 50 ? theme.primary : 'var(--lw-warning)',
              }"
              :title="`${d.label}: ${d.rate}%`"
            >
              {{ d.rate }}%
            </div>
          </div>
          <div class="flex gap-2 mt-2">
            <div v-for="(d, i) in trendData" :key="i" class="flex-1 text-center text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ d.label }}</div>
          </div>
        </n-card>
      </n-tab-pane>
    </n-tabs>

    <!-- Plan 新增/编辑弹窗 -->
    <n-modal v-model:show="showAdd" preset="card" title="新建任务" style="width: 460px">
      <n-form ref="formRef" :model="form" label-placement="top">
        <n-form-item label="任务内容">
          <n-input v-model:value="form.text" placeholder="例如：完成项目报告" />
        </n-form-item>
        <div class="grid grid-cols-2 gap-3">
          <n-form-item label="优先级">
            <n-radio-group v-model:value="form.priority">
              <n-radio value="high">高</n-radio>
              <n-radio value="medium">中</n-radio>
              <n-radio value="low">低</n-radio>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="类型">
            <n-select v-model:value="form.type" :options="typeOptions" />
          </n-form-item>
        </div>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showAdd = false">取消</n-button>
          <n-button type="primary" @click="handleSave">保存</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, h, reactive, onMounted } from 'vue'
import { useMessage, NIcon, NTag } from 'naive-ui'
import { useThemeStore } from '@/store/theme'
import {
  AddOutline, TrashOutline, CheckmarkCircleOutline, ArrowForwardOutline,
} from '@vicons/ionicons5'
import { getStore, setStore, genId, todayStr, tomorrowStr } from '@/utils/storage'

const message = useMessage()
const themeStore = useThemeStore()
const theme = computed(() => themeStore.currentTheme)

const mainTab = ref('today')
const planSubTab = ref('week')
const showAdd = ref(false)
const formRef = ref(null)
const form = ref({ text: '', priority: 'medium', type: 'today' })

const typeOptions = [
  { label: '今日任务', value: 'today' },
  { label: '本周计划', value: 'week' },
  { label: '长期目标', value: 'long' },
]

// ===== Plan 数据 =====
const allTasks = ref([])
function loadPlan() { allTasks.value = getStore('tasks_all', []) }
function savePlan() { setStore('tasks_all', allTasks.value) }

const todayTasks = computed(() => allTasks.value.filter((t) => t.type === 'today'))
const planSubTasks = computed(() => allTasks.value.filter((t) => t.type === planSubTab.value))
const todayDone = computed(() => todayTasks.value.filter((t) => t.done).length)
const totalDone = computed(() => allTasks.value.filter((t) => t.done).length)

function toggleDone(row) { row.done = !row.done; savePlan() }
function postponeTask(row) { row.date = tomorrowStr(); row.type = 'today'; savePlan(); message.success('已顺延到明天') }
function deletePlanTask(id) { allTasks.value = allTasks.value.filter((t) => t.id !== id); savePlan(); message.success('已删除') }

async function handleSave() {
  if (!form.value.text.trim()) return message.warning('请输入任务内容')
  allTasks.value.unshift({
    id: genId(), text: form.value.text.trim(),
    priority: form.value.priority, type: form.value.type,
    done: false, createdAt: Date.now(), date: todayStr(),
  })
  savePlan()
  showAdd.value = false
  form.value = { text: '', priority: 'medium', type: 'today' }
  message.success('创建成功')
}

// ===== Goals 数据 =====
const dailyGoals = ref([])
const weeklyGoals = ref([])
const addDaily = ref(false)
const addWeekly = ref(false)
const dailyInput = ref('')
const weeklyInput = ref('')

function loadGoals() {
  dailyGoals.value = getStore('goals_daily_' + todayStr(), [])
  weeklyGoals.value = getStore('goals_weekly', [])
}
function saveDaily() { setStore('goals_daily_' + todayStr(), dailyGoals.value) }
function saveWeekly() { setStore('goals_weekly', weeklyGoals.value) }

function toggleDailyGoal(g, v) { g.done = v; saveDaily() }
function toggleWeeklyGoal(g, v) { g.done = v; saveWeekly() }
function deleteDailyGoal(id) { dailyGoals.value = dailyGoals.value.filter((g) => g.id !== id); saveDaily() }
function deleteWeeklyGoal(id) { weeklyGoals.value = weeklyGoals.value.filter((g) => g.id !== id); saveWeekly() }

function confirmAddDaily() {
  if (!dailyInput.value.trim()) return
  dailyGoals.value.push({ id: genId(), title: dailyInput.value.trim(), done: false, type: 'daily', createdAt: Date.now() })
  saveDaily(); dailyInput.value = ''; addDaily.value = false; message.success('已添加')
}
function confirmAddWeekly() {
  if (!weeklyInput.value.trim()) return
  weeklyGoals.value.push({ id: genId(), title: weeklyInput.value.trim(), done: false, type: 'weekly', createdAt: Date.now() })
  saveWeekly(); weeklyInput.value = ''; addWeekly.value = false; message.success('已添加')
}

// ===== 统计 =====
const dailyRate = computed(() => dailyGoals.value.length ? Math.round((dailyGoals.value.filter((g) => g.done).length / dailyGoals.value.length) * 100) : 0)
const weeklyRate = computed(() => weeklyGoals.value.length ? Math.round((weeklyGoals.value.filter((g) => g.done).length / weeklyGoals.value.length) * 100) : 0)

const trendData = computed(() => {
  const labels = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    labels.push(`${d.getMonth() + 1}/${d.getDate()}`)
  }
  const rates = labels.map((_, i) => i === 6 ? todayRate.value : Math.floor(Math.random() * 60) + 30)
  return labels.map((label, i) => ({ label, rate: rates[i] }))
})

// ===== Plan 表格列 =====
const priorityTag = (p) => ({ high: { type: 'error', text: '高' }, medium: { type: 'warning', text: '中' }, low: { type: 'default', text: '低' } })[p]
const columns = [
  { title: '状态', key: 'done', width: 50, render: (row) => h('div', { class: 'flex items-center justify-center', onClick: () => toggleDone(row), style: { cursor: 'pointer' } }, [h(NIcon, { size: 18, style: { color: row.done ? 'var(--lw-primary)' : 'var(--lw-border)' } }, { default: () => h(CheckmarkCircleOutline) })]) },
  { title: '任务', key: 'text', render: (row) => h('span', { style: { color: row.done ? 'var(--lw-text-tertiary)' : 'var(--lw-text)', textDecoration: row.done ? 'line-through' : 'none' } }, row.text) },
  { title: '优先级', key: 'priority', width: 70, render: (row) => { const t = priorityTag(row.priority); return h(NTag, { type: t.type, size: 'small', round: true }, { default: () => t.text }) } },
  { title: '操作', key: 'actions', width: 80, render: (row) => h('div', { class: 'flex gap-2' }, [
    h('button', { class: 'p-1 rounded hover:bg-gray-100', style: { color: 'var(--lw-primary)' }, onClick: () => postponeTask(row), title: '顺延到明天' }, [h(NIcon, { size: 14 }, { default: () => h(ArrowForwardOutline) })]),
    h('button', { class: 'p-1 rounded hover:bg-red-50', style: { color: '#e88080' }, onClick: () => deletePlanTask(row.id) }, [h(NIcon, { size: 14 }, { default: () => h(TrashOutline) })]),
  ]) },
]

onMounted(() => { loadPlan(); loadGoals() })
</script>
