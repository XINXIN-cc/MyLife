<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold" :style="{ color: 'var(--lw-text)' }">健康生活</h1>
    </div>

    <n-tabs v-model:value="activeTab" type="line" animated>
      <n-tab-pane name="workout" tab="每日跟练" />
      <n-tab-pane name="video" tab="视频归档" />
      <n-tab-pane name="sport" tab="运动记录" />
      <n-tab-pane name="body" tab="身体档案" />
    </n-tabs>

    <!-- ============ 每日跟练 ============ -->
    <div v-if="activeTab === 'workout'" class="space-y-4">
      <!-- Hero -->
      <n-card :bordered="false" class="relative overflow-hidden">
        <div class="absolute inset-0 opacity-10" :style="{ background: 'linear-gradient(135deg, var(--lw-primary) 0%, var(--lw-primary-hover) 100%)' }"></div>
        <div class="relative">
          <div class="text-xs mb-1" :style="{ color: 'var(--lw-primary)' }">DAILY WORKOUT</div>
          <div class="text-2xl font-semibold mb-1" :style="{ color: 'var(--lw-text)' }">
            {{ todayCollection ? todayCollection.name : '今天还没有跟练合集' }}
          </div>
          <div class="text-sm mb-4" :style="{ color: 'var(--lw-text-secondary)' }">
            {{ todayCollection ? `${todayCollection.focus || '全身'} · ${todayCollection.items?.length || 0} 个动作 · 约 ${todayCollection.items?.reduce((s, i) => s + (i.duration || 0), 0) || 0} 分钟` : '新建一个合集，或者用默认的 20 分钟舒缓训练' }}
          </div>
          <div class="flex gap-2">
            <n-button type="primary" @click="startTodayWorkout" :disabled="!todayCollection">
              <template #icon><n-icon><PlayOutline /></n-icon></template>
              {{ workoutTimer > 0 ? `训练中 ${formatTimer(workoutTimer)}` : '开始今日跟练' }}
            </n-button>
            <n-button @click="showCollectionModal = true">
              <template #icon><n-icon><AddOutline /></n-icon></template>
              新建合集
            </n-button>
          </div>
          <div v-if="workoutTimer > 0" class="mt-3 flex gap-2">
            <n-button size="small" @click="workoutTimer = 0">结束训练</n-button>
          </div>
        </div>
      </n-card>

      <!-- 合集列表 -->
      <n-card :bordered="false">
        <div class="flex items-center justify-between mb-4">
          <div class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">我的跟练合集</div>
          <div class="text-xs" :style="{ color: 'var(--lw-text-tertiary)' }">{{ collections.length }} 个合集</div>
        </div>

        <div v-if="collections.length === 0" class="text-center py-10" :style="{ color: 'var(--lw-text-tertiary)' }">
          还没有合集，点击「新建合集」创建你的第一个跟练计划
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="c in collections"
            :key="c.id"
            class="card-hover p-4 rounded-xl cursor-pointer"
            :style="{ background: 'var(--lw-card)', border: c.id === todayCollection?.id ? '2px solid var(--lw-primary)' : '1px solid var(--lw-border)' }"
          >
            <div class="flex items-start justify-between">
              <div>
                <div class="font-medium" :style="{ color: 'var(--lw-text)' }">{{ c.name }}</div>
                <div class="text-xs mt-0.5" :style="{ color: 'var(--lw-text-secondary)' }">
                  {{ c.focus || '全身' }} · {{ c.day === 'all' ? '每天' : dayName(c.day) }}
                </div>
                <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-tertiary)' }">
                  {{ c.items?.length || 0 }} 个动作 · 约 {{ c.items?.reduce((s, i) => s + (i.duration || 0), 0) || 0 }} 分钟
                </div>
              </div>
              <div class="flex gap-1">
                <n-button text size="tiny" @click="selectToday(c)">设为今日</n-button>
                <n-button text size="tiny" type="error" @click="deleteCollection(c.id)">
                  <template #icon><n-icon size="12"><TrashOutline /></n-icon></template>
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- ============ 视频归档 ============ -->
    <div v-else-if="activeTab === 'video'" class="space-y-4">
      <n-card :bordered="false" size="small">
        <div class="flex flex-wrap items-center gap-3">
          <n-input v-model:value="searchText" placeholder="搜索视频标题..." clearable style="width: 240px" />
          <n-select v-model:value="filterTag" placeholder="按标签筛选" :options="tagOptions" clearable style="width: 160px" />
          <n-button type="primary" @click="showAddVideo = true">
            <template #icon><n-icon><AddOutline /></n-icon></template>
            添加视频
          </n-button>
        </div>
      </n-card>
      <n-card :bordered="false">
        <n-data-table :columns="videoColumns" :data="filteredVideos" :pagination="{ pageSize: 10 }" :row-key="(row) => row.id" />
      </n-card>
    </div>

    <!-- ============ 运动记录 ============ -->
    <div v-else-if="activeTab === 'sport'" class="space-y-4">
      <!-- 今日统计 -->
      <div class="grid grid-cols-3 gap-3">
        <n-card :bordered="false">
          <div class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">今日运动</div>
          <div class="text-2xl font-semibold mt-1" :style="{ color: 'var(--lw-primary)' }">{{ todaySport.totalMin }} <span class="text-sm font-normal">分钟</span></div>
        </n-card>
        <n-card :bordered="false">
          <div class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">消耗热量</div>
          <div class="text-2xl font-semibold mt-1" :style="{ color: 'var(--lw-text)' }">{{ todaySport.totalKcal }} <span class="text-sm font-normal">kcal</span></div>
        </n-card>
        <n-card :bordered="false">
          <div class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">本月累计</div>
          <div class="text-2xl font-semibold mt-1" :style="{ color: 'var(--lw-text)' }">{{ monthSport.totalMin }} <span class="text-sm font-normal">分钟</span></div>
        </n-card>
      </div>

      <!-- 添加记录 -->
      <n-card :bordered="false">
        <div class="text-sm font-medium mb-3" :style="{ color: 'var(--lw-text)' }">记录一次运动</div>
        <div class="flex flex-wrap items-end gap-3">
          <n-input v-model:value="sportForm.name" placeholder="运动名称" style="width: 160px" />
          <n-input-number v-model:value="sportForm.duration" :min="1" placeholder="时长(分)" style="width: 110px" />
          <n-input-number v-model:value="sportForm.kcal" :min="0" placeholder="消耗(kcal)" style="width: 130px" />
          <n-button type="primary" @click="saveSport">
            <template #icon><n-icon><AddOutline /></n-icon></template>
            记录
          </n-button>
        </div>
      </n-card>

      <!-- 近7天条形图 -->
      <n-card :bordered="false">
        <div class="text-sm font-medium mb-3" :style="{ color: 'var(--lw-text)' }">近 7 天运动时长</div>
        <div class="flex items-end justify-between gap-2 h-32">
          <div v-for="d in last7Sport" :key="d.date" class="flex-1 flex flex-col items-center gap-1">
            <div class="w-full rounded-t-lg transition-all" :style="{ height: Math.max(d.min * 1.5, 4) + 'px', background: d.min > 0 ? 'var(--lw-primary)' : 'var(--lw-border)' }"></div>
            <div class="text-[10px]" :style="{ color: 'var(--lw-text-tertiary)' }">{{ d.label }}</div>
          </div>
        </div>
      </n-card>

      <!-- 记录列表 -->
      <n-card :bordered="false">
        <div class="text-sm font-medium mb-3" :style="{ color: 'var(--lw-text)' }">今日运动明细</div>
        <div v-if="todaySport.records.length === 0" class="text-center py-8 text-sm" :style="{ color: 'var(--lw-text-tertiary)' }">还没有运动记录</div>
        <div v-else class="space-y-2">
          <div v-for="r in todaySport.records" :key="r.id" class="flex items-center justify-between py-2 px-3 rounded-lg" :style="{ background: 'var(--lw-bg)' }">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-lg flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 15%, white)' }">
                <n-icon size="18" :style="{ color: 'var(--lw-primary)' }"><PlayOutline /></n-icon>
              </div>
              <div>
                <div class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">{{ r.name }}</div>
                <div class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ r.duration }} 分钟 · {{ r.kcal || 0 }} kcal</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs" :style="{ color: 'var(--lw-text-tertiary)' }">{{ formatTime(r.createdAt) }}</span>
              <n-button text size="tiny" type="error" @click="deleteSport(r.id)">
                <template #icon><n-icon size="12"><TrashOutline /></n-icon></template>
              </n-button>
            </div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- ============ 身体档案 ============ -->
    <div v-else-if="activeTab === 'body'" class="space-y-4">
      <n-card :bordered="false">
        <div class="text-sm font-medium mb-3" :style="{ color: 'var(--lw-text)' }">记录身体数据</div>
        <div class="flex flex-wrap items-end gap-3">
          <n-input-number v-model:value="bodyForm.weight" :min="30" :max="200" step="0.1" placeholder="体重(kg)" style="width: 140px" />
          <n-input-number v-model:value="bodyForm.bodyFat" :min="5" :max="50" step="0.1" placeholder="体脂率(%)" style="width: 140px" />
          <n-input-number v-model:value="bodyForm.muscle" :min="20" :max="60" step="0.1" placeholder="肌肉量(kg)" style="width: 140px" />
          <n-button type="primary" @click="saveBody">保存</n-button>
        </div>
      </n-card>

      <n-card :bordered="false">
        <div class="text-sm font-medium mb-3" :style="{ color: 'var(--lw-text)' }">近 30 天体重趋势</div>
        <div class="flex items-end justify-between gap-1 h-32">
          <div v-for="d in last30Body" :key="d.date" class="flex-1 flex flex-col items-center gap-1" :title="`${d.date}: ${d.weight}kg`">
            <div class="w-full rounded-t transition-all" :style="{ height: Math.max(((d.weight - 40) * 3), 4) + 'px', background: d.weight ? 'var(--lw-primary)' : 'var(--lw-border)', opacity: d.weight ? 1 : 0.3 }"></div>
          </div>
        </div>
        <div v-if="bodyRecords.length >= 2" class="text-xs mt-3" :style="{ color: 'var(--lw-text-tertiary)' }">
          从 {{ bodyRecords[bodyRecords.length - 1].weight }} kg → {{ bodyRecords[0].weight }} kg · 
          <span :style="{ color: bodyRecords[0].weight < bodyRecords[bodyRecords.length - 1].weight ? '#52C41A' : '#F07040' }">
            {{ bodyRecords[0].weight < bodyRecords[bodyRecords.length - 1].weight ? '↓' : '↑' }}
            {{ Math.abs((bodyRecords[0].weight - bodyRecords[bodyRecords.length - 1].weight).toFixed(1)) }} kg
          </span>
        </div>
      </n-card>

      <n-card :bordered="false">
        <div class="text-sm font-medium mb-3" :style="{ color: 'var(--lw-text)' }">历史记录</div>
        <n-data-table
          :columns="bodyColumns"
          :data="bodyRecords"
          :bordered="false"
          size="small"
          :pagination="{ pageSize: 7 }"
          :row-key="(row) => row.id"
        />
      </n-card>
    </div>

    <!-- ============ 合集弹窗 ============ -->
    <n-modal v-model:show="showCollectionModal" preset="card" :title="editingCollection ? '编辑合集' : '新建合集'" style="width: 520px">
      <n-form label-placement="top">
        <n-form-item label="合集名称">
          <n-input v-model:value="collectionForm.name" placeholder="例如：周日柔韧放松" />
        </n-form-item>
        <div class="grid grid-cols-2 gap-3">
          <n-form-item label="训练目标">
            <n-input v-model:value="collectionForm.focus" placeholder="如：手臂、腰腹、拉伸" />
          </n-form-item>
          <n-form-item label="每周哪一天">
            <n-select v-model:value="collectionForm.day" :options="dayOptions" />
          </n-form-item>
        </div>
        <n-form-item label="动作列表（每行一个：动作名 + 分钟数，用逗号分隔）">
          <n-input
            v-model:value="collectionForm.itemsText"
            type="textarea"
            :rows="4"
            placeholder="例如：&#10;颈部旋转,2&#10;肩颈拉伸,5&#10;猫牛式,3"
          />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showCollectionModal = false">取消</n-button>
          <n-button type="primary" @click="saveCollection">保存</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- ============ 视频弹窗 ============ -->
    <n-modal v-model:show="showAddVideo" preset="card" title="添加运动视频" style="width: 520px">
      <n-form label-placement="top">
        <n-form-item label="视频链接">
          <n-input v-model:value="videoForm.url" placeholder="粘贴 B站/抖音/YouTube 链接" />
        </n-form-item>
        <n-form-item label="视频标题">
          <n-input v-model:value="videoForm.title" placeholder="视频标题" />
        </n-form-item>
        <n-form-item label="标签">
          <n-select v-model:value="videoForm.tags" multiple :options="tagOptions" placeholder="选择部位/时长/强度标签" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showAddVideo = false">取消</n-button>
          <n-button type="primary" @click="saveVideo">保存</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted, onBeforeUnmount } from 'vue'
