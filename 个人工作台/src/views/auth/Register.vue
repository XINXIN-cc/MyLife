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
        <h1 class="text-2xl font-semibold mb-1" :style="{ color: 'var(--lw-text)' }">创建账号</h1>
        <p class="text-sm" :style="{ color: 'var(--lw-text-secondary)' }">注册后系统将自动分配你的专属 ID</p>
      </div>

      <n-form ref="formRef" :model="form" :rules="rules" size="large">
        <!-- 手机号 -->
        <n-form-item label="手机号" path="phone">
          <n-input v-model:value="form.phone" placeholder="请输入手机号" clearable maxlength="11" @input="filterPhone">
            <template #prefix><n-icon><PhonePortraitOutline /></n-icon></template>
          </n-input>
          <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">用于登录，请输入 11 位手机号</div>
        </n-form-item>

        <!-- 昵称 -->
        <n-form-item label="昵称" path="nickname">
          <n-input v-model:value="form.nickname" placeholder="你希望被怎么称呼" clearable>
            <template #prefix><n-icon><HappyOutline /></n-icon></template>
          </n-input>
          <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">展示在工作台的名字，可随时修改（选填）</div>
        </n-form-item>

        <!-- 密码 -->
        <n-form-item label="密码" path="password">
          <n-input v-model:value="form.password" type="password" show-password-on="click" placeholder="设置登录密码">
            <template #prefix><n-icon><LockClosedOutline /></n-icon></template>
          </n-input>
          <div class="text-xs mt-1" :style="{ color: 'var(--lw-text-secondary)' }">6-16 位，需同时包含字母和数字</div>
        </n-form-item>

        <!-- 确认密码 -->
        <n-form-item label="确认密码" path="confirmPassword">
          <n-input v-model:value="form.confirmPassword" type="password" show-password-on="click" placeholder="再次输入密码" @keyup.enter="handleRegister">
            <template #prefix><n-icon><CheckmarkCircleOutline /></n-icon></template>
          </n-input>
        </n-form-item>

        <n-button type="primary" block size="large" class="!mt-2" @click="handleRegister" :loading="loading">
          注册
        </n-button>
      </n-form>

      <div class="text-center mt-5 text-sm" :style="{ color: 'var(--lw-text-secondary)' }">
        已有账号？
        <n-button text type="primary" @click="$router.push('/login')">去登录</n-button>
      </div>
    </n-card>

    <!-- 注册成功弹窗：显示分配的专属 ID -->
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
