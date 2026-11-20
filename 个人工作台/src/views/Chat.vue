<template>
  <div class="chat-layout">
    <!-- ========== 左侧：对话列表 ========== -->
    <div class="chat-sidebar">
      <div class="px-3 pt-3 pb-2">
        <n-button type="primary" block @click="newChat" class="!rounded-xl">
          <template #icon><n-icon><CreateOutline /></n-icon></template>
          新建对话
        </n-button>
      </div>
      <div class="chat-convs">
        <div
          v-for="c in conversations"
          :key="c.id"
          class="conv-item"
          :class="{ active: currentConvId === c.id }"
          @click="switchConv(c.id)"
        >
          <n-icon size="14" class="mr-2 shrink-0" :style="{ color: currentConvId === c.id ? 'var(--lw-primary)' : 'var(--lw-text-tertiary)' }">
            <ChatbubbleEllipsesOutline />
          </n-icon>
          <div class="flex-1 min-w-0 truncate text-sm" :style="{ color: currentConvId === c.id ? 'var(--lw-primary)' : 'var(--lw-text)' }">
            {{ c.title || '新对话' }}
          </div>
          <n-icon
            size="12"
            class="conv-del opacity-0 shrink-0 ml-1"
            :style="{ color: 'var(--lw-text-tertiary)' }"
            @click.stop="deleteConv(c.id)"
          >
            <TrashOutline />
          </n-icon>
        </div>
        <div v-if="conversations.length === 0" class="text-center py-6 text-xs" :style="{ color: 'var(--lw-text-tertiary)' }">
          还没有对话<br>点上方按钮开始第一个
        </div>
      </div>

      <!-- 底部：风格切换 -->
      <div class="px-3 pb-3 mt-auto border-t pt-3" :style="{ borderColor: 'var(--lw-border)' }">
        <div class="text-[11px] mb-1.5" :style="{ color: 'var(--lw-text-tertiary)' }">AI 风格</div>
        <n-select v-model:value="currentStyle" :options="styleOptions" size="small" />
      </div>
    </div>

    <!-- ========== 右侧：当前对话 ========== -->
    <div class="chat-main">
      <!-- 顶部栏 -->
      <div class="chat-header">
        <div class="flex items-center gap-2 min-w-0">
          <n-icon size="18" :style="{ color: 'var(--lw-primary)' }"><ChatbubbleEllipsesOutline /></n-icon>
          <span class="font-semibold text-sm truncate">{{ currentConv?.title || '闲话铺' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <n-button size="tiny" text @click="showMemory = !showMemory" class="!text-xs">
            <template #icon><n-icon size="14"><BookmarkOutline /></n-icon></template>
            记忆 {{ memories.length }}
          </n-button>
        </div>
      </div>

      <!-- 消息区 -->
      <div ref="messageBox" class="chat-messages">
        <!-- 空状态 -->
        <div v-if="messages.length === 0" class="chat-empty">
          <div class="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, transparent)' }">
            <n-icon size="32" :style="{ color: 'var(--lw-primary)' }"><ChatbubbleEllipsesOutline /></n-icon>
          </div>
          <div class="text-sm mb-4" :style="{ color: 'var(--lw-text-secondary)' }">想聊点什么？选一个试试 ↓</div>
          <div class="flex flex-wrap gap-2 justify-center max-w-md">
            <div
              v-for="t in quickTopics"
              :key="t.text"
              @click="quickSend(t.text)"
              class="quick-topic cursor-pointer px-3 py-1.5 rounded-full text-xs transition-all"
              :style="{ background: 'var(--lw-bg)', color: 'var(--lw-text-secondary)', border: '1px solid var(--lw-border)' }"
            >
              <n-icon size="12" class="mr-1" :style="{ color: 'var(--lw-primary)' }"><component :is="t.icon" /></n-icon>
              {{ t.text }}
            </div>
          </div>
        </div>

        <!-- 消息列表 -->
        <div v-else class="space-y-4">
          <div v-for="m in messages" :key="m.id" class="flex gap-3" :class="m.role === 'user' ? 'flex-row-reverse' : ''">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-medium"
              :style="{ background: m.role === 'user' ? 'var(--lw-primary)' : 'var(--lw-bg)', color: m.role === 'user' ? '#fff' : 'var(--lw-text)', border: '1px solid var(--lw-border)' }"
            >
              {{ m.role === 'user' ? '我' : aiName.charAt(0) }}
            </div>
            <div class="max-w-[75%]">
              <div v-if="m.role === 'assistant'" class="text-xs mb-1" :style="{ color: 'var(--lw-text-tertiary)' }">{{ aiName }}</div>
              <div
                class="px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed"
                :class="m.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'"
                :style="{
                  background: m.role === 'user' ? 'var(--lw-primary)' : 'var(--lw-bg)',
                  color: m.role === 'user' ? '#fff' : 'var(--lw-text)',
                }"
              >
                {{ m.text }}
                <span v-if="m.streaming" class="inline-block w-1.5 h-4 ml-0.5 animate-pulse" :style="{ background: m.role === 'user' ? '#fff' : 'var(--lw-text-secondary)' }"></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="chat-input">
        <div class="flex flex-col gap-1 shrink-0">
          <!-- 语音输入按钮 -->
          <n-button
            size="small"
            circle
            :type="isRecording ? 'error' : 'default'"
            @click="toggleVoice"
            :disabled="loading"
            :title="isRecording ? '停止录音' : '语音输入'"
          >
            <template #icon>
              <n-icon :size="16"><MicOutline /></n-icon>
            </template>
          </n-button>
          <!-- AI 语音开关 -->
          <n-button
            size="small"
            circle
            :type="voiceReply ? 'primary' : 'default'"
            @click="voiceReply = !voiceReply; message.success(voiceReply ? 'AI 将语音回复' : '已关闭语音')"
            title="AI 语音回复"
          >
            <template #icon>
              <n-icon :size="16"><VolumeHighOutline /></n-icon>
            </template>
          </n-button>
        </div>
        <n-input
          v-model:value="inputText"
          :placeholder="isRecording ? '正在听你说...' : '说点什么...(Enter 发送)'"
          @keyup.enter="sendMessage"
          :disabled="loading"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 3 }"
          class="!rounded-xl"
        />
        <n-button type="primary" @click="sendMessage" :disabled="!inputText.trim() || loading" class="!rounded-xl !h-10 shrink-0">
          <template #icon><n-icon><SendOutline /></n-icon></template>
          发送
        </n-button>
      </div>
    </div>

    <!-- 记忆面板 -->
    <div v-if="showMemory" class="chat-memory">
      <div class="flex items-center justify-between mb-3">
        <span class="text-sm font-medium flex items-center gap-1.5" :style="{ color: 'var(--lw-text)' }">
          <n-icon size="14" :style="{ color: 'var(--lw-primary)' }"><SparklesOutline /></n-icon>
          AI 的记忆
          <n-tag v-if="memoryCloud" size="tiny" type="success" :bordered="false" round>☁ 云端</n-tag>
          <n-tag v-else size="tiny" :bordered="false" round>本地</n-tag>
        </span>
        <n-button text size="tiny" type="error" @click="clearMemory" :disabled="memories.length === 0">清空</n-button>
      </div>

      <!-- 记忆开关 -->
      <div class="flex items-center justify-between mb-3 p-2 rounded-lg" :style="{ background: 'var(--lw-bg)' }">
        <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">允许 AI 记住我</span>
        <n-switch v-model:value="memoryEnabled" size="small" @update:value="onMemoryToggle" />
      </div>

      <div v-if="memoryTip" class="mb-2 text-[11px] leading-relaxed p-2 rounded-lg" :style="{ background: 'color-mix(in srgb, #e7a23a 12%, transparent)', color: '#b9761b' }">
        {{ memoryTip }}
      </div>

      <div v-if="memories.length === 0" class="text-center py-8 text-xs" :style="{ color: 'var(--lw-text-secondary)' }">
        还没有记住什么<br>和我聊聊你自己吧~
      </div>
      <div v-else class="space-y-1.5 max-h-[45vh] overflow-auto">
        <div v-for="(m, i) in memories" :key="i" class="group flex items-start gap-2 p-2 rounded-lg text-xs" :style="{ background: 'var(--lw-bg)' }">
          <n-icon size="12" :style="{ color: 'var(--lw-primary)', flexShrink: 0, marginTop: 2 }"><HeartOutline /></n-icon>
          <span class="flex-1 leading-relaxed" :style="{ color: 'var(--lw-text)' }">{{ m.content }}</span>
          <n-icon
            size="12"
            class="shrink-0 cursor-pointer opacity-40 hover:opacity-100"
            :style="{ color: 'var(--lw-text-tertiary)', marginTop: 2 }"
            title="删除这条"
            @click="removeMemory(i)"
          ><TrashOutline /></n-icon>
        </div>
      </div>
      <div class="mt-3 pt-3 border-t text-[11px] leading-relaxed" :style="{ borderColor: 'var(--lw-border)', color: 'var(--lw-text-tertiary)' }">
        {{ memoryCloud ? '记忆已存云端，换设备登录同一手机号即可看到' : '当前为本地记忆模式' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import {
  BookmarkOutline, ChatbubbleEllipsesOutline, SparklesOutline, HeartOutline, SendOutline,
  WaterOutline, CheckmarkDoneOutline, HelpCircleOutline, HappyOutline, SunnyOutline,
  CreateOutline, TrashOutline, MicOutline, VolumeHighOutline,
} from '@vicons/ionicons5'
import { genId, getStore, setStore, todayStr } from '@/utils/storage'
import { streamChat, fetchMemories, deleteMemory } from '@/api/chat'
import { useUserStore } from '@/store/user'
import { useMessage } from 'naive-ui'

const userStore = useUserStore()
const message = useMessage()

const styleOptions = [
  { label: '暖心姐姐', value: 'warm' },
  { label: '理性朋友', value: 'rational' },
  { label: '幽默搭子', value: 'humor' },
  { label: '学习导师', value: 'mentor' },
]

const SYSTEM_PROMPTS = {
  warm: '你是一个全能的温柔姐姐，什么都能聊：情感陪伴、学习辅导、技术问答、生活建议、创意脑暴、知识科普、实用工具。语气温柔、耐心、共情，像一个靠谱的闺蜜姐姐。遇到任何问题都能接住，自然地根据话题切换专业度。不要每次结尾都生硬引导话题。',
  rational: '你是一个全能的理性朋友，什么都能聊：情感倾听、学习方法、技术分析、生活规划、创意评估、知识科普。语气冷静、客观、逻辑清晰，擅长帮人理清思路、拆解问题、给出可执行建议。但面对情绪问题时也要先共情再分析，不要冷冰冰。不要每次结尾都生硬引导话题。',
  humor: '你是一个全能的幽默搭子，什么都能聊：轻松闲聊、学习吐槽、技术梗、生活趣事、创意脑暴、冷知识科普。语气活泼、俏皮、会玩梗，偶尔抖个机灵。该认真时也能认真，该搞笑时不吝啬。不要每次结尾都生硬引导话题。',
  mentor: '你是一个全能的导师型伙伴，什么都能聊：学习辅导、知识讲解、技术答疑、人生建议、职业规划、思维训练。语气耐心、启发式，擅长把复杂问题讲简单，鼓励独立思考。既能像老师一样专业，也能像学长/学姐一样亲近。不要每次结尾都生硬引导话题。',
}

const quickTopics = [
  { text: '我今天喝了几杯水？', icon: WaterOutline },
  { text: '给我一个放松小建议', icon: SunnyOutline },
  { text: '今天心情不好...', icon: HeartOutline },
  { text: '有什么推荐的学习方法吗', icon: HelpCircleOutline },
  { text: '夸夸我今天做得好的', icon: HappyOutline },
  { text: '今天的打卡完成了吗', icon: CheckmarkDoneOutline },
]

const STORAGE_CONVS = 'chat_conversations'
const STORAGE_CURRENT = 'chat_current_conv'

const currentStyle = ref('warm')
const conversations = ref([])      // [{ id, title, style, messages, updatedAt }]
const currentConvId = ref(null)
const inputText = ref('')
const loading = ref(false)
const messageBox = ref(null)
const showMemory = ref(false)
const memories = ref([])
const memoryCloud = ref(false)   // 记忆是否已上云
const memoryTip = ref('')        // 未配置云存储时的提示

// ===== 语音相关 =====
const isRecording = ref(false)
const voiceReply = ref(getStore('chat_voice_reply', false))
let recognition = null
let voiceSupported = false

// 初始化语音识别
function initVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) { voiceSupported = false; return }
  voiceSupported = true
  recognition = new SR()
  recognition.lang = 'zh-CN'
  recognition.interimResults = true
  recognition.continuous = true
  recognition.onresult = (e) => {
    let final = ''
    let interim = ''
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i]
      if (r.isFinal) final += r[0].transcript
      else interim += r[0].transcript
    }
    if (final) {
      inputText.value += final
    } else if (interim) {
      inputText.value = inputText.value.replace(/\s*$/, '') + interim
    }
  }
  recognition.onerror = () => { isRecording.value = false }
  recognition.onend = () => { isRecording.value = false }
}

