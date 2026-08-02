/* ================================================================
   宝宝的工作台 · 主交互逻辑 v0.2
   基于15张参考图完整落地（去掉穿搭助手）
   ================================================================ */

/* ===== 主题系统（5套奶油淡系） ===== */
const THEMES = {
  blue:     {bg1:'#F4F8FC',bg2:'#ECF3F9',bg3:'#FBFCFE',primary:'#9CC0E2',secondary:'#B8D9CE',primaryDark:'#6E98C2',cardTint:'#EFF5FB',textMuted:'#A6C2DD',accentTint:'#EAF2FB'},
  mint:     {bg1:'#EEF8F3',bg2:'#E5F3EC',bg3:'#F8FBF9',primary:'#97D6C8',secondary:'#C8D99A',primaryDark:'#62AE9E',cardTint:'#EBF8F3',textMuted:'#95C5B8',accentTint:'#E6F5EF'},
  lavender: {bg1:'#F4F1FA',bg2:'#EDE8F6',bg3:'#FBF9FD',primary:'#BFAEF0',secondary:'#E5AFD2',primaryDark:'#8F80D2',cardTint:'#F1EDFA',textMuted:'#B6AADC',accentTint:'#F1ECFA'},
  peach:    {bg1:'#FDF4EE',bg2:'#FCEDE2',bg3:'#FEF9F5',primary:'#F4B593',secondary:'#F4D38B',primaryDark:'#DB9169',cardTint:'#FDEEE3',textMuted:'#E3B295',accentTint:'#FCEDE3'},
  sakura:   {bg1:'#FCEFF4',bg2:'#FAE5EC',bg3:'#FEF7FA',primary:'#F0AECC',secondary:'#CDB5EA',primaryDark:'#DE86A8',cardTint:'#FCECF2',textMuted:'#E3A7C0',accentTint:'#FBEAF2'},
  sunset:   {bg1:'#FFF4E8',bg2:'#FBE7E4',bg3:'#FFF9F1',primary:'#F28B70',secondary:'#F5C66F',primaryDark:'#C65F55',cardTint:'#FFF0E8',textMuted:'#C98D82',accentTint:'#FDE5D5'},
  matcha:   {bg1:'#F2F4E8',bg2:'#E8EBD9',bg3:'#FAF8F0',primary:'#8FAA72',secondary:'#D39A67',primaryDark:'#637B50',cardTint:'#EEF2E3',textMuted:'#91A47E',accentTint:'#E7EDD9'},
  berry:    {bg1:'#FFF0F6',bg2:'#F3E8FA',bg3:'#FFF8FB',primary:'#D968A0',secondary:'#8E78D6',primaryDark:'#A74379',cardTint:'#FBEAF3',textMuted:'#B77A9D',accentTint:'#F4E3F4'},
  aurora:   {bg1:'#EAF4F4',bg2:'#EDE9FA',bg3:'#F7F4FB',primary:'#4CA9A4',secondary:'#8977CE',primaryDark:'#357A83',cardTint:'#E8F2F2',textMuted:'#6E9DA2',accentTint:'#E5EAF6'},
  coast:    {bg1:'#F6F7DD',bg2:'#E4F2EE',bg3:'#FBFAEE',primary:'#45A6A1',secondary:'#E8C94F',primaryDark:'#247B7A',cardTint:'#EAF4EA',textMuted:'#78A59C',accentTint:'#E5F1D9'},
  seouldot: {bg1:'#FAF7EF',bg2:'#F2EDE2',bg3:'#FFFDF8',primary:'#2F3437',secondary:'#D9B66F',primaryDark:'#242729',cardTint:'#F3EFE5',textMuted:'#999184',accentTint:'#ECE5D6'},
  cherry:   {bg1:'#FFF7F4',bg2:'#F7EAE7',bg3:'#FFFCF8',primary:'#C94F55',secondary:'#6F9278',primaryDark:'#963C45',cardTint:'#FAECE9',textMuted:'#BB8985',accentTint:'#F6E3DE'},
  gingham:  {bg1:'#F4F7F3',bg2:'#E7EEE9',bg3:'#FBFCF8',primary:'#719181',secondary:'#D6A5A8',primaryDark:'#4E6D5E',cardTint:'#EAF0EB',textMuted:'#8AA095',accentTint:'#E4ECE7'},
  butter:   {bg1:'#FFFBEF',bg2:'#F6EED6',bg3:'#FFFEF8',primary:'#D7AD3C',secondary:'#7893B8',primaryDark:'#9C781C',cardTint:'#F9F1D9',textMuted:'#B9A064',accentTint:'#F3E9C8'},
  blueberry:{bg1:'#F7F5FC',bg2:'#EBE9F3',bg3:'#FCFBFF',primary:'#66719C',secondary:'#C594A8',primaryDark:'#485476',cardTint:'#EFEDF6',textMuted:'#9095AE',accentTint:'#E8E6F1'}
  ,cookie:   {bg1:'#FBF6ED',bg2:'#F1E7D8',bg3:'#FFFDF8',primary:'#806C5A',secondary:'#DDBF9A',primaryDark:'#5F4E40',cardTint:'#F4EBDE',textMuted:'#A38E7A',accentTint:'#EFE3D2'}
  ,dalmatian:{bg1:'#F7F7F4',bg2:'#ECEDEA',bg3:'#FFFFFF',primary:'#51575A',secondary:'#AEB8B3',primaryDark:'#34383A',cardTint:'#EEF0EE',textMuted:'#929A96',accentTint:'#E8EBE9'}
  ,pinkdot:  {bg1:'#FFF7F9',bg2:'#F7E8ED',bg3:'#FFFCFD',primary:'#D989A5',secondary:'#F2CDD8',primaryDark:'#A95E79',cardTint:'#FAECF1',textMuted:'#BE91A2',accentTint:'#F7E5EB'}
};
const $ = s => document.getElementById(s);
const $$ = s => document.querySelectorAll(s);

function setTheme(name){
  const t = THEMES[name]; if(!t) return;
  const r = document.documentElement;
  r.style.setProperty('--bg1',t.bg1); r.style.setProperty('--bg2',t.bg2);
  r.style.setProperty('--bg3',t.bg3); r.style.setProperty('--primary',t.primary);
  r.style.setProperty('--secondary',t.secondary||t.primary);
  r.style.setProperty('--primary-dark',t.primaryDark);
  r.style.setProperty('--card-tint',t.cardTint); r.style.setProperty('--text-muted',t.textMuted);
  document.body.setAttribute('data-theme', name);
  localStorage.setItem('wb_theme', name);
  $$('.theme-dot').forEach(b => b.classList.toggle('active', b.dataset.t === name));
}

// 设置页主题选择：点击后立即预览，并记住选择。
$('themePicker')?.addEventListener('click',e=>{
  const btn=e.target.closest('.theme-dot');
  if(!btn)return;
  setTheme(btn.dataset.t);
  showToast(`已换成「${btn.querySelector('b')?.textContent||'新'}」主题`);
});
$('themeCategories')?.addEventListener('click',e=>{
  const btn=e.target.closest('[data-theme-group]');if(!btn)return;
  $$('#themeCategories button').forEach(b=>b.classList.toggle('active',b===btn));
  const group=btn.dataset.themeGroup;
  $$('.theme-dot').forEach(card=>{
    const isPattern=[...card.classList].some(c=>c.startsWith('pattern-'));
    const match=group==='all'||(group==='cream'&&!card.classList.contains('vivid')&&!isPattern)||(group==='vivid'&&card.classList.contains('vivid'))||(group==='pattern'&&isPattern)||(group==='dot'&&card.classList.contains('pattern-dot'));
    card.classList.toggle('theme-filter-hidden',!match);
  });
});

/* ===== 数据备份、恢复与清空 ===== */
function collectBackup(){
  const data={};
  for(let i=0;i<localStorage.length;i++){
    const key=localStorage.key(i);
    if(key&&key.startsWith('wb_')&&!['wb_cloud_session','wb_cloud_config','wb_active_profile'].includes(key)&&!key.startsWith('wb_profile_cache_')) data[key]=localStorage.getItem(key);
  }
  return {app:'personal-workbench',version:1,exportedAt:new Date().toISOString(),data};
}

function downloadBackup(prefix='个人工作台备份'){
  const backup=collectBackup();
  const blob=new Blob([JSON.stringify(backup,null,2)],{type:'application/json;charset=utf-8'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`${prefix}-${todayStr()}.json`;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),500);
}

function renderDataSummary(){
  const el=$('dataSummary');if(!el)return;
  const counts=[['任务',tasks.length],['日记',diaryPosts.length],['灵感',ideas.length+visRecs.length],['阅读',books.length],['运动',exerciseLog.length]];
  el.innerHTML=counts.map(([name,count])=>`<div><b>${count}</b><span>${name}</span></div>`).join('');
}

$('exportDataBtn')?.addEventListener('click',()=>{downloadBackup();showToast('备份文件已导出 ✓');});
$('importDataBtn')?.addEventListener('click',()=>$('importDataFile')?.click());
$('importDataFile')?.addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
    const backup=JSON.parse(await file.text());
    if(backup.app!=='personal-workbench'||!backup.data||typeof backup.data!=='object') throw new Error('invalid');
    if(!confirm('恢复后将覆盖当前数据。系统会先下载一份当前备份，是否继续？'))return;
    downloadBackup('恢复前自动备份');
    restoreLocalSnapshot(backup.data);const active=localStorage.getItem('wb_active_profile')||'guest';save('wb_profile_cache_'+active,backup.data);
    alert('恢复成功，页面将重新载入。');location.reload();
  }catch(err){showToast('无法识别这个备份文件');}
  finally{e.target.value='';}
});
$('clearDataBtn')?.addEventListener('click',()=>{
  if(!confirm('确定清空当前账号的本机记录吗？建议先导出备份。'))return;
  if(!confirm('再次确认：当前账号的任务、灵感和健康记录都会被删除。'))return;
  restoreLocalSnapshot({});const active=localStorage.getItem('wb_active_profile')||'guest';save('wb_profile_cache_'+active,{});
  location.reload();
});

