<template>
  <n-config-provider :theme-overrides="themeOverrides" :theme="naiveTheme">
    <n-message-provider>
      <n-dialog-provider>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { darkTheme } from 'naive-ui'
import { useThemeStore } from '@/store/theme'

const themeStore = useThemeStore()

onMounted(() => {
  themeStore.init()
})

// NaiveUI 主题覆盖
const naiveTheme = computed(() => {
  return themeStore.currentThemeId === 'midnight' ? darkTheme : null
})

const themeOverrides = computed(() => {
  const t = themeStore.currentTheme
  return {
    common: {
      primaryColor: t.primary,
      primaryColorHover: t.primaryHover,
      primaryColorPressed: t.primaryHover,
      primaryColorSuppl: t.primary,
      bodyColor: t.bg,
      cardColor: t.card,
      textColorBase: t.text,
      textColor1: t.text,
      textColor2: t.textSecondary,
      borderColor: t.border,
      dividerColor: t.border,
      borderRadius: '10px',
      borderRadiusSmall: '6px',
    },
    Button: {
      colorPrimary: t.primary,
      colorPrimaryHover: t.primaryHover,
      colorPrimaryPressed: t.primaryHover,
      borderRadius: '8px',
    },
    Card: {
      color: t.card,
      colorEmbedded: t.bg,
      borderColor: t.border,
      borderRadius: '12px',
    },
    Input: {
      borderColor: t.border,
      borderRadius: '8px',
    },
    Tabs: {
      tabTextColorActive: t.primary,
      tabTextColorHover: t.primaryHover,
    },
    DataTable: {
      borderColor: t.border,
      tdColor: t.card,
      thColor: t.bg,
      borderRadius: '10px',
    },
  }
})
</script>
