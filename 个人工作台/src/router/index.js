import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

// 记录页面最后访问时间（给首页快捷入口排序用）
const STORAGE_KEY = 'lw_page_visits'
function recordVisit(path) {
  const key = path.replace(/^\//, '').split('/')[0] || 'home'
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
  data[key] = Date.now()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const routes = [
  { path: '/login', name: 'Login', component: () => import('@/views/auth/Login.vue'), meta: { title: '登录' } },
  { path: '/register', name: 'Register', component: () => import('@/views/auth/Register.vue'), meta: { title: '注册' } },
  { path: '/onboarding', name: 'Onboarding', component: () => import('@/views/auth/Onboarding.vue'), meta: { title: '选择你的兴趣', requiresAuth: true } },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'Start', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
      { path: 'plangoals', name: 'PlanGoals', component: () => import('@/views/PlanGoals.vue'), meta: { title: '计划与目标' } },
      { path: 'checkin', name: 'Checkin', component: () => import('@/views/Checkin.vue'), meta: { title: '今日打卡' } },
      { path: 'water', name: 'Water', component: () => import('@/views/Water.vue'), meta: { title: '喝水管理' } },
      { path: 'sleep', name: 'Sleep', component: () => import('@/views/Sleep.vue'), meta: { title: '睡眠管理' } },
      { path: 'health', name: 'Health', component: () => import('@/views/Health.vue'), meta: { title: '健康中心' } },
      { path: 'finance', name: 'Finance', component: () => import('@/views/Finance.vue'), meta: { title: '消费记账' } },
      { path: 'study', name: 'Study', component: () => import('@/views/Study.vue'), meta: { title: '学习中心' } },
      { path: 'diary', name: 'DiaryTreehole', component: () => import('@/views/DiaryTreehole.vue'), meta: { title: '心情树洞' } },
      { path: 'knowledge', name: 'Knowledge', component: () => import('@/views/Knowledge.vue'), meta: { title: '知识与阅读' } },
      { path: 'calendar', name: 'Calendar', component: () => import('@/views/Calendar.vue'), meta: { title: '我的日历' } },
      { path: 'chat', name: 'Chat', component: () => import('@/views/Chat.vue'), meta: { title: '闲话铺' } },
      { path: 'mood', name: 'Mood', component: () => import('@/views/Mood.vue'), meta: { title: '情绪追踪' } },
      { path: 'muyu', name: 'Muyu', component: () => import('@/views/Muyu.vue'), meta: { title: '电子木鱼' } },
      { path: 'settings', name: 'Settings', component: () => import('@/views/Settings.vue'), meta: { title: '我的与设置' } },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  userStore.initFromStorage()
  // 记录访问时间
  if (to.meta.requiresAuth) recordVisit(to.path)
  if (to.meta.requiresAuth && !userStore.isLoggedIn) next('/login')
  else if ((to.path === '/login' || to.path === '/register') && userStore.isLoggedIn) next('/')
  else if (to.path === '/onboarding' && userStore.hasSelectedInterests) next('/')
  else if (to.path !== '/onboarding' && userStore.isLoggedIn && !userStore.hasSelectedInterests) next('/onboarding')
  else next()
})

export default router
