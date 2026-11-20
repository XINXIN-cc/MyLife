<template>
  <div class="space-y-5">
    <div class="flex items-center justify-between">
      <h1 class="text-xl font-semibold" :style="{ color: 'var(--lw-text)' }">心情树洞</h1>
      <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">记录心情 · 匿名倾诉</span>
    </div>

    <n-tabs v-model:value="tab" type="line" animated>
      <!-- Tab 1: 心情日记 -->
      <n-tab-pane name="diary" tab="心情日记">
        <div class="grid grid-cols-1 md:grid-cols-[1fr_400px] gap-4">
          <!-- 左：日记列表 -->
          <div class="min-w-0">
            <n-card :bordered="false">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">共 {{ diaries.length }} 篇日记</span>
                <n-button type="primary" size="small" @click="openDiary">+ 写日记</n-button>
              </div>
              <div v-if="diaries.length === 0" class="text-center py-12" :style="{ color: 'var(--lw-text-secondary)' }">
                <div class="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, transparent)' }">
                  <n-icon size="32" :style="{ color: 'var(--lw-primary)' }"><CreateOutline /></n-icon>
                </div>
                <p>还没有日记，记录今天的故事吧</p>
              </div>
              <div v-else class="space-y-3">
                <div v-for="d in diaries" :key="d.id" @click="selected = d" class="p-4 rounded-xl cursor-pointer transition-all" :style="{ background: selected?.id === d.id ? 'color-mix(in srgb, var(--lw-primary) 8%, var(--lw-card))' : 'var(--lw-card)', border: '1px solid', borderColor: selected?.id === d.id ? 'var(--lw-primary)' : 'var(--lw-border)' }">
                  <div class="flex items-center justify-between">
                    <span class="text-xl">{{ d.mood }}</span>
                    <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ fmtDate(d.createdAt) }}</span>
                  </div>
                  <div class="font-medium mt-2 truncate" :style="{ color: 'var(--lw-text)' }">{{ d.title || '无标题' }}</div>
                  <div class="text-sm mt-1 line-clamp-2" :style="{ color: 'var(--lw-text-secondary)' }">{{ d.content }}</div>
                </div>
              </div>
            </n-card>
          </div>
          <!-- 右：详情/编辑 -->
          <div class="min-w-0">
            <n-card :bordered="false">
              <template v-if="selected">
                <div class="flex items-center justify-between mb-4">
                  <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">{{ fmtDate(selected.createdAt) }}</span>
                  <div class="flex gap-2">
                    <n-button text size="tiny" @click="editDiary">编辑</n-button>
                    <n-button text size="tiny" type="error" @click="delDiary">删除</n-button>
                  </div>
                </div>
                <div class="text-4xl mb-3">{{ selected.mood }}</div>
                <h2 class="text-lg font-medium mb-2" :style="{ color: 'var(--lw-text)' }">{{ selected.title }}</h2>
                <div class="flex gap-1 mb-3"><n-tag v-for="t in selected.tags" :key="t" size="small" round>{{ t }}</n-tag></div>
                <div class="text-sm whitespace-pre-wrap leading-relaxed" :style="{ color: 'var(--lw-text)' }">{{ selected.content }}</div>
              </template>
              <div v-else class="text-center py-16" :style="{ color: 'var(--lw-text-secondary)' }">
                <div class="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, transparent)' }">
                  <n-icon size="32" :style="{ color: 'var(--lw-primary)' }"><CreateOutline /></n-icon>
                </div>
                <p>选择一篇日记查看详情</p>
              </div>
            </n-card>
          </div>
        </div>

        <!-- 写/编辑日记弹窗 -->
        <n-modal v-model:show="showDiary" preset="card" :title="editingId ? '编辑日记' : '写日记'" style="width: 520px">
          <n-form label-placement="top">
            <n-form-item label="心情">
              <n-radio-group v-model:value="dForm.mood">
                <n-radio-button v-for="m in moods" :key="m" :value="m">{{ m }}</n-radio-button>
              </n-radio-group>
            </n-form-item>
            <n-form-item label="标题"><n-input v-model:value="dForm.title" placeholder="给今天起个标题" /></n-form-item>
            <n-form-item label="内容"><n-input v-model:value="dForm.content" type="textarea" :rows="5" placeholder="写下今天的故事..." /></n-form-item>
            <n-form-item label="标签（逗号分隔）"><n-input v-model:value="dForm.tagsStr" placeholder="如：开心,学习" /></n-form-item>
          </n-form>
          <template #footer>
            <n-button @click="showDiary = false">取消</n-button>
            <n-button type="primary" @click="saveDiary">保存</n-button>
          </template>
        </n-modal>
      </n-tab-pane>

      <!-- Tab 2: 匿名树洞 -->
      <n-tab-pane name="treehole" tab="匿名树洞">
        <!-- 发帖 -->
        <n-card :bordered="false" class="mb-4">
          <div class="flex items-center justify-between mb-3">
            <span class="font-medium text-base" :style="{ color: 'var(--lw-text)' }">匿名树洞</span>
            <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">说出来，就有人听见</span>
          </div>
          <n-input v-model:value="newPost" type="textarea" placeholder="今天遇到什么事了？匿名说出来吧~" :rows="3" :autosize="{ minRows: 3, maxRows: 6 }" />
          <div class="flex justify-end mt-3">
            <n-button type="primary" @click="publishPost" :disabled="!newPost.trim()">匿名发布</n-button>
          </div>
        </n-card>

        <!-- 帖子列表 -->
        <div v-if="postsWithTime.length === 0" class="text-center py-16" :style="{ color: 'var(--lw-text-secondary)' }">
          <div class="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, transparent)' }">
            <n-icon size="32" :style="{ color: 'var(--lw-primary)' }"><LeafOutline /></n-icon>
          </div>
          <div class="text-sm">还没有人发过树洞，你是第一个</div>
        </div>

        <div v-else class="space-y-4">
          <div v-for="p in postsWithTime" :key="p.id" class="rounded-xl p-4 transition-all duration-200 hover:shadow-sm" :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm" :style="{ background: p.avatarBg, color: '#fff' }">{{ p.avatarChar }}</div>
              <span class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">{{ p.nickname }}</span>
              <span class="text-xs" :style="{ color: 'var(--lw-text-tertiary)' }">{{ p.timeLabel }}</span>
            </div>
            <div class="text-sm leading-relaxed whitespace-pre-wrap mb-3" :style="{ color: 'var(--lw-text)' }">{{ p.content }}</div>
            <div class="flex items-center gap-4 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
              <button @click="toggleLike(p.id)" class="flex items-center gap-1 transition-colors" :style="{ color: p.liked ? '#F07040' : 'var(--lw-text-secondary)' }">
                <HeartOutline :size="16" /><span>{{ p.likes }}</span>
              </button>
            </div>
            <div v-if="p.aiReply" class="mt-3 pt-3 border-t text-sm" :style="{ borderColor: 'var(--lw-border)' }">
              <div class="flex items-center gap-1.5 mb-1">
                <SparklesOutline :size="14" :style="{ color: 'var(--lw-primary)' }" />
                <span class="text-xs font-medium" :style="{ color: 'var(--lw-primary)' }">AI 暖心回应</span>
              </div>
              <div class="text-sm pl-5" :style="{ color: 'var(--lw-text-secondary)' }">{{ p.aiReply }}</div>
            </div>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessage, NIcon } from 'naive-ui'
