import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function UserPage() {
  const { user, isGoogleReady, authError, clientId, renderGoogleButton, signOut } = useAuth();
  const buttonRef = React.useRef(null);
  const [isRecentOrdersHidden, setIsRecentOrdersHidden] = React.useState(false);

  React.useEffect(() => {
    if (!user && isGoogleReady && buttonRef.current) {
      renderGoogleButton(buttonRef.current);
    }
  }, [isGoogleReady, renderGoogleButton, user]);

  React.useEffect(() => {
    setIsRecentOrdersHidden(false);
  }, [user?.id]);

  return (
    <div className="user-page">
      <h1>Tài Khoản Người Dùng</h1>
      <p>Quản lý thông tin và đơn hàng của bạn.</p>

      <div className="user-card">
        {user ? (
          <>
            <div className="user-profile">
              <img src={user.avatar} alt={user.name} className="user-avatar" />
              <div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
            </div>
            <p>Bạn đã đăng nhập bằng Google trên trình duyệt này.</p>
            <p>ID tài khoản: {user.id}</p>
            {Array.isArray(user.orders) ? (
              <div className="user-orders">
                <div className="user-orders-header">
                  <h3>Đơn hàng gần đây</h3>
                  {!isRecentOrdersHidden && user.orders.length > 0 ? (
                    <button
                      className="text-button"
                      onClick={() => setIsRecentOrdersHidden(true)}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                {isRecentOrdersHidden ? (
                  <p>Đã làm gọn danh sách đơn hàng gần đây.</p>
                ) : user.orders.length === 0 ? (
                  <p>Chưa có đơn hàng nào được gửi lên máy chủ.</p>
                ) : (
                  user.orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="order-item">
                      <strong>{order.id}</strong>
                      <p>{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                      <p>{order.totalPrice.toLocaleString('vi-VN')} VND</p>
                    </div>
                  ))
                )}
              </div>
            ) : null}
            <button className="secondary-button" onClick={signOut}>
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <h2>Đăng nhập bằng Google</h2>
            <p>Dùng tài khoản Google để đăng nhập nhanh và đồng bộ thông tin người dùng.</p>
            {!clientId ? (
              <div className="auth-note">
                <p>Thiếu cấu hình OAuth client ID.</p>
                <p>Thêm biến môi trường <code>REACT_APP_GOOGLE_CLIENT_ID</code> vào file <code>.env</code>, sau đó khởi động lại ứng dụng.</p>
              </div>
            ) : (
              <div ref={buttonRef} className="google-signin-slot" />
            )}
            {authError ? <p className="auth-error">{authError}</p> : null}
          </>
        )}
      </div>
    </div>
  );
}
