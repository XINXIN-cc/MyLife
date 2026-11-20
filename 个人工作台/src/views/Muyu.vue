<template>
  <div class="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
    <div class="text-center max-w-md mx-auto">
      <!-- 计数 -->
      <div class="mb-8">
        <div class="text-sm mb-2" :style="{ color: 'var(--lw-text-secondary)' }">今日功德</div>
        <div class="text-5xl font-semibold" :style="{ color: 'var(--lw-primary)' }">{{ todayCount }}</div>
        <div class="text-xs mt-2" :style="{ color: 'var(--lw-text-secondary)' }">累计 {{ totalCount }} 次</div>
      </div>

      <!-- 木鱼 -->
      <div
        class="w-48 h-48 mx-auto rounded-full flex items-center justify-center cursor-pointer select-none transition-transform duration-100"
        :class="{ 'scale-95': isClicking }"
        :style="{
          background: 'radial-gradient(circle at 35% 30%, #c9a87c, #8b6f47)',
          boxShadow: '0 12px 40px rgba(139, 111, 71, 0.35), inset 0 -8px 20px rgba(0,0,0,0.2), inset 0 4px 12px rgba(255,255,255,0.15)',
        }"
        @click="knock"
      >
        <!-- 木鱼 SVG 图形 -->
        <svg viewBox="0 0 120 100" width="72" height="60" fill="none">
          <ellipse cx="60" cy="55" rx="48" ry="38" fill="#5c4228"/>
          <ellipse cx="60" cy="52" rx="44" ry="34" fill="#7a5a3a"/>
          <ellipse cx="60" cy="48" rx="40" ry="30" fill="#8b6f47"/>
          <ellipse cx="60" cy="46" rx="36" ry="26" fill="#9b7f57"/>
          <!-- 木鱼眼睛 -->
          <circle cx="45" cy="50" r="4" fill="#3a2818"/>
          <circle cx="75" cy="50" r="4" fill="#3a2818"/>
          <circle cx="46" cy="49" r="1.5" fill="#fff"/>
          <circle cx="76" cy="49" r="1.5" fill="#fff"/>
          <!-- 嘴 -->
          <path d="M50 62 Q60 68 70 62" stroke="#3a2818" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        </svg>
      </div>

      <!-- 浮动功德文字 -->
      <transition-group name="float" tag="div" class="relative h-8 mt-4">
        <div
          v-for="f in floats"
          :key="f.id"
          class="absolute left-1/2 -translate-x-1/2 font-medium"
          :style="{ color: 'var(--lw-primary)' }"
        >
          功德 +1
        </div>
      </transition-group>

      <!-- 说明 -->
      <p class="mt-8 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
        敲一下，深呼吸，让心安静下来
      </p>

      <div class="mt-4 flex items-center justify-center gap-2">
        <n-switch v-model:value="soundOn" />
        <span class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">音效</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { playMuyuSound } from '@/utils/sound'
import { getStore, setStore, todayStr } from '@/utils/storage'

const todayCount = ref(0)
const totalCount = ref(0)
const isClicking = ref(false)
const soundOn = ref(true)
const floats = ref([])
let floatId = 0

function load() {
  const today = todayStr()
  const saved = getStore('muyu', { date: '', today: 0, total: 0 })
  if (saved.date !== today) {
    todayCount.value = 0
    save()
  } else {
    todayCount.value = saved.today || 0
  }
  totalCount.value = saved.total || 0
}

function save() {
  setStore('muyu', {
    date: todayStr(),
    today: todayCount.value,
    total: totalCount.value,
  })
}

function knock() {
  isClicking.value = true
  setTimeout(() => {
    isClicking.value = false
  }, 100)

  todayCount.value++
  totalCount.value++
  save()

  if (soundOn.value) {
    playMuyuSound()
  }

  // 浮动文字
  const id = floatId++
  floats.value.push({ id })
  setTimeout(() => {
    floats.value = floats.value.filter((f) => f.id !== id)
  }, 1000)
}

onMounted(load)
</script>

<style scoped>
.float-enter-active {
  transition: all 1s ease-out;
}
.float-enter-from {
  opacity: 1;
  transform: translate(-50%, 0);
}
.float-leave-active {
  transition: all 0.3s ease;
}
.float-enter-to {
  opacity: 0;
  transform: translate(-50%, -30px);
}
.float-leave-to {
  opacity: 0;
}
</style>