import { CreateOutline, HeartOutline, SparklesOutline, LeafOutline } from '@vicons/ionicons5'
import { getStore, setStore, genId } from '@/utils/storage'

const message = useMessage()
const tab = ref('diary')

// ===== 日记 =====
const moods = ['😊', '😢', '😡', '😴', '🤔', '🥰', '😎', '😌']
const diaries = ref([])
const selected = ref(null)
const showDiary = ref(false)
const editingId = ref(null)
const dForm = ref({ mood: '😊', title: '', content: '', tagsStr: '' })

function loadDiaries() { diaries.value = getStore('diaries', []).sort((a, b) => b.createdAt - a.createdAt) }
function saveDiaries() { setStore('diaries', diaries.value) }
function fmtDate(ts) { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` }
function openDiary() { editingId.value = null; dForm.value = { mood: '😊', title: '', content: '', tagsStr: '' }; showDiary.value = true }
function editDiary() { if (!selected.value) return; editingId.value = selected.value.id; dForm.value = { mood: selected.value.mood, title: selected.value.title, content: selected.value.content, tagsStr: (selected.value.tags || []).join(',') }; showDiary.value = true }
function saveDiary() {
  if (!dForm.value.content.trim()) return message.warning('内容不能为空')
  const tags = dForm.value.tagsStr.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
  if (editingId.value) {
    const idx = diaries.value.findIndex((d) => d.id === editingId.value)
    if (idx >= 0) { diaries.value[idx] = { ...diaries.value[idx], ...dForm.value, tags }; selected.value = diaries.value[idx] }
    message.success('已更新')
  } else {
    const newD = { id: genId(), mood: dForm.value.mood, title: dForm.value.title.trim(), content: dForm.value.content.trim(), tags, createdAt: Date.now() }
    diaries.value.unshift(newD); selected.value = newD; message.success('已保存')
  }
  saveDiaries(); showDiary.value = false
}
function delDiary() { if (!selected.value) return; diaries.value = diaries.value.filter((d) => d.id !== selected.value.id); saveDiaries(); selected.value = null; message.success('已删除') }

// ===== 树洞 =====
const newPost = ref('')
const posts = ref([])
const anonymousNames = ['迷路的小猫', '熬夜的星星', '发呆的云朵', '想睡的熊猫', '漂流的瓶子', '匿名的小熊', '深夜的猫头鹰', '迷路的狐狸']
const avatarColors = ['#7BA7C7', '#D4A5A5', '#9BB7A4', '#B8A9C9', '#E8B4A0', '#C5B4A0', '#A0B8C8', '#B0C4A0']
const aiReplies = ['抱抱你~ 不管发生什么，总会过去的。', '你不是一个人，很多人都有过类似的感受。', '辛苦了，今天也要好好吃饭好好睡觉呀。', '能说出来就已经很棒了。', '慢慢来，一切都会好起来的。', '你值得被温柔对待呀。', '加油，明天又是新的一天~']

function loadPosts() { posts.value = getStore('treehole_posts', []) }
function savePosts() { setStore('treehole_posts', posts.value) }
function timeAgo(ts) {
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return '刚刚'
  if (m < 60) return `${m}分钟前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}小时前`
  return `${Math.floor(h / 24)}天前`
}
const postsWithTime = computed(() => posts.value.map((p) => ({ ...p, timeLabel: timeAgo(p.createdAt) })))

function publishPost() {
  if (!newPost.value.trim()) return
  const idx = Math.floor(Math.random() * anonymousNames.length)
  posts.value.unshift({
    id: genId(), content: newPost.value.trim(), nickname: anonymousNames[idx], avatarChar: anonymousNames[idx][0],
    avatarBg: avatarColors[idx], createdAt: Date.now(), likes: 0, liked: false,
    aiReply: aiReplies[Math.floor(Math.random() * aiReplies.length)],
  })
  savePosts(); newPost.value = ''; message.success('已匿名发布')
}
function toggleLike(id) {
  const p = posts.value.find((x) => x.id === id); if (!p) return
  p.liked = !p.liked; p.likes += p.liked ? 1 : -1; savePosts()
}

onMounted(() => { loadDiaries(); loadPosts() })
</script>
