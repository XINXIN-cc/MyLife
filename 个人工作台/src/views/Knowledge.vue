<template>
  <div>
    <div class="mb-6">
      <h1 class="text-xl font-semibold" :style="{ color: 'var(--lw-text)' }">知识与阅读</h1>
      <p class="text-sm mt-1" :style="{ color: 'var(--lw-text-secondary)' }">积累点滴，构建知识体系</p>
    </div>

    <n-tabs type="line" animated>
      <!-- 我的书架（放最前，用户最常看） -->
      <n-tab-pane name="shelf" tab="我的书架">
        <n-card :bordered="false" class="mt-4">
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
              共 {{ books.length }} 本书 · {{ pdfs.length }} 个 PDF
            </div>
            <div class="flex gap-2">
              <n-button size="small" @click="showBookModal = true">+ 添加图书</n-button>
              <n-button type="primary" size="small" @click="triggerPdfInput">
                <template #icon><n-icon><DocumentAttachOutline /></n-icon></template>
                导入 PDF
              </n-button>
              <input ref="pdfInputRef" type="file" accept=".pdf" class="hidden" @change="handlePdfUpload" />
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="books.length === 0 && pdfs.length === 0" class="text-center py-12" :style="{ color: 'var(--lw-text-secondary)' }">
            <div class="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, transparent)' }">
              <n-icon size="32" :style="{ color: 'var(--lw-primary)' }"><BookOutline /></n-icon>
            </div>
            <p>书架还是空的，添加一本书或导入 PDF 开始阅读吧</p>
          </div>

          <!-- PDF 列表 -->
          <div v-if="pdfs.length > 0" class="mb-6">
            <div class="flex items-center gap-2 mb-3">
              <n-icon size="16" :style="{ color: 'var(--lw-primary)' }"><DocumentAttachOutline /></n-icon>
              <span class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">PDF 文件</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="p in pdfs"
                :key="p.id"
                class="card-hover p-3 rounded-xl cursor-pointer group"
                :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }"
                @click="openPdf(p)"
              >
                <div class="flex items-start gap-3">
                  <div class="w-10 h-14 rounded-md flex items-center justify-center shrink-0" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 15%, white)' }">
                    <n-icon size="20" :style="{ color: 'var(--lw-primary)' }"><DocumentAttachOutline /></n-icon>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium truncate" :style="{ color: 'var(--lw-text)' }">{{ p.name }}</div>
                    <div class="text-xs mt-0.5" :style="{ color: 'var(--lw-text-secondary)' }">{{ formatSize(p.size) }} · {{ formatDate(p.createdAt) }}</div>
                  </div>
                </div>
                <div class="flex items-center justify-between mt-2 pt-2 border-t" :style="{ borderColor: 'var(--lw-border)' }">
                  <span class="text-xs" :style="{ color: 'var(--lw-primary)' }">点击阅读</span>
                  <n-button text size="tiny" type="error" @click.stop="deletePdf(p.id)">
                    <template #icon><n-icon size="12"><TrashOutline /></n-icon></template>
                  </n-button>
                </div>
              </div>
            </div>
          </div>

          <!-- 图书列表 -->
          <div v-if="books.length > 0">
            <div class="flex items-center gap-2 mb-3">
              <n-icon size="16" :style="{ color: 'var(--lw-primary)' }"><BookOutline /></n-icon>
              <span class="text-sm font-medium" :style="{ color: 'var(--lw-text)' }">图书</span>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <div
                v-for="b in books"
                :key="b.id"
                class="card-hover p-3 rounded-xl cursor-pointer"
                :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }"
              >
                <div class="flex gap-3">
                  <div class="w-14 h-20 rounded-lg flex items-center justify-center shrink-0 overflow-hidden" :style="{ background: b.cover || 'color-mix(in srgb, var(--lw-primary) 15%, white)' }">
                    <n-icon v-if="!b.cover" size="26" :style="{ color: 'var(--lw-primary)' }"><BookOutline /></n-icon>
                    <img v-else :src="b.cover" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="font-medium text-sm truncate" :style="{ color: 'var(--lw-text)' }">{{ b.title }}</div>
                    <div class="text-xs mt-0.5" :style="{ color: 'var(--lw-text-secondary)' }">{{ b.author || '佚名' }}</div>
                    <div class="mt-2">
                      <div class="flex items-center justify-between text-xs mb-1">
                        <span :style="{ color: b.status === 'done' ? '#52C41A' : b.status === 'reading' ? 'var(--lw-primary)' : 'var(--lw-text-tertiary)' }">
                          {{ b.status === 'done' ? '已读完' : b.status === 'reading' ? '在读' : '想读' }}
                        </span>
                        <span :style="{ color: 'var(--lw-text-tertiary)' }">{{ b.progress || 0 }}%</span>
                      </div>
                      <div class="w-full h-1.5 rounded-full overflow-hidden" :style="{ background: 'var(--lw-bg)' }">
                        <div class="h-full rounded-full transition-all" :style="{ width: (b.progress || 0) + '%', background: 'var(--lw-primary)' }"></div>
                      </div>
                    </div>
                    <div class="flex gap-1 mt-2">
                      <n-button text size="tiny" @click.stop="editBook(b)">编辑</n-button>
                      <n-button text size="tiny" @click.stop="deleteBook(b.id)">删除</n-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </n-card>
      </n-tab-pane>

      <!-- 知识库 -->
      <n-tab-pane name="notes" tab="知识库">
        <n-card :bordered="false" class="mt-4">
          <!-- 搜索 + 标签筛选 + 新增 -->
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <n-input v-model:value="searchKeyword" placeholder="搜索关键词" clearable style="width: 200px" />
            <n-select
              v-model:value="selectedTag"
              placeholder="全部标签"
              clearable
              :options="tagOptions"
              style="width: 140px"
            />
            <div class="flex-1"></div>
            <n-button type="primary" size="small" @click="showNoteModal = true">+ 新增笔记</n-button>
          </div>

          <!-- 标签云 -->
          <div v-if="allTags.length" class="flex flex-wrap gap-2 mb-4">
            <n-tag
              v-for="t in allTags"
              :key="t"
              :type="selectedTag === t ? 'primary' : 'default'"
              round
              style="cursor: pointer"
              @click="selectedTag = selectedTag === t ? null : t"
            >
              {{ t }}
            </n-tag>
          </div>

          <div v-if="filteredNotes.length === 0" class="text-center py-12" :style="{ color: 'var(--lw-text-secondary)' }">
            <div class="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, transparent)' }">
              <n-icon size="32" :style="{ color: 'var(--lw-primary)' }"><DocumentTextOutline /></n-icon>
            </div>
            <p>暂无笔记，添加一条开始积累</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="n in filteredNotes"
              :key="n.id"
              class="card-hover p-4 rounded-xl"
              :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }"
            >
              <div class="font-medium mb-2" :style="{ color: 'var(--lw-text)' }">{{ n.title }}</div>
              <div class="text-sm line-clamp-3 mb-3" :style="{ color: 'var(--lw-text-secondary)' }">{{ n.content }}</div>
              <div class="flex flex-wrap gap-1 mb-3">
                <n-tag v-for="t in n.tags" :key="t" size="tiny" round>{{ t }}</n-tag>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ formatDate(n.createdAt) }}</span>
                <div class="flex gap-1">
                  <n-button text size="tiny" @click="editNote(n)">编辑</n-button>
                  <n-button text size="tiny" type="error" @click="deleteNote(n)">删除</n-button>
                </div>
              </div>
            </div>
          </div>
        </n-card>
      </n-tab-pane>

      <!-- 英文积累 -->
      <n-tab-pane name="english" tab="英文积累">
        <n-card :bordered="false" class="mt-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">共 {{ words.length }} 个单词</span>
            <n-button type="primary" size="small" @click="showWordModal = true">+ 新增单词</n-button>
          </div>
          <div v-if="words.length === 0" class="text-center py-12" :style="{ color: 'var(--lw-text-secondary)' }">
            <div class="text-4xl mb-3">🔤</div>
            <p>还没有积累单词</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="w in words"
              :key="w.id"
              class="flex items-center gap-3 p-3 rounded-xl"
              :style="{ background: 'var(--lw-bg)' }"
            >
              <div class="flex-1">
                <span class="font-medium" :style="{ color: 'var(--lw-text)' }">{{ w.word }}</span>
                <span class="text-sm ml-3" :style="{ color: 'var(--lw-text-secondary)' }">{{ w.meaning }}</span>
              </div>
              <n-button text size="tiny" type="error" @click="deleteWord(w)">删除</n-button>
            </div>
          </div>
        </n-card>
      </n-tab-pane>

      <!-- 阅读日记 -->
      <n-tab-pane name="reading" tab="阅读日记">
        <n-card :bordered="false" class="mt-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">已读 {{ books.length }} 本</span>
            <n-button type="primary" size="small" @click="showBookModal = true">+ 添加书籍</n-button>
          </div>
          <div v-if="books.length === 0" class="text-center py-12" :style="{ color: 'var(--lw-text-secondary)' }">
            <div class="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, transparent)' }">
              <n-icon size="32" :style="{ color: 'var(--lw-primary)' }"><BookOutline /></n-icon>
            </div>
            <p>还没有阅读记录</p>
          </div>
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              v-for="b in books"
              :key="b.id"
              class="card-hover p-4 rounded-xl flex gap-4"
              :style="{ background: 'var(--lw-card)', border: '1px solid var(--lw-border)' }"
            >
              <div class="w-14 h-20 rounded-lg flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 15%, white)' }">
                <n-icon size="28" :style="{ color: 'var(--lw-primary)' }"><BookOutline /></n-icon>
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate" :style="{ color: 'var(--lw-text)' }">{{ b.title }}</div>
                <div class="text-xs mt-0.5" :style="{ color: 'var(--lw-text-secondary)' }">{{ b.author || '佚名' }}</div>
                <n-tag size="tiny" class="mt-2" :type="b.status === 'done' ? 'success' : 'warning'" round>
                  {{ b.status === 'done' ? '已读完' : '在读' }}
                </n-tag>
                <div class="flex gap-2 mt-2">
                  <n-button text size="tiny" type="error" @click="deleteBook(b)">删除</n-button>
                </div>
              </div>
            </div>
          </div>
        </n-card>
      </n-tab-pane>
    </n-tabs>

    <!-- 新增/编辑笔记弹窗 -->
    <n-modal v-model:show="showNoteModal" preset="card" :title="editingNoteId ? '编辑笔记' : '新增笔记'" style="width: 480px">
      <n-form label-placement="top">
        <n-form-item label="标题">
          <n-input v-model:value="noteForm.title" placeholder="笔记标题" />
        </n-form-item>
        <n-form-item label="内容">
          <n-input v-model:value="noteForm.content" type="textarea" :rows="5" placeholder="笔记内容" />
        </n-form-item>
        <n-form-item label="标签（逗号分隔）">
          <n-input v-model:value="noteForm.tagsStr" placeholder="如：Vue,前端,面试" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="showNoteModal = false">取消</n-button>
        <n-button type="primary" @click="saveNote">保存</n-button>
      </template>
    </n-modal>

    <!-- 新增单词弹窗 -->
    <n-modal v-model:show="showWordModal" preset="card" title="新增单词" style="width: 400px">
      <n-form label-placement="top">
        <n-form-item label="单词">
          <n-input v-model:value="wordForm.word" placeholder="英文单词" />
        </n-form-item>
        <n-form-item label="释义">
          <n-input v-model:value="wordForm.meaning" placeholder="中文释义" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="showWordModal = false">取消</n-button>
        <n-button type="primary" @click="saveWord">保存</n-button>
      </template>
    </n-modal>

    <!-- 新增/编辑书籍弹窗 -->
    <n-modal v-model:show="showBookModal" preset="card" :title="editingBookId ? '编辑图书' : '添加图书'" style="width: 440px">
      <n-form label-placement="top">
        <n-form-item label="书名">
          <n-input v-model:value="bookForm.title" placeholder="书籍名称" />
        </n-form-item>
        <div class="grid grid-cols-2 gap-3">
          <n-form-item label="作者（选填）">
            <n-input v-model:value="bookForm.author" placeholder="作者" />
          </n-form-item>
          <n-form-item label="状态">
            <n-select v-model:value="bookForm.status" :options="['wish','reading','done'].map(v => ({ label: v === 'wish' ? '想读' : v === 'reading' ? '在读' : '已读完', value: v }))" />
          </n-form-item>
        </div>
        <n-form-item label="阅读进度（%）">
          <n-input-number v-model:value="bookForm.progress" :min="0" :max="100" style="width: 100%" />
        </n-form-item>
        <n-form-item label="封面（选填）">
          <div class="flex items-center gap-3">
            <div class="w-16 h-20 rounded-lg flex items-center justify-center overflow-hidden" :style="{ background: bookForm.cover ? 'transparent' : 'color-mix(in srgb, var(--lw-primary) 15%, white)' }">
              <img v-if="bookForm.cover" :src="bookForm.cover" class="w-full h-full object-cover" />
              <n-icon v-else size="22" :style="{ color: 'var(--lw-primary)' }"><BookOutline /></n-icon>
            </div>
            <input type="file" accept="image/*" @change="onBookCover" class="text-xs" />
          </div>
        </n-form-item>
      </n-form>
      <template #footer>
        <n-button @click="showBookModal = false">取消</n-button>
        <n-button type="primary" @click="saveBook">保存</n-button>
      </template>
    </n-modal>

    <!-- PDF 阅读器弹窗 -->
    <n-modal v-model:show="showPdfViewer" preset="card" :title="currentPdf?.name" style="width: 92vw; height: 92vh; max-width: 1300px">
      <div style="height: calc(92vh - 120px)">
        <iframe v-if="currentPdf?.url" :src="currentPdf.url" width="100%" height="100%" frameborder="0"></iframe>
      </div>
      <template #footer>
        <div class="flex items-center justify-between w-full">
          <span class="text-xs" :style="{ color: 'var(--lw-text-tertiary)' }">浏览器内置 PDF 阅读器 · {{ formatSize(currentPdf?.size || 0) }}</span>
          <n-space>
            <n-button @click="showPdfViewer = false">关闭</n-button>
            <n-button type="primary" @click="window.open(currentPdf?.url, '_blank')">新窗口打开</n-button>
          </n-space>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessage, NIcon } from 'naive-ui'