/* ===== 可选云同步（Supabase REST，无配置时保持纯本地模式） ===== */
const CLOUD_CONFIG_KEY='wb_cloud_config',CLOUD_SESSION_KEY='wb_cloud_session',CLOUD_PRESET=window.WORKBENCH_CLOUD_CONFIG||{};
let cloudConfig=load(CLOUD_CONFIG_KEY,{url:'',anonKey:''}),cloudSession=load(CLOUD_SESSION_KEY,null);
if(CLOUD_PRESET.url&&CLOUD_PRESET.anonKey)cloudConfig={url:CLOUD_PRESET.url,anonKey:CLOUD_PRESET.anonKey};
function cleanCloudUrl(v){return String(v||'').trim().replace(/\/+$/,'');}
function currentLocalSnapshot(){return collectBackup().data;}
function restoreLocalSnapshot(data){Object.keys(localStorage).filter(k=>k.startsWith('wb_')&&!['wb_cloud_session','wb_cloud_config','wb_active_profile'].includes(k)&&!k.startsWith('wb_profile_cache_')).forEach(k=>localStorage.removeItem(k));Object.entries(data||{}).forEach(([k,v])=>{if(k.startsWith('wb_')&&typeof v==='string')localStorage.setItem(k,v);});}
function activateLocalProfile(userId){const current=localStorage.getItem('wb_active_profile')||'guest';if(current===userId)return false;const snapshot=currentLocalSnapshot();save('wb_profile_cache_'+current,snapshot);let next=load('wb_profile_cache_'+userId,null);if(!next&&current==='guest'){next=snapshot;save('wb_profile_cache_guest',{});}restoreLocalSnapshot(next||{});localStorage.setItem('wb_active_profile',userId);return true;}
function cloudHeaders(auth=false){const h={'apikey':cloudConfig.anonKey,'Content-Type':'application/json'};if(auth&&cloudSession?.access_token)h.Authorization=`Bearer ${cloudSession.access_token}`;return h;}
function setCloudBusy(busy){['cloudTestBtn','cloudSignupBtn','cloudLoginBtn','cloudPushBtn','cloudPullBtn'].forEach(id=>{if($(id))$(id).disabled=busy;});}
function renderCloudState(msg=''){
  if(!$('cloudStatus'))return;$('cloudUrl').value=cloudConfig.url||'';$('cloudAnonKey').value=cloudConfig.anonKey||'';const configured=!!(cloudConfig.url&&cloudConfig.anonKey),logged=!!cloudSession?.access_token;$('authGate')?.classList.toggle('hidden',logged);$('authProjectConfig')?.classList.toggle('hidden',configured);$('cloudUserPanel').classList.toggle('hidden',!logged);$('cloudUserText').textContent=logged?`已登录：${cloudSession.user?.email||'当前用户'}`:'';const status=msg||(logged?'已登录':configured?'云端已连接':'等待管理员配置');$('cloudStatus').textContent=status;$('cloudStatus').classList.toggle('online',logged);if($('authCloudStatus'))$('authCloudStatus').textContent=status;
}
function readCloudConfig(){const url=cleanCloudUrl($('cloudUrl').value),anonKey=$('cloudAnonKey').value.trim();if(!url||!anonKey){showToast('请先填写项目 URL 和公开密钥');return false;}cloudConfig={url,anonKey};save(CLOUD_CONFIG_KEY,cloudConfig);return true;}
async function refreshCloudSession(){if(!cloudSession?.refresh_token)throw new Error('登录已过期，请重新登录');const res=await fetch(cloudConfig.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:cloudHeaders(false),body:JSON.stringify({refresh_token:cloudSession.refresh_token})}),data=await res.json();if(!res.ok||!data.access_token)throw new Error('登录已过期，请重新登录');cloudSession={...cloudSession,...data};save(CLOUD_SESSION_KEY,cloudSession);return true;}
async function cloudFetch(path,options={},auth=false,retried=false){if(!cloudConfig.url||!cloudConfig.anonKey)throw new Error('云端尚未配置');const res=await fetch(cloudConfig.url+path,{...options,headers:{...cloudHeaders(auth),...(options.headers||{})}});if(res.status===401&&auth&&!retried){await refreshCloudSession();return cloudFetch(path,options,auth,true);}let body=null;try{body=await res.json();}catch(e){}if(!res.ok)throw new Error(body?.msg||body?.message||body?.error_description||`请求失败 ${res.status}`);return body;}
$('cloudTestBtn')?.addEventListener('click',async()=>{if(!readCloudConfig())return;setCloudBusy(true);try{await cloudFetch('/auth/v1/settings');renderCloudState('连接正常，可以注册或登录');showToast('云端项目连接成功');}catch(e){renderCloudState('连接失败：请检查地址和密钥');showToast(e.message);}finally{setCloudBusy(false);}});
async function cloudAuth(mode){if(!readCloudConfig())return;const email=$('cloudEmail').value.trim(),password=$('cloudPassword').value;if(!email||password.length<6){showToast('请填写邮箱和至少6位密码');return;}setCloudBusy(true);try{const path=mode==='signup'?'/auth/v1/signup':'/auth/v1/token?grant_type=password',data=await cloudFetch(path,{method:'POST',body:JSON.stringify({email,password})});if(data.access_token){cloudSession=data;save(CLOUD_SESSION_KEY,cloudSession);const switched=activateLocalProfile(data.user.id);renderCloudState();showToast(mode==='signup'?'注册并登录成功':'登录成功');if(switched)setTimeout(()=>location.reload(),500);}else{showToast('注册成功，请前往邮箱确认后再登录');setAuthMode('login');}}catch(e){if($('authCloudStatus'))$('authCloudStatus').textContent=e.message;showToast(e.message);}finally{setCloudBusy(false);}}
$('cloudSignupBtn')?.addEventListener('click',()=>cloudAuth('signup'));$('cloudLoginBtn')?.addEventListener('click',()=>cloudAuth('login'));
function setAuthMode(mode){const login=mode==='login';$('authLoginTab')?.classList.toggle('active',login);$('authSignupTab')?.classList.toggle('active',!login);$('cloudLoginBtn')?.classList.toggle('hidden',!login);$('cloudSignupBtn')?.classList.toggle('hidden',login);if($('authTitle'))$('authTitle').textContent=login?'欢迎回来':'创建你的工作台';if($('authDesc'))$('authDesc').textContent=login?'登录后继续记录属于你的每一天':'注册后，每个人都会拥有独立空间';if($('cloudPassword'))$('cloudPassword').autocomplete=login?'current-password':'new-password';}
$('authLoginTab')?.addEventListener('click',()=>setAuthMode('login'));$('authSignupTab')?.addEventListener('click',()=>setAuthMode('signup'));$('cloudPassword')?.addEventListener('keydown',e=>{if(e.key==='Enter')($('cloudLoginBtn').classList.contains('hidden')?$('cloudSignupBtn'):$('cloudLoginBtn')).click();});
$('cloudPushBtn')?.addEventListener('click',async()=>{if(!cloudSession?.user?.id){showToast('请先登录');return;}setCloudBusy(true);try{const payload=collectBackup();await cloudFetch('/rest/v1/workbench_data?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({user_id:cloudSession.user.id,payload,updated_at:new Date().toISOString()})},true);renderCloudState('已同步');showToast('当前记录已上传云端');}catch(e){showToast(`上传失败：${e.message}`);}finally{setCloudBusy(false);}});
$('cloudPullBtn')?.addEventListener('click',async()=>{if(!cloudSession?.user?.id){showToast('请先登录');return;}if(!confirm('下载云端数据会覆盖当前账号的文字记录，是否继续？'))return;setCloudBusy(true);try{const rows=await cloudFetch(`/rest/v1/workbench_data?user_id=eq.${encodeURIComponent(cloudSession.user.id)}&select=payload,updated_at`,{},true);if(!rows?.length){showToast('云端还没有备份');return;}downloadBackup('云端恢复前自动备份');const backup=rows[0].payload;if(backup?.app!=='personal-workbench'||!backup.data)throw new Error('云端数据格式不正确');restoreLocalSnapshot(backup.data);save('wb_profile_cache_'+cloudSession.user.id,backup.data);showToast('云端数据下载成功');setTimeout(()=>location.reload(),700);}catch(e){showToast(`下载失败：${e.message}`);}finally{setCloudBusy(false);}});
$('cloudLogoutBtn')?.addEventListener('click',async()=>{try{await cloudFetch('/auth/v1/logout',{method:'POST'},true);}catch(e){}const current=localStorage.getItem('wb_active_profile')||cloudSession?.user?.id;if(current&&current!=='guest')save('wb_profile_cache_'+current,currentLocalSnapshot());restoreLocalSnapshot(load('wb_profile_cache_guest',{}));localStorage.setItem('wb_active_profile','guest');cloudSession=null;localStorage.removeItem(CLOUD_SESSION_KEY);renderCloudState('已退出');setTimeout(()=>location.reload(),400);});
renderCloudState();

/* ===== 数据存储键 ===== */
const KEYS = {
  tasks: 'wb_tasks',
  ideas: 'wb_ideas',
  books: 'wb_books',
  dishes: 'wb_dishes',
  sports: 'wb_sports',
  coins: 'wb_coins',
  learnDone: 'wb_learn_done',
  readStreak: 'wb_read_streak',
  readLastDate: 'wb_read_last_date',
  chatMsgs: 'wb_chat_msgs',
  healthLog: 'wb_health_log',
  planNotes: 'wb_plan_notes',
  avatar: 'wb_avatar',       // 头像（base64）
  nickname: 'wb_nickname',   // 昵称
  waterLog: 'wb_water_log',      // 喝水打卡记录 {日期:{杯index:打卡时间}}
  waterPlan: 'wb_water_plan',    // 八杯水时间表
  waterRemind: 'wb_water_remind', // 到点提醒开关
  visRecs: 'wb_vis_recs',        // 灵感收藏夹（自己攒的）
  exerciseLog: 'wb_exercise_log', // 运动记录（手动记录已完成的运动）
  bodyProfile: 'wb_body_profile', // 身体档案与健康目标
  lifeProfile: 'wb_life_profile', // 出生日期与生命档案
  diaryPosts: 'wb_diary_posts',   // “我的星球”日记时间流
  muyuLog: 'wb_muyu_log',         // 电子木鱼每日功德
  habits: 'wb_habits',            // 每日习惯清单
  habitLog: 'wb_habit_log',       // 每日习惯完成记录
  fatPlan: 'wb_fat_plan',         // 温和减脂目标
  weeklyGoals: 'wb_weekly_goals', // 每周量化目标
  weeklyGoalLog: 'wb_weekly_goal_log',
  mealLog: 'wb_meal_log',         // 本地饮食打卡与热量账本
  workoutPlans: 'wb_workout_plans',
  workoutHistory: 'wb_workout_history',
  mealPrep: 'wb_meal_prep',
  shoppingChecked: 'wb_shopping_checked'
  ,courses: 'wb_courses'
  ,courseAttendance: 'wb_course_attendance'
  ,assignments: 'wb_assignments'
  ,focusLog: 'wb_focus_log'
  ,focusSession: 'wb_focus_session'
  ,knowledgeItems: 'wb_knowledge_items'
  ,readingNotes: 'wb_reading_notes'
  ,workoutCollections: 'wb_workout_collections'
  ,workoutCollectionLog: 'wb_workout_collection_log'
  ,workoutSelected: 'wb_workout_selected'
};

/* ===== 喝水打卡：默认八杯水时间表 ===== */
const DEFAULT_WATER_PLAN = [
  {t:'07:00', d:'起床第一杯 · 唤醒身体'},
  {t:'09:00', d:'早餐后 · 开启代谢'},
  {t:'11:00', d:'上午加水 · 补充流失'},
  {t:'13:00', d:'午餐后半小时 · 助消化'},
  {t:'15:00', d:'下午茶时间 · 提神醒脑'},
  {t:'17:00', d:'收工前 · 缓解疲劳'},
  {t:'19:00', d:'晚餐后 · 促进循环'},
  {t:'21:00', d:'睡前一小时 · 温水安神'}
];
const CUP_ML = 250;

/* ===== 默认数据 ===== */
const DEFAULT_TASKS = [
  {id:1, text:'读10页书', cat:'学习', tag:'常规', done:false, coin:10},
  {id:2, text:'写50字日记', cat:'生活', tag:'常规', done:false},
  {id:3, text:'做10分钟拉伸', cat:'健康', tag:'常规', done:true}
];
const DEFAULT_HABITS=[
  {id:'wake',icon:'🌤️',name:'按时起床',time:'07:30'},
  {id:'breakfast',icon:'🥣',name:'认真吃早餐',time:'08:30'},
  {id:'stretch',icon:'🧘',name:'拉伸 10 分钟',time:'10:00'},
  {id:'read',icon:'📖',name:'阅读 20 分钟',time:'20:00'},
  {id:'sleep',icon:'🌙',name:'23 点前睡觉',time:'23:00'}
];

const DAILY_QUOTES = [
  {en:'Done is better than perfect.', cn:'完成比完美更重要。'},
  {en:'Get busy living or get busy dying.', cn:'要什么活着，要么忙着死。'},
  {en:'The only way to do great work is to love what you do.', cn:'成就伟业的唯一途径是热爱自己的工作。'},
  {en:'Small steps every day lead to big results.', cn:'每天一小步，终会成就大目标。'},
  {en:'Be yourself; everyone else is already taken.', cn:'做你自己，因为别人都有人做了。'},
  {en:'Everything you can imagine is real.', cn:'你能想象的一切都是真实的。'},
  {en:'Start where you are. Use what you have. Do what you can.', cn:'从当下开始，用你拥有的，做你能做的。'}
];

/* 灵感收藏夹的示例内容（仅在空状态时供「一键填充」使用，不是自动推荐） */
const SAMPLE_VIS = [
  {icon:'🎬', title:'《瞬息全宇宙》', desc:'极繁主义视觉盛宴，多重宇宙的奇观', link:''},
  {icon:'🎨', title:'蒙德里安·红黄蓝构图', desc:'几何抽象的秩序之美，经典配色灵感源', link:''},
  {icon:'🏛️', title:'故宫博物院常设展', desc:'一眼千年，中华文明的审美基因库', link:''},
  {icon:'✨', title:'Collect UI', desc:'每日更新的 UI 设计灵感集合站', link:'https://collectui.com'}
];

/* 每日精选 / 审美培养（内置示例数据，后续可接入真实推荐源） */
const PICKS = {
  daily: [
    {id:'d1', icon:'🎬', tag:'影视', title:'《瞬息全宇宙》', desc:'极繁主义视觉盛宴，多重宇宙的奇观',
      detail:'一部把"家庭关系"和"宇宙冒险"揉在一起的电影。它在视觉上毫不留情地堆满细节：热狗手指、石块宇宙、everything bagel……看似混乱，其实都在说一件事——在无限的可能性里，依然选择去爱眼前具体的人。\n\n适合心情需要被点燃、或对"存在意义"有点迷茫时看。',
      source:'推荐来源：豆瓣电影 Top250（示例数据）'},
    {id:'d2', icon:'🎨', tag:'艺术', title:'蒙德里安·红黄蓝构图', desc:'几何抽象的秩序之美，经典配色灵感源',
      detail:'蒙德里安用最简单的直线和三原色，构建出一种"安静的秩序"。他的画告诉你：高级感不一定来自复杂，而来自恰到好处的平衡与留白。\n\n做设计、排版、甚至整理房间时，都可以想想这条——少即是多。',
      source:'推荐来源：艺术史通识（示例数据）'},
    {id:'d3', icon:'🏛️', tag:'展览', title:'故宫博物院常设展', desc:'一眼千年，中华文明的审美基因库',
      detail:'故宫的常设展把几千年的器物、书画、服饰并置，你会直观感受到什么叫"一脉相承的审美"。从宋瓷的素雅到明清的繁复，都是同一种文化基因的变奏。\n\n逛展不一定要懂，先让眼睛记住"什么叫好看"。',
      source:'推荐来源：故宫博物院官网（示例数据）'},
    {id:'d4', icon:'✨', tag:'素材', title:'Collect UI', desc:'每日更新的 UI 设计灵感集合站',
      detail:'一个每天更新 UI 案例的站点，从登录页到数据看板都有。刷它不为抄，而是训练"好界面的肌肉记忆"——看多了，自己做的时候手感自然就来了。\n\n建议每天花 5 分钟随便翻翻，存 1 个让你心动的。',
      source:'推荐来源：collectui.com（示例数据）'}
  ],
  aesthetic: [
    {id:'a1', icon:'🌈', tag:'配色', title:'莫兰迪色系', desc:'低饱和高级灰，温柔又有质感',
      detail:'莫兰迪色 = 把所有颜色都"掺了点灰"。它不刺眼、不抢戏，放在一起却异常和谐。\n\n想做温柔系、ins 风、治愈系的东西，先记住它。你工作台这套奶油淡系，本质上就是莫兰迪思路的延伸。',
      source:'推荐来源：配色理论（示例数据）'},
    {id:'a2', icon:'📐', tag:'构图', title:'三分法与留白', desc:'让画面"呼吸"的基本功',
      detail:'三分法：把画面横竖各分三等，重要元素放交叉点。留白：敢空，比敢塞更难也更高级。\n\n无论是拍照、做图还是排版，这两条先用熟，审美立刻上一个台阶。',
      source:'推荐来源：摄影构图基础（示例数据）'},
    {id:'a3', icon:'🎭', tag:'风格', title:'极简主义', desc:'少即是多，克制的力量',
      detail:'极简不是"空"，而是"每个留下的元素都有理由"。它逼你做减法，也逼你想清楚自己到底要什么。\n\n生活和工作台都适用：功能多了反而乱，留最核心的，反而更好用。',
      source:'推荐来源：设计思潮（示例数据）'},
    {id:'a4', icon:'🌿', tag:'审美', title:'自然系美学', desc:'从植物与光影里找灵感',
      detail:'最有生命力的配色和构图，往往来自自然——叶脉的排布、黄昏的渐变、石材的肌理。\n\n审美培养不用硬学，多看看真实世界里"本来就好看"的东西，品味会自己长出来。',
      source:'推荐来源：自然观察（示例数据）'}
  ]
};

const REC_BOOKS = [
  {cover:'⚛️', title:'原子习惯', author:'James Clear', tags:['自我提升','习惯养成'], desc:'每天进步1%，一年后你会比现在的自己优秀37倍。'},
  {cover:'🧠', title:'深度工作', author:'Cal Newport', tags:['效率','专注力'], desc:'在碎片化时代，专注力是最稀缺的认知资源。'},
  {cover:'📕', title:'被讨厌的勇气', author:'岸见一郎', tags:['心理学','人际关系'], desc:'阿德勒心理学入门，教你拥有被讨厌的勇气。'},
  {cover:'💡', title:'思考，快与慢', author:'Daniel Kahneman', tags:['心理','决策'], desc:'诺贝尔奖得主的思维经典，了解你的两个思考系统。'}
];

const GREETINGS = [
  '宿主大人，今天也要元气满满哦',
  '欢迎回来，我的宿主大人 ✨',
  '宿主大人，您今天真好看',
  '嗨～宿主大人，准备好开启今天了吗',
  '宿主大人，新的一天请多指教呀',
  '我的宿主大人，您终于来啦',
  '宿主大人，今天也是被您惊艳到的一天'
];

const ENCOURAGES = [
  '你今天真棒，简直是天才来的。',
  '今天也辛苦啦，你已经很棒了！',
  '每一步都算数，你比昨天更强大。',
  '保持这个节奏，你正在变得更好。',
  '今天的你闪闪发光 ✨',
  '不管今天发生什么，你已经很厉害了。',
  '相信自己，你比想象中更有力量。',
  '今天的努力，未来的你会感谢的。',
  '慢慢来，比较快。你已经走在路上了。',
  '你的坚持，真的有人在默默为你鼓掌。',
  '今天也是值得被记录的一天 🌟',
  '允许自己不完美，但别允许自己放弃。',
  '你不需要跟别人比，跟昨天的自己比就够了。'
];

const FLATTERS = [
  '苹果绿配你 绝配！因为你就是那么清新脱俗。',
  '今天的你特别好看，状态满分！',
  '你认真做事的样子真的很有魅力。',
  '你身上有一种让人安心的力量。',
  '能认识这么努力的你，真好呀～',
  '宝宝你就是那种「越了解越喜欢」的人。',
  '你的审美一直在线，选的主题都好好看。',
  '你笑起来的时候整个世界都亮了。',
  '又美又能干，说你是什么神仙不过分吧？',
  '你今天的状态看起来超好的，继续保持！',
  '温柔又有主见，这组合太绝了。',
  '你身上有一种很舒服的气质，让人想靠近。',
  '浅蓝色系跟你简直天生一对 💙'
];

/* ===== 工具函数 ===== */
function load(key, fallback){ try{ const d=localStorage.getItem(key); return d?JSON.parse(d):fallback; }catch(e){return fallback;} }
function save(key, data){ localStorage.setItem(key, JSON.stringify(data)); }
function esc(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function rid(){ return Date.now()+Math.random().toString(36).slice(2,8); }
/* 昵称：仅用于进入后的页面（首页 / 我的）；「开始今天」首屏固定称呼「宿主大人」 */
const DEFAULT_NICK = '宝宝';
function getNick(){ return load(KEYS.nickname, DEFAULT_NICK) || DEFAULT_NICK; }
function todayStr(){ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }

let toastTimer;
function showToast(msg){
  const el=$('toast'); el.textContent=msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),1600);
}

/* ===== 数据初始化 ===== */
let tasks = load(KEYS.tasks, DEFAULT_TASKS.slice());
// 兼容旧版本：旧任务没有周期时归入“今日任务”。
tasks = tasks.map(t=>({...t, cat:t.cat==='health'?'健康':t.cat, period:t.period||'today', priority:t.priority||'normal',
  rewardClaimed:t.rewardClaimed!==undefined?!!t.rewardClaimed:!!(t.done&&t.coin)}));
save(KEYS.tasks, tasks);
// 给已完成但无完成日期的任务补上今天（用于成长日历统计）
tasks.forEach(t=>{ if(t.done && !t.completedAt) t.completedAt=todayStr(); });
let ideas = load(KEYS.ideas, []);
let books = load(KEYS.books, []);
let dishes = load(KEYS.dishes, []);
let sports = load(KEYS.sports, []);
let exerciseLog = load(KEYS.exerciseLog, []);  // 运动记录（实际完成的运动）
let coins = load(KEYS.coins, 320);
let learnDoneStore = load(KEYS.learnDone, {});
if(Object.values(learnDoneStore).some(v=>typeof v==='boolean'))learnDoneStore={};
let learnDone = learnDoneStore[todayStr()]||{};
let readStreak = load(KEYS.readStreak, 0);
let readLastDate = load(KEYS.readLastDate, '');
if(readLastDate&&readLastDate.includes(' ')){const oldDate=new Date(readLastDate);if(!Number.isNaN(oldDate.getTime()))readLastDate=`${oldDate.getFullYear()}-${String(oldDate.getMonth()+1).padStart(2,'0')}-${String(oldDate.getDate()).padStart(2,'0')}`;}
let chatMsgs = load(KEYS.chatMsgs, []);
let visRecs = load(KEYS.visRecs, []);
let healthLog = load(KEYS.healthLog, {});
let planNotes = load(KEYS.planNotes, []);
let waterLog = load(KEYS.waterLog, {});
let waterPlan = load(KEYS.waterPlan, DEFAULT_WATER_PLAN);
let waterRemind = load(KEYS.waterRemind, false);
let lifeProfile = load(KEYS.lifeProfile, {birthDate:'',birthTime:'',birthCity:''});
let diaryPosts = load(KEYS.diaryPosts, []);
let muyuLog = load(KEYS.muyuLog, {});
let habits = load(KEYS.habits, DEFAULT_HABITS);
habits=habits.map(h=>({...h,days:Array.isArray(h.days)?h.days:[0,1,2,3,4,5,6]}));save(KEYS.habits,habits);
let habitLog = load(KEYS.habitLog, {});
let fatPlan = load(KEYS.fatPlan, {targetWeight:'',weeklyGoal:0.5});
let weeklyGoals = load(KEYS.weeklyGoals, []);
let weeklyGoalLog = load(KEYS.weeklyGoalLog, {});
let mealLog = load(KEYS.mealLog, []);
let workoutPlans = load(KEYS.workoutPlans, []);
let workoutHistory = load(KEYS.workoutHistory, []);
let mealPrep = load(KEYS.mealPrep, {});
let shoppingChecked = load(KEYS.shoppingChecked, {});
let courses = load(KEYS.courses, []);
let courseAttendance = load(KEYS.courseAttendance, {});
let assignments = load(KEYS.assignments, []);
let focusLog = load(KEYS.focusLog, []);
let focusSession = load(KEYS.focusSession, null);
let knowledgeItems = load(KEYS.knowledgeItems, []);
let readingNotes = load(KEYS.readingNotes, []);
let workoutCollections = load(KEYS.workoutCollections, [{id:'relax-sunday',name:'周日 · 柔韧放松日',focus:'肩颈 · 腰背 · 全身拉伸',day:'0',segments:[{id:'relax-warm',title:'轻柔热身',duration:5,description:'活动肩颈与关节，让身体慢慢进入状态',url:''},{id:'relax-main',title:'全身柔韧拉伸',duration:15,description:'放松腰背与腿后侧，不追求疼痛幅度',url:''},{id:'relax-cool',title:'呼吸放松',duration:5,description:'缓慢呼吸，让心率平稳下来',url:''}]}]);
let workoutCollectionLog = load(KEYS.workoutCollectionLog, {});
let workoutSelected = load(KEYS.workoutSelected, {});

/* ===== 实时时钟 + 日期 ===== */
const WEEK = ['周日','周一','周二','周三','周四','周五','周六'];
function tick(){
  const d=new Date();
  $('clock').textContent = `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  $('todayDate').textContent = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 ${WEEK[d.getDay()]}`;
  $('chatDate').textContent = `${d.getMonth()+1}月${d.getDate()}日 · ${WEEK[d.getDay()]}`;
  const sd=$('startDate'); if(sd) sd.textContent=`${d.getMonth()+1}月${d.getDate()}日 · ${WEEK[d.getDay()]}`;
  // 首页问候：时段 + 昵称（昵称只在进入后的页面出现）
  const hh=d.getHours();
  const period = hh<6?'凌晨好':hh<11?'早上好':hh<14?'中午好':hh<18?'下午好':'晚上好';
  const hi=$('homeHi'); if(hi) hi.textContent=`${period}，${getNick()} 👋`;
}
tick(); setInterval(tick,30000);

/* ===== Tab 切换 ===== */
function switchTab(page){
  $$('.page').forEach(p=>p.classList.remove('active'));
  $('page-'+page).classList.add('active');
  $$('.tab').forEach(t=>{ t.classList.toggle('active', t.dataset.page===page); });
  if(page==='calendar') renderCalendarPage();
  if(page==='start') initStartPage();
  if(page==='water') renderWater();
  if(page==='chat') initChat();
  if(page==='idea') renderVisGrid(true);
  if(page==='diary') renderDiary();
  if(page==='muyu') renderMuyu();
  if(page==='checkin') renderCheckin();
  if(page==='goals') renderGoalCenter();
  if(page==='study') renderStudy();
}

/* 从今日概览直达健康管理中的指定模块 */
function openHealthTab(name){
  switchTab('health');
  const tab=document.querySelector(`.htab[data-htab="${name}"]`);
  if(tab) tab.click();
}

/* ===== 首页渲染 ===== */
function renderHome(){
  // 今日计划（用户自定义）
  renderHomePlan();

  // 概览数据
  const doneCount=tasks.filter(t=>t.done).length;
  const st=$('statTasks'); if(st) st.textContent=`${doneCount}/${tasks.length}`;
  $('headerCoins').textContent=coins;
  $('headerDone').textContent=doneCount;
  $('headerTotal').textContent=Math.max(tasks.length,10);

  // 灵感计数
  $('ideaCount').textContent=ideas.length;

  // 每日一句
  const dayIndex=new Date().getDate()%DAILY_QUOTES.length;
  const q=DAILY_QUOTES[dayIndex];
  $('dailyQuote').textContent=q.en; $('dailyCn').textContent=q.cn;

  // 成长日历
  renderGrowth();
}

/* ===== 首页「今日计划」：用户自定义的当日意图 ===== */
function renderHomePlan(){
  const list=$('homePlanList'); if(!list) return;
  if(planNotes.length===0){
    list.innerHTML='<p class="tip-text">还没有给自己定计划～写下今天的安排吧</p>';
  } else {
    list.innerHTML=planNotes.map(p=>`
      <div class="hplan ${p.done?'done':''}" data-pid="${p.id}">
        <span class="hplan-check" data-act="ptoggle">${p.done?'✓':''}</span>
        <span class="hplan-txt">${esc(p.text)}</span>
        <span class="hplan-del" data-act="pdel">×</span>
      </div>`).join('');
  }
}
$('homePlanBtn')?.addEventListener('click',()=>{
  const inp=$('homePlanInput'); const v=inp.value.trim();
  if(!v) return;
  planNotes.push({id:rid(), text:v, done:false});
  save(KEYS.planNotes, planNotes); inp.value='';
  renderHomePlan(); showToast('已加入今日计划 📌');
});
$('homePlanInput')?.addEventListener('keydown',e=>{ if(e.key==='Enter') $('homePlanBtn').click(); });
$('homePlanList')?.addEventListener('click',e=>{
  const row=e.target.closest('.hplan'); if(!row) return;
  const id=row.dataset.pid; const p=planNotes.find(x=>x.id===id); if(!p) return;
  if(e.target.dataset.act==='pdel'){ planNotes=planNotes.filter(x=>x.id!==id); }
  else if(e.target.dataset.act==='ptoggle'){ p.done=!p.done; }
  save(KEYS.planNotes, planNotes); renderHomePlan();
});

/* ===== 成长日历 / 时间轴（平滑曲线，数据来自你自己的任务完成情况） ===== */
function renderGrowth(){
  const today=todayStr();
  const WEEK=['日','一','二','三','四','五','六'];
  const week=[];
  for(let i=6;i>=0;i--){
    const d=new Date(); d.setDate(d.getDate()-i);
    const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const cnt=tasks.filter(t=>t.completedAt===ds).length;
    week.push({ds, cnt, isToday:ds===today, label:WEEK[d.getDay()]});
  }
  const W=280,H=120,top=16,bottom=22,plotH=H-top-bottom,marginX=22,step=(W-2*marginX)/6;
  const maxV=Math.max(1,...week.map(w=>w.cnt));
  const pts=week.map((w,i)=>{
    const x=marginX+i*step;
    const ratio=maxV===0?0:w.cnt/maxV;
    const y=top+(1-ratio)*plotH;
    return {x,y,...w};
  });
  const smooth=catmullRom(pts.map(p=>[p.x,p.y]));
  const area=`${smooth} L ${pts[6].x} ${top+plotH} L ${pts[0].x} ${top+plotH} Z`;
  const circles=pts.map(p=>`<circle cx="${p.x}" cy="${p.y}" r="${p.isToday?4.5:3}" fill="var(--primary)" ${p.isToday?`stroke="var(--accent-tint)" stroke-width="3"`:''}/>`).join('');
  const g=$('growthWeek');
  g.innerHTML=`
    <svg class="growth-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.02"/>
      </linearGradient></defs>
      <path d="${area}" fill="url(#gg)"/>
      <path d="${smooth}" fill="none" stroke="var(--primary-dark)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      ${circles}
    </svg>
    <div class="growth-labels">${pts.map(p=>`<span class="${p.isToday?'gtoday':''}">${p.label}</span>`).join('')}</div>`;
  const total7=week.reduce((a,w)=>a+w.cnt,0);
  const todayCnt=week.find(w=>w.isToday).cnt;
  $('growthFoot').innerHTML=`<span>近7天共完成 <b>${total7}</b> 项</span><span>今天 <b>${todayCnt}</b> 项</span>`;
}
function catmullRom(P){
  if(P.length<2) return '';
  let d=`M ${P[0][0]} ${P[0][1]}`;
  for(let i=0;i<P.length-1;i++){
    const p0=P[i-1]||P[i], p1=P[i], p2=P[i+1], p3=P[i+2]||P[i+1];
    const c1x=p1[0]+(p2[0]-p0[0])/6, c1y=p1[1]+(p2[1]-p0[1])/6;
    const c2x=p2[0]-(p3[0]-p1[0])/6, c2y=p2[1]-(p3[1]-p1[1])/6;
    d+=` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/* ===== 首页灵感快记 ===== */
function addIdeaFrom(inputId){
  const input=$(inputId);if(!input)return;
  const v=input.value.trim();
  if(!v){showToast('先写下一点灵感吧');input.focus();return;}
  ideas.unshift({id:rid(), text:v, time:new Date().toISOString()});
  save(KEYS.ideas,ideas);input.value='';
  showToast('灵感已收好 ✦');renderHome();renderIdeaList();
}
$('ideaRecordBtn')?.addEventListener('click',()=>addIdeaFrom('ideaQuick'));
$('ideaQuick')?.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')addIdeaFrom('ideaQuick');});

/* ===== 计划页 ===== */
let planCat='all';
let planTab='today';

function renderPlan(){
  const list=$('planTaskList');
  let filtered=tasks.filter(t=>(t.period||'today')===planTab);
  if(planCat!=='all') filtered=filtered.filter(t=>t.cat===planCat);

  list.innerHTML='';
  filtered.forEach(t=>{
    list.innerHTML+=`
      <div class="ptask ${t.done?'done':''} priority-${t.priority||'normal'}" data-id="${t.id}">
        <div class="pcheck" data-act="ptoggle">${t.done?'✓':''}</div>
        <span class="ptxt">${esc(t.text)}</span>
        <span class="pcat">${t.cat}</span>
        ${t.dueDate?`<span class="pmeta">${esc(t.dueDate.slice(5))}</span>`:''}
        ${t.coin&&!t.rewardClaimed?`<span class="pcoin">🪙+${t.coin}</span>`:''}
        <span class="pdel" data-act="pdel">×</span>
      </div>`;
  });

  if(filtered.length===0) list.innerHTML='<p class="tip-text">这里还没有任务，添加一项开始吧～</p>';

  const done=filtered.filter(t=>t.done).length;
  $('planProgress').textContent=`${done}/${filtered.length} 已完成`;
  $('planBadge').textContent=`${filtered.length} 项`;
  const titles={today:'今日任务清单',week:'本周计划清单',long:'长期目标清单'};
  const title=list.closest('.card')?.querySelector('.card-title');
  if(title) title.textContent=titles[planTab];
}

$$('.ptab').forEach(b=>b.addEventListener('click',e=>{$$('.ptab').forEach(x=>x.classList.remove('active'));e.target.classList.add('active');planTab=e.target.dataset.ptab;renderPlan();}));
$$('.ctag').forEach(b=>b.addEventListener('click',e=>{$$('.ctag').forEach(x=>x.classList.remove('active'));e.target.classList.add('active');planCat=e.target.dataset.cat;renderPlan();}));

$('planAddBtn')?.addEventListener('click',()=>{
  const text=$('planTaskInput').value.trim();
  if(!text)return;
  tasks.push({id:rid(), text, cat:$('planCatSelect').value, tag:'常规', period:planTab,
    priority:$('planPrioritySelect').value, dueDate:$('planDueDate').value, done:false, rewardClaimed:false});
  save(KEYS.tasks,tasks); $('planTaskInput').value='';
  $('planDueDate').value='';
  showToast('已添加任务 ✓'); renderPlan(); renderHome();
});
$('planTaskInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')$('planAddBtn').click();});

// 计划页任务操作
$('planTaskList')?.addEventListener('click',e=>{
  const el=e.target.closest('[data-act]');
  if(!el)return;
  const id=el.closest('[data-id]').dataset.id;
  const t=tasks.find(x=>String(x.id)===id); if(!t)return;
  if(el.dataset.act==='ptoggle'){
    t.done=!t.done;
    if(t.done){
      t.completedAt=todayStr();
      if(t.coin&&!t.rewardClaimed){coins+=t.coin;t.rewardClaimed=true;save(KEYS.coins,coins);}
    }
    else { t.completedAt=null; }
  }
  if(el.dataset.act==='pdel'){tasks=tasks.filter(x=>String(x.id)!==id);}
  save(KEYS.tasks,tasks); renderPlan(); renderHome();
});

/* ===== 灵感页 ===== */
function renderIdeaList(){
  const l=$('ideaList');
  $('ideaBadge').textContent=`${ideas.length} 条`;
  if(ideas.length===0){l.innerHTML='<p class="tip-text">还没有记录灵感哦，想到什么就写下来吧～</p>';return;}
  l.innerHTML='';
  ideas.forEach(i=>{
    const d=new Date(i.time);
    const ts=`${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    l.innerHTML+=`<div class="idea-item" data-id="${i.id}"><span class="itxt">${esc(i.text)}</span><small style="color:#bbb;font-size:10px;">${ts}</small><span class="idel" data-act="idel">×</span></div>`;
  });
}

$('ideaFullBtn')?.addEventListener('click',()=>addIdeaFrom('ideaFullInput'));
$('ideaFullInput')?.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter')addIdeaFrom('ideaFullInput');});

$('ideaList')?.addEventListener('click',e=>{
  if(e.target.dataset.act==='idel'){
    const id=e.target.closest('[data-id]').dataset.id;
    ideas=ideas.filter(x=>String(x.id)!==id); save(KEYS.ideas,ideas);
    renderIdeaList(); renderHome();
  }
});

/* ===== 本地视频存储（IndexedDB，避免撑爆 localStorage） ===== */
const VID_DB='wb_vid_db', VID_STORE='videos';
function openVidDB(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open(VID_DB,2);
    r.onupgradeneeded=e=>{ const db=e.target.result;if(!db.objectStoreNames.contains(VID_STORE))db.createObjectStore(VID_STORE); };
    r.onsuccess=e=>res(e.target.result);
    r.onerror=()=>rej(r.error);
  });
}
const putMedia=putVid,getMedia=getVid,delMedia=delVid;
async function putVid(id,blob){
  const db=await openVidDB();
  return new Promise((res,rej)=>{
    const tx=db.transaction(VID_STORE,'readwrite');
    tx.objectStore(VID_STORE).put(blob,id);
    tx.oncomplete=()=>res();
    tx.onerror=()=>rej(tx.error);
  });
}
function getVid(id){
  return openVidDB().then(db=>new Promise((res,rej)=>{
    const tx=db.transaction(VID_STORE,'readonly');
    const rq=tx.objectStore(VID_STORE).get(id);
    rq.onsuccess=()=>res(rq.result);
    rq.onerror=()=>rej(rq.error);
  }));
}
function delVid(id){
  return openVidDB().then(db=>new Promise(res=>{
    const tx=db.transaction(VID_STORE,'readwrite');
    tx.objectStore(VID_STORE).delete(id);
    tx.oncomplete=()=>res();
  }));
}

/* ===== 灵感收藏夹（自己攒的，「换一批」= 从收藏里真随机抽） ===== */
const VIS_SHOW = 4;   // 一屏展示几条
let visPicked = [];   // 当前抽到的这批

// 从收藏里随机抽 n 条（不重复）
function shuffleVis(n){
  const pool=[...visRecs];
  const out=[];
  while(pool.length && out.length<n){
    out.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  }
  return out;
}

function renderVisGrid(reshuffle){
  const g=$('visGrid'); if(!g) return;
  const cnt=$('recDate'); if(cnt) cnt.textContent=`共 ${visRecs.length} 条`;
  const tip=$('visTip');

  if(!visRecs.length){
    g.innerHTML=`<div class="vis-empty">
      <span class="vis-empty-icon">🗂️</span>
      <p class="vis-empty-txt">收藏夹还是空的</p>
      <p class="vis-empty-sub">把喜欢的电影、配色、展览、网站存进来<br>攒多了「换一批」就能随机翻牌</p>
      <button class="btn-sm btn-sm-primary" id="visEmptyAdd">＋ 添加第一条</button>
      <button class="btn-sm" id="visEmptySample">先放几条示例</button>
    </div>`;
    if(tip) tip.classList.add('hidden');
    $('visEmptyAdd')?.addEventListener('click',()=>toggleVisForm(true));
    $('visEmptySample')?.addEventListener('click',()=>{
      SAMPLE_VIS.forEach(s=>visRecs.push({id:rid(), ...s, createdAt:todayStr()}));
      save(KEYS.visRecs,visRecs); renderVisGrid(true); showToast('放了 4 条示例，随便删～');
    });
    return;
  }
  if(tip) tip.classList.remove('hidden');

  // 需要重新抽 / 首次渲染 / 抽到的条目已被删
  if(reshuffle || !visPicked.length || visPicked.some(v=>!visRecs.find(x=>x.id===v.id))){
    visPicked=shuffleVis(VIS_SHOW);
  }

  g.innerHTML=visPicked.map(v=>`
    <div class="vis-item${visPicked.length===1?' full':''}" data-vid="${v.id}">
      <span class="vis-del" data-del="${v.id}" title="移出收藏">×</span>
      <span class="vis-icon">${v.icon||'✨'}</span>
      <div class="vis-info">
        <p class="vis-title">${v.videoType?`<span class="vis-video-badge">▶</span>`:''}${esc(v.title)}</p>
        ${v.desc?`<p class="vis-desc">${esc(v.desc)}</p>`:''}
      </div>
    </div>`).join('');

  g.querySelectorAll('.vis-item').forEach(el=>{
    el.addEventListener('click',e=>{
      if(e.target.dataset.del){
        const id=e.target.dataset.del;
        const v=visRecs.find(x=>x.id===id);
        visRecs=visRecs.filter(x=>x.id!==id);
        save(KEYS.visRecs,visRecs);
        visPicked=visPicked.filter(x=>x.id!==id);
        if(v&&v.videoType==='file') delVid(id).catch(()=>{});
        renderVisGrid(); showToast('已移出收藏');
        return;
      }
      const v=visRecs.find(x=>x.id===el.dataset.vid); if(!v) return;
      openPickDetail({
        tag:'我的收藏', title:v.title,
        detail:v.desc||'（没写理由，但你当时觉得它好看 ✨）',
        link:v.link||'',
        videoType:v.videoType||'',
        video:v.video||'',
        videoId:v.id,
        source:`收藏于 ${v.createdAt||'—'} · 收藏夹共 ${visRecs.length} 条`
      });
    });
  });
}

// 换一批
$('refreshRecBtn')?.addEventListener('click',()=>{
  if(!visRecs.length){ showToast('先存点东西进来呀～'); return; }
  if(visRecs.length<=VIS_SHOW){ showToast(`一共才 ${visRecs.length} 条，再多存点才好翻牌 😏`); }
  renderVisGrid(true);
});

// 添加表单开关
function toggleVisForm(show){
  const f=$('visForm'); if(!f) return;
  const open = show===undefined ? f.classList.contains('hidden') : show;
  f.classList.toggle('hidden', !open);
  if(open) setTimeout(()=>$('visTitleInput')?.focus(),100);
}
$('visAddToggle')?.addEventListener('click',()=>toggleVisForm());
$('visCancelBtn')?.addEventListener('click',()=>{ clearVisForm(); toggleVisForm(false); });

// 图标选择
$$('.vis-icon-opt').forEach(b=>b.addEventListener('click',()=>{
  $$('.vis-icon-opt').forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
}));

function clearVisForm(){
  ['visTitleInput','visDescInput','visLinkInput','visVideoInput'].forEach(id=>{ const el=$(id); if(el) el.value=''; });
  const vf=$('visVideoFile'); if(vf) vf.value='';
  const fh=$('visFileHint'); if(fh) fh.textContent='';
}

// 本地上传按钮
$('visVideoFileBtn')?.addEventListener('click',()=>$('visVideoFile')?.click());
$('visVideoFile')?.addEventListener('change',e=>{
  const f=e.target.files&&e.target.files[0];
  const fh=$('visFileHint');
  if(f){ const mb=Math.round(f.size/1048576*10)/10; fh.textContent=`已选本地视频：${f.name}（${mb}MB，收藏后离线也能看）`; }
  else if(fh){ fh.textContent=''; }
});

// 保存收藏
$('visSaveBtn')?.addEventListener('click', async ()=>{
  const title=($('visTitleInput')?.value||'').trim();
  if(!title){ showToast('起个名字吧～'); $('visTitleInput')?.focus(); return; }
  const iconBtn=document.querySelector('.vis-icon-opt.active');
  const item={
    id: rid(),
    icon: iconBtn?iconBtn.dataset.icon:'✨',
    title,
    desc: ($('visDescInput')?.value||'').trim(),
    link: ($('visLinkInput')?.value||'').trim(),
    videoType:'', video:'', videoName:'',
    createdAt: todayStr()
  };
  const fileInput=$('visVideoFile');
  const file=fileInput&&fileInput.files&&fileInput.files[0];
  const vlink=($('visVideoInput')?.value||'').trim();
  if(file){
    item.videoType='file'; item.videoName=file.name;
    try{ await putVid(item.id, file); }
    catch(err){ showToast('视频存本地失败，换个格式试试～'); return; }
  } else if(vlink){
    item.videoType='link'; item.video=vlink;
  }
  visRecs.unshift(item);
  save(KEYS.visRecs,visRecs);
  clearVisForm(); toggleVisForm(false);
  renderVisGrid(true);
  showToast('存好啦 ✨');
});
$('visTitleInput')?.addEventListener('keydown',e=>{ if(e.key==='Enter') $('visSaveBtn').click(); });

/* ===== 知识页 ===== */
// 子Tab切换
$$('.ktab').forEach(b=>b.addEventListener('click',e=>{
  $$('.ktab').forEach(x=>x.classList.remove('active')); e.target.classList.add('active');
  $$('.kpanel').forEach(p=>p.classList.remove('active'));
  const panel=$('kp-'+e.target.dataset.ktab); if(panel)panel.classList.add('active');
  if(e.target.dataset.ktab==='library')renderKnowledgeLibrary();
  if(e.target.dataset.ktab==='reading'){renderBooks();renderReadingNotes();}
}));

// 学习卡片完成
$$('.lc-done').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const key=btn.dataset.lc;
    if(learnDone[key]){showToast('今天已经学过啦～');return;}
    learnDone[key]=true;learnDoneStore[todayStr()]=learnDone;coins++;save(KEYS.learnDone,learnDoneStore); save(KEYS.coins,coins);
    btn.classList.add('done'); btn.textContent='已完成 ✓';
    showToast(`学习完成 🪙+1`);
    renderHome();
  });
});
// 恢复学习状态
Object.keys(learnDone).forEach(k=>{
  const btn=$(`[data-lc="${k}"]`);
  if(btn&&learnDone[k]){btn.classList.add('done');btn.textContent='已完成 ✓';}
});

