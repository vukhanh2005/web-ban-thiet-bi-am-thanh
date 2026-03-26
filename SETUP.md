# Web Bán Hàng - E-Commerce Project

Đây là một dự án trang web bán hàng trực tuyến được xây dựng bằng **React.js**.

## Tính năng chính

- ✅ Trang chủ hiển thị thông tin cửa hàng
- ✅ Trang danh sách sản phẩm
- ✅ Giỏ hàng với quản lý số lượng
- ✅ Trang thanh toán
- ✅ Quản lý tài khoản người dùng
- ✅ Context API cho quản lý trạng thái giỏ hàng
- ✅ Custom hooks để sử dụng giỏ hàng

## Cấu trúc dự án

```
web-ban-hang/
├── public/                 # File công khai
├── src/
│   ├── assets/            # Hình ảnh, icon, font...
│   ├── components/        # Các component tái sử dụng
│   │   ├── Header.js      # Thanh điều hướng
│   │   ├── Footer.js      # Chân trang
│   │   └── ProductCard.js # Card sản phẩm
│   ├── pages/             # Các trang chính
│   │   ├── HomePage.js
│   │   ├── ProductsPage.js
│   │   ├── CartPage.js
│   │   ├── CheckoutPage.js
│   │   └── UserPage.js
│   ├── services/          # Gọi API
│   │   └── api.js
│   ├── context/           # React Context
│   │   └── CartContext.js
│   ├── hooks/             # Custom Hooks
│   │   └── useCart.js
│   ├── utils/             # Hàm tiện ích
│   ├── App.js             # Component chính
│   ├── App.css            # Style chính
│   └── index.js           # Entry point
└── package.json
```

## Cài đặt và chạy

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy ứng dụng
```bash
npm start
```

Ứng dụng sẽ mở ở `http://localhost:3000`

### 3. Build cho production
```bash
npm run build
```

### 4. Chạy test (nếu có)
```bash
npm test
```

## Công nghệ sử dụng

- **React 18** - Library để xây dựng UI
- **React Hooks** - State management và lifecycle
- **Context API** - Quản lý trạng thái toàn cục
- **CSS3** - Styling

## Tính năng sắp tới

- [ ] Thêm React Router cho routing
- [ ] Redux cho state management nâng cao
- [ ] Thanh toán với Stripe/PayPal
- [ ] Đăng nhập/Đăng ký người dùng
- [ ] Lịch sử đơn hàng
- [ ] Tìm kiếm và lọc sản phẩm
- [ ] Reviews từ khách hàng
- [ ] Chat support
- [ ] Dark mode
- [ ] Đa ngôn ngữ

## Hướng dẫn sử dụng CartContext

```javascript
import { useCart } from './hooks/useCart';

function MyComponent() {
  const { cartItems, addToCart, removeFromCart, getTotalPrice } = useCart();
  
  // Sử dụng cart functions
}
```

## API Endpoints (để kết nối backend)

```
GET    /api/products           - Lấy tất cả sản phẩm
GET    /api/products/:id       - Lấy sản phẩm theo ID
POST   /api/orders             - Tạo đơn hàng
GET    /api/users/:userId      - Lấy thông tin người dùng
```

## Hỗ trợ

Nếu bạn gặp vấn đề, vui lòng liên hệ:
- Email: support@webbanhang.com
- Phone: 1-800-123-456

## Giấy phép

MIT License - bạn tự do sử dụng dự án này