import { BookOutline, DocumentTextOutline, DocumentAttachOutline, PlayOutline, TrashOutline } from '@vicons/ionicons5'
import { getStore, setStore, genId } from '@/utils/storage'

const message = useMessage()

// ===== 知识库 =====
const notes = ref([])
const searchKeyword = ref('')
const selectedTag = ref(null)
const showNoteModal = ref(false)
const editingNoteId = ref(null)
const noteForm = ref({ title: '', content: '', tagsStr: '' })

const allTags = computed(() => {
  const set = new Set()
  notes.value.forEach((n) => n.tags.forEach((t) => set.add(t)))
  return [...set]
})

const tagOptions = computed(() => allTags.value.map((t) => ({ label: t, value: t })))

const filteredNotes = computed(() => {
  return notes.value.filter((n) => {
    const matchKeyword = !searchKeyword.value || n.title.includes(searchKeyword.value) || n.content.includes(searchKeyword.value)
    const matchTag = !selectedTag.value || n.tags.includes(selectedTag.value)
    return matchKeyword && matchTag
  })
})

function loadNotes() {
  notes.value = getStore('knowledge_notes', []).sort((a, b) => b.createdAt - a.createdAt)
}

function saveNotes() {
  setStore('knowledge_notes', notes.value)
}

function editNote(n) {
  editingNoteId.value = n.id
  noteForm.value = { title: n.title, content: n.content, tagsStr: (n.tags || []).join(',') }
  showNoteModal.value = true
}

