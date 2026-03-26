import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { routes } from '../utils/routing';

const navItems = [
  { key: 'home', label: 'Trang Chủ', path: routes.home },
  { key: 'products', label: 'Sản Phẩm', path: routes.products },
  { key: 'cart', label: 'Giỏ Hàng', path: routes.cart },
  { key: 'history', label: 'Lịch Sử', path: routes.history },
  { key: 'user', label: 'Tài Khoản', path: routes.user },
];

export default function Header({ currentPage, onNavigate }) {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <button className="logo-button" onClick={() => onNavigate(routes.home)}>
            Web Bán Hàng
          </button>
        </div>
        <nav className="navbar">
          <ul>
            {navItems.map((item) => (
              <li key={item.key}>
                <button
                  className={currentPage === item.key ? 'nav-link active' : 'nav-link'}
                  onClick={() => onNavigate(item.path)}
                >
                  <span>{item.label}</span>
                  {item.key === 'cart' ? (
                    <small className="nav-meta">
                      {cartCount > 0 ? `${cartCount} sản phẩm` : 'Chưa có sản phẩm'}
                    </small>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header-account">
          {user ? (
            <>
              <img src={user.avatar} alt={user.name} className="header-avatar" />
              <button className="account-chip" onClick={() => onNavigate(routes.user)}>
                {user.name}
              </button>
            </>
          ) : (
            <button className="account-chip ghost" onClick={() => onNavigate(routes.user)}>
              Đăng nhập Google
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
