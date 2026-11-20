<template>
  <!-- 复刻旧版毛玻璃注册页：双色光晕背景 + 装饰球 + 通透卡片 + 🌙品牌头 + Tab切换 -->
  <div class="lw-auth">
    <div class="auth-decor auth-decor-one"></div>
    <div class="auth-decor auth-decor-two"></div>

    <div class="auth-shell">
      <div class="auth-brand">
        <span class="auth-logo">🌙</span>
        <small>MY LITTLE WORKBENCH</small>
        <h1>创建账号</h1>
        <p>注册后系统将自动分配你的专属 ID</p>
      </div>

      <div class="auth-tabs">
        <button @click="$router.push('/login')">登录</button>
        <button class="active">注册</button>
      </div>

      <n-form ref="formRef" :model="form" :rules="rules" size="large" class="auth-form">
        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="form.phone" placeholder="请输入手机号" clearable maxlength="11" @input="filterPhone">
            <template #prefix><n-icon><PhonePortraitOutline /></n-icon></template>
          </n-input>
          <div class="auth-tip">用于登录，请输入 11 位手机号</div>
        </n-form-item>

        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="form.nickname" placeholder="你希望被怎么称呼" clearable>
            <template #prefix><n-icon><HappyOutline /></n-icon></template>
          </n-input>
          <div class="auth-tip">展示在工作台的名字，可随时修改（选填）</div>
        </n-form-item>

        <n-form-item label="密码" path="password">
          <n-input v-model:value="form.password" type="password" show-password-on="click" placeholder="设置登录密码">
            <template #prefix><n-icon><LockClosedOutline /></n-icon></template>
          </n-input>
          <div class="auth-tip">6-16 位，需同时包含字母和数字</div>
        </n-form-item>

        <n-form-item label="确认密码" path="confirmPassword">
          <n-input v-model:value="form.confirmPassword" type="password" show-password-on="click" placeholder="再次输入密码" @keyup.enter="handleRegister">
            <template #prefix><n-icon><CheckmarkCircleOutline /></n-icon></template>
          </n-input>
        </n-form-item>

        <n-button type="primary" block size="large" class="auth-submit-btn !mt-2" @click="handleRegister" :loading="loading">
          注册
        </n-button>
      </n-form>

      <div class="auth-foot">
        <p class="auth-status">账号数据将独立保存在你的设备</p>
        <p class="auth-legal">继续使用即表示你同意 用户条款 和 隐私说明</p>
      </div>
    </div>

    <!-- 注册成功弹窗：显示分配的专属 ID（功能原样保留） -->
    <n-modal v-model:show="showAccount" preset="card" title="注册成功" style="width: 400px" :mask-closable="false">
      <div class="text-center py-4">
        <div class="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center" :style="{ background: 'color-mix(in srgb, var(--lw-primary) 12%, transparent)' }">
          <n-icon size="32" :style="{ color: 'var(--lw-primary)' }"><CheckmarkCircleOutline /></n-icon>
        </div>
        <div class="text-sm mb-2" :style="{ color: 'var(--lw-text-secondary)' }">你的专属 ID 已生成，用于识别你的数据</div>
        <div
          class="inline-block px-6 py-3 rounded-xl text-2xl font-mono font-bold tracking-widest my-3"
          :style="{ background: 'var(--lw-bg)', color: 'var(--lw-primary)' }"
        >
          {{ generatedAccount }}
        </div>
        <div class="text-xs" :style="{ color: 'var(--lw-text-secondary)' }">登录请使用手机号，此 ID 为系统内部编号</div>
      </div>
      <template #footer>
        <n-space justify="center">
          <n-button @click="copyAccount">复制 ID</n-button>
          <n-button type="primary" @click="goLogin">去登录</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage, NIcon } from 'naive-ui'
import { LockClosedOutline, CheckmarkCircleOutline, HappyOutline, PhonePortraitOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/store/user'
import BubbleBackground from '@/components/BubbleBackground.vue'

const router = useRouter()
const message = useMessage()
const userStore = useUserStore()

const formRef = ref(null)
const loading = ref(false)
const showAccount = ref(false)
const generatedAccount = ref('')
const form = reactive({ phone: '', nickname: '', password: '', confirmPassword: '' })

// 手机号输入时过滤非数字字符
function filterPhone(value) {
  form.phone = value.replace(/\D/g, '').slice(0, 11)
}

const rules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1\d{10}$/,
      message: '请输入正确的 11 位手机号',
      trigger: 'blur',
    },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '密码长度为 6-16 位', trigger: 'blur' },
    {
      validator: (_rule, value) => {
        if (!value) return true
        const hasLetter = /[a-zA-Z]/.test(value)
        const hasNumber = /[0-9]/.test(value)
        if (!hasLetter || !hasNumber) {
          return new Error('密码需同时包含字母和数字')
        }
        return true
      },
      trigger: 'blur',
    },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_rule, value) => {
        if (value !== form.password) return new Error('两次密码不一致')
        return true
      },
      trigger: 'blur',
    },
  ],
}

async function handleRegister() {
  try {
    await formRef.value.validate()
  } catch {
    return
  }
  loading.value = true
  setTimeout(() => {
    const res = userStore.register(form.phone, form.password, form.nickname)
    loading.value = false
    if (res.success) {
      generatedAccount.value = res.account
      showAccount.value = true
    } else {
      message.error(res.message)
    }
  }, 400)
}

function copyAccount() {
  navigator.clipboard.writeText(generatedAccount.value).then(() => {
    message.success('ID 已复制到剪贴板')
  })
}

function goLogin() {
  router.push('/login')
}
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
.auth-form :deep(.n-form-item-label__text) { color: var(--lw-text-secondary, #767f79); font-size: 11px; }
.auth-form :deep(.n-input) { --n-border-radius: 13px !important; }
.auth-tip {
  margin-top: 4px;
  font-size: 11px;
  color: var(--lw-text-tertiary, #a0a7b0);
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