function saveNote() {
  if (!noteForm.value.title.trim()) return message.warning('请输入标题')
  const tags = noteForm.value.tagsStr.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
  if (editingNoteId.value) {
    const idx = notes.value.findIndex((n) => n.id === editingNoteId.value)
    if (idx >= 0) notes.value[idx] = { ...notes.value[idx], title: noteForm.value.title, content: noteForm.value.content, tags }
    message.success('笔记已更新')
  } else {
    notes.value.unshift({ id: genId(), title: noteForm.value.title, content: noteForm.value.content, tags, createdAt: Date.now() })
    message.success('笔记已添加')
  }
  saveNotes()
  noteForm.value = { title: '', content: '', tagsStr: '' }
  editingNoteId.value = null
  showNoteModal.value = false
}

function deleteNote(n) {
  notes.value = notes.value.filter((x) => x.id !== n.id)
  saveNotes()
  message.success('已删除')
}

// ===== 英文积累 =====
const words = ref([])
const showWordModal = ref(false)
const wordForm = ref({ word: '', meaning: '' })

function loadWords() {
  words.value = getStore('english_words', []).sort((a, b) => b.createdAt - a.createdAt)
}

function saveWord() {
  if (!wordForm.value.word.trim() || !wordForm.value.meaning.trim()) return message.warning('请填写完整')
  words.value.unshift({ id: genId(), ...wordForm.value, createdAt: Date.now() })
  setStore('english_words', words.value)
  wordForm.value = { word: '', meaning: '' }
  showWordModal.value = false
  message.success('已添加')
}

