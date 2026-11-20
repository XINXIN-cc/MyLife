// 功能模块配置
export const MODULES = [
  // ===== 今天 =====
  { key: 'PlanGoals', name: '计划与目标', group: 'today', interests: ['plan'], icon: 'PlanGoals' },
  { key: 'Study', name: '学习中心', group: 'today', interests: ['study'], icon: 'Study' },
  // ===== 习惯打卡 =====
  { key: 'Checkin', name: '今日打卡', group: 'habit', interests: ['plan'], icon: 'Checkin' },
  { key: 'Water', name: '喝水管理', group: 'habit', interests: ['water'], icon: 'Water' },
  { key: 'Sleep', name: '睡眠管理', group: 'habit', interests: ['sleep', 'plan'], icon: 'Sleep' },
  // ===== 记录与成长 =====
  { key: 'DiaryTreehole', name: '心情树洞', group: 'record', interests: ['plan', 'relax', 'mood'], icon: 'DiaryTreehole' },
  { key: 'Mood', name: '情绪追踪', group: 'record', interests: ['plan', 'relax', 'mood'], icon: 'Mood' },
  { key: 'Knowledge', name: '知识与阅读', group: 'record', interests: ['study'], icon: 'Knowledge' },
  { key: 'Calendar', name: '我的日历', group: 'record', interests: ['plan'], icon: 'Calendar' },
  // ===== 健康生活 =====
  { key: 'Health', name: '健康中心', group: 'health', interests: ['fitness'], icon: 'Health' },
  { key: 'Finance', name: '消费记账', group: 'health', interests: ['finance'], icon: 'Finance' },
  // ===== 放松一下 =====
  { key: 'Muyu', name: '电子木鱼', group: 'relax', interests: ['relax'], icon: 'Muyu' },
  { key: 'Chat', name: '闲话铺', group: 'relax', interests: ['relax'], icon: 'Chat' },
]

export const MODULE_GROUPS = [
  { key: 'today', name: '今天' },
  { key: 'habit', name: '习惯打卡' },
  { key: 'record', name: '记录与成长' },
  { key: 'health', name: '健康生活' },
  { key: 'relax', name: '放松一下' },
]

export function getDefaultEnabledModules(interests) {
  return MODULES.filter((m) => m.interests.some((i) => interests.includes(i))).map((m) => m.key)
}
