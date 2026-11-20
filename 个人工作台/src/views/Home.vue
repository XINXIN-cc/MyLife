<template>
  <div class="space-y-6">
    <!-- ============ 顶部 Hero 问候区 ============ -->
    <div
      class="rounded-2xl p-6 relative overflow-hidden"
      :style="{
        background: `linear-gradient(135deg, ${theme.primary}18 0%, ${theme.primary}08 50%, transparent 100%)`,
        border: `1px solid ${theme.primary}22`,
      }"
    >
      <div
        class="absolute -top-8 -right-8 w-40 h-40 rounded-full pointer-events-none"
        :style="{ background: `radial-gradient(circle, ${theme.primary}15, transparent 70%)` }"
      ></div>
      <div class="relative">
        <div class="flex items-center gap-2 text-xs mb-2 tracking-wider" :style="{ color: theme.primary }">
          <span>{{ dateStr }}</span>
          <span class="opacity-40">·</span>
          <span>{{ weekLabel }}</span>
        </div>
        <h1 class="text-2xl font-semibold" :style="{ color: 'var(--lw-text)' }">
          {{ greeting }}，{{ nickname }}
        </h1>
        <p class="text-sm mt-2" :style="{ color: 'var(--lw-text-secondary)' }">{{ todayQuote }}</p>
        <!-- 每日一句（塞 Hero 底部） -->
        <div class="mt-4 pt-3 border-t flex items-center gap-3" :style="{ borderColor: theme.primary + '20' }">
          <div class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" :style="{ background: theme.primary + '15' }">
            <n-icon size="14" :style="{ color: theme.primary }"><BookOutline /></n-icon>
          </div>
          <div class="min-w-0">
            <div class="text-[10px] tracking-widest" :style="{ color: 'var(--lw-text-tertiary)' }">DAILY ENGLISH</div>
            <div class="text-xs truncate" :style="{ color: 'var(--lw-text-secondary)' }">
              {{ dailyEnglish.en }} — {{ dailyEnglish.cn }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ 今日概览 4 宫格 ============ -->
    <div class="grid grid-cols-4 gap-3">
      <div
        v-for="s in todayStats"
        :key="s.label"
        class="rounded-xl p-4 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
        :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }"
        @click="s.path && router.push(s.path)"
      >
        <div class="flex items-center gap-2 mb-2">
          <n-icon size="16" :style="{ color: theme.primary }">
            <component :is="s.icon" />
          </n-icon>
          <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ s.label }}</span>
        </div>
        <div class="text-xl font-semibold" :style="{ color: 'var(--lw-text)' }">{{ s.value }}</div>
        <div class="text-xs mt-0.5" :style="{ color: 'var(--lw-text-secondary)' }">{{ s.desc }}</div>
      </div>
    </div>

    <!-- ============ 快捷入口 横向滚动 ============ -->
    <div>
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">常用功能</span>
      </div>
      <div
        class="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1"
        :style="{ scrollbarWidth: 'none' }"
      >
        <div
          v-for="item in recommendedCards"
          :key="item.key"
          @click="onCardClick(item)"
          class="shrink-0 w-20 flex flex-col items-center gap-2 py-3 px-2 rounded-xl cursor-pointer transition-all duration-200 hover:scale-105"
          :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            :style="{ background: `color-mix(in srgb, ${theme.primary} 12%, var(--lw-card))` }"
          >
            <n-icon size="20" :style="{ color: theme.primary }">
              <component :is="QUICK_ICONS[item.icon]" />
            </n-icon>
          </div>
          <span class="text-xs whitespace-nowrap text-center" :style="{ color: 'var(--lw-text)' }">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <!-- ============ 今日计划 + 快速记账 双栏 ============ -->
    <n-grid :cols="2" :x-gap="16" responsive="screen" item-responsive>
      <!-- 今日计划卡 -->
      <n-grid-item>
        <n-card class="card-hover" :bordered="false" size="small">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <n-icon size="18" :style="{ color: theme.primary }"><ListOutline /></n-icon>
              <span class="font-medium" :style="{ color: 'var(--lw-text)' }">今日计划</span>
              <span class="text-xs px-1.5 py-0.5 rounded-md" :style="{ background: theme.primary + '15', color: theme.primary }">
                {{ doneCount }}/{{ todayTasks.length }}
              </span>
            </div>
            <n-button text size="tiny" @click="$router.push('/plan')">全部 →</n-button>
          </div>

          <div class="flex gap-2 mb-3">
            <n-input v-model:value="newTask" placeholder="添加今日任务..." @keyup.enter="addTask" />
            <n-button type="primary" circle @click="addTask">
              <template #icon><n-icon><AddOutline /></n-icon></template>
            </n-button>
          </div>

          <div class="space-y-1.5">
            <div v-if="todayTasks.length === 0" class="text-center py-6 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
              还没有任务，添加一个吧
            </div>
            <div
              v-for="task in todayTasks"
              :key="task.id"
              class="flex items-center gap-3 px-2 py-2 rounded-lg transition-colors group"
              :style="{ background: 'var(--lw-bg)' }"
            >
              <n-checkbox :checked="task.done" @update:checked="(v) => toggleTask(task, v)" />
              <span
                class="flex-1 text-sm"
                :style="{
                  color: task.done ? 'var(--lw-text-tertiary)' : 'var(--lw-text)',
                  textDecoration: task.done ? 'line-through' : 'none',
                }"
              >{{ task.text }}</span>
              <n-button text size="tiny" type="error" class="opacity-0 group-hover:opacity-100 transition-opacity" @click="deleteTask(task.id)">
                <template #icon><n-icon size="14"><TrashOutline /></n-icon></template>
              </n-button>
            </div>
          </div>

          <div v-if="todayTasks.length > 0" class="mt-4">
            <n-progress type="line" :percentage="planProgress" :color="theme.primary" :show-indicator="false" :height="6" />
          </div>
        </n-card>
      </n-grid-item>

      <!-- 快速记账卡 -->
      <n-grid-item>
        <n-card class="card-hover" :bordered="false" size="small">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <n-icon size="18" :style="{ color: theme.primary }"><CashOutline /></n-icon>
              <span class="font-medium" :style="{ color: 'var(--lw-text)' }">快速记账</span>
            </div>
            <n-button text size="tiny" @click="$router.push('/finance')">全部 →</n-button>
          </div>

          <!-- 统计数字 -->
          <div class="flex items-center gap-4 mb-4">
            <div>
              <div class="text-[10px]" :style="{ color: 'var(--lw-text-tertiary)' }">今日支出</div>
              <div class="text-lg font-semibold" style="color:#F07040">¥{{ todayExpense.toFixed(2) }}</div>
            </div>
            <div class="h-8 w-px" :style="{ background: 'var(--lw-border)' }"></div>
            <div>
              <div class="text-[10px]" :style="{ color: 'var(--lw-text-tertiary)' }">本月结余</div>
              <div class="text-lg font-semibold" :style="{ color: monthBalance >= 0 ? '#18A058' : '#F07040' }">
                ¥{{ monthBalance.toFixed(2) }}
              </div>
            </div>
          </div>

          <!-- 快速记账表单 -->
          <div class="flex items-center gap-2 mb-2">
            <n-button-group size="tiny">
              <n-button :type="finForm.type === 'expense' ? 'primary' : 'default'" @click="finForm.type = 'expense'">支出</n-button>
              <n-button :type="finForm.type === 'income' ? 'primary' : 'default'" @click="finForm.type = 'income'">收入</n-button>
            </n-button-group>
          </div>
          <div class="flex gap-2 mb-2">
            <n-input-number v-model:value="finForm.amount" placeholder="金额" :min="0" :precision="2" style="width: 110px" />
            <n-select v-model:value="finForm.category" :options="finCategoryOptions" placeholder="分类" size="small" style="flex:1" />
          </div>
          <n-input v-model:value="finForm.note" size="small" placeholder="备注（选填）" class="mb-2" />
          <n-button type="primary" block size="small" @click="addQuickFinance">
            <template #icon><n-icon size="16"><AddOutline /></n-icon></template>
            记一笔
          </n-button>

          <!-- 最近 2 条 -->
          <div v-if="recentRecords.length > 0" class="mt-3 pt-3 border-t space-y-1.5" :style="{ borderColor: 'var(--lw-border)' }">
            <div v-for="r in recentRecords" :key="r.id" class="flex items-center justify-between text-xs">
              <span :style="{ color: 'var(--lw-text-secondary)' }">{{ r.category }} · {{ r.note || '—' }}</span>
              <span :style="{ color: r.type === 'expense' ? '#F07040' : '#18A058' }">
                {{ r.type === 'expense' ? '-' : '+' }}¥{{ r.amount.toFixed(2) }}
              </span>
            </div>
          </div>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { useThemeStore } from '@/store/theme'