import { NIcon, NTag, useMessage } from 'naive-ui'
import { AddOutline, PlayOutline, TrashOutline } from '@vicons/ionicons5'
import { getStore, setStore, genId, todayStr } from '@/utils/storage'

const message = useMessage()

// ===== 通用 =====
const activeTab = ref('workout')

// ===== 每日跟练 =====
const collections = ref([])
const showCollectionModal = ref(false)
const editingCollection = ref(null)
const collectionForm = ref({ name: '', focus: '', day: 'all', itemsText: '' })
const workoutTimer = ref(0)
let workoutTimerId = null

function loadCollections() {
  collections.value = getStore('workout_collections', [])
}

function saveCollections() {
  setStore('workout_collections', collections.value)
}

const dayOptions = [
  { label: '每天', value: 'all' },
  { label: '周一', value: '1' },
  { label: '周二', value: '2' },
  { label: '周三', value: '3' },
  { label: '周四', value: '4' },
  { label: '周五', value: '5' },
  { label: '周六', value: '6' },
  { label: '周日', value: '0' },
]

function dayName(d) {
  return dayOptions.find((x) => x.value === d)?.label || ''
}

const todayCollection = computed(() => {
  const stored = getStore('workout_today_id', null)
  if (stored) return collections.value.find((c) => c.id === stored) || null
  // 默认：匹配今天星期
  const day = String(new Date().getDay())
  return collections.value.find((c) => c.day === day || c.day === 'all') || null
})