function deleteWord(w) {
  words.value = words.value.filter((x) => x.id !== w.id)
  setStore('english_words', words.value)
  message.success('已删除')
}

// ===== 阅读日记（书架）=====
const books = ref([])
const showBookModal = ref(false)
const editingBookId = ref(null)
const bookForm = ref({ title: '', author: '', status: 'reading', progress: 0, cover: '' })

function loadBooks() {
  books.value = getStore('reading_books', []).sort((a, b) => b.createdAt - a.createdAt)
}

function editBook(b) {
  editingBookId.value = b.id
  bookForm.value = { title: b.title, author: b.author || '', status: b.status || 'reading', progress: b.progress || 0, cover: b.cover || '' }
  showBookModal.value = true
}

function saveBook() {
  if (!bookForm.value.title.trim()) return message.warning('请输入书名')
  if (editingBookId.value) {
    const idx = books.value.findIndex((b) => b.id === editingBookId.value)
    if (idx >= 0) books.value[idx] = { ...books.value[idx], ...bookForm.value }
    message.success('已更新')
  } else {
    books.value.unshift({ id: genId(), ...bookForm.value, createdAt: Date.now() })
    message.success('已添加')
  }
  setStore('reading_books', books.value)
  bookForm.value = { title: '', author: '', status: 'reading', progress: 0, cover: '' }
  editingBookId.value = null
  showBookModal.value = false
}