// 知识收藏库
const KNOW_TYPE_LABEL={note:'文字',link:'链接',course:'课程',video:'视频'};
function renderKnowledgeLibrary(){
  const box=$('knowledgeList');if(!box)return;const q=($('knowledgeSearch')?.value||'').trim().toLowerCase(),cat=$('knowledgeFilter')?.value||'all';
  const list=[...knowledgeItems].filter(x=>(cat==='all'||x.category===cat)&&(!q||[x.title,x.content,(x.tags||[]).join(' ')].join(' ').toLowerCase().includes(q))).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));
  const cats=new Set(knowledgeItems.map(x=>x.category));$('knowledgeStats').innerHTML=`<span><b>${knowledgeItems.length}</b> 条收藏</span><span><b>${cats.size}</b> 个分类</span><span><b>${knowledgeItems.filter(x=>x.favorite).length}</b> 条珍藏</span>`;
  box.innerHTML=list.length?list.map(x=>`<article class="knowledge-item ${x.favorite?'favorite':''}" data-knowledge="${x.id}"><div class="knowledge-item-top"><span>${x.favorite?'★':'☆'}</span><div><small>${esc(x.category)} · ${KNOW_TYPE_LABEL[x.type]||'笔记'}</small><b>${esc(x.title)}</b></div><button data-knowledge-act="delete">×</button></div><p>${esc(x.content)}</p>${(x.tags||[]).length?`<div class="knowledge-tags">${x.tags.map(t=>`<i>#${esc(t)}</i>`).join('')}</div>`:''}<div class="knowledge-item-foot"><time>${esc(x.createdAt||'')}</time><button data-knowledge-act="favorite">${x.favorite?'取消珍藏':'加入珍藏'}</button>${/^https?:\/\//i.test(x.content)?`<a href="${esc(x.content)}" target="_blank" rel="noopener">打开链接</a>`:''}</div></article>`).join(''):'<div class="study-empty">还没有符合条件的收藏，先保存第一条知识吧 ✨</div>';
}
$('knowledgeSaveBtn')?.addEventListener('click',()=>{const title=$('knowledgeTitle').value.trim(),content=$('knowledgeContent').value.trim();if(!title||!content){showToast('请填写标题和内容');return;}knowledgeItems.push({id:rid(),title,content,category:$('knowledgeCategory').value,type:$('knowledgeType').value,tags:$('knowledgeTags').value.trim().split(/\s+/).filter(Boolean),favorite:false,date:todayStr(),createdAt:new Date().toLocaleDateString('zh-CN')});save(KEYS.knowledgeItems,knowledgeItems);$('knowledgeTitle').value='';$('knowledgeContent').value='';$('knowledgeTags').value='';renderKnowledgeLibrary();showToast('已保存到知识库');});
$('knowledgeSearch')?.addEventListener('input',renderKnowledgeLibrary);$('knowledgeFilter')?.addEventListener('change',renderKnowledgeLibrary);
$('knowledgeList')?.addEventListener('click',e=>{const act=e.target.dataset.knowledgeAct;if(!act)return;const row=e.target.closest('[data-knowledge]'),id=row.dataset.knowledge;if(act==='delete')knowledgeItems=knowledgeItems.filter(x=>String(x.id)!==id);else{const item=knowledgeItems.find(x=>String(x.id)===id);if(item)item.favorite=!item.favorite;}save(KEYS.knowledgeItems,knowledgeItems);renderKnowledgeLibrary();});

// 阅读日记
$$('.rtab').forEach(b=>b.addEventListener('click',e=>{
  $$('.rtab').forEach(x=>x.classList.remove('active')); e.target.classList.add('active');
  $$('.rpanel').forEach(p=>p.classList.remove('active'));
  const panel=$('rp-'+e.target.dataset.rtab); if(panel)panel.classList.add('active');
}));

function renderBooks(){
  const bl=$('bookList');
  if(books.length===0){bl.innerHTML='<div class="empty-state">📚 还没有添加书籍</div>';return;}
  const statusLabel={reading:'在读',want:'想读',finished:'读完',paused:'暂时搁置'};
  bl.innerHTML=books.map(b=>{const pct=b.pages?Math.min(100,Math.round((b.read||0)/b.pages*100)):0,noteCount=readingNotes.filter(n=>String(n.bookId)===String(b.id)).length;return `<div class="book-item-rich" data-book="${b.id}"><div class="book-cover-mini">📕</div><div class="book-rich-main"><div class="book-rich-title"><b>${esc(b.name)}</b><span>${statusLabel[b.status||'reading']}</span></div><small>${esc(b.author||'未填写作者')} · ${b.pages||0}页 · 已读${b.read||0}页</small><div class="book-progress"><i style="width:${pct}%"></i></div><div class="book-rich-actions"><button data-book-act="note">✍️ 写笔记</button><button data-book-act="status">切换状态</button><em>${noteCount} 条笔记</em></div></div><button class="book-rich-del" data-book-act="delete">×</button></div>`}).join('');
  $('readStreak').textContent=readStreak+' 天';
}
$('bookList')?.addEventListener('click',e=>{const act=e.target.dataset.bookAct;if(!act)return;const row=e.target.closest('[data-book]'),id=row.dataset.book,b=books.find(x=>String(x.id)===id);if(!b)return;if(act==='delete'){books=books.filter(x=>String(x.id)!==id);readingNotes=readingNotes.filter(n=>String(n.bookId)!==id);save(KEYS.books,books);save(KEYS.readingNotes,readingNotes);renderBooks();renderReadingNotes();}else if(act==='status'){const states=['want','reading','finished','paused'],idx=states.indexOf(b.status||'reading');b.status=states[(idx+1)%states.length];save(KEYS.books,books);renderBooks();}else if(act==='note')openReadingNote(b);});
function openReadingNote(book){$('readingNoteBookId').value=book.id;$('readingNoteBookName').textContent=`《${book.name}》阅读记录`;$('readingNotePage').value=book.read||'';$('readingNoteRating').value='';$('readingNoteQuote').value='';$('readingNoteThought').value='';$('readingNoteSummary').value='';$('readingNoteEditor').classList.remove('hidden');$('readingNoteEditor').scrollIntoView({behavior:'smooth',block:'center'});}
$('readingNoteClose')?.addEventListener('click',()=>$('readingNoteEditor').classList.add('hidden'));
$('readingNoteSave')?.addEventListener('click',()=>{const bookId=$('readingNoteBookId').value,book=books.find(b=>String(b.id)===bookId),quote=$('readingNoteQuote').value.trim(),thought=$('readingNoteThought').value.trim(),summary=$('readingNoteSummary').value.trim();if(!book||(!quote&&!thought&&!summary)){showToast('至少写下一项摘抄或感想');return;}const page=Number($('readingNotePage').value)||book.read||0,previous=Number(book.read)||0;book.read=Math.max(previous,page);if(book.pages&&book.read>=book.pages)book.status='finished';readingNotes.push({id:rid(),bookId:book.id,bookName:book.name,page,rating:Math.min(5,Math.max(0,Number($('readingNoteRating').value)||0)),quote,thought,summary,pagesRead:Math.max(0,page-previous),date:todayStr(),createdAt:new Date().toLocaleString('zh-CN')});readLastDate=todayStr();save(KEYS.books,books);save(KEYS.readingNotes,readingNotes);save(KEYS.readLastDate,readLastDate);$('readingNoteEditor').classList.add('hidden');renderBooks();renderReadingNotes();renderCheckin();showToast('阅读笔记已保存 📖');});
function renderReadingNotes(){const box=$('readingNotes');if(!box)return;const notes=[...readingNotes].sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt)));box.innerHTML=notes.length?`<div class="section-title reading-note-title"><div><small>MY NOTES</small><b>最近的阅读笔记</b></div><span>${notes.length} 条</span></div>`+notes.map(n=>`<article class="reading-note-card" data-reading-note="${n.id}"><div class="reading-note-head"><div><b>《${esc(n.bookName)}》</b><small>${esc(n.createdAt)}${n.page?' · 第'+n.page+'页':''}</small></div>${n.rating?`<span>${'★'.repeat(n.rating)}</span>`:''}<button data-reading-note-delete="${n.id}">×</button></div>${n.summary?`<h4>${esc(n.summary)}</h4>`:''}${n.quote?`<blockquote>“${esc(n.quote)}”</blockquote>`:''}${n.thought?`<p>${esc(n.thought)}</p>`:''}</article>`).join(''):'';}
$('readingNotes')?.addEventListener('click',e=>{const id=e.target.dataset.readingNoteDelete;if(!id)return;readingNotes=readingNotes.filter(n=>String(n.id)!==id);save(KEYS.readingNotes,readingNotes);renderReadingNotes();renderBooks();});

$('addBookBtn')?.addEventListener('click',()=>{
  const name=$('bookName').value.trim(), author=$('bookAuthor').value.trim();
  if(!name)return;
  books.push({id:rid(), name, author, pages:Number($('bookPages').value)||0, read:Number($('bookRead').value)||0,status:$('bookStatus').value||'reading'});
  save(KEYS.books,books);
  $('bookName').value='';$('bookAuthor').value='';$('bookPages').value='';$('bookRead').value='';
  showToast('已添加书籍 📚'); renderBooks();
});

// 打卡
$('readCheckinBtn')?.addEventListener('click',()=>{
  const today=todayStr();
  if(readLastDate===today){showToast('今天已经打过卡啦～');return;}
  const yd=new Date();yd.setDate(yd.getDate()-1);const yesterday=`${yd.getFullYear()}-${String(yd.getMonth()+1).padStart(2,'0')}-${String(yd.getDate()).padStart(2,'0')}`;
  readStreak=readLastDate===yesterday?readStreak+1:1;
  readLastDate=today;
  save(KEYS.readStreak,readStreak); save(KEYS.readLastDate,readLastDate);
  $('readCheckinBtn').textContent='已打卡 ✓'; $('readCheckinBtn').disabled=true;
  showToast('阅读打卡成功 🔥 +1天连续');
  renderBooks();
});

// 推荐书籍
function renderRecBooks(){
  const rl=$('recBookList');
  rl.innerHTML='';
  REC_BOOKS.forEach(b=>{
    rl.innerHTML+=`<div class="rec-book"><div class="rb-cover">${b.cover}</div><div class="rb-info"><p class="rb-title">${b.title}</p><p class="rb-author">${b.author}</p><div class="rb-tags">${b.tags.map(t=>`<span class="rb-tag">${t}</span>`).join('')}</div><p class="rb-desc">${b.desc}</p></div></div>`;
  });
}
renderRecBooks();

/* ===== 我的页 - 子面板切换 ===== */
/* 兼容旧调用：各功能已拆为独立页面 */
function showSubPage(name){
  if(name==='health'){
    switchTab('health');
    $$('.htab').forEach((t,i)=>{t.classList.toggle('active',i===0);});
    $$('.hpanel').forEach((p,i)=>{p.classList.toggle('active',i===0);});
  }
  else if(name==='chat'){ switchTab('chat'); }
  else if(name==='water'){ openWaterPage(); }
  else if(name==='settings'){ switchTab('settings'); }
}
/* 直达喝水打卡（独立页） */
function openWaterPage(){
  switchTab('water');
  renderWater();
}

/* ===== 健康管理 ===== */
$$('.htab').forEach(b=>b.addEventListener('click',e=>{
  $$('.htab').forEach(x=>x.classList.remove('active')); e.target.classList.add('active');
  $$('.hpanel').forEach(p=>p.classList.remove('active'));
  const panel=$('hp-'+e.target.dataset.htab); if(panel)panel.classList.add('active');
  if(e.target.dataset.htab==='calendar') renderCalendar();
  if(e.target.dataset.htab==='smart') calcNutri();
  if(e.target.dataset.htab==='diet') renderMealLog();
  if(e.target.dataset.htab==='training') renderWorkoutPlans();
  if(e.target.dataset.htab==='mealprep') renderMealPrep();
  if(e.target.dataset.htab==='dailyworkout') renderWorkoutCollections();
}));

