/* 部署前由管理员填写一次。
 * 这里只填 LeanCloud 国际版的公开凭证（App ID / App Key），绝不填写 Master Key。
 * 服务器地址由 app.js 根据 App ID 前 8 位自动拼接为 https://{前8位}.api.lncldglobal.com，无需手动填。
 */
window.WORKBENCH_CLOUD_CONFIG = {
  provider: 'leancloud',
  appId: '在此填入你的 LeanCloud App ID',
  appKey: '在此填入你的 LeanCloud App Key'
};
