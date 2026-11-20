<template>
  <div class="space-y-5">
    <!-- 预算条 -->
    <n-card :bordered="false" class="card-hover">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, var(--lw-card))' }">
            <n-icon size="16" :style="{ color: 'var(--lw-primary)' }"><WalletOutline /></n-icon>
          </div>
          <span class="font-medium" :style="{ color: 'var(--lw-text)' }">本月预算</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
            已花 <b style="color:#F07040">¥{{ monthExpense.toFixed(0) }}</b> / 
            <b :style="{ color: budgetRemain >= 0 ? '#18A058' : '#F07040' }">¥{{ budget }}</b>
          </span>
          <n-input-number v-model:value="budget" :min="0" :precision="0" size="small" style="width: 120px" />
        </div>
      </div>
      <n-progress type="line" :percentage="budgetRate" :color="budgetRemain >= 200 ? 'var(--lw-primary)' : budgetRemain >= 0 ? '#f0a020' : '#F07040'" :show-indicator="false" :height="8" />
      <div class="text-xs mt-2" :style="{ color: 'var(--lw-text-tertiary)' }">
        {{ budgetRemain >= 0 ? `还剩 ¥${budgetRemain.toFixed(0)} 可花，加油~` : `超支 ¥${Math.abs(budgetRemain).toFixed(0)} 了，注意控制` }}
      </div>
    </n-card>

    <!-- 概览 + 分类饼图 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <n-card v-for="s in statsCards" :key="s.label" :bordered="false" size="medium" class="card-hover">
        <div class="text-xs mb-1" :style="{ color: 'var(--lw-text-secondary)' }">{{ s.label }}</div>
        <div class="text-2xl font-semibold" :style="{ color: s.color }">¥{{ s.value.toFixed(2) }}</div>
        <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-tertiary)' }">{{ s.desc }}</div>
      </n-card>
    </div>

    <!-- 分类占比 + 月度趋势 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- 分类饼图 -->
      <n-card :bordered="false" class="card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="font-medium" :style="{ color: 'var(--lw-text)' }">支出分类占比</span>
        </div>
        <div v-if="categoryExpenses.length === 0" class="text-center py-8 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">本月还没有支出</div>
        <div v-else class="flex items-center gap-6">
          <!-- SVG 环形图 -->
          <div class="relative" style="width: 160px; height: 160px; flex-shrink: 0">
            <svg viewBox="0 0 36 36" class="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="15" fill="none" :stroke="'var(--lw-border)'" stroke-width="3" />
              <circle
                v-for="(seg, i) in pieSegments"
                :key="i"
                cx="18" cy="18" r="15" fill="none"
                :stroke="seg.color"
                stroke-width="3"
                stroke-linecap="butt"
                :stroke-dasharray="`${seg.dash} ${94.2 - seg.dash}`"
                :stroke-dashoffset="-seg.offset"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="text-xs" :style="{ color: 'var(--lw-text-tertiary)' }">总支出</div>
              <div class="text-lg font-semibold" style="color:#F07040">¥{{ monthExpense.toFixed(0) }}</div>
            </div>
          </div>
          <!-- 图例 -->
          <div class="flex-1 space-y-2 min-w-0">
            <div v-for="c in categoryExpenses.slice(0, 6)" :key="c.name" class="flex items-center justify-between gap-2 text-sm">
              <div class="flex items-center gap-2 min-w-0">
                <span class="w-3 h-3 rounded-sm shrink-0" :style="{ background: c.color }"></span>
                <span class="truncate" :style="{ color: 'var(--lw-text)' }">{{ c.name }}</span>
              </div>
              <span class="shrink-0" :style="{ color: 'var(--lw-text-secondary)' }">¥{{ c.amount.toFixed(0) }} <span class="text-xs" :style="{ color: 'var(--lw-text-tertiary)' }">({{ c.pct }}%)</span></span>
            </div>
          </div>
        </div>
      </n-card>

      <!-- 月度条形图 -->
      <n-card :bordered="false" class="card-hover">
        <div class="flex items-center justify-between mb-4">
          <span class="font-medium" :style="{ color: 'var(--lw-text)' }">近 12 月收支</span>
        </div>
        <div class="flex items-end gap-1 h-40">
          <div v-for="m in monthlyData" :key="m.label" class="flex-1 flex flex-col items-center gap-0.5">
            <div class="w-full flex flex-col items-center gap-0.5" style="height: 140px; justify-content: flex-end">
              <div v-if="m.income > 0" class="w-full rounded-t-sm" :style="{ height: m.incomeBar + 'px', background: '#18A058', minHeight: '2px' }" :title="'收入 ¥' + m.income"></div>
              <div v-if="m.expense > 0" class="w-full rounded-t-sm" :style="{ height: m.expenseBar + 'px', background: '#F07040', minHeight: '2px' }" :title="'支出 ¥' + m.expense"></div>
            </div>
            <div class="text-[10px]" :style="{ color: 'var(--lw-text-tertiary)' }">{{ m.label }}</div>
          </div>
        </div>
        <div class="flex justify-center gap-4 mt-2 text-xs" :style="{ color: 'var(--lw-text-secondary)' }">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm" style="background:#18A058"></span>收入</span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-sm" style="background:#F07040"></span>支出</span>
        </div>
      </n-card>
    </div>

    <!-- 记一笔 -->
    <n-card :bordered="false" class="card-hover">
      <div class="flex items-center justify-between mb-4">
        <span class="font-medium text-base" :style="{ color: 'var(--lw-text)' }">记一笔</span>
        <n-button-group size="small">
          <n-button :type="form.type === 'expense' ? 'primary' : 'default'" @click="form.type = 'expense'">支出</n-button>
          <n-button :type="form.type === 'income' ? 'primary' : 'default'" @click="form.type = 'income'">收入</n-button>
        </n-button-group>
      </div>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <n-input-number v-model:value="form.amount" placeholder="金额" :min="0" :precision="2" style="width: 100%" />
        <n-select v-model:value="form.category" :options="categoryOptions" placeholder="分类" />
      </div>
      <n-input v-model:value="form.note" placeholder="备注（选填）" class="mb-3" />
      <n-button type="primary" block @click="addRecord">添加记录</n-button>
    </n-card>

    <!-- 账单列表 -->
    <n-card :bordered="false" class="card-hover">
      <div class="flex items-center justify-between mb-4">
        <span class="font-medium text-base" :style="{ color: 'var(--lw-text)' }">账单明细</span>
        <n-select v-model:value="filterType" size="small" style="width: 100px" :options="[{label:'全部',value:''},{label:'支出',value:'expense'},{label:'收入',value:'income'}]" />
      </div>
      <div v-if="filteredRecords.length === 0" class="text-center py-8 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">还没有记录，记一笔吧~</div>
      <div v-else class="space-y-2">
        <div v-for="r in filteredRecords" :key="r.id" class="flex items-center justify-between p-3 rounded-xl transition-colors" :style="{ background: 'var(--lw-bg)' }">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium" :style="{ background: r.type === 'expense' ? '#FFF1F0' : '#F6FFED', color: r.type === 'expense' ? '#F07040' : '#18A058' }">{{ r.category }}</div>
            <div>
              <div class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">{{ r.category }}</div>
              <div class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ r.note || '—' }} · {{ r.date }}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-semibold" :style="{ color: r.type === 'expense' ? '#F07040' : '#18A058' }">{{ r.type === 'expense' ? '-' : '+' }}¥{{ r.amount.toFixed(2) }}</span>
            <n-button text size="tiny" @click="deleteRecord(r.id)"><template #icon><n-icon><TrashOutline /></n-icon></template></n-button>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { TrashOutline, WalletOutline } from '@vicons/ionicons5'