import { getStore, setStore, genId, todayStr } from '@/utils/storage'
import {
  AddOutline,
  TrashOutline,
  ListOutline,
  BookOutline,
  CalendarOutline,
  CheckmarkCircleOutline,
  CheckmarkDoneOutline,
  WaterOutline,
  HeartOutline,
  CashOutline,
} from '@vicons/ionicons5'
import { QUICK_ICONS } from '@/config/icons'

const router = useRouter()
const userStore = useUserStore()
const themeStore = useThemeStore()
const message = useMessage()
const theme = computed(() => themeStore.currentTheme)

const nickname = computed(() => userStore.user?.nickname || '宿主大人')

// ===== 日期 =====
const dateStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
})
const weekLabel = computed(() => {
  const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  return weeks[new Date().getDay()]
})
const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 12) return '早上好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
})

// ===== 今日鼓励语（按日期取固定一句，每天变）=====
const quotes = [
  '今天也要元气满满哦', '慢慢来，比较快', '你已经很棒了', '每一步都算数',
  '保持热爱，奔赴山海', '今天的努力是明天的礼物', '好好吃饭，好好睡觉',
  '做自己就好', '一切都会越来越好的', '你值得被温柔以待',
]
const todayQuote = computed(() => {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  return quotes[seed % quotes.length]
})