function toggleVoice() {
  if (!voiceSupported) { message.warning('浏览器不支持语音识别，请用 Chrome 或 Edge'); return }
  if (isRecording.value) {
    recognition.stop()
    isRecording.value = false
    // 录完自动发送
    if (inputText.value.trim()) sendMessage()
  } else {
    inputText.value = ''
    recognition.start()
    isRecording.value = true
  }
}

// AI 语音朗读
function speak(text) {
  if (!voiceReply.value) return
  if (!('speechSynthesis' in window)) return
  // 取消之前的朗读
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'zh-CN'
  u.rate = 1.0
  // 尝试选中文语音
  const voices = window.speechSynthesis.getVoices()
  const zh = voices.find(v => v.lang.startsWith('zh'))
  if (zh) u.voice = zh
  window.speechSynthesis.speak(u)
}

// 记忆 key 用手机号（用户自己填的，跨设备一致），没填则退回专属 ID
// 后端会做 sha256 后存云端，不会明文存手机号
const userId = computed(() => userStore.user?.phone || userStore.user?.account || 'guest')
const aiName = computed(() => userStore.user?.aiName || '小暖')
const memoryEnabled = ref(getStore('chat_memory_enabled', true))

const currentConv = computed(() => conversations.value.find(c => c.id === currentConvId.value))
const messages = computed(() => currentConv.value?.messages || [])