// 菜品
let pendingDishImage=null,pendingDishVideo=null;
$('addDishBtn')?.addEventListener('click',()=>{$('dishForm').classList.toggle('hidden');});
$('cancelDishBtn')?.addEventListener('click',()=>{$('dishForm').classList.add('hidden');});
$('dishImageBtn')?.addEventListener('click',()=>$('dishImageFile')?.click());
$('dishVideoBtn')?.addEventListener('click',()=>$('dishVideoFile')?.click());
$('dishImageFile')?.addEventListener('change',e=>{pendingDishImage=e.target.files?.[0]||null;updateDishMediaTip();});
$('dishVideoFile')?.addEventListener('change',e=>{pendingDishVideo=e.target.files?.[0]||null;updateDishMediaTip();});
function updateDishMediaTip(){const names=[pendingDishImage?.name,pendingDishVideo?.name].filter(Boolean);$('dishMediaTip').textContent=names.length?names.join(' · '):'未选择本地媒体';}
$('saveDishBtn')?.addEventListener('click',async()=>{
  const name=$('dishName').value.trim(); if(!name)return;
  if(pendingDishImage?.size>12*1024*1024){showToast('菜谱图片请控制在 12MB 以内');return;}
  if(pendingDishVideo?.size>150*1024*1024){showToast('菜谱视频请控制在 150MB 以内');return;}
  $('saveDishBtn').disabled=true;
  const media={};
  try{
    if(pendingDishImage){media.imageId='dish_img_'+rid();await putMedia(media.imageId,pendingDishImage);}
    if(pendingDishVideo){media.videoId='dish_vid_'+rid();await putMedia(media.videoId,pendingDishVideo);}
  }catch(e){showToast('本地媒体保存失败');$('saveDishBtn').disabled=false;return;}
  dishes.push({
    id:rid(), name,
    cat:$('dishCat').value,
    ingredients:$('dishIngredients').value,
    seasoning:$('dishSeasoning').value,
    source:$('dishSource').value,
    price:$('dishPrice').value,
    img:$('dishImg').value,
    videoUrl:$('dishVideoUrl').value,
    totalKcal:Number($('dishTotalKcal').value)||0,
    servings:Math.max(1,Number($('dishServings').value)||1),
    protein:Number($('dishProtein').value)||0,
    carbs:Number($('dishCarbs').value)||0,
    fat:Number($('dishFat').value)||0,
    ...media
  });
  save(KEYS.dishes,dishes); $('dishForm').classList.add('hidden');
  // 清空表单
  ['dishName','dishCat','dishIngredients','dishSeasoning','dishSource','dishPrice','dishImg','dishVideoUrl','dishTotalKcal','dishProtein','dishCarbs','dishFat'].forEach(id=>$(id).value='');
  $('dishServings').value='1';
  pendingDishImage=null;pendingDishVideo=null;$('dishImageFile').value='';$('dishVideoFile').value='';updateDishMediaTip();$('saveDishBtn').disabled=false;
  showToast('菜品已保存 🍳'); renderDishes();
});
function renderDishes(){
  const dl=$('dishList');
  renderMealDishOptions();
  if(dishes.length===0){dl.innerHTML='<div class="empty-state">还没有菜品，点"+添加菜品"开始收集你的厨房秘籍</div>';return;}
  dl.innerHTML='';
  dishes.forEach(d=>{
    const perKcal=d.totalKcal?Math.round(d.totalKcal/(Number(d.servings)||1)):0;
    dl.innerHTML+=`<div class="dish-item dish-rich" data-dish="${d.id}"><div class="dish-cover" data-dish-cover="${d.id}">${d.img?`<img src="${esc(d.img)}" alt="">`:'🍳'}</div><div class="dish-copy"><span class="dname">${esc(d.name)}</span><span class="dcat">${esc(d.cat||'我的菜谱')}</span><small>${perKcal?`🔥 ${perKcal} kcal/份`:''}${d.videoId||d.videoUrl?' · 🎬 视频':''}${d.price?' · ¥'+esc(d.price):''}</small></div><span class="pdel" data-ddel="${d.id}">×</span></div>`;
    if(d.imageId)fillDishCover(d);
  });
  dl.querySelectorAll('[data-dish]').forEach(el=>el.addEventListener('click',e=>{if(!e.target.closest('[data-ddel]'))openDishDetail(dishes.find(x=>String(x.id)===el.dataset.dish));}));
  dl.querySelectorAll('[data-ddel]').forEach(d=>{
    d.addEventListener('click',async()=>{
      const item=dishes.find(x=>String(x.id)===d.dataset.ddel);if(item?.imageId)await delMedia(item.imageId);if(item?.videoId)await delMedia(item.videoId);
      dishes=dishes.filter(x=>String(x.id)!==d.dataset.ddel); save(KEYS.dishes,dishes); renderDishes();
    });
  });
}
async function fillDishCover(d){
  const box=document.querySelector(`[data-dish-cover="${d.id}"]`);if(!box)return;
  try{const blob=await getMedia(d.imageId);if(blob)box.innerHTML=`<img src="${URL.createObjectURL(blob)}" alt="${esc(d.name)}">`;}catch(e){}
}
async function openDishDetail(d){
  if(!d)return;$('detailTag').textContent=d.cat||'我的菜谱';$('detailTitle').textContent=d.name;
  const perKcal=d.totalKcal?Math.round(d.totalKcal/(Number(d.servings)||1)):0;
  $('detailBody').textContent=`食材：${d.ingredients||'未填写'}\n\n调料：${d.seasoning||'未填写'}${perKcal?`\n\n每份热量：${perKcal} kcal\n蛋白质 ${d.protein||0}g · 碳水 ${d.carbs||0}g · 脂肪 ${d.fat||0}g`:''}${d.price?`\n\n预估价格：¥${d.price}`:''}`;
  const vc=$('detailVideo');vc.innerHTML='';
  if(d.imageId){try{const blob=await getMedia(d.imageId);if(blob)vc.innerHTML=`<img src="${URL.createObjectURL(blob)}" class="dish-detail-image" alt="">`;}catch(e){}}
  else if(d.img)vc.innerHTML=`<img src="${esc(d.img)}" class="dish-detail-image" alt="">`;
  if(d.videoId){try{const blob=await getMedia(d.videoId);if(blob)vc.insertAdjacentHTML('beforeend',`<video controls preload="metadata" src="${URL.createObjectURL(blob)}"></video>`);}catch(e){}}
  else if(d.videoUrl){const emb=videoEmbedHtml(d.videoUrl);vc.insertAdjacentHTML('beforeend',emb||`<a class="pick-link" href="${esc(d.videoUrl)}" target="_blank">▶ 打开视频教程</a>`);}
  $('detailLink').classList.add('hidden');$('detailSrc').textContent=d.source?`来源：${d.source}`:'收藏于我的厨房秘籍';$('detailMask').classList.remove('hidden');
}

/* ===== 免费本地饮食打卡与热量账本 ===== */
let pendingMealPhoto=null;
function renderMealDishOptions(){
  const sel=$('mealDish');if(!sel)return;const old=sel.value;
  sel.innerHTML='<option value="">选择收藏菜品</option>'+dishes.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('');
  if([...sel.options].some(o=>o.value===old))sel.value=old;
}
$('mealDish')?.addEventListener('change',()=>{const d=dishes.find(x=>String(x.id)===$('mealDish').value);$('mealKcal').value=d?.totalKcal?Math.round(d.totalKcal/(Number(d.servings)||1)):'';});
$('mealPhotoBtn')?.addEventListener('click',()=>$('mealPhotoFile')?.click());
$('mealPhotoFile')?.addEventListener('change',e=>{pendingMealPhoto=e.target.files?.[0]||null;if(pendingMealPhoto?.size>12*1024*1024){showToast('餐食图片请控制在 12MB 以内');pendingMealPhoto=null;e.target.value='';}$('mealPhotoTip').textContent=pendingMealPhoto?pendingMealPhoto.name:'未选择图片';});
function dailyCalorieTarget(){
  const W=Number(bodyProfile.weight)||65,H=Number(bodyProfile.height)||170,A=Number(bodyProfile.age)||22,g=bodyProfile.gender||'女',factor={sedentary:1.2,light:1.375,moderate:1.55,active:1.725}[bodyProfile.activity]||1.2,bmr=10*W+6.25*H-5*A+(g==='男'?5:-161),tdee=Math.round(bmr*factor),deficit=fatPlan.targetWeight?(Number(fatPlan.weeklyGoal)||.5)*7700/7:(bodyProfile.goal==='lose'?300:0);return Math.max(g==='男'?1500:1200,Math.round(tdee-deficit));
}
$('addMealBtn')?.addEventListener('click',async()=>{
  const dish=dishes.find(x=>String(x.id)===$('mealDish').value),kcal=Number($('mealKcal').value),amount=Number($('mealServings').value)||1,date=$('mealDate').value||todayStr();
  if(!dish){showToast('先选择一道收藏菜品');return;}if(!kcal){showToast('请填写这道菜每份的热量');return;}
  let photoId='';if(pendingMealPhoto){try{photoId='meal_'+rid();await putMedia(photoId,pendingMealPhoto);}catch(e){showToast('图片保存失败');return;}}
  mealLog.unshift({id:rid(),date,type:$('mealType').value,dishId:dish.id,name:dish.name,servings:amount,kcalPerServing:kcal,totalKcal:Math.round(kcal*amount),protein:(Number(dish.protein)||0)*amount,carbs:(Number(dish.carbs)||0)*amount,fat:(Number(dish.fat)||0)*amount,photoId,time:new Date().toISOString()});save(KEYS.mealLog,mealLog);pendingMealPhoto=null;$('mealPhotoFile').value='';$('mealPhotoTip').textContent='未选择图片';renderMealLog();showToast('饮食打卡完成 🥣');
});
function renderMealLog(){
  if(!$('mealList'))return;if(!$('mealDate').value)$('mealDate').value=todayStr();const date=$('mealDate').value,rows=mealLog.filter(x=>x.date===date),total=rows.reduce((s,x)=>s+(Number(x.totalKcal)||0),0),target=dailyCalorieTarget(),left=target-total;
  $('dietSummary').innerHTML=`<div><b>${target}</b><span>目标 kcal</span></div><div><b>${total}</b><span>已摄入 kcal</span></div><div class="${left<0?'over':''}"><b>${Math.abs(left)}</b><span>${left>=0?'剩余':'超出'} kcal</span></div>`;
  $('mealList').innerHTML=rows.length?rows.map(x=>`<div class="meal-item" data-meal="${x.id}">${x.photoId?`<button class="meal-photo" data-meal-photo="${x.photoId}">📷</button>`:`<span class="meal-type">${x.type.slice(0,1)}</span>`}<div><b>${esc(x.name)}</b><small>${esc(x.type)} · ${x.servings}份 · 蛋白质 ${Math.round(x.protein||0)}g</small></div><strong>${x.totalKcal} kcal</strong><button class="meal-del" data-meal-del="${x.id}">×</button></div>`).join(''):'<p class="tip-text">这一天还没有饮食记录。</p>';
}
$('mealDate')?.addEventListener('change',renderMealLog);
$('mealList')?.addEventListener('click',async e=>{
  const photo=e.target.closest('[data-meal-photo]');if(photo){try{const blob=await getMedia(photo.dataset.mealPhoto);if(blob){$('detailTag').textContent='饮食打卡';$('detailTitle').textContent='今日餐食';$('detailBody').textContent='图片仅保存在当前设备';$('detailVideo').innerHTML=`<img class="dish-detail-image" src="${URL.createObjectURL(blob)}" alt="餐食图片">`;$('detailLink').classList.add('hidden');$('detailSrc').textContent='本地图片记录';$('detailMask').classList.remove('hidden');}}catch(err){}return;}
  const del=e.target.closest('[data-meal-del]');if(!del)return;const item=mealLog.find(x=>String(x.id)===del.dataset.mealDel);if(item?.photoId)await delMedia(item.photoId);mealLog=mealLog.filter(x=>String(x.id)!==del.dataset.mealDel);save(KEYS.mealLog,mealLog);renderMealLog();
});

/* ===== 训练模板与训练历史 ===== */
$('addWorkoutPlan')?.addEventListener('click',()=>{const name=$('workoutPlanName').value.trim();if(!name){showToast('先写下训练计划名称');return;}workoutPlans.push({id:rid(),name,focus:$('workoutPlanFocus').value.trim(),exercises:[]});save(KEYS.workoutPlans,workoutPlans);$('workoutPlanName').value='';$('workoutPlanFocus').value='';renderWorkoutPlans();});
function renderWorkoutPlans(){
  const box=$('workoutPlanList');if(!box)return;box.innerHTML=workoutPlans.length?workoutPlans.map(p=>`<div class="workout-plan" data-workout="${p.id}"><div class="workout-plan-head"><div><b>${esc(p.name)}</b><small>${esc(p.focus||'自定义训练')} · ${p.exercises.length} 个动作</small></div><button data-workout-act="delete-plan">×</button></div><div class="exercise-list">${p.exercises.map(ex=>`<div class="exercise-row" data-exercise="${ex.id}"><input value="${esc(ex.name)}" data-ex-field="name"><label><input type="number" value="${ex.sets}" min="1" data-ex-field="sets">组</label><label><input type="number" value="${ex.reps}" min="1" data-ex-field="reps">次</label><label><input type="number" value="${ex.weight}" min="0" step="0.5" data-ex-field="weight">kg</label><button data-workout-act="delete-ex">×</button></div>`).join('')}</div><div class="exercise-add"><input placeholder="动作名称"><input type="number" value="4" min="1" title="组数"><input type="number" value="10" min="1" title="次数"><input type="number" value="0" min="0" step="0.5" title="重量"><button data-workout-act="add-ex">＋动作</button></div><div class="workout-complete"><label>预计时长 <input type="number" value="45" min="5" data-workout-duration> 分钟</label><button data-workout-act="complete">✓ 完成今日训练</button></div></div>`).join(''):'<div class="empty-state">还没有训练模板，可以建立“推、拉、腿”或自己的计划。</div>';
  $('workoutHistoryList').innerHTML=workoutHistory.length?workoutHistory.slice(0,6).map(h=>`<div class="workout-history-row"><span>🏋️</span><div><b>${esc(h.name)}</b><small>${h.date} · ${h.duration}min · 训练容量 ${Math.round(h.volume)}kg</small></div></div>`).join(''):'<p class="tip-text">完成训练后会保留历史记录。</p>';
}
$('workoutPlanList')?.addEventListener('change',e=>{const field=e.target.dataset.exField;if(!field)return;const plan=workoutPlans.find(p=>String(p.id)===e.target.closest('[data-workout]').dataset.workout),ex=plan.exercises.find(x=>String(x.id)===e.target.closest('[data-exercise]').dataset.exercise);ex[field]=field==='name'?e.target.value:Number(e.target.value)||0;save(KEYS.workoutPlans,workoutPlans);});
$('workoutPlanList')?.addEventListener('click',e=>{const act=e.target.dataset.workoutAct;if(!act)return;const row=e.target.closest('[data-workout]'),plan=workoutPlans.find(p=>String(p.id)===row.dataset.workout);if(act==='delete-plan'){if(confirm('删除这个训练模板吗？'))workoutPlans=workoutPlans.filter(p=>String(p.id)!==row.dataset.workout);}if(act==='add-ex'){const inputs=[...row.querySelectorAll('.exercise-add input')],name=inputs[0].value.trim();if(!name){showToast('先填写动作名称');return;}plan.exercises.push({id:rid(),name,sets:Number(inputs[1].value)||1,reps:Number(inputs[2].value)||1,weight:Number(inputs[3].value)||0});}if(act==='delete-ex'){plan.exercises=plan.exercises.filter(x=>String(x.id)!==e.target.closest('[data-exercise]').dataset.exercise);}if(act==='complete'){if(!plan.exercises.length){showToast('先给计划添加训练动作');return;}const duration=Number(row.querySelector('[data-workout-duration]').value)||45,volume=plan.exercises.reduce((s,x)=>s+x.sets*x.reps*x.weight,0),entry={id:rid(),planId:plan.id,name:plan.name,date:todayStr(),duration,volume,exercises:JSON.parse(JSON.stringify(plan.exercises))};workoutHistory.unshift(entry);exerciseLog.unshift({id:rid(),name:plan.name,duration,kcal:0,date:todayStr()});save(KEYS.workoutHistory,workoutHistory);save(KEYS.exerciseLog,exerciseLog);renderExercise();showToast('训练完成，已记录今天的成绩 🏋️');}save(KEYS.workoutPlans,workoutPlans);renderWorkoutPlans();});