// ===== 每日一句 =====
const dailyEnglish = {
  en: 'Small steps every day lead to big changes.',
  cn: '每天一小步，带来大改变。',
}

// ===== 今日概览 4 宫格 =====
const waterRecords = ref(getStore('water_records', []))
const checkinRecords = ref(getStore('checkin_records', []))
const planProgress = computed(() => todayTasks.value.length === 0 ? 0 : Math.round((doneCount.value / todayTasks.value.length) * 100))

const todayStats = computed(() => {
  const tasksDone = doneCount.value
  const checkins = checkinRecords.value.filter((r) => r.date === todayStr() && r.done)
  const todayWater = waterRecords.value.filter((r) => r.date === todayStr()).reduce((s, r) => s + r.amount, 0)
  return [
    { label: '今日任务', value: `${tasksDone}/${todayTasks.value.length}`, desc: '完成进度', icon: CheckmarkCircleOutline, path: '/plan' },
    { label: '今日打卡', value: `${checkins.length}`, desc: '坚持好习惯', icon: CheckmarkDoneOutline, path: '/checkin' },
    { label: '今日喝水', value: `${todayWater}杯`, desc: '目标 8 杯', icon: WaterOutline, path: '/water' },
    { label: '本月结余', value: `¥${monthBalance.value.toFixed(0)}`, desc: '赚多少存多少', icon: HeartOutline, path: '/finance' },
  ]
})

function loadExtraData() {
  waterRecords.value = getStore('water_records', [])
  checkinRecords.value = getStore('checkin_records', [])
  loadFinanceData()
}

// ===== 快捷入口 =====
const allCards = [
  { key: 'plan', icon: 'plan', title: '计划目标', path: '/plan', interest: 'plan' },
  { key: 'checkin', icon: 'checkin', title: '今日打卡', path: '/checkin', interest: 'plan' },
  { key: 'study', icon: 'study', title: '学习中心', path: '/study', interest: 'study' },
  { key: 'mood', icon: 'mood', title: '情绪追踪', path: '/mood', interest: 'mood' },
  { key: 'health', icon: 'health', title: '健康中心', path: '/health', interest: 'fitness' },
  { key: 'water', icon: 'water', title: '喝水管理', path: '/water', interest: 'water' },
  { key: 'sleep', icon: 'sleep', title: '睡眠管理', path: '/sleep', interest: 'sleep' },
  { key: 'finance', icon: 'finance', title: '消费记账', path: '/finance', interest: 'finance' },
  { key: 'muyu', icon: 'muyu', title: '电子木鱼', path: '/muyu', interest: 'relax' },
  { key: 'chat', icon: 'chat', title: '闲话铺', path: '/chat', interest: 'relax' },
  { key: 'diary', icon: 'diary', title: '心情树洞', path: '/diary', interest: 'relax' },
  { key: 'knowledge', icon: 'knowledge', title: '知识阅读', path: '/knowledge', interest: 'study' },
  { key: 'calendar', icon: 'calendar', title: '我的日历', path: '/calendar', interest: 'plan' },
]
const cardClicks = ref(getStore('card_clicks', {}))
function trackCardClick(key) { cardClicks.value[key] = (cardClicks.value[key] || 0) + 1; setStore('card_clicks', cardClicks.value) }
function onCardClick(item) { trackCardClick(item.key); router.push(item.path) }

