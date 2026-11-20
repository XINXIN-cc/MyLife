<template>
  <div class="min-h-screen flex items-center justify-center p-6" :style="{ background: 'var(--lw-bg)' }">
    <div class="w-full max-w-2xl">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-semibold mb-2" :style="{ color: 'var(--lw-text)' }">选择你感兴趣的方向</h1>
        <p class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">我们会根据你的选择，为你推荐首页内容</p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div
          v-for="tag in tags"
          :key="tag.id"
          @click="toggleTag(tag.id)"
          class="card-hover cursor-pointer rounded-2xl p-5 border-2 transition-all duration-200"
          :class="selected.includes(tag.id) ? 'border-primary-500' : ''"
          :style="{
            borderColor: selected.includes(tag.id) ? 'var(--lw-primary)' : 'var(--lw-border)',
            background: selected.includes(tag.id) ? 'color-mix(in srgb, var(--lw-primary) 8%, white)' : 'var(--lw-card)',
          }"
        >
          <div class="mb-3">
            <n-icon size="32" :style="{ color: 'var(--lw-primary)' }">
              <component :is="INTEREST_ICONS[tag.icon]" />
            </n-icon>
          </div>
          <div class="font-medium mb-1" :style="{ color: 'var(--lw-text)' }">{{ tag.name }}</div>
          <div class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">{{ tag.desc }}</div>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
          已选 {{ selected.length }} 项（至少选 1 项）
        </span>
        <n-button type="primary" size="large" :disabled="selected.length === 0" @click="handleSubmit">
          开始使用
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useUserStore } from '@/store/user'
import { NIcon } from 'naive-ui'
import { INTEREST_ICONS } from '@/config/icons'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const tags = [
  { id: 'plan', name: '计划管理', icon: 'plan', desc: '今日三件事，坚持打卡' },
  { id: 'fitness', name: '运动健身', icon: 'fitness', desc: '视频归档，跟练打卡' },
  { id: 'food', name: '饮食健康', icon: 'food', desc: '食谱收藏，健康饮食' },
  { id: 'water', name: '喝水习惯', icon: 'water', desc: '每日八杯水，养成习惯' },
  { id: 'relax', name: '解压放松', icon: 'relax', desc: '电子木鱼，闲话陪伴' },
  { id: 'study', name: '学习专注', icon: 'study', desc: '专注计时，学习管理' },
]

const selected = ref([])

function toggleTag(id) {
  const idx = selected.value.indexOf(id)
  if (idx >= 0) {
    selected.value.splice(idx, 1)
  } else {
    selected.value.push(id)
  }
}

function handleSubmit() {
  userStore.saveInterests(selected.value)
  message.success('设置完成')
  router.push('/')
}
</script>
