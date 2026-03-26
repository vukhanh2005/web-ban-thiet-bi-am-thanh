const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const PORT = Number(process.env.PORT || 5000);
const DATA_DIR = path.join(__dirname, 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};

const readJsonFile = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    return [];
  }
};

const writeJsonFile = (filePath, payload) => {
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf8');
};

const readRequestBody = (req) =>
  new Promise((resolve, reject) => {
    let data = '';

    req.on('data', (chunk) => {
      data += chunk;
    });

    req.on('end', () => {
      if (!data) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(data));
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });

const getUserOrders = (userId) => {
  const orders = readJsonFile(ORDERS_FILE);
  return orders.filter((order) => order.userId === userId);
};

const buildPaymentCode = () => `PAY-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const server = http.createServer(async (req, res) => {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = requestUrl;

  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/products') {
    sendJson(res, 200, readJsonFile(PRODUCTS_FILE));
    return;
  }

  if (req.method === 'GET' && pathname.startsWith('/api/products/')) {
    const productId = Number(pathname.split('/').pop());
    const product = readJsonFile(PRODUCTS_FILE).find((item) => item.id === productId);

    if (!product) {
      sendJson(res, 404, { message: 'Không tìm thấy sản phẩm.' });
      return;
    }

    sendJson(res, 200, product);
    return;
  }

  if (req.method === 'POST' && pathname === '/api/orders') {
    try {
      const payload = await readRequestBody(req);
      const orders = readJsonFile(ORDERS_FILE);

      if (!Array.isArray(payload.items) || payload.items.length === 0) {
        sendJson(res, 400, { message: 'Đơn hàng phải có ít nhất một sản phẩm.' });
        return;
      }

      const order = {
        id: `ORD-${Date.now()}`,
        userId: payload.userId || 'guest',
        customerName: payload.customerName || 'Khách hàng',
        items: payload.items,
        totalPrice: payload.totalPrice || 0,
        createdAt: new Date().toISOString(),
        paymentCode: buildPaymentCode(),
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        status: payload.status || 'pending_payment',
      };

      orders.unshift(order);
      writeJsonFile(ORDERS_FILE, orders);
      sendJson(res, 201, order);
    } catch (error) {
      sendJson(res, 400, { message: 'Dữ liệu đơn hàng không hợp lệ.' });
    }
    return;
  }

  if (req.method === 'POST' && pathname === '/api/auth/google') {
    try {
      const payload = await readRequestBody(req);

      if (!payload.googleId || !payload.email || !payload.name) {
        sendJson(res, 400, { message: 'Thiếu thông tin tài khoản Google.' });
        return;
      }

      const users = readJsonFile(USERS_FILE);
      const existingUser = users.find((item) => item.id === payload.googleId);
      const userRecord = {
        id: payload.googleId,
        name: payload.name,
        email: payload.email,
        avatar: payload.avatar || '',
        provider: 'google',
        updatedAt: new Date().toISOString(),
      };

      if (existingUser) {
        Object.assign(existingUser, userRecord);
      } else {
        users.unshift({
          ...userRecord,
          createdAt: new Date().toISOString(),
        });
      }

      writeJsonFile(USERS_FILE, users);
      sendJson(res, 200, userRecord);
    } catch (error) {
      sendJson(res, 400, { message: 'Không thể đồng bộ tài khoản Google.' });
    }
    return;
  }

  if (req.method === 'GET' && pathname.startsWith('/api/users/')) {
    const userId = pathname.split('/').pop();
    const users = readJsonFile(USERS_FILE);
    const user = users.find((item) => item.id === userId);

    if (!user) {
      sendJson(res, 404, { message: 'Không tìm thấy người dùng.' });
      return;
    }

    sendJson(res, 200, {
      ...user,
      orders: getUserOrders(userId),
    });
    return;
  }

  sendJson(res, 404, { message: 'API endpoint không tồn tại.' });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

module.exports = server;