const VISIT_KEY = 'lw_page_visits'
function getVisitScore(pathKey) {
  const visits = JSON.parse(localStorage.getItem(VISIT_KEY) || '{}')
  const last = visits[pathKey]
  if (!last) return 0
  const hoursAgo = (Date.now() - last) / 3600000
  if (hoursAgo < 1) return 60       // 1 小时内访问
  if (hoursAgo < 24) return 30      // 今天访问
  if (hoursAgo < 72) return 10      // 3 天内
  if (hoursAgo < 168) return 0      // 7 天内
  return -20                         // 超过 7 天没用过 → 降权
}

const recommendedCards = computed(() => {
  const interests = userStore.user?.interests || []
  const enabled = userStore.user?.enabledModules || []
  let list = allCards.filter((c) => enabled.includes(c.key))
  if (list.length === 0) list = allCards.filter((c) => ['plan', 'checkin', 'water', 'muyu'].includes(c.key))
  list = list.slice().sort((a, b) => {
    const aScore = (interests.includes(a.interest) ? 100 : 0)
      + (cardClicks.value[a.key] || 0) * 2
      + getVisitScore(a.key)
    const bScore = (interests.includes(b.interest) ? 100 : 0)
      + (cardClicks.value[b.key] || 0) * 2
      + getVisitScore(b.key)
    return bScore - aScore
  })
  return list.slice(0, 6)
})

// ===== 今日计划 =====
const newTask = ref('')
const todayTasks = ref([])
function loadTasks() { todayTasks.value = getStore('tasks_today', []) }
function addTask() {
  if (!newTask.value.trim()) return
  todayTasks.value.push({ id: genId(), text: newTask.value.trim(), done: false, createdAt: Date.now() })
  newTask.value = ''
  saveTasks()
}
function toggleTask(task, val) { task.done = val; saveTasks() }
function deleteTask(id) { todayTasks.value = todayTasks.value.filter((t) => t.id !== id); saveTasks() }
function saveTasks() { setStore('tasks_today', todayTasks.value) }
const doneCount = computed(() => todayTasks.value.filter((t) => t.done).length)

// ===== 快速记账 =====
const financeRecords = ref([])
const finForm = reactive({ type: 'expense', amount: null, category: null, note: '' })
const finCategories = {
  expense: ['餐饮', '交通', '购物', '娱乐', '学习', '日用', '其他'],
  income: ['兼职', '生活费', '奖金', '其他'],
}
const finCategoryOptions = computed(() => finCategories[finForm.type].map((c) => ({ label: c, value: c })))

function loadFinanceData() { financeRecords.value = getStore('finance_records', []) }
function saveFinanceRecords() { setStore('finance_records', financeRecords.value) }

function addQuickFinance() {
  if (!finForm.amount || !finForm.category) {
    message.warning('请填写金额和分类')
    return
  }
  financeRecords.value.unshift({
    id: genId(), type: finForm.type, amount: finForm.amount,
    category: finForm.category, note: finForm.note.trim(),
    date: todayStr(), createdAt: Date.now(),
  })
  saveFinanceRecords()
  finForm.amount = null; finForm.category = null; finForm.note = ''
  message.success('已记录 ✓')
}

const todayExpense = computed(() =>
  financeRecords.value.filter((r) => r.type === 'expense' && r.date === todayStr()).reduce((s, r) => s + r.amount, 0)
)
const monthBalance = computed(() => {
  const now = new Date()
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const monthIn = financeRecords.value.filter((r) => r.type === 'income' && r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0)
  const monthEx = financeRecords.value.filter((r) => r.type === 'expense' && r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0)
  return monthIn - monthEx
})
const recentRecords = computed(() => financeRecords.value.slice(0, 2))

onMounted(() => {
  loadTasks()
  loadExtraData()
})
</script>

<style scoped>
div[style*='scrollbarWidth']::-webkit-scrollbar { display: none; }
div[style*='scrollbarWidth'] { -ms-overflow-style: none; scrollbar-width: none; }
</style>
