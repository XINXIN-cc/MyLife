<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative" :style="{ background: 'var(--lw-bg)' }">
    <BubbleBackground />
    <n-card class="w-full max-w-md shadow-lg relative z-10" :bordered="false">
      <div class="text-center mb-8">
        <div
          class="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold mb-4"
          :style="{ background: 'var(--lw-primary)' }"
        >
          生
        </div>
        <h1 class="text-2xl font-semibold mb-1" :style="{ color: 'var(--lw-text)' }">欢迎回来</h1>
        <p class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">登录你的生活工作台</p>
      </div>

      <n-form ref="formRef" :model="form" :rules="rules" size="large">
        <n-form-item path="username">
          <n-input v-model:value="form.username" placeholder="请输入手机号" clearable maxlength="11" @input="filterPhone">
            <template #prefix><n-icon><PhonePortraitOutline /></n-icon></template>
          </n-input>
          <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">使用注册时的手机号登录</div>
        </n-form-item>
        <n-form-item path="password">
          <n-input v-model:value="form.password" type="password" show-password-on="click" placeholder="密码">
            <template #prefix><n-icon><LockClosedOutline /></n-icon></template>
          </n-input>
        </n-form-item>
        <!-- 验证码 -->
        <n-form-item path="captcha">
          <div class="flex gap-3">
            <n-input v-model:value="form.captcha" placeholder="验证码" maxlength="4" style="flex: 1">
              <template #prefix><n-icon><ShieldCheckmarkOutline /></n-icon></template>
            </n-input>
            <canvas
              ref="captchaCanvas"
              width="110"
              height="40"
              class="rounded-lg cursor-pointer flex-shrink-0"
              title="点击刷新验证码"
              @click="drawCaptcha"
            ></canvas>
          </div>
        </n-form-item>
        <n-button type="primary" block size="large" class="!mt-2" @click="handleLogin" :loading="loading">
          登录
        </n-button>
      </n-form>

      <div class="text-center mt-5 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
        还没有账号？
        <n-button text type="primary" @click="$router.push('/register')">立即注册</n-button>
      </div>
    </n-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import { PhonePortraitOutline, LockClosedOutline, ShieldCheckmarkOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/store/user'
import BubbleBackground from '@/components/BubbleBackground.vue'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref(null)
const captchaCanvas = ref(null)
const loading = ref(false)
const form = reactive({ username: '', password: '', captcha: '' })
let captchaCode = ''

// 手机号输入时过滤非数字字符
function filterPhone(value) {
  form.username = value.replace(/\D/g, '').slice(0, 11)
}

// 验证码字符集（去除易混淆的 0/O、1/I/l）
const captchaChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateCode() {
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += captchaChars[Math.floor(Math.random() * captchaChars.length)]
  }
  return code
}

function drawCaptcha() {
  const canvas = captchaCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const w = canvas.width
  const h = canvas.height

  captchaCode = generateCode()

  // 背景
  ctx.fillStyle = '#f0f4f8'
  ctx.fillRect(0, 0, w, h)

  // 干扰线
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 100}, 0.4)`
    ctx.beginPath()
    ctx.moveTo(Math.random() * w, Math.random() * h)
    ctx.lineTo(Math.random() * w, Math.random() * h)
    ctx.stroke()
  }

  // 干扰点
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `rgba(${Math.random() * 150 + 50}, ${Math.random() * 150 + 50}, ${Math.random() * 150 + 50}, 0.5)`
    ctx.beginPath()
    ctx.arc(Math.random() * w, Math.random() * h, 1, 0, Math.PI * 2)
    ctx.fill()
  }

  // 文字
  const colors = ['#4a6b8f', '#8fa7c5', '#5b7a9e', '#6482a8']
  for (let i = 0; i < captchaCode.length; i++) {
    ctx.save()
    ctx.font = `bold ${20 + Math.random() * 6}px sans-serif`
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
    const x = 15 + i * 24
    const y = 28 + Math.random() * 6
    ctx.translate(x, y)
    ctx.rotate((Math.random() - 0.5) * 0.5)
    ctx.fillText(captchaCode[i], 0, 0)
    ctx.restore()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1\d{10}$/,
      message: '请输入正确的 11 位手机号',
      trigger: 'blur',
    },
  ],
  password: { required: true, message: '请输入密码', trigger: 'blur' },
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    {
      validator: (_rule, value) => {
        if (value && value.toUpperCase() !== captchaCode) {
          return new Error('验证码错误')
        }
        return true
      },
      trigger: 'blur',
    },
  ],
}

async function handleLogin() {
  try {
    await formRef.value.validate()
  } catch {
    drawCaptcha()
    form.captcha = ''
    return
  }
  loading.value = true
  setTimeout(() => {
    const res = userStore.login(form.username, form.password)
    loading.value = false
    if (res.success) {
      message.success('登录成功')
      if (userStore.hasSelectedInterests) {
        router.push('/')
      } else {
        router.push('/onboarding')
      }
    } else {
      message.error(res.message)
      drawCaptcha()
      form.captcha = ''
    }
  }, 400)
}

onMounted(() => {
  nextTick(() => {
    drawCaptcha()
  })
})
</script>