/* ===== 每日跟练合集 ===== */
const WORKOUT_DAY_LABEL={0:'周日',1:'周一',2:'周二',3:'周三',4:'周四',5:'周五',6:'周六',all:'每天'};
function normalizeWorkoutVideoUrl(text){const raw=String(text||'').trim(),found=raw.match(/https?:\/\/[^\s，。]+/i);if(found)return found[0];if(/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw))return 'https://'+raw;return '';}
function selectedWorkoutCollection(){const ds=todayStr(),selected=workoutSelected[ds],day=String(new Date().getDay());return workoutCollections.find(c=>String(c.id)===String(selected))||workoutCollections.find(c=>String(c.day)===day)||workoutCollections.find(c=>c.day==='all')||workoutCollections[0]||null;}
function collectionDoneMap(id){return (workoutCollectionLog[todayStr()]||{})[id]||{};}
function renderWorkoutCollections(){
  const hero=$('dailyWorkoutHero'),list=$('workoutCollectionList');if(!hero||!list)return;save(KEYS.workoutCollections,workoutCollections);const active=selectedWorkoutCollection();
  if(!active){hero.innerHTML='<div class="study-empty">还没有今日跟练，先建立一个合集吧</div>';$('startDailyWorkout').disabled=true;}else{const doneMap=collectionDoneMap(active.id),done=active.segments.filter(s=>doneMap[s.id]).length,totalMin=active.segments.reduce((n,s)=>n+(Number(s.duration)||0),0),pct=active.segments.length?Math.round(done/active.segments.length*100):0;hero.innerHTML=`<div><small>${WORKOUT_DAY_LABEL[new Date().getDay()]} · TODAY WORKOUT</small><h2>${esc(active.name)}</h2><p>${esc(active.focus||'今日训练')} · 共 ${active.segments.length} 段 · ${totalMin} 分钟</p></div><div class="daily-workout-ring" style="--workout-pct:${pct*3.6}deg"><b>${done}/${active.segments.length}</b><small>已完成</small></div>`;$('startDailyWorkout').disabled=!active.segments.length;$('startDailyWorkout').textContent=done===active.segments.length&&done>0?'✓ 今日跟练已完成':'▶ 开始今日跟练';}
  const sportOpts='<option value="">自己填写 / 不绑定素材</option>'+sports.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');
  list.innerHTML=workoutCollections.length?workoutCollections.map(c=>{const isActive=active&&String(active.id)===String(c.id),doneMap=collectionDoneMap(c.id);return `<section class="workout-collection ${isActive?'active':''}" data-collection="${c.id}"><div class="collection-head"><div><small>${WORKOUT_DAY_LABEL[c.day]||'自定义'} · ${c.segments.length} 段</small><b>${esc(c.name)}</b><p>${esc(c.focus||'自定义训练')}</p></div><button data-collection-act="select">${isActive?'今日安排':'设为今天'}</button><button data-collection-act="delete">×</button></div><div class="collection-segments">${c.segments.map((s,i)=>`<article class="collection-segment ${doneMap[s.id]?'done':''}" data-segment="${s.id}"><span>${doneMap[s.id]?'✓':i+1}</span><div><small>第 ${i+1} 段 · ${s.duration} 分钟 · ${s.videoId?'本地视频':s.url?'视频链接':'无视频'}</small><b>${esc(s.title)}</b><p>${esc(s.description||'')}</p></div><div class="segment-tools"><button data-segment-act="up">↑</button><button data-segment-act="down">↓</button><button data-segment-act="delete">×</button></div></article>`).join('')||'<p class="tip-text">还没有分段，在下面加入今天要跟练的内容。</p>'}</div><div class="segment-add"><select data-segment-source>${sportOpts}</select><input data-segment-title placeholder="分段名称"><input type="number" data-segment-duration min="1" value="10" placeholder="分钟"><input data-segment-url placeholder="视频链接（与上传二选一）"><label class="segment-file-label">🎬 上传视频<input type="file" accept="video/*" data-segment-file></label><input data-segment-desc placeholder="训练作用或注意事项"><button data-collection-act="add-segment">＋ 加入一段</button></div></section>`}).join(''):'<div class="study-empty">建立第一个每日跟练合集吧</div>';
}
$('toggleWorkoutCollection')?.addEventListener('click',()=>$('workoutCollectionCreate').classList.toggle('hidden'));
$('saveWorkoutCollection')?.addEventListener('click',()=>{const name=$('collectionName').value.trim();if(!name){showToast('请填写合集名称');return;}workoutCollections.push({id:rid(),name,focus:$('collectionFocus').value.trim(),day:$('collectionDay').value,segments:[]});save(KEYS.workoutCollections,workoutCollections);$('collectionName').value='';$('collectionFocus').value='';$('workoutCollectionCreate').classList.add('hidden');renderWorkoutCollections();showToast('跟练合集已创建');});
$('workoutCollectionList')?.addEventListener('change',e=>{const sel=e.target.closest('[data-segment-source]');if(!sel||!sel.value)return;const row=sel.closest('[data-collection]'),sport=sports.find(s=>String(s.id)===sel.value);if(!sport)return;row.querySelector('[data-segment-title]').value=sport.name||'';row.querySelector('[data-segment-duration]').value=sport.duration||10;row.querySelector('[data-segment-url]').value=sport.url||'';row.querySelector('[data-segment-desc]').value=sport.type||'';});
$('workoutCollectionList')?.addEventListener('click',async e=>{const cRow=e.target.closest('[data-collection]');if(!cRow)return;const c=workoutCollections.find(x=>String(x.id)===cRow.dataset.collection),act=e.target.dataset.collectionAct,sAct=e.target.dataset.segmentAct;if(act==='select'){workoutSelected[todayStr()]=c.id;save(KEYS.workoutSelected,workoutSelected);}else if(act==='delete'){if(confirm('删除这个跟练合集吗？')){for(const s of c.segments)if(s.videoId)await delVid(s.videoId);workoutCollections=workoutCollections.filter(x=>String(x.id)!==String(c.id));}}else if(act==='add-segment'){const title=cRow.querySelector('[data-segment-title]').value.trim(),file=cRow.querySelector('[data-segment-file]').files?.[0];if(!title){showToast('先填写这一段练什么');return;}if(file&&file.size>200*1024*1024){showToast('单个视频请控制在 200MB 以内');return;}const segment={id:rid(),title,duration:Number(cRow.querySelector('[data-segment-duration]').value)||10,url:normalizeWorkoutVideoUrl(cRow.querySelector('[data-segment-url]').value),description:cRow.querySelector('[data-segment-desc]').value.trim()};if(file){segment.videoId='workout_'+segment.id;segment.videoName=file.name;try{await putVid(segment.videoId,file);segment.url='';}catch(err){showToast('视频保存失败，请检查设备空间');return;}}c.segments.push(segment);showToast(file?'本地视频已加入合集':segment.url?'已识别链接并加入合集':'跟练分段已加入');}else if(sAct){const sRow=e.target.closest('[data-segment]'),idx=c.segments.findIndex(x=>String(x.id)===sRow.dataset.segment);if(sAct==='delete'){if(c.segments[idx].videoId)await delVid(c.segments[idx].videoId);c.segments.splice(idx,1);}if(sAct==='up'&&idx>0)[c.segments[idx-1],c.segments[idx]]=[c.segments[idx],c.segments[idx-1]];if(sAct==='down'&&idx<c.segments.length-1)[c.segments[idx+1],c.segments[idx]]=[c.segments[idx],c.segments[idx+1]];}else return;save(KEYS.workoutCollections,workoutCollections);renderWorkoutCollections();});
let activeFollowCollection=null,activeFollowIndex=0;
function openWorkoutFollow(collection,index=0){if(!collection?.segments.length){showToast('今日合集还没有跟练内容');return;}activeFollowCollection=collection;activeFollowIndex=Math.max(0,Math.min(index,collection.segments.length-1));renderWorkoutFollow();$('workoutFollowMode').classList.remove('hidden');}
function renderWorkoutFollow(){const c=activeFollowCollection,s=c?.segments[activeFollowIndex];if(!s)return;const doneMap=collectionDoneMap(c.id);$('workoutFollowStep').textContent=`第 ${activeFollowIndex+1} 段 / ${c.segments.length}`;$('workoutFollowCollection').textContent=c.name;$('workoutFollowDuration').textContent=`${s.duration} 分钟`;$('workoutFollowTitle').textContent=s.title;$('workoutFollowDesc').textContent=s.description||'跟随视频完成这一段训练';$('workoutFollowBar').style.width=`${(activeFollowIndex+(doneMap[s.id]?1:0))/c.segments.length*100}%`;$('workoutFollowComplete').textContent=doneMap[s.id]?'✓ 本段已完成':'完成本段';$('workoutFollowPrev').disabled=activeFollowIndex===0;$('workoutFollowNext').disabled=activeFollowIndex===c.segments.length-1;const media=$('workoutFollowMedia');if(s.videoId){media.innerHTML='<div>⏳<small>正在读取本地视频…</small></div>';const expected=s.id;getVid(s.videoId).then(blob=>{if(activeFollowCollection?.segments[activeFollowIndex]?.id!==expected)return;if(!blob){media.innerHTML='<div>⚠️<small>本地视频找不到了，请重新上传</small></div>';return;}const url=URL.createObjectURL(blob);media.innerHTML=`<video controls playsinline src="${url}"></video>`;}).catch(()=>media.innerHTML='<div>⚠️<small>视频读取失败</small></div>');}else{const embed=s.url?videoEmbedHtml(s.url):'';media.innerHTML=embed||(s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">▶ 打开原视频跟练</a>`:`<div>🎬<small>这一段还没有绑定视频，可按动作说明完成</small></div>`);}}
$('startDailyWorkout')?.addEventListener('click',()=>{const c=selectedWorkoutCollection();if(!c)return;const done=collectionDoneMap(c.id),idx=c.segments.findIndex(s=>!done[s.id]);openWorkoutFollow(c,idx<0?0:idx);});
$('workoutFollowExit')?.addEventListener('click',()=>$('workoutFollowMode').classList.add('hidden'));
$('workoutFollowFullscreen')?.addEventListener('click',async()=>{const mode=$('workoutFollowMode');try{if(!document.fullscreenElement)await mode.requestFullscreen();else await document.exitFullscreen();}catch(e){showToast('当前浏览器不允许网页全屏');}});
async function setWorkoutOrientation(type){const mode=$('workoutFollowMode');mode.classList.toggle('layout-landscape',type==='landscape');mode.classList.toggle('layout-portrait',type==='portrait');try{if(!document.fullscreenElement&&mode.requestFullscreen)await mode.requestFullscreen();if(screen.orientation?.lock)await screen.orientation.lock(type);}catch(e){showToast(type==='landscape'?'已切换横屏排版':'已切换竖屏排版');}}
$('workoutFollowLandscape')?.addEventListener('click',()=>setWorkoutOrientation('landscape'));
$('workoutFollowPortrait')?.addEventListener('click',()=>setWorkoutOrientation('portrait'));
document.addEventListener('fullscreenchange',()=>{if($('workoutFollowFullscreen'))$('workoutFollowFullscreen').textContent=document.fullscreenElement?'⊙ 退出全屏':'⛶ 全屏';if(!document.fullscreenElement&&screen.orientation?.unlock)try{screen.orientation.unlock();}catch(e){}});
$('workoutFollowPrev')?.addEventListener('click',()=>{activeFollowIndex--;renderWorkoutFollow();});$('workoutFollowNext')?.addEventListener('click',()=>{activeFollowIndex++;renderWorkoutFollow();});
$('workoutFollowComplete')?.addEventListener('click',()=>{const c=activeFollowCollection,s=c.segments[activeFollowIndex],ds=todayStr();if(!workoutCollectionLog[ds])workoutCollectionLog[ds]={};if(!workoutCollectionLog[ds][c.id])workoutCollectionLog[ds][c.id]={};workoutCollectionLog[ds][c.id][s.id]=true;const allDone=c.segments.every(x=>workoutCollectionLog[ds][c.id][x.id]);if(allDone&&!workoutCollectionLog[ds][c.id]._logged){const duration=c.segments.reduce((n,x)=>n+(Number(x.duration)||0),0);exerciseLog.unshift({id:rid(),name:c.name,duration,kcal:0,date:ds,source:'collection'});workoutCollectionLog[ds][c.id]._logged=true;save(KEYS.exerciseLog,exerciseLog);renderExercise();renderCheckin();showToast('今日整套跟练完成啦 🎉');$('workoutFollowMode').classList.add('hidden');}else if(activeFollowIndex<c.segments.length-1){activeFollowIndex++;showToast('本段完成，进入下一段');}save(KEYS.workoutCollectionLog,workoutCollectionLog);renderWorkoutFollow();renderWorkoutCollections();});

/* ===== 每周备餐与自动采购清单 ===== */
function renderMealPrep(){
  const box=$('mealPrepWeek');if(!box)return;const wk=weekKey();if(!mealPrep[wk])mealPrep[wk]={};const start=dateAtMidnight(wk),opts='<option value="">未安排</option>'+dishes.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('');
  box.innerHTML=Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(d.getDate()+i);const day=['周一','周二','周三','周四','周五','周六','周日'][i];return `<div class="mealprep-day"><div><b>${day}</b><small>${d.getMonth()+1}/${d.getDate()}</small></div><label>午餐<select data-meal-slot="${i}-lunch">${opts}</select></label><label>晚餐<select data-meal-slot="${i}-dinner">${opts}</select></label></div>`}).join('');
  box.querySelectorAll('[data-meal-slot]').forEach(sel=>sel.value=String(mealPrep[wk][sel.dataset.mealSlot]||''));renderShoppingList();
}
$('mealPrepWeek')?.addEventListener('change',e=>{const sel=e.target.closest('[data-meal-slot]');if(!sel)return;const wk=weekKey();if(!mealPrep[wk])mealPrep[wk]={};if(sel.value)mealPrep[wk][sel.dataset.mealSlot]=sel.value;else delete mealPrep[wk][sel.dataset.mealSlot];save(KEYS.mealPrep,mealPrep);renderShoppingList();});
function shoppingIngredients(){const wk=weekKey(),slots=Object.values(mealPrep[wk]||{}),counts={};slots.forEach(id=>{const dish=dishes.find(d=>String(d.id)===String(id));(dish?.ingredients||'').split(/[,，、;；\n]+/).map(s=>s.trim()).filter(Boolean).forEach(x=>counts[x]=(counts[x]||0)+1);});return counts;}
function renderShoppingList(){const box=$('shoppingList');if(!box)return;const wk=weekKey(),items=shoppingIngredients();if(!shoppingChecked[wk])shoppingChecked[wk]={};box.innerHTML=Object.keys(items).length?Object.entries(items).map(([name,count])=>`<label class="shopping-item ${shoppingChecked[wk][name]?'done':''}"><input type="checkbox" data-shopping="${esc(name)}" ${shoppingChecked[wk][name]?'checked':''}><span>${esc(name)}</span>${count>1?`<small>用于 ${count} 道餐</small>`:''}</label>`).join(''):'<p class="tip-text">先安排本周菜谱，采购清单会自动生成。菜谱需要填写食材。</p>';}
$('shoppingList')?.addEventListener('change',e=>{if(!e.target.dataset.shopping)return;const wk=weekKey();if(!shoppingChecked[wk])shoppingChecked[wk]={};shoppingChecked[wk][e.target.dataset.shopping]=e.target.checked;save(KEYS.shoppingChecked,shoppingChecked);renderShoppingList();});
$('resetShopping')?.addEventListener('click',()=>{shoppingChecked[weekKey()]={};save(KEYS.shoppingChecked,shoppingChecked);renderShoppingList();});

// 视频跟练（收藏跟练视频，原误放在「运动记录」标签下，已归位）
$('addSportBtn')?.addEventListener('click',()=>{
  const name=$('sportName').value.trim(); if(!name)return;
  sports.push({
    id:rid(),
    name, url:$('sportUrl').value,
    duration:Number($('sportDuration').value)||0,
    type:$('sportType').value
  });
  save(KEYS.sports,sports);
  ['sportName','sportUrl','sportDuration','sportType'].forEach(id=>$(id).value='');
  showToast('跟练视频已收藏 🎬'); renderSports();
});
function renderSports(){
  const sl=$('sportList');
  if(sports.length===0){sl.innerHTML='<div class="empty-state">🎬 还没有添加跟练视频，从上方添加吧</div>';return;}
  sl.innerHTML='';
  sports.forEach(s=>{
    sl.innerHTML+=`<div class="sport-item"><span class="sname">${esc(s.name)}</span><span class="sdur">${s.duration}min</span><span class="pdel" style="cursor:pointer;color:#ccc;" data-sdel="${s.id}">×</span></div>`;
  });
  sl.querySelectorAll('[data-sdel]').forEach(d=>{
    d.addEventListener('click',()=>{
      sports=sports.filter(x=>x.id!==d.dataset.sdel); save(KEYS.sports,sports); renderSports();
    });
  });
}

// 运动记录（记录实际完成的运动：名称/时长/消耗/日期）
$('addExBtn')?.addEventListener('click',()=>{
  const name=$('exName').value.trim(); if(!name){ showToast('填个运动名称吧～'); return; }
  exerciseLog.unshift({
    id:rid(),
    name,
    duration:Number($('exDuration').value)||0,
    kcal:Number($('exKcal').value)||0,
    date:($('exDate').value||todayStr())
  });
  save(KEYS.exerciseLog,exerciseLog);
  ['exName','exDuration','exKcal'].forEach(id=>$(id).value='');
  if($('exDate')) $('exDate').value=todayStr();
  showToast('已记录 🏃'); renderExercise();
});
function renderExercise(){
  const el=$('exLogList'); if(!el) return;
  if(exerciseLog.length===0){el.innerHTML='<div class="empty-state">还没有运动记录，今天动一下就记一笔吧 🏃</div>';return;}
  el.innerHTML='';
  exerciseLog.forEach(e=>{
    el.innerHTML+=`<div class="sport-item"><span class="sname">${esc(e.name)}</span>`+
      `<span class="smeta">${e.date} · ${e.duration}min · ${e.kcal}kcal</span>`+
      `<span class="pdel" style="cursor:pointer;color:#ccc;" data-edel="${e.id}">×</span></div>`;
  });
  el.querySelectorAll('[data-edel]').forEach(d=>{
    d.addEventListener('click',()=>{
      exerciseLog=exerciseLog.filter(x=>x.id!==d.dataset.edel); save(KEYS.exerciseLog,exerciseLog); renderExercise();
    });
  });
}

/* ===== 💧 喝水打卡 ===== */
function waterToday(){ return waterLog[todayStr()] || {}; }
function waterDoneCount(ds){ return Object.keys(waterLog[ds]||{}).length; }
function nowMinutes(){ const d=new Date(); return d.getHours()*60+d.getMinutes(); }
function hm2min(s){ const p=(s||'0:0').split(':'); return (+p[0])*60+(+p[1]); }
function waterRecTime(v){return typeof v==='string'?v:(v?.time||'');}
const WATER_MAKEUP_LIMIT=3;
function waterCurrentScheduledIndex(nowM=nowMinutes()){
  let idx=-1;
  waterPlan.forEach((c,i)=>{if(hm2min(c.t)<=nowM)idx=i;});
  return idx;
}
function waterMakeupCount(rec=waterToday()){
  return Object.values(rec).filter(v=>typeof v==='object'&&v.makeup).length;
}

function renderWater(){
  const list=$('waterList'); if(!list) return;
  const rec=waterToday();
  const done=Object.keys(rec).length;
  const nowM=nowMinutes();

  // “该喝了”始终对应当前时间最近的一杯；更早漏掉的杯数属于补卡。
  const scheduledIdx=waterCurrentScheduledIndex(nowM);
  const nowIdx=scheduledIdx>=0&&rec[scheduledIdx]===undefined?scheduledIdx:-1;
  const nextIdx=waterPlan.findIndex((c,i)=>i>scheduledIdx&&rec[i]===undefined);
  const makeupUsed=waterMakeupCount(rec),makeupLeft=Math.max(0,WATER_MAKEUP_LIMIT-makeupUsed);
  if($('waterMakeupLeft'))$('waterMakeupLeft').textContent=`今日可补卡 ${makeupLeft} 次`;

  // 水瓶水位 + 进度条
  const ratio=Math.min(done/waterPlan.length,1);
  const fill=$('waterFill');
  if(fill) fill.setAttribute('y', String(142 - Math.round(120*ratio)));
  $('waterDone').textContent=done;
  $('waterMl').textContent=`${done*CUP_ML} / ${waterPlan.length*CUP_ML} ml`;
  $('waterBarFill').style.width=(ratio*100)+'%';

  // 下一杯提示
  const tipEl=$('waterNext');
  if(done>=waterPlan.length) tipEl.textContent='今日八杯水已达标，你太棒啦 🎉';
  else if(nowIdx>=0) tipEl.textContent=`⏰ 现在该喝第 ${nowIdx+1} 杯啦 · ${waterPlan[nowIdx].d}`;
  else if(nextIdx>=0) tipEl.textContent=`下一杯 ${waterPlan[nextIdx].t} · ${waterPlan[nextIdx].d}`;
  else if(done<waterPlan.length) tipEl.textContent=`今天有 ${waterPlan.length-done} 杯漏打卡，可按实际情况补记 💧`;
  else tipEl.textContent='今天还没喝水哦，先来一杯吧 💧';

  // 时间表列表
  list.innerHTML=waterPlan.map((c,i)=>{
    const isDone=rec[i]!==undefined;
    const isNow=(i===nowIdx);
    const entry=rec[i];
    const isFuture=hm2min(c.t)>nowM;
    const isMakeup=!isDone&&!isNow&&!isFuture;
    const wasMakeup=typeof entry==='object'&&entry.makeup;
    const badge=isDone?`${wasMakeup?'补卡':'已喝'} ${waterRecTime(entry)}`:(isNow?'该喝了':(isMakeup?(makeupLeft>0?'可补卡':'补卡已用完'):'未到时间'));
    return `<div class="wcup${isDone?' done':''}${isNow?' now':''}${isFuture&&!isDone?' locked':''}${isMakeup?' makeup':''}" data-cup="${i}">
      <div class="wcup-icon">${isDone?'✓':'💧'}</div>
      <div class="wcup-main">
        <p class="wcup-time">第 ${i+1} 杯 · ${esc(c.t)}</p>
        <p class="wcup-desc">${esc(c.d)}</p>
      </div>
      ${isDone&&typeof entry==='object'&&entry.mediaId?`<button class="water-media-view" data-water-media="${i}">${entry.mediaType==='video'?'🎬':'📷'}</button>`:''}
      <span class="wcup-badge">${badge}</span>
    </div>`;
  }).join('');

  renderWaterStats();
}

function renderWaterStats(){
  const goal=waterPlan.length;
  const dates=Object.keys(waterLog).sort();
  // 累计打卡杯数
  const total=dates.reduce((s,d)=>s+Object.keys(waterLog[d]).length,0);
  // 本月达标天数
  const ym=todayStr().slice(0,7);
  const monthOK=dates.filter(d=>d.startsWith(ym)&&Object.keys(waterLog[d]).length>=goal).length;
  // 连续达标（从今天或昨天往前推）
  let streak=0; const d=new Date();
  if(Object.keys(waterLog[todayStr()]||{}).length<goal) d.setDate(d.getDate()-1);
  for(;;){
    const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if(Object.keys(waterLog[ds]||{}).length>=goal){ streak++; d.setDate(d.getDate()-1); } else break;
  }
  $('wStreak').textContent=streak;
  $('wMonth').textContent=monthOK;
  $('wTotal').textContent=total;
}

let pendingWaterProof=null,pendingWaterProofUrl='';
$('waterProofBtn')?.addEventListener('click',()=>$('waterProofFile')?.click());
$('waterProofFile')?.addEventListener('change',e=>{
  const file=e.target.files?.[0];if(!file)return;
  if(!file.type.startsWith('image/')&&!file.type.startsWith('video/')){showToast('请选择图片或视频');return;}
  if(file.size>150*1024*1024){showToast('文件请控制在 150MB 以内');e.target.value='';return;}
  pendingWaterProof=file;if(pendingWaterProofUrl)URL.revokeObjectURL(pendingWaterProofUrl);pendingWaterProofUrl=URL.createObjectURL(file);
  const box=$('waterProofPreview');box.classList.remove('hidden');box.innerHTML=`${file.type.startsWith('video/')?`<video src="${pendingWaterProofUrl}" muted></video>`:`<img src="${pendingWaterProofUrl}" alt="打卡预览">`}<span>${esc(file.name)}</span><button id="clearWaterProof">×</button>`;
  $('clearWaterProof')?.addEventListener('click',()=>clearWaterProof());
});
function clearWaterProof(){pendingWaterProof=null;$('waterProofFile').value='';if(pendingWaterProofUrl)URL.revokeObjectURL(pendingWaterProofUrl);pendingWaterProofUrl='';$('waterProofPreview').classList.add('hidden');$('waterProofPreview').innerHTML='';}
async function openWaterProof(entry){
  try{const blob=await getMedia(entry.mediaId);if(!blob){showToast('这条打卡影像找不到了');return;}const url=URL.createObjectURL(blob);$('detailTag').textContent='喝水打卡';$('detailTitle').textContent=`${entry.time||''} · 今日饮水记录`;$('detailBody').textContent='给认真喝水的自己留下一张生活切片 💧';$('detailVideo').innerHTML=entry.mediaType==='video'?`<video controls autoplay src="${url}"></video>`:`<img class="dish-detail-image" src="${url}" alt="喝水打卡图片">`;$('detailLink').classList.add('hidden');$('detailSrc').textContent='仅保存在当前设备';$('detailMask').classList.remove('hidden');}catch(e){showToast('打卡影像读取失败');}
}

// 点击杯子：打卡 / 取消；可为新打卡附一张图片或一段视频。
$('waterList')?.addEventListener('click',async e=>{
  const mediaBtn=e.target.closest('[data-water-media]');
  if(mediaBtn){const entry=waterToday()[Number(mediaBtn.dataset.waterMedia)];if(typeof entry==='object')openWaterProof(entry);return;}
  const el=e.target.closest('.wcup[data-cup]'); if(!el) return;
  const i=Number(el.dataset.cup);
  const ds=todayStr();
  if(!waterLog[ds]) waterLog[ds]={};
  if(waterLog[ds][i]!==undefined){
    const old=waterLog[ds][i];if(typeof old==='object'&&old.mediaId)await delMedia(old.mediaId);
    delete waterLog[ds][i];
    if(!Object.keys(waterLog[ds]).length) delete waterLog[ds];
    showToast('这杯取消啦');
  } else {
    if(hm2min(waterPlan[i].t)>nowMinutes()){
      showToast(`还没到第 ${i+1} 杯时间，${waterPlan[i].t} 后再来打卡吧`);
      return;
    }
    const n=new Date();
    const time=`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
    const scheduledIdx=waterCurrentScheduledIndex();
    const isMakeup=i!==scheduledIdx;
    if(isMakeup&&waterMakeupCount(waterLog[ds])>=WATER_MAKEUP_LIMIT){
      showToast('今天的 3 次补卡机会已经用完啦');
      return;
    }
    if(pendingWaterProof){
      try{const mediaId='water_'+rid();await putMedia(mediaId,pendingWaterProof);waterLog[ds][i]={time,mediaId,mediaType:pendingWaterProof.type.startsWith('video/')?'video':'image',makeup:isMakeup};clearWaterProof();}catch(err){showToast('影像保存失败，请重试');return;}
    }else waterLog[ds][i]=isMakeup?{time,makeup:true}:time;
    const cnt=Object.keys(waterLog[ds]).length;
    if(cnt>=waterPlan.length) showToast('八杯水达标啦，宝宝真棒 🎉');
    else showToast(isMakeup?`第 ${i+1} 杯已补卡 💧`:`第 ${i+1} 杯打卡成功 💧 还差 ${waterPlan.length-cnt} 杯`);
  }
  save(KEYS.waterLog,waterLog);
  renderWater();
});

// 调整时间表
$('waterEditBtn')?.addEventListener('click',()=>{
  const box=$('waterEditBox');
  box.classList.toggle('hidden');
  if(!box.classList.contains('hidden')) renderWaterTimeGrid();
});
function renderWaterTimeGrid(){
  $('waterTimeGrid').innerHTML=waterPlan.map((c,i)=>
    `<div class="wt-row"><span>${i+1}杯</span><input type="time" data-wt="${i}" value="${c.t}"></div>`
  ).join('');
}
$('waterTimeSave')?.addEventListener('click',()=>{
  $$('#waterTimeGrid input[data-wt]').forEach(inp=>{
    const i=Number(inp.dataset.wt);
    if(inp.value) waterPlan[i]={...waterPlan[i], t:inp.value};
  });
  waterPlan.sort((a,b)=>hm2min(a.t)-hm2min(b.t));
  save(KEYS.waterPlan,waterPlan);
  $('waterEditBox').classList.add('hidden');
  showToast('时间表已更新 ⏰');
  renderWater();
});
$('waterTimeReset')?.addEventListener('click',()=>{
  waterPlan=JSON.parse(JSON.stringify(DEFAULT_WATER_PLAN));
  save(KEYS.waterPlan,waterPlan);
  renderWaterTimeGrid();
  showToast('已恢复默认时间');
  renderWater();
});

/* 到点提醒 */
let remindedKeys={};
const rt=$('waterRemindToggle');
if(rt){
  rt.checked=!!waterRemind;
  rt.addEventListener('change',()=>{
    waterRemind=rt.checked; save(KEYS.waterRemind,waterRemind);
    if(waterRemind){
      if('Notification' in window && Notification.permission==='default'){
        Notification.requestPermission();
      }
      showToast('到点会提醒你喝水啦 💧');
    } else showToast('已关闭喝水提醒');
  });
}
function checkWaterRemind(){
  if(!waterRemind) return;
  const ds=todayStr(); const rec=waterLog[ds]||{}; const nowM=nowMinutes();
  waterPlan.forEach((c,i)=>{
    if(rec[i]!==undefined) return;
    const t=hm2min(c.t);
    // 到点后 30 分钟内提醒一次
    if(nowM>=t && nowM<t+30){
      const key=`${ds}-${i}`;
      if(remindedKeys[key]) return;
      remindedKeys[key]=1;
      const msg=`💧 该喝第 ${i+1} 杯水啦 · ${c.d}`;
      showToast(msg);
      if('Notification' in window && Notification.permission==='granted'){
        try{ new Notification('喝水提醒', {body:msg, tag:key}); }catch(e){}
      }
    }
  });
}
setInterval(()=>{ checkWaterRemind(); }, 60000);
setTimeout(checkWaterRemind, 3000);
// 每分钟刷新一次列表状态（"该喝了"标记会随时间变化）
setInterval(()=>{ if($('hp-water')?.classList.contains('active')) renderWater(); }, 60000);

// 智能营养计算
const DEFAULT_BODY_PROFILE={gender:'女',age:22,height:170,weight:65,budget:2000,activity:'sedentary',goal:'maintain'};
let bodyProfile=load(KEYS.bodyProfile, DEFAULT_BODY_PROFILE);

function loadBodyProfile(){
  const map={bodyGender:'gender',bodyAge:'age',bodyHeight:'height',bodyWeight:'weight',bodyBudget:'budget',bodyActivity:'activity',bodyGoal:'goal'};
  Object.entries(map).forEach(([id,key])=>{ if($(id)&&bodyProfile[key]!==undefined) $(id).value=bodyProfile[key]; });
}

function saveBodyProfile(){
  bodyProfile={
    gender:$('bodyGender').value,
    age:Number($('bodyAge').value)||22,
    height:Number($('bodyHeight').value)||170,
    weight:Number($('bodyWeight').value)||65,
    budget:Number($('bodyBudget').value)||2000,
    activity:$('bodyActivity').value,
    goal:$('bodyGoal').value
  };
  save(KEYS.bodyProfile,bodyProfile);
}

function calcNutri(){
  const H=Number($('bodyHeight').value)||170;
  const W=Number($('bodyWeight').value)||65;
  const gender=$('bodyGender').value;
  const budget=Number($('bodyBudget').value)||2000;
  const actMap={sedentary:1.2,light:1.375,moderate:1.55,active:1.725};
  const factor=actMap[$('bodyActivity').value]||1.2;
  const goal=$('bodyGoal').value;

  // Mifflin-St Jeor
  let bmr;
  if(gender==='男') bmr=10*W+6.25*H-5*age()+5;
  else bmr=10*W+6.25*H-5*age()-161;
  const tdee=Math.round(bmr*factor);
  const target=Math.max(1200,tdee+(goal==='lose'?-300:goal==='gain'?300:0));
  const bmi=(W/((H/100)**2)).toFixed(1);
  const dailyBudget=Math.round(budget/30);

  $('bmrVal').textContent=Math.round(bmr);
  $('tdeeVal').textContent=target;
  const tdeeLabel=$('tdeeVal').nextElementSibling;
  if(tdeeLabel) tdeeLabel.textContent=(goal==='maintain'?'每日消耗':'目标摄入')+' kcal/天';
  $('bmiVal').textContent=bmi+(bmi<18.5?' 偏瘦':bmi<24?' 正常':bmi<28?' 偏胖':' 肥胖');
  $('dailyBudgetVal').textContent='¥'+dailyBudget;
}
function age(){ return Number($('bodyAge').value)||22; }

// 监听身体数据变化
['bodyAge','bodyHeight','bodyWeight','bodyBudget','bodyActivity','bodyGoal'].forEach(id=>{
  $(id)?.addEventListener('input',()=>{saveBodyProfile();calcNutri();});
});
$('bodyGender')?.addEventListener('change',()=>{saveBodyProfile();calcNutri();});

$('genMenuBtn')?.addEventListener('click',()=>{showToast('智能食谱生成中…（后续版本接入AI）');});

// 日历
let calYear, calMonth;

/* ===== 独立日历 Tab（聚合所有个人数据） ===== */
let cbYear, cbMonth;
function renderCalendarPage(){
  cbYear=cbYear||new Date().getFullYear();
  cbMonth=cbMonth||new Date().getMonth();
  $('cbTitle').textContent=`${cbYear}年${cbMonth+1}月`;
  const firstDay=new Date(cbYear,cbMonth,1).getDay();
  const daysInMonth=new Date(cbYear,cbMonth+1,0).getDate();
  const today=todayStr();
  let daysHtml='';
  for(let i=0;i<firstDay;i++) daysHtml+='<div class="cal-day empty"></div>';
  for(let d=1;d<=daysInMonth;d++){
    const ds=`${cbYear}-${String(cbMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const taskDone=tasks.filter(t=>t.completedAt===ds).length;
    const ideaCnt=ideas.filter(i=>(i.time||'').slice(0,10)===ds).length;
    const health=healthLog[ds];
    const waterCnt=Object.keys(waterLog[ds]||{}).length;
    const hasData=taskDone>0||ideaCnt>0||health||waterCnt>0;
    const isToday=ds===today;
    daysHtml+=`<div class="cal-day${isToday?' today':''}${hasData?' has-data':''}" data-date="${ds}"><span>${d}</span>${hasData?'<i class="cal-dot"></i>':''}</div>`;
  }
  $('cbDays').innerHTML=daysHtml;
}
function renderCalDetail(ds){
  const p=ds.split('-');
  $('cbDetailTitle').textContent=`${parseInt(p[1])}月${parseInt(p[2])}日`;
  const taskDone=tasks.filter(t=>t.completedAt===ds);
  const ideaCnt=ideas.filter(i=>(i.time||'').slice(0,10)===ds);
  const health=healthLog[ds];
  const isToday=ds===todayStr();
  let h='';
  if(taskDone.length) h+=`<p class="cd-sub">✅ 完成任务 ${taskDone.length} 项</p>`+taskDone.map(t=>`<div class="cd-item">${esc(t.text)}</div>`).join('');
  if(ideaCnt.length) h+=`<p class="cd-sub">💡 灵感 ${ideaCnt.length} 条</p>`+ideaCnt.map(i=>`<div class="cd-item">${esc(i.text)}</div>`).join('');
  if(health) h+=`<p class="cd-sub">🏃 运动打卡</p><div class="cd-item">${esc(health.type||'运动')} · ${health.duration||0}min</div>`;
  const wRec=waterLog[ds]||{}; const wCnt=Object.keys(wRec).length;
  if(wCnt){
    const times=Object.keys(wRec).sort((a,b)=>a-b).map(k=>wRec[k]).join(' · ');
    h+=`<p class="cd-sub">💧 喝水 ${wCnt}/${waterPlan.length} 杯（${wCnt*CUP_ML}ml）${wCnt>=waterPlan.length?' 🎉达标':''}</p><div class="cd-item">${esc(times)}</div>`;
  }
  if(isToday && planNotes.length) h+=`<p class="cd-sub">📌 今日计划</p>`+planNotes.map(x=>`<div class="cd-item">${x.done?'✓ ':''}${esc(x.text)}</div>`).join('');
  if(!h) h='<p class="tip-text">这一天还没有记录～</p>';
  $('cbDetailBody').innerHTML=h;
}
$('cbPrev')?.addEventListener('click',()=>{ cbMonth--; if(cbMonth<0){cbMonth=11;cbYear--;} renderCalendarPage(); });
$('cbNext')?.addEventListener('click',()=>{ cbMonth++; if(cbMonth>11){cbMonth=0;cbYear++;} renderCalendarPage(); });
$('cbDays')?.addEventListener('click',e=>{ const c=e.target.closest('.cal-day[data-date]'); if(c) renderCalDetail(c.dataset.date); });
function renderCalendar(){
  calYear=calYear||new Date().getFullYear();
  calMonth=calMonth||new Date().getMonth();
  $('calTitle').textContent=`${calYear}年${calMonth+1}月`;

  const firstDay=new Date(calYear,calMonth,1).getDay();
  const daysInMonth=new Date(calYear,calMonth+1,0).getDate();

  let weekHtml='<div class="cal-week">日 一 二 三 四 五 六</div>'.replace(/ /g,'</div><div class="cal-week" style="display:contents">');
  weekHtml='<div class="cal-week"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>';

  let daysHtml='';
  for(let i=0;i<firstDay;i++) daysHtml+='<div class="cal-day empty"></div>';
  for(let d=1;d<=daysInMonth;d++){
    const dateStr=`${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const hasData=!!healthLog[dateStr];
    const isToday=(new Date().getDate()===d&&new Date().getMonth()===calMonth&&new Date().getFullYear()===calYear);
    daysHtml+=`<div class="cal-day${isToday?' today':''}${hasData?' has-data':''}" data-date="${dateStr}">${d}</div>`;
  }

  $('calendar').innerHTML=weekHtml+`<div class="cal-days">${daysHtml}</div>`;
  updateCalStats();
}
function updateCalStats(){
  const prefix=`${calYear}-${String(calMonth+1).padStart(2,'0')}-`;
  let totalDays=0,totalMin=0,types=new Set();
  Object.entries(healthLog).forEach(([k,v])=>{
    if(k.startsWith(prefix)){totalDays++;totalMin+=(v.duration||0);types.add(v.type||'unknown');}
  });
  $('calDays').textContent=totalDays;
  $('calTotalMin').textContent=totalMin+'min';
  $('calAvgMin').textContent=totalDays?Math.round(totalMin/totalDays)+'min':'0min';
  $('calTypes').textContent=types.size;
}
$('calPrev')?.addEventListener('click',()=>{calMonth--;if(calMonth<0){calMonth=11;calYear--;}renderCalendar();});
$('calNext')?.addEventListener('click',()=>{calMonth++;if(calMonth>11){calMonth=0;calYear++;}renderCalendar();});

/* ===== AI对话/闲话铺 + 开始今天 ===== */
function pickRandom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function initStartPage(){
  // 随机激励文案（首屏固定称呼「宿主大人」，与昵称无关）
  $('startGreet').textContent = pickRandom(GREETINGS);
  $('startEncourage').textContent = pickRandom(ENCOURAGES);
  $('startFlatter').textContent = pickRandom(FLATTERS);
  // 昵称只用于进入后的页面
  $('meName').textContent = getNick();
  // 加载头像（两处同步）
  loadAvatar();
}

/* ===== 头像上传（本地上传 → 圆形裁剪 → base64存储） ===== */
function loadAvatar(){
  const data = load(KEYS.avatar, '');
  // 开始今天页
  const img = $('startAvatarImg');
  const fallback = $('startAvatarFallback');
  if(data){
    img.src = data;
    img.classList.remove('hidden');
    fallback.classList.add('hidden');
  } else {
    img.classList.add('hidden');
    fallback.classList.remove('hidden');
  }
  // 我的页
  const meImg = $('meAvatarImg');
  const meFallback = $('meAvatarFallback');
  if(data){
    meImg.src = data;
    meImg.classList.remove('hidden');
    meFallback.classList.add('hidden');
  } else {
    meImg.classList.add('hidden');
    meFallback.classList.remove('hidden');
  }
  // 闲话铺头像
  const chatImg=$('chatAvatarImg'),chatFallback=$('chatAvatarFallback');
  if(chatImg&&chatFallback){
    if(data){chatImg.src=data;chatImg.classList.remove('hidden');chatFallback.classList.add('hidden');}
    else{chatImg.classList.add('hidden');chatFallback.classList.remove('hidden');chatFallback.textContent=getNick().slice(0,1);}
  }
  // 左侧功能抽屉头像与昵称
  const drawerImg=$('drawerAvatarImg'),drawerFallback=$('drawerAvatarFallback');
  if(drawerImg&&drawerFallback){if(data){drawerImg.src=data;drawerImg.classList.remove('hidden');drawerFallback.classList.add('hidden');}else{drawerImg.classList.add('hidden');drawerFallback.classList.remove('hidden');drawerFallback.textContent=getNick().slice(0,1);}}
  if($('drawerNick'))$('drawerNick').textContent=getNick();
  // 日记时间流和设置页共用同一张头像。
  if($('diaryFeed')) renderDiary();
}
let cropSource=null,cropBaseScale=1,cropZoom=1,cropOffsetX=0,cropOffsetY=0,cropDragging=false,cropLastX=0,cropLastY=0;
function handleAvatarUpload(file){
  if(!file.type.startsWith('image/')){ showToast('请选择图片文件哦'); return; }
  if(file.size > 10*1024*1024){ showToast('图片太大了，选10MB以内的吧'); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    const img = new Image();
    img.onload = () => {
      cropSource=img;cropZoom=1;cropOffsetX=0;cropOffsetY=0;$('avatarCropZoom').value=1;
      $('avatarCropMask').classList.remove('hidden');
      requestAnimationFrame(()=>{const size=$('avatarCropStage').clientWidth;cropBaseScale=Math.max(size/img.naturalWidth,size/img.naturalHeight);updateCropView();});
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}
function updateCropView(){
  if(!cropSource)return;const size=$('avatarCropStage').clientWidth,scale=cropBaseScale*cropZoom,w=cropSource.naturalWidth*scale,h=cropSource.naturalHeight*scale;
  const maxX=Math.max(0,(w-size)/2),maxY=Math.max(0,(h-size)/2);cropOffsetX=Math.max(-maxX,Math.min(maxX,cropOffsetX));cropOffsetY=Math.max(-maxY,Math.min(maxY,cropOffsetY));
  const img=$('avatarCropImage');img.src=cropSource.src;img.style.width=w+'px';img.style.height=h+'px';img.style.left=((size-w)/2+cropOffsetX)+'px';img.style.top=((size-h)/2+cropOffsetY)+'px';
}
function closeAvatarCrop(){cropSource=null;$('avatarCropMask').classList.add('hidden');}
$('avatarCropZoom')?.addEventListener('input',e=>{cropZoom=Number(e.target.value);updateCropView();});
$('avatarCropStage')?.addEventListener('pointerdown',e=>{cropDragging=true;cropLastX=e.clientX;cropLastY=e.clientY;e.currentTarget.setPointerCapture(e.pointerId);});
$('avatarCropStage')?.addEventListener('pointermove',e=>{if(!cropDragging)return;cropOffsetX+=e.clientX-cropLastX;cropOffsetY+=e.clientY-cropLastY;cropLastX=e.clientX;cropLastY=e.clientY;updateCropView();});
$('avatarCropStage')?.addEventListener('pointerup',()=>{cropDragging=false;});
$('avatarCropStage')?.addEventListener('pointercancel',()=>{cropDragging=false;});
$('avatarCropClose')?.addEventListener('click',closeAvatarCrop);$('avatarCropCancel')?.addEventListener('click',closeAvatarCrop);
$('avatarCropSave')?.addEventListener('click',()=>{
  if(!cropSource)return;const stage=$('avatarCropStage'),size=stage.clientWidth,imgEl=$('avatarCropImage'),out=400,k=out/size,c=document.createElement('canvas');c.width=out;c.height=out;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,out,out);ctx.drawImage(cropSource,parseFloat(imgEl.style.left)*k,parseFloat(imgEl.style.top)*k,parseFloat(imgEl.style.width)*k,parseFloat(imgEl.style.height)*k);save(KEYS.avatar,c.toDataURL('image/jpeg',.9));closeAvatarCrop();loadAvatar();showToast('头像已裁剪并同步 ✨');
});
// 开始今天页头像点击
$('startAvatarWrap')?.addEventListener('click', () => { $('avatarInput').click(); });
$('avatarInput')?.addEventListener('change', e => {
  const file = e.target.files[0]; if(!file) return;
  handleAvatarUpload(file);
  e.target.value = '';
});
// 我的页头像点击
$('meAvatarWrap')?.addEventListener('click', () => { $('meAvatarInput').click(); });
$('avatarEditBtn')?.addEventListener('click', () => { $('meAvatarInput').click(); });
$('meAvatarInput')?.addEventListener('change', e => {
  const file = e.target.files[0]; if(!file) return;
  handleAvatarUpload(file);
  e.target.value = '';
});
function initChat(){
  // 闲话铺属于「进入后」的页面 → 用昵称称呼
  const n=getNick();
  $('chatGreet').textContent=pickRandom([`嗨，${n}`,`${n}，我在呢`,`欢迎回来，${n} ✨`,`${n}，想聊点什么？`]);
  $('chatEncourage').textContent=pickRandom(ENCOURAGES);
  $('chatFlatter').textContent=pickRandom(FLATTERS);
  renderChatMsgs();
}
function renderChatMsgs(){
  const area=$('chatArea');
  area.innerHTML='<div class="chat-msg bot"><div class="msg-bubble">嗨～我是你的工作台小助手 💡 可以帮你记录灵感、管理任务、提醒习惯、或者只是聊聊天～有什么想说的尽管告诉我！</div></div>';
  chatMsgs.forEach(m=>{
    area.innerHTML+=`<div class="chat-msg ${m.role}"><div class="msg-bubble">${esc(m.text)}</div></div>`;
  });
  area.scrollTop=area.scrollHeight;
}

$('startDayBtn')?.addEventListener('click',()=>{
  switchTab('checkin');
});

/* ===== 昵称设置（只影响进入后的页面：首页问候 / 我的页） ===== */
const nickInput = $('nickInput');
if(nickInput){
  // 加载当前昵称到输入框
  nickInput.value = getNick();
}
$('nickSaveBtn')?.addEventListener('click',()=>{
  const v = (nickInput.value||'').trim();
  if(!v){ showToast('昵称不能为空哦'); return; }
  save(KEYS.nickname, v);
  $('meName').textContent = v;
  if($('drawerNick'))$('drawerNick').textContent=v;
  tick();  // 刷新首页问候语
  showToast('昵称已更新 ✨');
});
$('nickInput')?.addEventListener('keydown', e => { if(e.key==='Enter') $('nickSaveBtn').click(); });

/* ===== 生命档案 ===== */
function dateAtMidnight(ds){const [y,m,d]=(ds||'').split('-').map(Number);return y?new Date(y,m-1,d):null;}
function earthDays(ds,at=new Date()){
  const born=dateAtMidnight(ds);if(!born)return 0;
  const now=new Date(at.getFullYear(),at.getMonth(),at.getDate());
  return Math.max(1,Math.floor((now-born)/86400000)+1);
}
function zodiac(ds){
  const d=dateAtMidnight(ds);if(!d)return'';const md=(d.getMonth()+1)*100+d.getDate();
  const z=[[120,'摩羯座'],[219,'水瓶座'],[321,'双鱼座'],[420,'白羊座'],[521,'金牛座'],[622,'双子座'],[723,'巨蟹座'],[823,'狮子座'],[923,'处女座'],[1024,'天秤座'],[1123,'天蝎座'],[1222,'射手座'],[1232,'摩羯座']];
  return z.find(([end])=>md<end)?.[1]||'摩羯座';
}
function birthdayCountdown(ds){
  const b=dateAtMidnight(ds);if(!b)return 0;const now=new Date();now.setHours(0,0,0,0);
  let next=new Date(now.getFullYear(),b.getMonth(),b.getDate());if(next<now)next.setFullYear(next.getFullYear()+1);
  return Math.round((next-now)/86400000);
}
function renderLifeProfile(){
  if($('birthDate'))$('birthDate').value=lifeProfile.birthDate||'';
  if($('birthTime'))$('birthTime').value=lifeProfile.birthTime||'';
  if($('birthCity'))$('birthCity').value=lifeProfile.birthCity||'';
  const box=$('lifeStats');if(!box)return;
  if(!lifeProfile.birthDate){box.classList.add('hidden');return;}
  box.classList.remove('hidden');
  box.innerHTML=`<div><b>${earthDays(lifeProfile.birthDate).toLocaleString()}</b><span>来到地球的天数</span></div><div><b>${zodiac(lifeProfile.birthDate)}</b><span>你的星座</span></div><div><b>${birthdayCountdown(lifeProfile.birthDate)}</b><span>距离下次生日</span></div>`;
}
$('saveLifeBtn')?.addEventListener('click',()=>{
  const birthDate=$('birthDate').value;if(!birthDate){showToast('先选择出生日期吧');return;}
  if(dateAtMidnight(birthDate)>new Date()){showToast('出生日期不能在未来哦');return;}
  lifeProfile={birthDate,birthTime:$('birthTime').value,birthCity:$('birthCity').value.trim()};
  save(KEYS.lifeProfile,lifeProfile);renderLifeProfile();renderDiary();showToast('生命档案已保存 🌍');
});

/* ===== 我的星球：私密朋友圈式日记 ===== */
let diaryPendingFiles=[];
$('diaryMediaBtn')?.addEventListener('click',()=>$('diaryMediaFile')?.click());
$('diaryMediaFile')?.addEventListener('change',e=>{
  const files=[...(e.target.files||[])];const videos=files.filter(f=>f.type.startsWith('video/'));
  if(videos.length){diaryPendingFiles=[videos[0]];showToast('视频日记每篇可上传 1 段');}
  else diaryPendingFiles=files.filter(f=>f.type.startsWith('image/')).slice(0,9);
  $('diaryMediaStatus').textContent=diaryPendingFiles.length?`已选择 ${diaryPendingFiles.length} 个文件`:'最多 9 张图片或 1 段视频';
});
function canvasBlob(canvas){return new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('card')),'image/png'));}
function wrapCanvasText(ctx,text,maxWidth){
  const lines=[];(text||'').split(/\n/).forEach(paragraph=>{if(!paragraph){lines.push('');return;}let line='';for(const ch of paragraph){const test=line+ch;if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=ch;}else line=test;}if(line)lines.push(line);});return lines;
}
async function createDiaryTextCard(text,style,fontSize=46,post=null,options={}){
  const c=document.createElement('canvas');c.width=1080;const ctx=c.getContext('2d'),primary=getComputedStyle(document.documentElement).getPropertyValue('--primary').trim()||'#9cae9f';
  ctx.font=`500 ${fontSize}px "Microsoft YaHei",sans-serif`;const allLines=wrapCanvasText(ctx,text,830),lineHeight=Math.round(fontSize*1.65),lines=allLines.slice(0,28);c.height=Math.max(500,Math.min(1900,390+lines.length*lineHeight));
  if(style==='mono'){ctx.fillStyle='#F7F7F3';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='#1F2220';ctx.fillRect(82,82,8,c.height-164);}
  else if(style==='dot'){ctx.fillStyle='#FAF5EC';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(83,72,61,.14)';for(let y=36;y<c.height;y+=42)for(let x=36;x<c.width;x+=42){ctx.beginPath();ctx.arc(x,y,3,0,Math.PI*2);ctx.fill();}ctx.fillStyle='rgba(255,255,255,.9)';ctx.roundRect(75,70,930,c.height-140,34);ctx.fill();}
  else if(style==='sakura'){const g=ctx.createLinearGradient(0,0,c.width,c.height);g.addColorStop(0,'#FFF8FA');g.addColorStop(1,'#F5DDE6');ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(215,126,157,.13)';for(const [x,y,r] of [[930,80,190],[110,c.height-60,150],[1030,c.height*.62,90]]){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}}
  else if(style==='sage'){ctx.fillStyle='#E9EFE8';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(91,116,96,.09)';ctx.fillRect(70,70,940,c.height-140);ctx.strokeStyle='rgba(91,116,96,.2)';ctx.lineWidth=2;ctx.strokeRect(88,88,904,c.height-176);}
  else if(style==='night'){const g=ctx.createLinearGradient(0,0,c.width,c.height);g.addColorStop(0,'#252A43');g.addColorStop(1,'#565277');ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(255,255,255,.32)';for(let i=0;i<60;i++){ctx.beginPath();ctx.arc((i*173)%1080,(i*97)%c.height,i%4===0?2.5:1.3,0,Math.PI*2);ctx.fill();}}
  else if(style==='paper'){ctx.fillStyle='#F2E7D2';ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='rgba(104,82,56,.12)';for(let y=250;y<c.height-120;y+=72){ctx.beginPath();ctx.moveTo(95,y);ctx.lineTo(985,y);ctx.stroke();}ctx.fillStyle='rgba(139,55,42,.7)';ctx.fillRect(98,0,2,c.height);}
  else if(style==='gingham'){ctx.fillStyle='#F6F4EF';ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle='rgba(112,145,129,.08)';for(let x=0;x<c.width;x+=72)ctx.fillRect(x,0,28,c.height);for(let y=0;y<c.height;y+=72)ctx.fillRect(0,y,c.width,28);ctx.fillStyle='rgba(255,255,255,.82)';ctx.roundRect(80,70,920,c.height-140,26);ctx.fill();}
  else{const g=ctx.createLinearGradient(0,0,c.width,c.height);g.addColorStop(0,'#FFFDF8');g.addColorStop(1,'#F1EEE5');ctx.fillStyle=g;ctx.fillRect(0,0,c.width,c.height);ctx.fillStyle=primary;ctx.globalAlpha=.13;ctx.beginPath();ctx.arc(950,120,210,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}
  const dark=style==='night',textColor=dark?'#F4F1F8':style==='paper'?'#493C30':'#444A46',muted=dark?'rgba(235,232,245,.65)':'#969B97',now=post?new Date(post.time):new Date(),title=options.title||'',author=options.author||'',footer=options.footer||'';
  ctx.fillStyle=textColor;ctx.font='700 30px sans-serif';if(title)ctx.fillText(title,125,135);ctx.fillStyle=muted;ctx.font='24px sans-serif';const meta=[options.showDate!==false?`${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`:'',author].filter(Boolean).join('  ·  ');if(meta)ctx.fillText(meta,125,185);
  ctx.fillStyle=textColor;ctx.font=`500 ${fontSize}px "Microsoft YaHei",sans-serif`;let y=285;for(const line of lines){ctx.fillText(line,125,y);y+=lineHeight;}if(allLines.length>28)ctx.fillText('……',125,y);
  const footerY=c.height-95;ctx.strokeStyle=dark?'rgba(255,255,255,.18)':'rgba(100,105,101,.16)';ctx.beginPath();ctx.moveTo(125,footerY-45);ctx.lineTo(955,footerY-45);ctx.stroke();ctx.fillStyle=muted;ctx.font='24px sans-serif';const fixedEarthDay=post?.earthDay||((post&&lifeProfile.birthDate)?earthDays(lifeProfile.birthDate,new Date(post.time)):0),earth=fixedEarthDay?`来到地球的第 ${Number(fixedEarthDay).toLocaleString()} 天`:'尚未设置出生日期';ctx.fillText(earth,125,footerY);ctx.textAlign='right';if(footer)ctx.fillText(footer,955,footerY);return canvasBlob(c);
}
let textCardPost=null,textCardBlob=null,textCardPreviewUrl='';
async function updateTextCardPreview(){
  if(!textCardPost)return;$('textCardFontValue').textContent=$('textCardFontSize').value;
  try{const opts={title:$('textCardTitle').value.trim(),author:$('textCardAuthor').value.trim(),footer:$('textCardFooter').value.trim(),showDate:$('textCardShowDate').checked},blob=await createDiaryTextCard(textCardPost.text,$('textCardStyle').value,Number($('textCardFontSize').value),textCardPost,opts);if(textCardPreviewUrl)URL.revokeObjectURL(textCardPreviewUrl);textCardBlob=blob;textCardPreviewUrl=URL.createObjectURL(blob);$('textCardPreviewImg').src=textCardPreviewUrl;}catch(e){showToast('预览生成失败');}
}
function openTextCardPreview(post){textCardPost=post;const len=post.text.length,autoSize=len<12?62:len<45?52:len<120?44:36;$('textCardFontSize').value=autoSize;$('textCardStyle').value='cream';$('textCardTitle').value='MY LITTLE PLANET';$('textCardAuthor').value=getNick();$('textCardFooter').value='PRIVATE DIARY ✦';$('textCardShowDate').checked=true;$('textCardMask').classList.remove('hidden');updateTextCardPreview();}
function closeTextCardPreview(){textCardPost=null;textCardBlob=null;if(textCardPreviewUrl)URL.revokeObjectURL(textCardPreviewUrl);textCardPreviewUrl='';$('textCardMask').classList.add('hidden');}
['textCardStyle','textCardFontSize','textCardTitle','textCardAuthor','textCardFooter','textCardShowDate'].forEach(id=>$(id)?.addEventListener(id==='textCardStyle'||id==='textCardShowDate'?'change':'input',updateTextCardPreview));$('textCardClose')?.addEventListener('click',closeTextCardPreview);$('textCardCancel')?.addEventListener('click',closeTextCardPreview);
$('textCardDownload')?.addEventListener('click',()=>{if(!textCardBlob||!textCardPost)return;const url=URL.createObjectURL(textCardBlob),a=document.createElement('a');a.href=url;a.download=`我的星球文案-${new Date(textCardPost.time).toISOString().slice(0,10)}.png`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('文案照片已保存到设备');});
$('publishDiaryBtn')?.addEventListener('click',async()=>{
  const text=$('diaryText').value.trim();if(!text&&!diaryPendingFiles.length){showToast('写点什么或添加一张照片吧');return;}
  const media=[];$('publishDiaryBtn').disabled=true;
  try{
    for(const file of diaryPendingFiles){
      if(file.size>150*1024*1024)throw new Error('文件太大');
      const id='diary_'+rid();await putMedia(id,file);media.push({id,type:file.type.startsWith('video/')?'video':'image'});
    }
    const now=new Date();
    diaryPosts.unshift({id:rid(),text,time:now.toISOString(),mood:$('diaryMood').value,location:$('diaryLocation').value.trim(),tags:$('diaryTags').value.trim().split(/\s+/).filter(Boolean),media,liked:false,comment:'',earthDay:lifeProfile.birthDate?earthDays(lifeProfile.birthDate,now):0});
    save(KEYS.diaryPosts,diaryPosts);$('diaryText').value='';$('diaryLocation').value='';$('diaryTags').value='';diaryPendingFiles=[];$('diaryMediaFile').value='';$('diaryMediaStatus').textContent='最多 9 张图片或 1 段视频';
    renderDiary();showToast('已发布到我的星球 ✦');
  }catch(e){showToast(e.message==='文件太大'?'文件请控制在 150MB 以内':'媒体保存失败，请重试');}
  finally{$('publishDiaryBtn').disabled=false;}
});
function renderDiary(){
  const feed=$('diaryFeed');if(!feed)return;
  const diaryAvatar=load(KEYS.avatar,'');
  $('diaryCount').textContent=`${diaryPosts.length} 篇`;
  $('diaryEarthDay').textContent=lifeProfile.birthDate?`今天是来到地球的第 ${earthDays(lifeProfile.birthDate).toLocaleString()} 天`:'在设置中填写生日，开启生命天数';
  if(!diaryPosts.length){feed.innerHTML='<div class="diary-empty"><span>🌱</span><b>星球上还没有动态</b><p>发布第一篇日记，收藏今天的小事吧。</p></div>';return;}
  feed.innerHTML=diaryPosts.map(p=>{
    const d=new Date(p.time);const tags=(p.tags||[]).map(t=>`<span>#${esc(t.replace(/^#/,''))}</span>`).join('');
    return `<article class="diary-post" data-post="${p.id}"><header><div class="diary-avatar">${diaryAvatar?`<img src="${diaryAvatar}" alt="我的头像">`:esc(getNick().slice(0,1))}</div><div><b>${esc(getNick())}</b><small>${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日 · ${WEEK[d.getDay()]}${p.location?' · '+esc(p.location):''}</small></div><button data-diary-act="delete">•••</button></header>${p.earthDay?`<p class="earth-badge">🌍 来到地球的第 ${Number(p.earthDay).toLocaleString()} 天</p>`:''}<p class="diary-content">${esc(p.text)}</p><div class="diary-media ${p.media?.length>1?'multi':''}" data-media-for="${p.id}"></div><div class="diary-tags">${tags}</div><footer><span>${esc(p.mood||'🌿 平静')}</span>${p.text?'<button data-diary-act="generate">🖼 生成照片</button>':''}<button data-diary-act="like" class="${p.liked?'liked':''}">♡ ${p.liked?'已珍藏':'珍藏'}</button><button data-diary-act="comment">💬 ${p.comment?'查看留言':'写给未来'}</button></footer>${p.comment?`<div class="future-comment">未来留言：${esc(p.comment)}</div>`:''}</article>`;
  }).join('');
  diaryPosts.forEach(p=>fillDiaryMedia(p));
}
async function fillDiaryMedia(post){
  const box=document.querySelector(`[data-media-for="${post.id}"]`);if(!box||!post.media?.length)return;
  for(const m of post.media){
    try{const blob=await getMedia(m.id);if(!blob)continue;const url=URL.createObjectURL(blob);if(m.type==='video')box.insertAdjacentHTML('beforeend',`<video controls preload="metadata" src="${url}"></video>`);else if(m.generated)box.insertAdjacentHTML('beforeend',`<div class="text-card-media"><img src="${url}" alt="文案照片"><button data-download-card="${m.id}">↓ 保存到设备</button></div>`);else box.insertAdjacentHTML('beforeend',`<img src="${url}" alt="日记图片">`);}catch(e){}
  }
}
$('diaryFeed')?.addEventListener('click',async e=>{
  const download=e.target.closest('[data-download-card]');
  if(download){try{const blob=await getMedia(download.dataset.downloadCard);if(!blob)throw new Error();const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`我的星球文案-${todayStr()}.png`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('文案照片已保存到下载文件');}catch(err){showToast('照片保存失败，请重试');}return;}
  const act=e.target.closest('[data-diary-act]')?.dataset.diaryAct;if(!act)return;
  const row=e.target.closest('[data-post]');const post=diaryPosts.find(p=>String(p.id)===row.dataset.post);if(!post)return;
  if(act==='generate'){
    openTextCardPreview(post);
    return;
  }
  if(act==='like')post.liked=!post.liked;
  if(act==='comment'){const val=prompt('写一句话给未来的自己：',post.comment||'');if(val!==null)post.comment=val.trim();}
  if(act==='delete'&&confirm('确定删除这篇日记吗？')){for(const m of post.media||[])await delMedia(m.id);diaryPosts=diaryPosts.filter(p=>String(p.id)!==row.dataset.post);}
  save(KEYS.diaryPosts,diaryPosts);renderDiary();
});

/* ===== 电子木鱼 ===== */
/* ===== 学习中心：课程表、批量导入与作业截止 ===== */
const STUDY_DAY_NAMES=['周日','周一','周二','周三','周四','周五','周六'];
function todayCourses(){return courses.filter(c=>Number(c.day)===new Date().getDay()).sort((a,b)=>hm2min(a.start)-hm2min(b.start));}
function renderStudy(){
  const today=todayCourses();
  if($('studyTodaySub'))$('studyTodaySub').textContent=`${STUDY_DAY_NAMES[new Date().getDay()]} · ${today.length?`今天有 ${today.length} 节课`:'今天没有课程'}`;
  if($('studyTodayCount'))$('studyTodayCount').textContent=`${today.length} 节`;
  if($('studyTodayList'))$('studyTodayList').innerHTML=today.length?today.map(c=>`<div class="study-course-now"><span class="study-course-dot">🎓</span><div><b>${esc(c.name)}</b><small>${esc(c.start)}-${esc(c.end)}${c.location?' · '+esc(c.location):''}</small></div><span>${courseTimeState(c)}</span></div>`).join(''):'<div class="study-empty">今天没有排课，留一点时间给自己吧 ☁️</div>';
  renderTimetable();renderAssignments();renderFocus();renderWeeklyReport();
}
function courseTimeState(c){const n=nowMinutes(),s=hm2min(c.start),e=hm2min(c.end);return n<s?`还有 ${Math.max(1,Math.ceil((s-n)/60))} 小时`:n<=e?'上课中':'可补记';}
function renderTimetable(){
  const box=$('timetable');if(!box)return;
  box.innerHTML=[1,2,3,4,5,6,0].map(day=>{const list=courses.filter(c=>Number(c.day)===day).sort((a,b)=>hm2min(a.start)-hm2min(b.start));return `<div class="tt-day"><div class="tt-day-name"><b>${STUDY_DAY_NAMES[day]}</b><small>${list.length}节</small></div><div class="tt-courses">${list.length?list.map(c=>`<div class="tt-course" data-course-id="${c.id}"><i></i><div><b>${esc(c.name)}</b><small>${esc(c.start)}-${esc(c.end)}${c.location?' · '+esc(c.location):''}</small></div><button data-course-delete="${c.id}">×</button></div>`).join(''):'<span class="tt-rest">没有课程</span>'}</div></div>`;}).join('');
}
function parseCourseLines(text){
  const dayMap={'日':0,'天':0,'一':1,'二':2,'三':3,'四':4,'五':5,'六':6};
  const out=[];
  String(text).split(/\n+/).map(x=>x.trim()).filter(Boolean).forEach(line=>{
    const dayMatch=line.match(/(?:周|星期)\s*([一二三四五六日天])/),timeMatch=line.match(/([01]?\d|2[0-3]):([0-5]\d)\s*[-—~至]\s*([01]?\d|2[0-3]):([0-5]\d)/);
    if(!dayMatch||!timeMatch)return;
    const location=(line.match(/[@＠]\s*(.+)$/)||[])[1]||'';
    let name=line.replace(dayMatch[0],'').replace(timeMatch[0],'').replace(/[@＠].*$/,'').replace(/[|｜,，]+/g,' ').trim();
    if(name)out.push({id:rid(),name,day:dayMap[dayMatch[1]],start:`${timeMatch[1].padStart(2,'0')}:${timeMatch[2]}`,end:`${timeMatch[3].padStart(2,'0')}:${timeMatch[4]}`,location:location.trim()});
  });
  return out;
}
function importCoursesFromText(text){const found=parseCourseLines(text);if(!found.length){showToast('没有识别到课程，请按示例格式检查');return 0;}courses=[...courses,...found];save(KEYS.courses,courses);renderStudy();showToast(`已导入 ${found.length} 节课程，可在下方检查`);return found.length;}
$('courseTextToggle')?.addEventListener('click',()=>$('courseTextImport')?.classList.toggle('hidden'));
$('courseParseBtn')?.addEventListener('click',()=>{if(importCoursesFromText($('courseImportText').value))$('courseImportText').value='';});
$('courseImageBtn')?.addEventListener('click',()=>$('courseImageFile')?.click());
$('courseImageFile')?.addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;const url=URL.createObjectURL(file),preview=$('courseImagePreview');preview.classList.remove('hidden');preview.innerHTML=`<img src="${url}" alt="课表截图"><div><b>正在本地识别…</b><small>图片只在当前设备处理</small></div>`;
  if('TextDetector' in window){
    try{const bitmap=await createImageBitmap(file),blocks=await new TextDetector().detect(bitmap),text=blocks.map(x=>x.rawValue).join('\n');$('courseTextImport').classList.remove('hidden');$('courseImportText').value=text;preview.querySelector('b').textContent='识别完成，请检查后导入';preview.querySelector('small').textContent='已放入下方文本框';}
    catch(err){preview.querySelector('b').textContent='当前浏览器未能识别';preview.querySelector('small').textContent='可在下方一次粘贴整张课表文字';}
  }else{preview.querySelector('b').textContent='当前浏览器不支持本地图片识别';preview.querySelector('small').textContent='可使用下方批量粘贴，不需要逐门添加';$('courseTextImport').classList.remove('hidden');}
});
$('courseAddToggle')?.addEventListener('click',()=>$('courseEditor')?.classList.toggle('hidden'));
$('courseSaveBtn')?.addEventListener('click',()=>{const name=$('courseName').value.trim();if(!name){showToast('请填写课程名称');return;}courses.push({id:rid(),name,day:Number($('courseDay').value),start:$('courseStart').value||'08:00',end:$('courseEnd').value||'09:40',location:$('courseLocation').value.trim()});save(KEYS.courses,courses);$('courseName').value='';$('courseLocation').value='';renderStudy();showToast('课程已保存');});
$('timetable')?.addEventListener('click',e=>{const id=e.target.dataset.courseDelete;if(!id)return;courses=courses.filter(c=>String(c.id)!==id);save(KEYS.courses,courses);renderStudy();renderCheckin();});
function focusMinutesFor(ds){return focusLog.filter(x=>x.date===ds).reduce((s,x)=>s+(Number(x.minutes)||0),0);}
function focusElapsedMs(){if(!focusSession)return 0;return Number(focusSession.elapsedMs||0)+(focusSession.running?Math.max(0,Date.now()-Number(focusSession.runningSince||Date.now())):0);}
const FOCUS_ENCOURAGES=['慢慢来，把这一小段时间留给自己。','不用追求完美，只需要继续往前一点点。','此刻只做这一件事，其他事情稍后再想。','你正在为未来的自己积累底气。','专注不是绷紧，是温柔地把注意力带回来。','再坚持一会儿，完成后的你会很开心。'];
let focusModeDismissed=false;
function populateFocusCourses(){const list=$('focusTopicOptions');if(!list)return;const names=[...new Set(courses.map(c=>c.name).filter(Boolean))];list.innerHTML='<option value="自主学习"></option>'+names.map(n=>`<option value="${esc(n)}"></option>`).join('');}
function renderFocusMode(left,total,elapsed){
  if(!$('focusMode')||!focusSession)return;const sec=Math.ceil(left/1000),time=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;$('focusModeTime').textContent=time;$('focusModeTopic').textContent=focusSession.course;$('focusModeState').textContent=focusSession.running?'正在专注':'已暂停，休息一下';$('focusModePause').textContent=focusSession.running?'暂停':'继续';$('focusModeRing').style.setProperty('--focus-pct',`${Math.min(360,elapsed/total*360)}deg`);$('focusEncourage').textContent=FOCUS_ENCOURAGES[Math.floor(elapsed/30000)%FOCUS_ENCOURAGES.length];if(!focusModeDismissed)$('focusMode').classList.remove('hidden');
}
function renderFocus(){
  if(!$('focusTime'))return;populateFocusCourses();const todayMin=focusMinutesFor(todayStr());$('focusTodayTotal').textContent=`今日 ${todayMin} 分钟`;
  if(focusSession){const total=focusSession.duration*60000,elapsed=focusElapsedMs(),left=Math.max(0,total-elapsed),sec=Math.ceil(left/1000);$('focusTime').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;$('focusState').textContent=focusSession.running?`${focusSession.course} · 专注中`:`${focusSession.course} · 已暂停`;$('focusStartBtn').textContent=focusSession.running?'暂停':'继续';$('focusFinishBtn').classList.remove('hidden');$('focusTopic').disabled=false;$('focusDuration').disabled=true;$('focusClock').style.setProperty('--focus-pct',`${Math.min(360,elapsed/total*360)}deg`);renderFocusMode(left,total,elapsed);if(left<=0)finishFocus(true);}
  else{$('focusTime').textContent=`${$('focusDuration').value.padStart(2,'0')}:00`;$('focusState').textContent='准备开始';$('focusStartBtn').textContent='开始专注';$('focusFinishBtn').classList.add('hidden');$('focusTopic').disabled=false;$('focusDuration').disabled=false;$('focusClock').style.setProperty('--focus-pct','0deg');$('focusMode')?.classList.add('hidden');}
  const recent=focusLog.filter(x=>x.date===todayStr()).slice(-3).reverse();$('focusRecent').innerHTML=recent.length?recent.map(x=>`<span>✓ ${esc(x.course)} · ${x.minutes}分钟</span>`).join(''):'<small>完成一次专注后，记录会出现在这里</small>';
}
function finishFocus(auto=false){if(!focusSession)return;const minutes=auto?focusSession.duration:Math.max(1,Math.round(focusElapsedMs()/60000));focusLog.push({id:rid(),date:todayStr(),course:focusSession.course,minutes,time:new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})});save(KEYS.focusLog,focusLog);focusSession=null;focusModeDismissed=false;save(KEYS.focusSession,focusSession);$('focusMode')?.classList.add('hidden');renderFocus();renderWeeklyReport();renderCheckin();showToast(auto?'本次专注完成啦 🎉':`已记录 ${minutes} 分钟专注`);}
$('focusDuration')?.addEventListener('change',renderFocus);
$('focusTopic')?.addEventListener('input',()=>{if(focusSession){focusSession.course=$('focusTopic').value.trim()||'自主学习';save(KEYS.focusSession,focusSession);}});
$('focusStartBtn')?.addEventListener('click',()=>{if(!focusSession){focusSession={course:$('focusTopic').value.trim()||'自主学习',duration:Number($('focusDuration').value)||25,elapsedMs:0,running:true,runningSince:Date.now()};focusModeDismissed=false;}else if(focusSession.running){focusSession.elapsedMs=focusElapsedMs();focusSession.running=false;focusSession.runningSince=0;}else{focusSession.running=true;focusSession.runningSince=Date.now();focusModeDismissed=false;}save(KEYS.focusSession,focusSession);renderFocus();});
$('focusFinishBtn')?.addEventListener('click',()=>finishFocus(false));
$('focusModeExit')?.addEventListener('click',()=>{focusModeDismissed=true;$('focusMode').classList.add('hidden');});
$('focusModePause')?.addEventListener('click',()=>{$('focusStartBtn').click();});
$('focusModeFinish')?.addEventListener('click',()=>finishFocus(false));
setInterval(()=>{if(focusSession)renderFocus();},1000);
function lastSevenDates(){const out=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);out.push(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`);}return out;}
function renderWeeklyReport(){
  const box=$('weeklyReportGrid');if(!box)return;const dates=lastSevenDates(),focusTotal=dates.reduce((s,d)=>s+focusMinutesFor(d),0),sportTotal=exerciseLog.filter(x=>dates.includes(x.date)).reduce((s,x)=>s+(Number(x.duration)||0),0),waterTotal=dates.reduce((s,d)=>s+waterDoneCount(d),0),dietDays=dates.filter(d=>mealLog.some(x=>x.date===d)).length;
  let habitDone=0,habitExpected=0;dates.forEach(ds=>{const d=new Date(ds+'T12:00:00'),scheduled=habits.filter(h=>(h.days||[0,1,2,3,4,5,6]).includes(d.getDay()));habitExpected+=scheduled.length;habitDone+=scheduled.filter(h=>(habitLog[ds]||{})[h.id]).length;});
  const taskWeek=tasks.filter(t=>t.completedAt&&dates.includes(t.completedAt)).length,readingPages=readingNotes.filter(n=>dates.includes(n.date)).reduce((s,n)=>s+(Number(n.pagesRead)||0),0),knowledgeWeek=knowledgeItems.filter(x=>dates.includes(x.date)).length,scores=[habitExpected?habitDone/habitExpected:1,waterTotal/(waterPlan.length*7),Math.min(1,focusTotal/(25*7)),Math.min(1,sportTotal/150),dietDays/7],score=Math.round(scores.reduce((s,n)=>s+Math.min(1,n),0)/scores.length*100);$('weeklyReportScore').textContent=score+'%';
  box.innerHTML=`<div><b>${focusTotal}</b><span>专注分钟</span></div><div><b>${readingPages}</b><span>阅读页数</span></div><div><b>${knowledgeWeek}</b><span>新增知识</span></div><div><b>${sportTotal}</b><span>运动分钟</span></div><div><b>${waterTotal}</b><span>喝水杯数</span></div><div><b>${taskWeek}</b><span>完成任务</span></div><div><b>${dietDays}</b><span>饮食记录天</span></div><div><b>${habitDone}/${habitExpected}</b><span>生活目标</span></div>`;
  const max=Math.max(25,...dates.map(focusMinutesFor));$('studyWeekChart').innerHTML=dates.map(ds=>{const m=focusMinutesFor(ds),d=new Date(ds+'T12:00:00');return `<div><b>${m}</b><i><em style="height:${Math.max(4,m/max*100)}%"></em></i><small>${['日','一','二','三','四','五','六'][d.getDay()]}</small></div>`}).join('');
  $('weeklyReportNote').textContent=score>=80?'这周状态很稳，学习和生活都有认真照顾到 ✨':score>=50?'这周正在慢慢积累，再完成一次专注就更好啦。':'不用一次做满，从今天的一次 25 分钟专注开始。';
}
function renderAssignments(){const box=$('assignmentList');if(!box)return;const now=Date.now(),sorted=[...assignments].sort((a,b)=>new Date(a.due)-new Date(b.due)),pending=assignments.filter(x=>!x.done).length;$('assignmentPending').textContent=`${pending} 待完成`;box.innerHTML=sorted.length?sorted.map(a=>{const left=new Date(a.due)-now,urgent=!a.done&&left>0&&left<48*3600000,overdue=!a.done&&left<0;return `<div class="assignment-row ${a.done?'done':''} ${urgent?'urgent':''} ${overdue?'overdue':''}" data-assignment="${a.id}"><button data-assignment-act="toggle">${a.done?'✓':''}</button><div><b>${esc(a.name)}</b><small>${formatDue(a.due)} · ${a.done?'已完成':overdue?'已截止':urgent?'即将截止':'进行中'}</small></div><button data-assignment-act="delete">×</button></div>`}).join(''):'<div class="study-empty">暂时没有作业或考试安排 ✨</div>';}
function formatDue(v){const d=new Date(v);return Number.isNaN(d.getTime())?'未设时间':`${d.getMonth()+1}月${d.getDate()}日 ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;}
$('assignmentAddBtn')?.addEventListener('click',()=>{const name=$('assignmentName').value.trim(),due=$('assignmentDue').value;if(!name||!due){showToast('请填写任务和截止时间');return;}assignments.push({id:rid(),name,due,done:false});save(KEYS.assignments,assignments);$('assignmentName').value='';renderAssignments();showToast('截止提醒已添加');});
$('assignmentList')?.addEventListener('click',e=>{const act=e.target.dataset.assignmentAct;if(!act)return;const row=e.target.closest('[data-assignment]'),id=row.dataset.assignment;if(act==='delete')assignments=assignments.filter(a=>String(a.id)!==id);else{const a=assignments.find(a=>String(a.id)===id);if(a)a.done=!a.done;}save(KEYS.assignments,assignments);renderAssignments();});

