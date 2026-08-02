window.addEventListener('load', function () {
  if (typeof window.WORKBENCH_APP_READY !== 'undefined') return;
  const notice = document.createElement('div');
  notice.className = 'app-load-error';
  notice.textContent = '页面程序没有加载成功，请重新上传 app.js 后刷新页面。';
  document.body.appendChild(notice);
});