// ===== 对话管理 =====
function newChat() {
  const conv = { id: genId(), title: '', style: currentStyle.value, messages: [], updatedAt: Date.now() }
  conversations.value.unshift(conv)
  currentConvId.value = conv.id
  saveConvs()
}
function switchConv(id) {
  currentConvId.value = id
  const c = conversations.value.find(x => x.id === id)
  if (c && c.style) currentStyle.value = c.style
  saveCurrent()
}
function deleteConv(id) {
  if (!confirm('确定删除这个对话？')) return
  conversations.value = conversations.value.filter(c => c.id !== id)
  if (currentConvId.value === id) {
    currentConvId.value = conversations.value[0]?.id || null
  }
  saveConvs()
}
function saveConvs() {
  setStore(STORAGE_CONVS, conversations.value)
}
function saveCurrent() {
  setStore(STORAGE_CURRENT, currentConvId.value)
}
function updateCurrentConv(patch) {
  const idx = conversations.value.findIndex(c => c.id === currentConvId.value)
  if (idx >= 0) {
    conversations.value[idx] = { ...conversations.value[idx], ...patch, updatedAt: Date.now() }
    saveConvs()
  }
}

// ===== 构建健康上下文 =====
function buildHealthContext() {
  const ctx = {}
  const water = getStore('water', { date: '', count: 0, records: [] })
  if (water.date === todayStr()) {
    ctx.water = { count: water.count || 0, goal: 8, percent: Math.min(100, Math.round((water.count || 0) / 8 * 100)) }
  }
  const checkin = getStore('checkin', { date: '', items: [] })
  if (checkin.date === todayStr()) {
    const items = checkin.items || []
    const done = items.filter(i => i.done).length
    ctx.checkin = { done, total: items.length, streak: getStore('checkin_streak', 0) }
  }
  return Object.keys(ctx).length ? ctx : null
}