/* ===== 今日打卡与减脂计划 ===== */
function renderCheckin(){
  const list=$('habitList');if(!list)return;const ds=todayStr(),doneMap=habitLog[ds]||{};
  const d=new Date();$('checkinDate').textContent=`${d.getMonth()+1}月${d.getDate()}日 · ${WEEK[d.getDay()]} · 今天需要做什么`;
  const todayHabits=habits.filter(h=>(h.days||[0,1,2,3,4,5,6]).includes(d.getDay()));
  list.innerHTML=todayHabits.length?todayHabits.map(h=>`<div class="habit-item ${doneMap[h.id]?'done':''}" data-habit="${h.id}"><button class="habit-check" data-habit-act="toggle">${doneMap[h.id]?'✓':''}</button><span class="habit-icon">${h.icon||'✨'}</span><div><b>${esc(h.name)}</b><small>${esc(h.time||'随时')}</small></div><button class="habit-del" data-habit-act="delete">×</button></div>`).join(''):'<p class="tip-text">今天没有安排目标，去目标中心添加吧～</p>';
  const habitDone=todayHabits.filter(h=>doneMap[h.id]).length,waterDone=waterDoneCount(ds),todayTasks=tasks.filter(t=>(t.period||'today')==='today'),doneTasks=todayTasks.filter(t=>t.done).length,sportMin=exerciseLog.filter(x=>x.date===ds).reduce((s,x)=>s+(Number(x.duration)||0),0),readDone=readLastDate===ds,todayMeals=mealLog.filter(x=>x.date===ds).length,focusMin=focusMinutesFor(ds);
  const modules=[{name:'生活',score:todayHabits.length?habitDone/todayHabits.length:1},{name:'任务',score:todayTasks.length?doneTasks/todayTasks.length:1},{name:'喝水',score:waterDone/waterPlan.length},{name:'运动',score:sportMin>0?1:0},{name:'阅读',score:readDone?1:0},{name:'饮食',score:todayMeals>0?1:0},{name:'专注',score:Math.min(1,focusMin/25)}],pct=Math.round(modules.reduce((s,x)=>s+x.score,0)/modules.length*100);
  $('habitProgress').textContent=`${habitDone} / ${todayHabits.length}`;$('checkinRing').style.setProperty('--pct',pct*3.6+'deg');$('checkinRing').querySelector('span').textContent=pct+'%';$('checkinRing').title=modules.map(x=>`${x.name} ${Math.round(x.score*100)}%`).join(' · ');
  const moduleIcons={生活:'🌤️',任务:'📋',喝水:'💧',运动:'🏃',阅读:'📖',饮食:'🥣',专注:'⏳'};
  if($('checkinBreakdown'))$('checkinBreakdown').innerHTML=modules.map(x=>`<div><span>${moduleIcons[x.name]||'✨'} ${x.name}</span><b>${Math.round(x.score*100)}%</b><i><em style="width:${Math.round(x.score*100)}%"></em></i></div>`).join('');
  $('checkinDate').textContent=`${d.getMonth()+1}月${d.getDate()}日 · ${WEEK[d.getDay()]} · 7项综合进度`;
  $('ciTaskProgress').textContent=`${doneTasks}/${todayTasks.length}`;$('ciWaterProgress').textContent=`${waterDone}/${waterPlan.length}`;
  $('ciSportProgress').textContent=sportMin+'min';$('ciReadProgress').textContent=readDone?'已打卡':'未打卡';$('ciDietProgress').textContent=todayMeals+'餐';$('ciFocusProgress').textContent=focusMin+'min';
  renderFatPlan();
}
$('habitList')?.addEventListener('click',e=>{
  const act=e.target.closest('[data-habit-act]')?.dataset.habitAct;if(!act)return;const row=e.target.closest('[data-habit]'),id=row.dataset.habit,ds=todayStr();
  if(!habitLog[ds])habitLog[ds]={};
  if(act==='toggle'){habitLog[ds][id]=!habitLog[ds][id];if(!habitLog[ds][id])delete habitLog[ds][id];save(KEYS.habitLog,habitLog);}
  if(act==='delete'){habits=habits.filter(h=>String(h.id)!==id);delete habitLog[ds][id];save(KEYS.habits,habits);save(KEYS.habitLog,habitLog);}
  renderCheckin();
});
$('habitAddBtn')?.addEventListener('click',()=>{const name=$('habitNameInput').value.trim();if(!name){showToast('写下想坚持的习惯吧');return;}habits.push({id:rid(),icon:'✨',name,time:$('habitTimeInput').value||'随时',days:[0,1,2,3,4,5,6]});save(KEYS.habits,habits);$('habitNameInput').value='';$('habitTimeInput').value='';renderCheckin();showToast('已加入每天的生活清单');});
$('habitNameInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')$('habitAddBtn').click();});

