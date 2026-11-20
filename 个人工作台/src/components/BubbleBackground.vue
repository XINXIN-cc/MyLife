<template>
  <div class="bubble-bg">
    <div
      v-for="b in bubbles"
      :key="b.id"
      class="bubble"
      :style="{
        left: b.left + '%',
        width: b.size + 'px',
        height: b.size + 'px',
        animationDuration: b.duration + 's',
        animationDelay: b.delay + 's',
      }"
    ></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 统一柔和的蓝灰色调，避免五颜六色
const bubbles = ref(
  Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    left: 5 + Math.random() * 90,
    size: 60 + Math.random() * 100, // 60-160px，差异适中
    duration: 18 + Math.random() * 10, // 18-28s，舒缓
    delay: Math.random() * 12, // 错峰出现
  }))
)
</script>

<style scoped>
.bubble-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.bubble {
  position: absolute;
  bottom: -200px;
  border-radius: 50%;
  /* 统一柔和蓝灰 + 径向渐变，模拟通透球体 */
  background: radial-gradient(
    circle at 35% 30%,
    rgba(143, 167, 197, 0.25),
    rgba(100, 130, 168, 0.08) 60%,
    rgba(74, 107, 143, 0.03)
  );
  border: 1px solid rgba(143, 167, 197, 0.12);
  backdrop-filter: blur(1px);
  animation: floatUp linear infinite;
}

@keyframes floatUp {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  50% {
    transform: translateY(-55vh) translateX(15px);
  }
  85% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-110vh) translateX(-10px);
    opacity: 0;
  }
}
</style>