function getSystemPrompt() {
  return SYSTEM_PROMPTS[currentStyle.value] || SYSTEM_PROMPTS.warm
}

async function quickSend(text) { inputText.value = text; await sendMessage() }

async function sendMessage() {
  const text = inputText.value.trim()
  if (!text || loading.value) return
  if (!currentConvId.value) newChat()

  // 第一条用户消息 → 生成标题
  const isFirst = messages.value.length === 0

  const userMsg = { id: genId(), role: 'user', text, streaming: false }
  updateCurrentConv({ messages: [...messages.value, userMsg] })
  inputText.value = ''
  scrollToBottom()

  const botMsg = { id: genId(), role: 'assistant', text: '', streaming: true }
  updateCurrentConv({ messages: [...messages.value, botMsg] })
  loading.value = true
  scrollToBottom()

  const history = messages.value
    .filter(m => m.id !== botMsg.id)
    .map(m => ({ role: m.role, content: m.text }))

  await streamChat({
    user_id: userId.value,
    messages: history,
    systemPrompt: getSystemPrompt(),
    healthContext: buildHealthContext(),
    memoryEnabled: memoryEnabled.value,
    isFirst,
    onTitle: (title) => {
      // AI 生成的标题覆盖前端截断的临时标题
      if (title) updateCurrentConv({ title })
    },
    onChunk: (content) => {
      botMsg.text += content
      scrollToBottom()
      // 更新引用（botMsg 是浅拷贝，messages computed 依赖数组引用，直接 push 不触发）
      updateCurrentConv({ messages: [...messages.value] })
    },
    onDone: () => {
      botMsg.streaming = false
      loading.value = false
      // 兜底：AI 没返回标题时，用首条消息截前 20 字
      if (isFirst && !currentConv.value?.title) {
        updateCurrentConv({ title: text.length > 20 ? text.slice(0, 20) + '...' : text })
      }
      updateCurrentConv({ messages: [...messages.value] })
      speak(botMsg.text)
      setTimeout(loadMemory, 1500)
    },
    onError: (e) => {
      botMsg.text = `抱歉，出了点问题：${e.message}`
      botMsg.streaming = false
      loading.value = false
      updateCurrentConv({ messages: [...messages.value] })
    },
  })
}