/* ===== 目标中心：每日执行日、周目标与统计 ===== */
const GOAL_DAYS=[{v:1,t:'一'},{v:2,t:'二'},{v:3,t:'三'},{v:4,t:'四'},{v:5,t:'五'},{v:6,t:'六'},{v:0,t:'日'}];
function weekKey(date=new Date()){const d=new Date(date.getFullYear(),date.getMonth(),date.getDate()),day=d.getDay()||7;d.setDate(d.getDate()-day+1);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function renderGoalCenter(){renderDailyGoals();renderWeeklyGoals();renderGoalStats();}
function renderDailyGoals(){const box=$('goalDailyList');if(!box)return;box.innerHTML=habits.map(h=>`<div class="card goal-row" data-goal-daily="${h.id}"><div class="goal-row-head"><span>${h.icon||'✨'}</span><div><b>${esc(h.name)}</b><small>${esc(h.time||'随时')}</small></div><button data-goal-daily-act="delete">×</button></div><div class="day-picker">${GOAL_DAYS.map(d=>`<button class="${h.days.includes(d.v)?'active':''}" data-goal-day="${d.v}">${d.t}</button>`).join('')}</div></div>`).join('');}
$('goalDailyList')?.addEventListener('click',e=>{const row=e.target.closest('[data-goal-daily]');if(!row)return;const h=habits.find(x=>String(x.id)===row.dataset.goalDaily);if(!h)return;if(e.target.dataset.goalDailyAct==='delete'){habits=habits.filter(x=>String(x.id)!==row.dataset.goalDaily);}else if(e.target.dataset.goalDay!==undefined){const day=Number(e.target.dataset.goalDay);h.days=h.days.includes(day)?h.days.filter(x=>x!==day):[...h.days,day];}else return;save(KEYS.habits,habits);renderGoalCenter();renderCheckin();});
$('goalDailyAdd')?.addEventListener('click',()=>{const name=$('goalDailyName').value.trim();if(!name){showToast('写下每日目标名称');return;}habits.push({id:rid(),icon:'✨',name,time:$('goalDailyTime').value||'随时',days:[0,1,2,3,4,5,6]});save(KEYS.habits,habits);$('goalDailyName').value='';$('goalDailyTime').value='';renderGoalCenter();renderCheckin();});
$$('.goal-tabs button').forEach(btn=>btn.addEventListener('click',()=>{$$('.goal-tabs button').forEach(b=>b.classList.toggle('active',b===btn));$$('.goal-panel').forEach(p=>p.classList.remove('active'));$('goalPanel'+btn.dataset.goalTab[0].toUpperCase()+btn.dataset.goalTab.slice(1)).classList.add('active');if(btn.dataset.goalTab==='stats')renderGoalStats();}));
function renderWeeklyGoals(){const box=$('weeklyGoalList');if(!box)return;const wk=weekKey(),log=weeklyGoalLog[wk]||{};box.innerHTML=weeklyGoals.length?weeklyGoals.map(g=>{const count=Number(log[g.id])||0,pct=Math.min(100,Math.round(count/g.target*100));return `<div class="card weekly-row" data-weekly-goal="${g.id}"><div class="weekly-row-head"><div><b>${esc(g.name)}</b><small>${count} / ${g.target} ${esc(g.unit)}</small></div><button data-weekly-act="delete">×</button></div><div class="weekly-bar"><i style="width:${pct}%"></i></div><div class="weekly-controls"><button data-weekly-act="minus">−</button><span>${pct>=100?'本周已达成 🎉':'记录一次进度'}</span><button data-weekly-act="plus">＋</button></div></div>`}).join(''):'<div class="card"><p class="tip-text">还没有周目标，例如“每周运动3次”。</p></div>';}
$('goalWeeklyAdd')?.addEventListener('click',()=>{const name=$('goalWeeklyName').value.trim(),target=Number($('goalWeeklyTarget').value)||1,unit=$('goalWeeklyUnit').value.trim()||'次';if(!name){showToast('写下周目标名称');return;}weeklyGoals.push({id:rid(),name,target,unit});save(KEYS.weeklyGoals,weeklyGoals);$('goalWeeklyName').value='';renderGoalCenter();});
$('weeklyGoalList')?.addEventListener('click',e=>{const act=e.target.dataset.weeklyAct;if(!act)return;const row=e.target.closest('[data-weekly-goal]'),id=row.dataset.weeklyGoal,wk=weekKey();if(act==='delete'){weeklyGoals=weeklyGoals.filter(g=>String(g.id)!==id);save(KEYS.weeklyGoals,weeklyGoals);}else{if(!weeklyGoalLog[wk])weeklyGoalLog[wk]={};const n=Number(weeklyGoalLog[wk][id])||0;weeklyGoalLog[wk][id]=act==='plus'?n+1:Math.max(0,n-1);save(KEYS.weeklyGoalLog,weeklyGoalLog);}renderGoalCenter();});
function renderGoalStats(){const chart=$('goalChart');if(!chart)return;const rows=[];let totalDone=0,totalExpected=0;for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const ds=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,scheduled=habits.filter(h=>h.days.includes(d.getDay())),done=scheduled.filter(h=>(habitLog[ds]||{})[h.id]).length,pct=scheduled.length?Math.round(done/scheduled.length*100):0;totalDone+=done;totalExpected+=scheduled.length;rows.push({label:['日','一','二','三','四','五','六'][d.getDay()],pct});}chart.innerHTML=rows.map(r=>`<div><span style="height:${Math.max(4,r.pct)}%"></span><b>${r.pct}%</b><small>${r.label}</small></div>`).join('');$('goalWeekRate').textContent=(totalExpected?Math.round(totalDone/totalExpected*100):0)+'%';const wk=weekKey(),log=weeklyGoalLog[wk]||{};$('goalStatsSummary').innerHTML=weeklyGoals.length?weeklyGoals.map(g=>`<div class="goal-summary-row"><span>${esc(g.name)}</span><b>${Number(log[g.id])||0} / ${g.target} ${esc(g.unit)}</b></div>`).join(''):'<p class="tip-text">添加周目标后，这里会显示本周汇总。</p>';}

