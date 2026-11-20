<template>
  <div
    v-if="pet?.enabled"
    ref="petRef"
    class="fixed z-50 select-none"
    :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
  >
    <div
      @mousedown="startDrag"
      @click="interact"
      class="relative cursor-grab active:cursor-grabbing"
      @mouseenter="hovered = true"
      @mouseleave="hovered = false"
    >
      <!-- 名字气泡 -->
      <transition name="fade">
        <div
          v-if="showName"
          class="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap font-medium"
          :style="{ background: 'var(--lw-card)', color: 'var(--lw-text)', border: '1px solid var(--lw-border)', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }"
        >
          {{ pet.name }}
        </div>
      </transition>
      <!-- 互动气泡 -->
      <transition name="fade">
        <div
          v-if="bubble"
          class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-2xl text-xs whitespace-nowrap font-medium"
          :style="{ background: 'var(--lw-primary)', color: '#fff' }"
        >
          {{ bubble }}
        </div>
      </transition>

      <!-- 宠物 SVG -->
      <div
        class="transition-transform duration-200"
        :class="{ 'scale-110': hovered && !dragging }"
        :style="{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.1))' }"
      >
        <svg width="72" height="80" viewBox="0 0 72 80">
          <ellipse cx="36" cy="76" rx="18" ry="3" fill="rgba(0,0,0,0.08)" />

          <!-- 猫 -->
          <template v-if="pet.type === 'cat'">
            <ellipse cx="36" cy="58" rx="15" ry="13" fill="#FFD4B8" />
            <ellipse cx="28" cy="70" rx="6" ry="4" fill="#FFD4B8" />
            <ellipse cx="44" cy="70" rx="6" ry="4" fill="#FFD4B8" />
            <path d="M68 66 Q76 56 72 44 Q67 52 63 60 Z" fill="#FFD4B8" />
            <path d="M20 24 L16 8 L28 18 Z" fill="#FFBE9D" />
            <path d="M52 24 L56 8 L44 18 Z" fill="#FFBE9D" />
            <circle cx="36" cy="34" r="20" fill="#FFDFC8" />
            <ellipse cx="22" cy="40" rx="5" ry="3.5" fill="#FFA0A0" opacity="0.5" />
            <ellipse cx="50" cy="40" rx="5" ry="3.5" fill="#FFA0A0" opacity="0.5" />
            <ellipse :cx="29 + eyeOffset.x" :cy="33 + eyeOffset.y" rx="3.5" ry="5" fill="#3A3A3A" />
            <ellipse :cx="43 + eyeOffset.x" :cy="33 + eyeOffset.y" rx="3.5" ry="5" fill="#3A3A3A" />
            <circle :cx="30 + eyeOffset.x" :cy="31 + eyeOffset.y" r="1.5" fill="#fff" />
            <circle :cx="44 + eyeOffset.x" :cy="31 + eyeOffset.y" r="1.5" fill="#fff" />
            <path d="M33 30 L36 33 L39 30" stroke="#3A3A3A" stroke-width="1.2" fill="none" stroke-linecap="round" />
            <path d="M36 40 L33 42 L36 43 L39 42 Z" fill="#FF8080" />
            <path d="M36 43 Q33 46 31 44.5" stroke="#666" stroke-width="1" fill="none" stroke-linecap="round" />
            <path d="M36 43 Q39 46 41 44.5" stroke="#666" stroke-width="1" fill="none" stroke-linecap="round" />
          </template>

          <!-- 狗 -->
          <template v-else-if="pet.type === 'dog'">
            <ellipse cx="36" cy="58" rx="16" ry="14" fill="#EBD0AC" />
            <ellipse cx="28" cy="70" rx="6" ry="4" fill="#EBD0AC" />
            <ellipse cx="44" cy="70" rx="6" ry="4" fill="#EBD0AC" />
            <ellipse cx="18" cy="30" rx="9" ry="13" fill="#D9B384" transform="rotate(-20 18 30)" />
            <ellipse cx="54" cy="30" rx="9" ry="13" fill="#D9B384" transform="rotate(20 54 30)" />
            <circle cx="36" cy="34" r="20" fill="#F2DDB8" />
            <ellipse cx="36" cy="40" rx="12" ry="10" fill="#F8EAD2" />
            <ellipse cx="22" cy="38" rx="5" ry="3.5" fill="#FFA0A0" opacity="0.4" />
            <ellipse cx="50" cy="38" rx="5" ry="3.5" fill="#FFA0A0" opacity="0.4" />
            <circle :cx="29 + eyeOffset.x" :cy="30 + eyeOffset.y" r="4" fill="#3A3A3A" />
            <circle :cx="43 + eyeOffset.x" :cy="30 + eyeOffset.y" r="4" fill="#3A3A3A" />
            <circle :cx="30.5 + eyeOffset.x" :cy="28.5 + eyeOffset.y" r="1.5" fill="#fff" />
            <circle :cx="44.5 + eyeOffset.x" :cy="28.5 + eyeOffset.y" r="1.5" fill="#fff" />
            <ellipse cx="36" cy="42" rx="4" ry="3" fill="#8B6B45" />
            <path d="M36 45 L36 48" stroke="#8B6B45" stroke-width="1.2" stroke-linecap="round" />
            <path d="M36 48 Q32 51 30 49" stroke="#8B6B45" stroke-width="1.2" fill="none" stroke-linecap="round" />
            <path d="M36 48 Q40 51 42 49" stroke="#8B6B45" stroke-width="1.2" fill="none" stroke-linecap="round" />
            <ellipse cx="30" cy="50" rx="3" ry="2" fill="#FF8888" opacity="0.6" />
            <ellipse cx="42" cy="50" rx="3" ry="2" fill="#FF8888" opacity="0.6" />
          </template>

          <!-- 兔子 -->
          <template v-else-if="pet.type === 'rabbit'">
            <ellipse cx="36" cy="58" rx="14" ry="12" fill="#FFFFFF" />
            <ellipse cx="29" cy="69" rx="5" ry="4" fill="#FFFFFF" />
            <ellipse cx="43" cy="69" rx="5" ry="4" fill="#FFFFFF" />
            <ellipse cx="28" cy="16" rx="5" ry="16" fill="#FFFFFF" transform="rotate(-8 28 16)" />
            <ellipse cx="44" cy="16" rx="5" ry="16" fill="#FFFFFF" transform="rotate(8 44 16)" />
            <ellipse cx="28" cy="17" rx="2.5" ry="11" fill="#FFD0D0" transform="rotate(-8 28 17)" />
            <ellipse cx="44" cy="17" rx="2.5" ry="11" fill="#FFD0D0" transform="rotate(8 44 17)" />
            <circle cx="36" cy="36" r="18" fill="#FFFFFF" />
            <ellipse cx="23" cy="42" rx="5" ry="3.5" fill="#FFD0D0" opacity="0.5" />
            <ellipse cx="49" cy="42" rx="5" ry="3.5" fill="#FFD0D0" opacity="0.5" />
            <circle :cx="30 + eyeOffset.x" :cy="34 + eyeOffset.y" r="3.5" fill="#3A3A3A" />
            <circle :cx="42 + eyeOffset.x" :cy="34 + eyeOffset.y" r="3.5" fill="#3A3A3A" />
            <circle :cx="31 + eyeOffset.x" :cy="32.5 + eyeOffset.y" r="1.3" fill="#fff" />
            <circle :cx="43 + eyeOffset.x" :cy="32.5 + eyeOffset.y" r="1.3" fill="#fff" />
            <ellipse cx="36" cy="40" rx="2.5" ry="1.8" fill="#FFA0A0" />
            <path d="M36 42 L36 44" stroke="#999" stroke-width="1" stroke-linecap="round" />
            <rect x="33" y="44" width="2.5" height="3" rx="0.5" fill="#fff" stroke="#ccc" stroke-width="0.5" />
            <rect x="36.5" y="44" width="2.5" height="3" rx="0.5" fill="#fff" stroke="#ccc" stroke-width="0.5" />
          </template>

          <!-- 熊猫 -->
          <template v-else-if="pet.type === 'panda'">
            <ellipse cx="36" cy="58" rx="16" ry="14" fill="#FFFFFF" />
            <ellipse cx="28" cy="70" rx="6" ry="4" fill="#2E2E2E" />
            <ellipse cx="44" cy="70" rx="6" ry="4" fill="#2E2E2E" />
            <ellipse cx="20" cy="22" rx="9" ry="10" fill="#2E2E2E" transform="rotate(-15 20 22)" />
            <ellipse cx="52" cy="22" rx="9" ry="10" fill="#2E2E2E" transform="rotate(15 52 22)" />
            <circle cx="36" cy="34" r="20" fill="#FFFFFF" />
            <ellipse cx="28" cy="36" rx="7" ry="8" fill="#2E2E2E" transform="rotate(-15 28 36)" />
            <ellipse cx="44" cy="36" rx="7" ry="8" fill="#2E2E2E" transform="rotate(15 44 36)" />
            <ellipse cx="22" cy="42" rx="5" ry="3" fill="#FFA0A0" opacity="0.4" />
            <ellipse cx="50" cy="42" rx="5" ry="3" fill="#FFA0A0" opacity="0.4" />
            <circle :cx="28 + eyeOffset.x" :cy="35 + eyeOffset.y" r="3" fill="#fff" />
            <circle :cx="44 + eyeOffset.x" :cy="35 + eyeOffset.y" r="3" fill="#fff" />
            <circle :cx="28 + eyeOffset.x" :cy="35 + eyeOffset.y" r="1.5" fill="#2E2E2E" />
            <circle :cx="44 + eyeOffset.x" :cy="35 + eyeOffset.y" r="1.5" fill="#2E2E2E" />
            <ellipse cx="36" cy="43" rx="3" ry="2.2" fill="#2E2E2E" />
            <path d="M36 45.5 Q33 48.5 31 47" stroke="#2E2E2E" stroke-width="1.2" fill="none" stroke-linecap="round" />
            <path d="M36 45.5 Q39 48.5 41 47" stroke="#2E2E2E" stroke-width="1.2" fill="none" stroke-linecap="round" />
          </template>

          <!-- 狐狸 -->
          <template v-else-if="pet.type === 'fox'">
            <!-- 身体 -->
            <ellipse cx="36" cy="58" rx="15" ry="13" fill="#FF9A4D" />
            <ellipse cx="36" cy="60" rx="9" ry="8" fill="#FFE8D5" />
            <!-- 小短腿 -->
            <ellipse cx="29" cy="70" rx="5" ry="4" fill="#FF9A4D" />
            <ellipse cx="43" cy="70" rx="5" ry="4" fill="#FF9A4D" />
            <!-- 蓬松大尾巴 -->
            <path d="M50 56 Q66 50 70 36 Q72 28 66 26 Q60 30 58 40 Q56 50 50 56 Z" fill="#FF9A4D" />
            <path d="M64 30 Q70 28 68 24 Q62 26 60 30 Z" fill="#FFE8D5" />
            <!-- 尖耳朵（内侧白） -->
            <path d="M22 26 L16 8 L30 18 Z" fill="#FF9A4D" />
            <path d="M50 26 L56 8 L42 18 Z" fill="#FF9A4D" />
            <path d="M23 24 L19 13 L27 18 Z" fill="#FFE8D5" />
            <path d="M49 24 L53 13 L45 18 Z" fill="#FFE8D5" />
            <!-- 头（大圆） -->
            <circle cx="36" cy="34" r="20" fill="#FFA95C" />
            <!-- 白色嘴部区域 -->
            <ellipse cx="36" cy="42" rx="11" ry="9" fill="#FFE8D5" />
            <!-- 腮红 -->
            <ellipse cx="20" cy="42" rx="5" ry="3.5" fill="#FF8080" opacity="0.5" />
            <ellipse cx="52" cy="42" rx="5" ry="3.5" fill="#FF8080" opacity="0.5" />
            <!-- 大圆眼 -->
            <circle :cx="29 + eyeOffset.x" :cy="32 + eyeOffset.y" r="4.5" fill="#2C2C2C" />
            <circle :cx="43 + eyeOffset.x" :cy="32 + eyeOffset.y" r="4.5" fill="#2C2C2C" />
            <circle :cx="30.5 + eyeOffset.x" :cy="30.5 + eyeOffset.y" r="1.8" fill="#fff" />
            <circle :cx="44.5 + eyeOffset.x" :cy="30.5 + eyeOffset.y" r="1.8" fill="#fff" />
            <circle :cx="28 + eyeOffset.x" :cy="34 + eyeOffset.y" r="0.9" fill="#fff" opacity="0.6" />
            <circle :cx="42 + eyeOffset.x" :cy="34 + eyeOffset.y" r="0.9" fill="#fff" opacity="0.6" />
            <!-- 小鼻子 -->
            <ellipse cx="36" cy="42" rx="2.5" ry="2" fill="#3D3D3D" />
            <!-- 微笑嘴 -->
            <path d="M36 44 Q33 47 31 45.5" stroke="#555" stroke-width="1.1" fill="none" stroke-linecap="round" />
            <path d="M36 44 Q39 47 41 45.5" stroke="#555" stroke-width="1.1" fill="none" stroke-linecap="round" />
          </template>

          <!-- 青蛙 -->
          <template v-else-if="pet.type === 'frog'">
            <ellipse cx="36" cy="58" rx="18" ry="13" fill="#B9E28C" />
            <ellipse cx="36" cy="60" rx="10" ry="8" fill="#E8F5D8" />
            <ellipse cx="26" cy="69" rx="7" ry="5" fill="#B9E28C" />
            <ellipse cx="46" cy="69" rx="7" ry="5" fill="#B9E28C" />
            <circle cx="36" cy="36" r="18" fill="#CCEBA0" />
            <!-- 凸眼睛 -->
            <circle cx="25" cy="22" r="9" fill="#CCEBA0" />
            <circle cx="47" cy="22" r="9" fill="#CCEBA0" />
            <circle :cx="25 + eyeOffset.x" :cy="22 + eyeOffset.y" r="5.5" fill="#fff" />
            <circle :cx="47 + eyeOffset.x" :cy="22 + eyeOffset.y" r="5.5" fill="#fff" />
            <circle :cx="25 + eyeOffset.x" :cy="22 + eyeOffset.y" r="3" fill="#3A3A3A" />
            <circle :cx="47 + eyeOffset.x" :cy="22 + eyeOffset.y" r="3" fill="#3A3A3A" />
            <circle :cx="26 + eyeOffset.x" :cy="20.5 + eyeOffset.y" r="1.2" fill="#fff" />
            <circle :cx="48 + eyeOffset.x" :cy="20.5 + eyeOffset.y" r="1.2" fill="#fff" />
            <ellipse cx="20" cy="44" rx="5" ry="3" fill="#FFA0A0" opacity="0.4" />
            <ellipse cx="52" cy="44" rx="5" ry="3" fill="#FFA0A0" opacity="0.4" />
            <ellipse cx="36" cy="44" rx="3" ry="2" fill="#689F38" />
            <path d="M20 48 Q36 56 52 48" stroke="#558B2F" stroke-width="1.5" fill="none" stroke-linecap="round" />
          </template>

          <!-- 仓鼠 -->
          <template v-else-if="pet.type === 'hamster'">
            <ellipse cx="36" cy="56" rx="20" ry="18" fill="#FFE4B5" />
            <ellipse cx="36" cy="60" rx="12" ry="10" fill="#FFF6E6" />
            <ellipse cx="22" cy="70" rx="7" ry="5" fill="#FFE4B5" />
            <ellipse cx="50" cy="70" rx="7" ry="5" fill="#FFE4B5" />
            <circle cx="20" cy="22" r="8" fill="#FFD089" />
            <circle cx="52" cy="22" r="8" fill="#FFD089" />
            <circle cx="20" cy="22" r="4" fill="#FFE4B5" />
            <circle cx="52" cy="22" r="4" fill="#FFE4B5" />
            <circle cx="36" cy="34" r="20" fill="#FFECC4" />
            <!-- 鼓鼓的腮帮子 -->
            <ellipse cx="20" cy="42" rx="8" ry="7" fill="#FFE4B5" />
            <ellipse cx="52" cy="42" rx="8" ry="7" fill="#FFE4B5" />
            <ellipse cx="20" cy="44" rx="5" ry="4" fill="#FF9E7A" opacity="0.5" />
            <ellipse cx="52" cy="44" rx="5" ry="4" fill="#FF9E7A" opacity="0.5" />
            <circle :cx="30 + eyeOffset.x" :cy="32 + eyeOffset.y" r="3.5" fill="#3A3A3A" />
            <circle :cx="42 + eyeOffset.x" :cy="32 + eyeOffset.y" r="3.5" fill="#3A3A3A" />
            <circle :cx="31 + eyeOffset.x" :cy="30.5 + eyeOffset.y" r="1.3" fill="#fff" />
            <circle :cx="43 + eyeOffset.x" :cy="30.5 + eyeOffset.y" r="1.3" fill="#fff" />
            <ellipse cx="36" cy="40" rx="2.5" ry="2" fill="#FF9E7A" />
            <path d="M36 42 Q33 45 31 43.5" stroke="#8B6B45" stroke-width="1" fill="none" stroke-linecap="round" />
            <path d="M36 42 Q39 45 41 43.5" stroke="#8B6B45" stroke-width="1" fill="none" stroke-linecap="round" />
          </template>

          <!-- 考拉 -->
          <template v-else-if="pet.type === 'koala'">
            <ellipse cx="36" cy="58" rx="16" ry="14" fill="#D8E0E3" />
            <ellipse cx="36" cy="60" rx="9" ry="8" fill="#F0F2F4" />
            <ellipse cx="28" cy="70" rx="6" ry="4" fill="#A0B0B8" />
            <ellipse cx="44" cy="70" rx="6" ry="4" fill="#A0B0B8" />
            <ellipse cx="20" cy="24" rx="10" ry="10" fill="#A0B0B8" />
            <ellipse cx="52" cy="24" rx="10" ry="10" fill="#A0B0B8" />
            <circle cx="36" cy="34" r="20" fill="#E6EBEE" />
            <ellipse cx="36" cy="40" rx="14" ry="11" fill="#F0F2F4" />
            <ellipse cx="20" cy="40" rx="5" ry="3.5" fill="#FFA0A0" opacity="0.4" />
            <ellipse cx="52" cy="40" rx="5" ry="3.5" fill="#FFA0A0" opacity="0.4" />
            <circle :cx="30 + eyeOffset.x" :cy="32 + eyeOffset.y" r="3.5" fill="#546E7A" />
            <circle :cx="42 + eyeOffset.x" :cy="32 + eyeOffset.y" r="3.5" fill="#546E7A" />
            <circle :cx="31 + eyeOffset.x" :cy="30.5 + eyeOffset.y" r="1.3" fill="#fff" />
            <circle :cx="43 + eyeOffset.x" :cy="30.5 + eyeOffset.y" r="1.3" fill="#fff" />
            <ellipse cx="36" cy="42" rx="5" ry="4" fill="#546E7A" />
            <ellipse cx="36" cy="41" rx="2" ry="1.5" fill="#37474F" />
            <path d="M36 46 Q33 48 31 46.5" stroke="#546E7A" stroke-width="1" fill="none" stroke-linecap="round" />
            <path d="M36 46 Q39 48 41 46.5" stroke="#546E7A" stroke-width="1" fill="none" stroke-linecap="round" />
          </template>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const petRef = ref(null)