import { getStore, setStore, genId, todayStr } from '@/utils/storage'

const message = useMessage()

const categories = {
  expense: ['餐饮', '交通', '购物', '娱乐', '学习', '日用', '其他'],
  income: ['兼职', '生活费', '奖金', '其他'],
}
const categoryColors = {
  餐饮: '#F07040', 交通: '#7BA7C7', 购物: '#D4A5A5', 娱乐: '#9BB7A4',
  学习: '#B8A9C9', 日用: '#C5B4A0', 其他: '#A0B8C8',
  兼职: '#52C41A', 生活费: '#1890FF', 奖金: '#FAAD14',
}

const categoryOptions = computed(() => categories[form.type].map((c) => ({ label: c, value: c })))

const form = reactive({ type: 'expense', amount: null, category: null, note: '' })
const filterType = ref('')
const records = ref([])
const budget = ref(Number(getStore('finance_budget', 3000)) || 3000)

function loadRecords() { records.value = getStore('finance_records', []) }

function addRecord() {
  if (!form.amount || !form.category) { message.warning('请填写金额和分类'); return }
  records.value.unshift({
    id: genId(), type: form.type, amount: form.amount,
    category: form.category, note: form.note.trim(),
    date: todayStr(), createdAt: Date.now(),
  })
  setStore('finance_records', records.value)
  form.amount = null; form.category = null; form.note = ''
  message.success('记录已添加')
}