const FAT_MEALS=[
  ['蛋白质早餐','午餐半盘蔬菜','晚餐减少精制主食'],['早餐加一份水果','午餐优先瘦肉','晚餐清淡少盐'],['保证蛋白质摄入','主食换成粗粮','不喝含糖饮料'],['早餐不要空腹','午餐八分饱','晚餐提前两小时'],['鸡蛋或无糖酸奶','蔬菜至少两种','夜间不吃零食'],['正常吃三餐','外食先选清蒸','留意隐形油脂'],['轻松饮食日','保持七分饱','准备下周食材']
];
const FAT_SPORTS=['快走 35 分钟＋拉伸 10 分钟','力量训练 25 分钟＋散步','低冲击有氧 30 分钟','休息或舒缓瑜伽 20 分钟','全身力量训练 30 分钟','户外快走或骑行 45 分钟','休息＋下周状态复盘'];
function renderFatPlan(){
  if(!$('fatDashboard'))return;const W=Number(bodyProfile?.weight)||65,H=Number(bodyProfile?.height)||170,A=Number(bodyProfile?.age)||22,g=bodyProfile?.gender||'女';
  if(!$('fatTargetWeight').value)$('fatTargetWeight').value=fatPlan.targetWeight||Math.max(35,W-5);$('fatWeeklyGoal').value=String(fatPlan.weeklyGoal||.5);
  const target=Number(fatPlan.targetWeight);if(!target){$('fatDashboard').innerHTML='<div class="fat-empty">设置目标体重后，为你生成每日减脂安排。</div>';return;}
  const factor={sedentary:1.2,light:1.375,moderate:1.55,active:1.725}[bodyProfile.activity]||1.2,bmr=10*W+6.25*H-5*A+(g==='男'?5:-161),tdee=Math.round(bmr*factor),weekly=Number(fatPlan.weeklyGoal)||.5,minKcal=g==='男'?1500:1200,targetKcal=Math.max(minKcal,Math.round(tdee-weekly*7700/7)),weeks=Math.max(0,Math.ceil((W-target)/weekly)),idx=new Date().getDay();
  $('fatStatus').textContent=`预计 ${weeks} 周`;$('fatDashboard').innerHTML=`<div class="fat-numbers"><div><b>${W}</b><span>当前 kg</span></div><div><b>${target}</b><span>目标 kg</span></div><div><b>${targetKcal}</b><span>建议 kcal</span></div></div><div class="fat-today"><b>今日饮食重点</b>${FAT_MEALS[idx].map(x=>`<p>· ${x}</p>`).join('')}<b>今日运动</b><p>· ${FAT_SPORTS[idx]}</p></div>`;
}
$('saveFatPlanBtn')?.addEventListener('click',()=>{const target=Number($('fatTargetWeight').value),current=Number(bodyProfile.weight)||65;if(!target||target>=current){showToast('减脂目标需要低于当前体重');return;}fatPlan={targetWeight:target,weeklyGoal:Number($('fatWeeklyGoal').value)||.5};save(KEYS.fatPlan,fatPlan);renderFatPlan();showToast('减脂计划已生成 ✦');});

let muyuSound=true,muyuAudioCtx=null;
const MUYU_WORDS=['功德 +1','烦恼 -1','平安喜乐','万事顺意','心静自在','好运加载中'];
function renderMuyu(){
  const today=muyuLog[todayStr()]||0;
  const total=Object.values(muyuLog).reduce((sum,n)=>sum+(Number(n)||0),0);
  if($('muyuToday'))$('muyuToday').textContent=today.toLocaleString();
  if($('muyuTotal'))$('muyuTotal').textContent=total.toLocaleString();
}
function playMuyuSound(){
  if(!muyuSound)return;
  try{
    muyuAudioCtx=muyuAudioCtx||new (window.AudioContext||window.webkitAudioContext)();
    const ctx=muyuAudioCtx,osc=ctx.createOscillator(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
    osc.type='sine';osc.frequency.setValueAtTime(190,ctx.currentTime);osc.frequency.exponentialRampToValueAtTime(105,ctx.currentTime+.09);
    filter.type='lowpass';filter.frequency.value=520;gain.gain.setValueAtTime(.22,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.18);
    osc.connect(filter);filter.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.19);
  }catch(e){}
}
function knockMuyu(){
  const ds=todayStr();muyuLog[ds]=(Number(muyuLog[ds])||0)+1;save(KEYS.muyuLog,muyuLog);renderMuyu();playMuyuSound();
  const fish=$('woodFishBtn'),stick=$('muyuStick'),stage=$('muyuStage');fish.classList.remove('knock');stick.classList.remove('knock');void fish.offsetWidth;fish.classList.add('knock');stick.classList.add('knock');
  const word=MUYU_WORDS[Math.floor(Math.random()*MUYU_WORDS.length)];$('muyuMantra').textContent=word;
  const pop=document.createElement('span');pop.className='merit-pop';pop.textContent=word;pop.style.left=(38+Math.random()*24)+'%';stage.appendChild(pop);setTimeout(()=>pop.remove(),900);
}
$('woodFishBtn')?.addEventListener('click',knockMuyu);
$('muyuSoundBtn')?.addEventListener('click',e=>{muyuSound=!muyuSound;e.currentTarget.classList.toggle('active',muyuSound);e.currentTarget.textContent=muyuSound?'🔔':'🔕';showToast(muyuSound?'已开启木鱼声':'已静音');});
document.addEventListener('keydown',e=>{if(e.code==='Space'&&$('page-muyu')?.classList.contains('active')&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){e.preventDefault();knockMuyu();}});

/* ===== 左侧功能抽屉 ===== */
function openDrawer(){
  $('drawer').classList.remove('hidden');
  $('drawerOverlay').classList.remove('hidden');
  requestAnimationFrame(()=>{
    $('drawer').classList.add('show');
    $('drawerOverlay').classList.add('show');
  });
}
function closeDrawer(){
  $('drawer').classList.remove('show');
  $('drawerOverlay').classList.remove('show');
  setTimeout(()=>{
    $('drawer').classList.add('hidden');
    $('drawerOverlay').classList.add('hidden');
  },300);
}
$$('.drawer-toggle-btn').forEach(b=>b.addEventListener('click', openDrawer));
$('drawerClose')?.addEventListener('click', closeDrawer);
$('drawerOverlay')?.addEventListener('click', closeDrawer);
$('drawerProfileBtn')?.addEventListener('click',()=>{closeDrawer();setTimeout(()=>switchTab('settings'),280);});
// 抽屉内各项点击
$$('.drawer-item').forEach(item=>{
  item.addEventListener('click',()=>{
    const target = item.dataset.drawer;
    closeDrawer();
    setTimeout(()=>{
      if(target==='home'){switchTab('home');}
      else if(target==='checkin'){switchTab('checkin');}
      else if(target==='goals'){switchTab('goals');}
      else if(target==='plan'){switchTab('plan');}
      else if(target==='study'){switchTab('study');}
      else if(target==='knowledge'){switchTab('knowledge');}
      else if(target==='idea'){switchTab('idea');}
      else if(target==='diary'){switchTab('diary');}
      else if(target==='muyu'){switchTab('muyu');}
      else if(target==='recipe'){switchTab('health');setTimeout(()=>{const t=document.querySelector('.htab[data-htab="recipe"]');if(t)t.click();},50);}
      else if(target==='reading'){switchTab('knowledge');setTimeout(()=>{const t=document.querySelector('.ktab[data-ktab="reading"]');if(t)t.click();},50);}
      else if(target==='calendar'){switchTab('calendar');}
      else if(target==='chat'){switchTab('chat');}
      else if(target==='water'){openWaterPage();}
      else if(target==='health'){switchTab('health');}
      else if(target==='settings'){switchTab('settings');}
      else if(target==='start'){switchTab('start');initStartPage();}
    },280);
  });
});

$('chatSendBtn')?.addEventListener('click',sendChat);
$('chatInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')sendChat();});

function sendChat(){
  const input=$('chatInput');
  const text=input.value.trim(); if(!text)return;
  addChatMsg('user',text); input.value='';
  // 简单回复逻辑
  setTimeout(()=>{
    const reply=generateReply(text);
    addChatMsg('bot',reply);
  },400+Math.random()*600);
}
function addChatMsg(role,text){
  chatMsgs.push({role,text,time:new Date().toISOString()});
  save(KEYS.chatMsgs,chatMsgs); renderChatMsgs();
}
function generateReply(text){
  const lower=text.toLowerCase();
  if(lower.includes('任务')||lower.includes('计划'))return'要我帮你看看今天的任务吗？去"计划"页就能看到全部安排哦 📋';
  if(lower.includes('灵感'))return'有灵感了？快记下来！首页和灵感页都可以快速记录 ✍️';
  if(lower.includes('学习')||lower.includes('英语'))return'今天的学习任务在"知识"页的英文积累里，每天学一点，积少成多 📖';
  if(lower.includes('健康')||lower.includes('运动'))return'健康管理在"我的"页面里，可以记录食谱和运动打卡 🥗🏃';
  if(lower.includes('你好')||lower.includes('嗨')||lower.includes('在吗'))return'我在呢宝宝！有什么需要帮忙的吗？😊';
  if(lower.includes('开心')||lower.includes('高兴'))return'看到你开心我也很开心！继续保持好心情吧 ✨';
  if(lower.includes('累')||lower.includes(' tired')||lower.includes('疲惫'))return'辛苦啦宝宝，适当休息一下，你已经很棒了 💪';
  if(lower.includes('谢谢'))return'不客气～能帮到你就好 😊';
  const replies=[
    '嗯嗯，我记住了！有什么需要随时叫我～',
    '好的宝宝，我收到啦 ✨',
    '有意思的想法！还有别的想聊的吗？',
    '哈哈，你说得对 👀',
    '收到～我会好好记住的 💡'
  ];
  return replies[Math.floor(Math.random()*replies.length)];
}

/* ===== 详情阅读弹层 ===== */
function openPickDetail(item){
  $('detailTag').textContent=item.tag||'推荐';
  $('detailTitle').textContent=item.title||'';
  $('detailBody').textContent=item.detail||item.desc||'';
  // 视频区
  const vc=$('detailVideo'); vc.innerHTML='';
  if(item.videoType==='file'){
    fillDetailVideoFile(item.videoId);
  } else if(item.videoType==='link' && item.video){
    const emb=videoEmbedHtml(item.video);
    vc.innerHTML = emb || `<a class="pick-link" href="${esc(item.video)}" target="_blank" rel="noopener">▶ 打开视频</a>`;
  }
  const lk=$('detailLink');
  if(lk){
    if(item.link){
      let url=item.link; if(!/^https?:\/\//i.test(url)) url='https://'+url;
      lk.href=url; lk.textContent='🔗 '+item.link; lk.classList.remove('hidden');
    } else { lk.classList.add('hidden'); lk.removeAttribute('href'); }
  }
  $('detailSrc').textContent=item.source||'当前为内置示例推荐，后续可在设置中接入真实推荐源 ✦';
  $('detailMask').classList.remove('hidden');
}

// 本地视频读取后塞进播放器
function fillDetailVideoFile(id){
  const vc=$('detailVideo');
  getVid(id).then(blob=>{
    if(!blob){ vc.innerHTML='<p class="detail-src">本地视频找不到了（可能换设备/清了缓存）</p>'; return; }
    const objURL=URL.createObjectURL(blob);
    const v=document.createElement('video');
    v.controls=true; v.src=objURL; v.style.cssText='width:100%;border-radius:12px;background:#000;display:block;';
    vc.innerHTML=''; vc.appendChild(v);
  }).catch(()=>{ vc.innerHTML='<p class="detail-src">本地视频读取失败</p>'; });
}

// 在线视频链接 → 可嵌入的播放器 HTML（无法嵌入时返回空，由上层降级为链接）
function videoEmbedHtml(url){
  const u=url.trim();
  if(!/^https?:\/\//i.test(u))return '';
  if(/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(u))
    return `<video controls src="${esc(u)}" style="width:100%;border-radius:12px;background:#000;display:block;"></video>`;
  let m=u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/i);
  if(m) return `<iframe class="detail-video-frame" src="https://www.youtube.com/embed/${m[1]}" frameborder="0" allowfullscreen></iframe>`;
  let b=u.match(/bilibili\.com\/video\/(BV[\w]+)/i);
  if(b) return `<iframe class="detail-video-frame" src="https://player.bilibili.com/player.html?bvid=${b[1]}&autoplay=0" frameborder="0" allowfullscreen></iframe>`;
  return '';
}
$('detailClose')?.addEventListener('click',()=>$('detailMask').classList.add('hidden'));
$('detailMask')?.addEventListener('click',e=>{ if(e.target.id==='detailMask') $('detailMask').classList.add('hidden'); });

/* ===== 四宫格快捷入口（首页） ===== */
$$('.quad-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    const mod=b.dataset.mod;
    if(mod==='灵感速记')switchTab('idea');
    else if(mod==='每日英语')switchTab('knowledge');
    else if(mod==='复盘')showToast('复盘模块开发中～');
    else if(mod==='健康')switchTab('health');
  });
});

/* ===== 初始化 ===== */
setTheme(localStorage.getItem('wb_theme')||'blue');
renderHome();
renderPlan();
renderIdeaList();
renderVisGrid();
renderBooks();
renderReadingNotes();
renderKnowledgeLibrary();
renderRecBooks();
renderDishes();
renderSports();
renderExercise();
if($('exDate')) $('exDate').value=todayStr();
renderWater();
initChat();
initStartPage();
loadBodyProfile();
calcNutri();
if($('mealDate'))$('mealDate').value=todayStr();
renderMealLog();
renderWorkoutPlans();
renderWorkoutCollections();
renderMealPrep();
renderCheckin();
renderGoalCenter();
renderStudy();
renderLifeProfile();
renderDiary();
renderMuyu();
renderDataSummary();