function deleteBook(bid) {
  books.value = books.value.filter((b) => b.id !== bid)
  setStore('reading_books', books.value)
  message.success('已删除')
}

function onBookCover(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { bookForm.value.cover = reader.result }
  reader.readAsDataURL(file)
}

// ===== PDF 书架 =====
const pdfs = ref([])
const pdfInputRef = ref(null)
const showPdfViewer = ref(false)
const currentPdf = ref(null)
const pdfUrls = new Map() // id → blob URL，避免重复创建

// IndexedDB 封装（存 Blob，避免 localStorage 5MB 限制）
const DB_NAME = 'lw_pdfs'
const STORE = 'files'

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function dbPut(id, blob) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function dbGet(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(id)
    req.onsuccess = () => resolve(req.result || null)
    req.onerror = () => reject(req.error)
  })
}

async function dbDelete(id) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

function loadPdfs() {
  // localStorage 只存元信息，文件在 IndexedDB
  const meta = getStore('reading_pdfs_meta', [])
  pdfs.value = meta
}

function savePdfs() {
  // 只存元信息（去掉 data 字段）
  const meta = pdfs.value.map((p) => ({ id: p.id, name: p.name, size: p.size, createdAt: p.createdAt }))
  setStore('reading_pdfs_meta', meta)
}

function triggerPdfInput() {
  pdfInputRef.value?.click()
}

async function handlePdfUpload(e) {
  const files = Array.from(e.target.files || [])
  e.target.value = ''
  if (files.length === 0) return
  for (const file of files) {
    const id = genId()
    await dbPut(id, file)
    pdfs.value.unshift({ id, name: file.name.replace(/\.pdf$/i, ''), size: file.size, createdAt: Date.now() })
  }
  savePdfs()
  message.success(`已导入 ${files.length} 个 PDF`)
}

async function openPdf(p) {
  let url = pdfUrls.get(p.id)
  if (!url) {
    const blob = await dbGet(p.id)
    if (!blob) { message.error('文件数据丢失，请重新导入'); return }
    url = URL.createObjectURL(blob)
    pdfUrls.set(p.id, url)
  }
  currentPdf.value = { ...p, url }
  showPdfViewer.value = true
}

async function deletePdf(pid) {
  pdfs.value = pdfs.value.filter((p) => p.id !== pid)
  await dbDelete(pid)
  if (pdfUrls.has(pid)) { URL.revokeObjectURL(pdfUrls.get(pid)); pdfUrls.delete(pid) }
  savePdfs()
  message.success('已删除')
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / 1024 / 1024).toFixed(1) + ' MB'
}

function formatDate(ts) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

onMounted(() => {
  loadNotes()
  loadWords()
  loadBooks()
  loadPdfs()
})
</script>