function scrollToBottom() {
  nextTick(() => {
    if (messageBox.value) messageBox.value.scrollTop = messageBox.value.scrollHeight
  })
}

async function loadMemory() {
  try {
    const res = await fetchMemories(userId.value)
    memories.value = res.memories
    memoryCloud.value = res.cloud
    memoryTip.value = res.tip || ''
  } catch (e) {
    memoryCloud.value = false
    memoryTip.value = '记忆服务暂不可用'
  }
}
async function clearMemory() {
  try { await deleteMemory(userId.value, -1); memories.value = []; message.success('记忆已清空') }
  catch (e) { message.error('操作失败') }
}
async function removeMemory(index) {
  try {
    const res = await deleteMemory(userId.value, index)
    memories.value = res.memories || memories.value.filter((_, i) => i !== index)
    message.success('已删除这条记忆')
  } catch (e) { message.error('操作失败') }
}
function onMemoryToggle(val) {
  setStore('chat_memory_enabled', val)
  message.success(val ? '已开启：AI 会记住你告诉它的重要信息' : '已关闭：AI 不再记录新记忆')
}

onMounted(() => {
  initVoice()
  const saved = getStore(STORAGE_CONVS, [])
  conversations.value = Array.isArray(saved) ? saved : []
  conversations.value = conversations.value.filter(c => c && c.id && c.messages)
  const lastId = getStore(STORAGE_CURRENT, null)
  currentConvId.value = conversations.value.find(c => c.id === lastId)?.id || conversations.value[0]?.id || null
  if (conversations.value.length === 0) newChat()
  else loadMemory()
})
</script>

<style scoped>
.chat-layout {
  display: flex;
  gap: 0;
  height: calc(100vh - 5rem);
  min-height: 520px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--lw-border);
  background: var(--lw-card);
}

/* ===== 左侧对话列表 ===== */
.chat-sidebar {
  width: 220px;
  flex-shrink: 0;
  background: var(--lw-bg);
  border-right: 1px solid var(--lw-border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-convs {
  flex: 1;
  overflow-y: auto;
  padding: 6px;
}
.conv-item {
  display: flex;
  align-items: center;
  padding: 9px 10px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 2px;
  transition: background 0.15s;
}
.conv-item:hover { background: color-mix(in srgb, var(--lw-primary) 6%, var(--lw-bg)); }
.conv-item.active {
  background: color-mix(in srgb, var(--lw-primary) 12%, var(--lw-bg));
}
.conv-item:hover .conv-del { opacity: 1 !important; }

/* ===== 右侧主区 ===== */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--lw-card);
}
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--lw-border);
  flex-shrink: 0;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}
.chat-empty { text-align: center; padding: 60px 20px; }
.chat-input {
  display: flex;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid var(--lw-border);
  flex-shrink: 0;
}

/* ===== 记忆面板 ===== */
.chat-memory {
  width: 240px;
  flex-shrink: 0;
  background: var(--lw-bg);
  border-left: 1px solid var(--lw-border);
  padding: 14px;
  overflow: hidden;
}

.quick-topic { transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease; }
.quick-topic:hover {
  transform: translateY(-1px);
  background: color-mix(in srgb, var(--lw-primary) 8%, var(--lw-card)) !important;
  color: var(--lw-primary) !important;
  border-color: var(--lw-primary) !important;
}
</style>
