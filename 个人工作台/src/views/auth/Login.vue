<template>
  <!-- 复刻旧版毛玻璃登录页：双色光晕背景 + 装饰球 + 通透卡片 + 🌙品牌头 + Tab切换 -->
  <div class="lw-auth">
    <div class="auth-decor auth-decor-one"></div>
    <div class="auth-decor auth-decor-two"></div>

    <div class="auth-shell">
      <div class="auth-brand">
        <span class="auth-logo">🌙</span>
        <small>MY LITTLE WORKBENCH</small>
        <h1>欢迎回来</h1>
        <p>登录后继续记录属于你的每一天</p>
      </div>

      <div class="auth-tabs">
        <button class="active">登录</button>
        <button @click="$router.push('/register')">注册</button>
      </div>

      <n-form ref="formRef" :model="form" :rules="rules" size="large" class="auth-form">
        <n-form-item path="username">
          <n-input v-model:value="form.username" placeholder="请输入手机号" clearable maxlength="11" @input="filterPhone">
            <template #prefix><n-icon><PhonePortraitOutline /></n-icon></template>
          </n-input>
          <div class="auth-tip">使用注册时的手机号登录</div>
        </n-form-item>
        <n-form-item path="password">
          <n-input v-model:value="form.password" type="password" show-password-on="click" placeholder="密码">
            <template #prefix><n-icon><LockClosedOutline /></n-icon></template>
          </n-input>
        </n-form-item>
        <n-form-item path="captcha">
          <div class="auth-captcha-row">
            <n-input v-model:value="form.captcha" placeholder="验证码" maxlength="4" style="flex: 1">
              <template #prefix><n-icon><ShieldCheckmarkOutline /></n-icon></template>
            </n-input>
            <canvas
              ref="captchaCanvas"
              width="110"
              height="40"
              class="auth-captcha-canvas"
              title="点击刷新验证码"
              @click="drawCaptcha"
            ></canvas>
          </div>
        </n-form-item>
        <n-button type="primary" block size="large" class="auth-submit-btn !mt-2" @click="handleLogin" :loading="loading">
          登录并进入
        </n-button>
      </n-form>

      <div class="auth-foot">
        <p class="auth-status">账号数据将独立保存</p>
        <p class="auth-legal">继续使用即表示你同意 用户条款 和 隐私说明</p>
      </div>
    </div>
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

<style scoped>
/* ===== 复刻旧版：双色光晕背景 + 装饰球 + 毛玻璃卡片 ===== */
.lw-auth {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: auto;
  padding: max(28px, env(safe-area-inset-top)) 18px max(28px, env(safe-area-inset-bottom));
  background:
    radial-gradient(circle at 14% 12%, color-mix(in srgb, var(--lw-primary-soft, #9cc0e2) 28%, transparent), transparent 27%),
    radial-gradient(circle at 86% 86%, color-mix(in srgb, var(--lw-primary, #4a6b8f) 25%, transparent), transparent 30%),
    linear-gradient(155deg, color-mix(in srgb, var(--lw-bg, #f5f7fa) 92%, #fff), color-mix(in srgb, var(--lw-primary-soft, #9cc0e2) 12%, #fff));
}
.auth-decor {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  opacity: 0.42;
  pointer-events: none;
}
.auth-decor-one {
  width: 170px; height: 170px;
  left: -60px; bottom: 8%;
  background: var(--lw-primary-soft, #9cc0e2);
}
.auth-decor-two {
  width: 120px; height: 120px;
  right: -35px; top: 8%;
  background: var(--lw-primary, #4a6b8f);
}
.auth-shell {
  position: relative;
  z-index: 1;
  width: min(420px, 94vw);
  padding: clamp(24px, 5vw, 38px);
  border: 1px solid rgba(255, 255, 255, 0.78);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.76);
  box-shadow: 0 25px 70px rgba(65, 72, 68, 0.13);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}
body[data-theme='midnight'] .auth-shell {
  background: rgba(28, 34, 48, 0.78);
  border-color: rgba(255, 255, 255, 0.12);
}
.auth-brand { text-align: center; }
.auth-logo {
  width: 62px; height: 62px;
  margin: auto;
  border-radius: 21px;
  display: grid; place-items: center;
  background: linear-gradient(145deg, color-mix(in srgb, var(--lw-card, #fff) 88%, #fff), var(--lw-card, #fff));
  box-shadow: 0 10px 28px rgba(70, 80, 74, 0.1);
  font-size: 29px;
}
.auth-brand small {
  display: block;
  margin-top: 16px;
  color: var(--lw-primary, #4a6b8f);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2.5px;
}
.auth-brand h1 {
  margin: 8px 0 5px;
  color: var(--lw-text, #414a45);
  font-size: 25px;
  font-weight: 600;
}
.auth-brand p {
  margin: 0;
  color: var(--lw-text-secondary, #929a95);
  font-size: 11px;
}
.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  margin: 22px 0 16px;
  padding: 4px;
  border-radius: 15px;
  background: color-mix(in srgb, var(--lw-primary-soft, #9cc0e2) 26%, var(--lw-card, #fff));
}
.auth-tabs button {
  border: 0;
  border-radius: 12px;
  padding: 9px;
  background: transparent;
  color: var(--lw-text-secondary, #89918c);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.18s ease;
}
.auth-tabs button.active {
  background: var(--lw-card, #fff);
  color: var(--lw-primary, #4a6b8f);
  font-weight: 700;
  box-shadow: 0 4px 13px rgba(65, 72, 68, 0.06);
}
.auth-form :deep(.n-form-item) { margin-bottom: 14px; }
.auth-form :deep(.n-base-selection),
.auth-form :deep(.n-input) {
  --n-border-radius: 13px !important;
}
.auth-tip {
  margin-top: 4px;
  font-size: 11px;
  color: var(--lw-text-tertiary, #a0a7b0);
}
.auth-captcha-row { display: flex; gap: 12px; align-items: center; }
.auth-captcha-canvas {
  border-radius: 10px;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(65, 72, 68, 0.1);
}
.auth-submit-btn {
  border-radius: 14px !important;
  padding: 12px !important;
  box-shadow: 0 9px 23px color-mix(in srgb, var(--lw-primary, #4a6b8f) 26%, transparent) !important;
  letter-spacing: 1px;
}
.auth-foot { margin-top: 18px; text-align: center; }
.auth-status {
  margin: 0 0 6px;
  color: var(--lw-text-tertiary, #a0a7b0);
  font-size: 10px;
}
.auth-legal {
  margin: 0;
  color: var(--lw-text-tertiary, #a0a7b0);
  font-size: 9px;
}
</style>