const hovered = ref(false)
const showName = ref(true)
const bubble = ref('')
const dragging = ref(false)

const pos = ref({ x: window.innerWidth - 100, y: window.innerHeight - 110 })

const targetEye = ref({ x: 0, y: 0 })
const eyeOffset = ref({ x: 0, y: 0 })

const pet = computed(() => userStore.user?.pet)

function onMouseMove(e) {
  if (dragging.value) return
  if (!petRef.value) return
  const rect = petRef.value.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2 - 12
  const dx = e.clientX - cx
  const dy = e.clientY - cy
  const dist = Math.sqrt(dx * dx + dy * dy) || 1
  targetEye.value = {
    x: Math.max(-2, Math.min(2, (dx / dist) * 2)),
    y: Math.max(-2, Math.min(2, (dy / dist) * 2)),
  }
}

let rafId = null
function animate() {
  eyeOffset.value.x += (targetEye.value.x - eyeOffset.value.x) * 0.15
  eyeOffset.value.y += (targetEye.value.y - eyeOffset.value.y) * 0.15
  rafId = requestAnimationFrame(animate)
}

let dragStart = { x: 0, y: 0, petX: 0, petY: 0 }
function startDrag(e) {
  dragging.value = true
  dragStart = { x: e.clientX, y: e.clientY, petX: pos.value.x, petY: pos.value.y }
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
}
function onDrag(e) {
  if (!dragging.value) return
  pos.value.x = Math.max(0, Math.min(window.innerWidth - 72, dragStart.petX + (e.clientX - dragStart.x)))
  pos.value.y = Math.max(0, Math.min(window.innerHeight - 80, dragStart.petY + (e.clientY - dragStart.y)))
}
function stopDrag() {
  dragging.value = false
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
}

const interactions = ['摸摸头~', '一起加油！', '你真棒！', '休息一下~', '我陪你！', '嘿嘿~', '今天也要开心哦', '蹭蹭~', '❤️']
let bubbleTimer = null
let nameTimer = null

function interact() {
  if (dragging.value) return
  bubble.value = interactions[Math.floor(Math.random() * interactions.length)]
  if (bubbleTimer) clearTimeout(bubbleTimer)
  bubbleTimer = setTimeout(() => { bubble.value = '' }, 2000)
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  animate()
  nameTimer = setTimeout(() => { showName.value = false }, 3000)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  if (rafId) cancelAnimationFrame(rafId)
  if (bubbleTimer) clearTimeout(bubbleTimer)
  if (nameTimer) clearTimeout(nameTimer)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
