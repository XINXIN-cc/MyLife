/**
 * 工作台云同步后端（Cloudflare Pages Functions + KV）
 * 路由：/api/register · /api/login · /api/upload · /api/download · /api/ping
 * 存储：KV namespace，绑定变量名 WORKBENCH_KV
 * 安全：密码以 SHA-256 哈希存储（不存明文）；会话用随机 UUID token 无状态校验
 */

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

async function sha256(s) {
  const data = new TextEncoder().encode(s);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// token -> email（无状态：直接查 KV 里 sess:token 的值）
async function emailOfToken(env, token) {
  if (!token) return null;
  const email = await env.WORKBENCH_KV.get('sess:' + token);
  return email || null;
}

export async function onRequest(context) {
  const { request, env } = context;
  const method = request.method;
  const path = new URL(request.url).pathname;

  // 预检请求
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  }

  // 连通性自检
  if (path === '/api/ping' && method === 'GET') {
    return json({ ret: 200, msg: 'ok' });
  }

  // 业务接口只接受 POST
  if (method !== 'POST') {
    return json({ ret: 405, msg: 'Method Not Allowed' }, 405);
  }

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    return json({ ret: 400, msg: '请求体格式错误' }, 400);
  }

  // 注册
  if (path === '/api/register') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ ret: 400, msg: '邮箱格式不正确' }, 400);
    }
    if (password.length < 6) {
      return json({ ret: 400, msg: '密码至少需要 6 位' }, 400);
    }
    const exist = await env.WORKBENCH_KV.get('user:' + email);
    if (exist) {
      return json({ ret: 409, msg: '该邮箱已注册，请直接登录' }, 409);
    }
    const pwdHash = await sha256(password);
    await env.WORKBENCH_KV.put('user:' + email, JSON.stringify({ email, pwd: pwdHash, created_at: Date.now() }));
    const token = crypto.randomUUID();
    await env.WORKBENCH_KV.put('sess:' + token, email);
    return json({ ret: 200, token, email });
  }

  // 登录
  if (path === '/api/login') {
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '');
    const raw = await env.WORKBENCH_KV.get('user:' + email);
    if (!raw) {
      return json({ ret: 401, msg: '账号不存在，请先注册' }, 401);
    }
    const user = JSON.parse(raw);
    const pwdHash = await sha256(password);
    if (user.pwd !== pwdHash) {
      return json({ ret: 401, msg: '密码错误' }, 401);
    }
    const token = crypto.randomUUID();
    await env.WORKBENCH_KV.put('sess:' + token, email);
    return json({ ret: 200, token, email });
  }

  // 上传备份
  if (path === '/api/upload') {
    const email = await emailOfToken(env, body.token);
    if (!email) {
      return json({ ret: 401, msg: '登录已失效，请重新登录' }, 401);
    }
    if (typeof body.payload !== 'string') {
      return json({ ret: 400, msg: '数据格式错误' }, 400);
    }
    await env.WORKBENCH_KV.put('data:' + email, JSON.stringify({ payload: body.payload, updated_at: Date.now() }));
    return json({ ret: 200, msg: 'saved' });
  }

  // 下载备份
  if (path === '/api/download') {
    const email = await emailOfToken(env, body.token);
    if (!email) {
      return json({ ret: 401, msg: '登录已失效，请重新登录' }, 401);
    }
    const raw = await env.WORKBENCH_KV.get('data:' + email);
    if (!raw) {
      return json({ ret: 404, msg: '云端还没有备份' }, 404);
    }
    const data = JSON.parse(raw);
    return json({ ret: 200, payload: data.payload, updated_at: data.updated_at });
  }

  return json({ ret: 404, msg: 'Not Found' }, 404);
}