function saveCollection() {
  if (!collectionForm.value.name.trim()) return message.warning('请输入合集名称')
  const items = collectionForm.value.itemsText
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, dur] = line.split(',').map((x) => x.trim())
      return { name, duration: parseInt(dur) || 3 }
    })
  if (editingCollection.value) {
    const idx = collections.value.findIndex((c) => c.id === editingCollection.value.id)
    if (idx >= 0) collections.value[idx] = { ...collections.value[idx], ...collectionForm.value, items }
  } else {
    collections.value.unshift({
      id: genId(),
      name: collectionForm.value.name,
      focus: collectionForm.value.focus,
      day: collectionForm.value.day,
      items,
      createdAt: Date.now(),
    })
  }
  saveCollections()
  collectionForm.value = { name: '', focus: '', day: 'all', itemsText: '' }
  editingCollection.value = null
  showCollectionModal.value = false
  message.success('合集已保存')
}

function deleteCollection(cid) {
  collections.value = collections.value.filter((c) => c.id !== cid)
  saveCollections()
  message.success('已删除')
}

function selectToday(c) {
  setStore('workout_today_id', c.id)
  message.success(`「${c.name}」已设为今日跟练`)
}

function startTodayWorkout() {
  if (workoutTimer.value > 0) return
  workoutTimer.value = 1
  workoutTimerId = setInterval(() => {
    workoutTimer.value++
    if (workoutTimer.value % 60 === 0) {
      // 每满一分钟记一次 sport
      saveSportSilent({
        name: (todayCollection.value?.name || '每日跟练') + ` (${Math.floor(workoutTimer.value / 60)}分钟)`,
        duration: 1,
        kcal: 8,
      })
    }
  }, 1000)
  message.success('开始训练！加油~')
}