function deleteRecord(id) {
  records.value = records.value.filter((r) => r.id !== id)
  setStore('finance_records', records.value)
}

const filteredRecords = computed(() => filterType.value ? records.value.filter((r) => r.type === filterType.value) : records.value)

const now = new Date()
const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
const monthExpense = computed(() => records.value.filter((r) => r.type === 'expense' && r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0))
const monthIncome = computed(() => records.value.filter((r) => r.type === 'income' && r.date.startsWith(prefix)).reduce((s, r) => s + r.amount, 0))
const monthBalance = computed(() => monthIncome.value - monthExpense.value)

const budgetRemain = computed(() => budget.value - monthExpense.value)
const budgetRate = computed(() => budget.value > 0 ? Math.min(100, Math.round((monthExpense.value / budget.value) * 100)) : 0)

// 预算变化持久化
import { watch } from 'vue'
watch(budget, (v) => setStore('finance_budget', v))

const statsCards = computed(() => [
  { label: '本月支出', value: monthExpense.value, color: '#F07040', desc: `预算 ¥${budget.value}` },
  { label: '本月收入', value: monthIncome.value, color: '#18A058', desc: '辛苦赚的钱' },
  { label: '本月结余', value: monthBalance.value, color: monthBalance.value >= 0 ? 'var(--lw-text)' : '#F07040', desc: monthBalance.value >= 0 ? '继续保持' : '入不敷出' },
])

// 分类饼图
const categoryExpenses = computed(() => {
  const map = {}
  records.value.filter((r) => r.type === 'expense' && r.date.startsWith(prefix)).forEach((r) => {
    map[r.category] = (map[r.category] || 0) + r.amount
  })
  const total = Object.values(map).reduce((s, v) => s + v, 0)
  return Object.entries(map)
    .map(([name, amount]) => ({ name, amount, color: categoryColors[name] || '#A0B8C8', pct: total ? Math.round((amount / total) * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount)
})

// SVG 环形图分段
const pieSegments = computed(() => {
  const CIRC = 2 * Math.PI * 15  // 94.2
  let offset = 0
  return categoryExpenses.value.map((c) => {
    const dash = (c.pct / 100) * CIRC
    const seg = { dash, offset, color: c.color }
    offset += dash
    return seg
  })
})

// 月度趋势
const monthlyData = computed(() => {
  const months = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const p = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const income = records.value.filter((r) => r.type === 'income' && r.date.startsWith(p)).reduce((s, r) => s + r.amount, 0)
    const expense = records.value.filter((r) => r.type === 'expense' && r.date.startsWith(p)).reduce((s, r) => s + r.amount, 0)
    months.push({ label: `${d.getMonth() + 1}月`, income, expense, incomeBar: 0, expenseBar: 0 })
  }
  const maxVal = Math.max(...months.map((m) => Math.max(m.income, m.expense)), 100)
  months.forEach((m) => {
    m.incomeBar = Math.max(2, Math.round((m.income / maxVal) * 130))
    m.expenseBar = Math.max(2, Math.round((m.expense / maxVal) * 130))
  })
  return months
})

onMounted(loadRecords)
</script>