function formatTimer(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

// ===== 视频归档 =====
const showAddVideo = ref(false)
const videoForm = ref({ url: '', title: '', tags: [] })
const videos = ref([])
const searchText = ref('')
const filterTag = ref(null)

const tagOptions = [
  { label: '减脂', value: '减脂' }, { label: '塑形', value: '塑形' }, { label: '拉伸', value: '拉伸' },
  { label: '上肢', value: '上肢' }, { label: '下肢', value: '下肢' }, { label: '核心', value: '核心' },
  { label: '全身', value: '全身' }, { label: '有氧', value: '有氧' },
  { label: '15分钟内', value: '15分钟内' }, { label: '30分钟', value: '30分钟' },
  { label: '轻松', value: '轻松' }, { label: '中等', value: '中等' }, { label: '高强度', value: '高强度' },
]

function loadVideos() {
  videos.value = getStore('videos', [])
}

function saveVideo() {
  if (!videoForm.value.url || !videoForm.value.title) return message.warning('请填写完整')
  videos.value.unshift({ id: genId(), ...videoForm.value, createdAt: Date.now() })
  setStore('videos', videos.value)
  videoForm.value = { url: '', title: '', tags: [] }
  showAddVideo.value = false
  message.success('已添加')
}

const filteredVideos = computed(() => {
  let list = videos.value
  if (searchText.value) list = list.filter((v) => v.title.includes(searchText.value))
  if (filterTag.value) list = list.filter((v) => (v.tags || []).includes(filterTag.value))
  return list
})

function deleteVideo(id) {
  videos.value = videos.value.filter((v) => v.id !== id)
  setStore('videos', videos.value)
}

function getPlatform(url) {
  if (url.includes('bilibili.com') || url.includes('b23.tv')) return { name: 'B站', color: '#fb7299' }
  if (url.includes('douyin.com')) return { name: '抖音', color: '#161823' }
  if (url.includes('youtube.com') || url.includes('youtu.be')) return { name: 'YouTube', color: '#ff0000' }
  return { name: '其他', color: 'var(--lw-primary)' }
}

const videoColumns = [
  {
    title: '标题', key: 'title', ellipsis: { tooltip: true },
    render: (row) => h('div', { class: 'flex items-center gap-2' }, [
      h('span', { style: { background: getPlatform(row.url).color, color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' } }, getPlatform(row.url).name),
      h('span', { style: { color: 'var(--lw-text)' } }, row.title),
    ]),
  },
  {
    title: '标签', key: 'tags', width: 220,
    render: (row) => h('div', { class: 'flex flex-wrap gap-1' }, (row.tags || []).map((t) => h(NTag, { size: 'small', round: true, type: 'default' }, { default: () => t }))),
  },
  {
    title: '操作', key: 'actions', width: 120,
    render: (row) => h('div', { class: 'flex gap-2' }, [
      h('button', { class: 'text-xs px-2 py-1 rounded', style: { color: 'var(--lw-primary)' }, onClick: () => window.open(row.url, '_blank') }, [h(NIcon, { size: 16 }, { default: () => h(PlayOutline) })]),
      h('button', { class: 'text-xs px-2 py-1 rounded', style: { color: '#e88080' }, onClick: () => deleteVideo(row.id) }, [h(NIcon, { size: 16 }, { default: () => h(TrashOutline) })]),
    ]),
  },
]

// ===== 运动记录 =====
const sportRecords = ref([])
const sportForm = ref({ name: '', duration: null, kcal: null })

function loadSport() {
  sportRecords.value = getStore('sport_records', [])
}

function saveSport() {
  if (!sportForm.value.name?.trim() || !sportForm.value.duration) return message.warning('请填写运动名称和时长')
  saveSportSilent({ name: sportForm.value.name, duration: sportForm.value.duration, kcal: sportForm.value.kcal || 0 })
  sportForm.value = { name: '', duration: null, kcal: null }
  message.success('已记录')
}

function saveSportSilent(entry) {
  sportRecords.value.unshift({ id: genId(), date: todayStr(), createdAt: Date.now(), ...entry })
  setStore('sport_records', sportRecords.value)
  // 同时更新 checkin 的 sport_minutes 数据源
  const todayMin = sportRecords.value.filter((r) => r.date === todayStr()).reduce((s, r) => s + (r.duration || 0), 0)
  setStore('sport_minutes', { date: todayStr(), minutes: todayMin })
}

function deleteSport(sid) {
  sportRecords.value = sportRecords.value.filter((s) => s.id !== sid)
  setStore('sport_records', sportRecords.value)
  message.success('已删除')
}

function formatTime(ts) {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const todaySport = computed(() => {
  const today = todayStr()
  const records = sportRecords.value.filter((r) => r.date === today)
  const totalMin = records.reduce((s, r) => s + (r.duration || 0), 0)
  const totalKcal = records.reduce((s, r) => s + (r.kcal || 0), 0)
  return { records, totalMin, totalKcal }
})

const monthSport = computed(() => {
  const now = new Date()
  const prefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const records = sportRecords.value.filter((r) => r.date?.startsWith(prefix))
  const totalMin = records.reduce((s, r) => s + (r.duration || 0), 0)
  return { records, totalMin }
})

const last7Sport = computed(() => {
  const arr = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const min = sportRecords.value.filter((r) => r.date === ds).reduce((s, r) => s + (r.duration || 0), 0)
    arr.push({ date: ds, min, label: i === 0 ? '今' : `${d.getMonth() + 1}/${d.getDate()}` })
  }
  return arr
})

// ===== 身体档案 =====
const bodyRecords = ref([])
const bodyForm = ref({ weight: null, bodyFat: null, muscle: null })

function loadBody() {
  bodyRecords.value = getStore('body_records', [])
}

function saveBody() {
  if (!bodyForm.value.weight) return message.warning('请至少填写体重')
  bodyRecords.value.unshift({ id: genId(), date: todayStr(), createdAt: Date.now(), ...bodyForm.value })
  setStore('body_records', bodyRecords.value)
  bodyForm.value = { weight: null, bodyFat: null, muscle: null }
  message.success('已保存')
}

const last30Body = computed(() => {
  const arr = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    const rec = bodyRecords.value.find((r) => r.date === ds)
    arr.push({ date: ds, weight: rec?.weight || null })
  }
  return arr
})

const bodyColumns = [
  { title: '日期', key: 'date', width: 110 },
  { title: '体重(kg)', key: 'weight', width: 110, render: (r) => r.weight || '-' },
  { title: '体脂率(%)', key: 'bodyFat', width: 120, render: (r) => r.bodyFat || '-' },
  { title: '肌肉量(kg)', key: 'muscle', width: 120, render: (r) => r.muscle || '-' },
  { title: '操作', key: 'actions', width: 80, render: (row) => h('button', { class: 'text-xs', style: { color: '#e88080' }, onClick: () => { bodyRecords.value = bodyRecords.value.filter((x) => x.id !== row.id); setStore('body_records', bodyRecords.value) } }, '删除') },
]

// ===== 初始化 =====
onMounted(() => {
  loadCollections()
  loadVideos()
  loadSport()
  loadBody()
})

onBeforeUnmount(() => {
  if (workoutTimerId) clearInterval(workoutTimerId)
})
</script>
