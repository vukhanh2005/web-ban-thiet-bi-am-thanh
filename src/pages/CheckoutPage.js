import React from 'react';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { ApiRequestError, createOrder } from '../services/api';
import { routes } from '../utils/routing';

export default function CheckoutPage({ onNavigate }) {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { user, recordOrder } = useAuth();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      onNavigate(routes.products);
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const order = await createOrder({
        userId: user?.id,
        customerName: user?.name,
        items: cartItems,
        totalPrice: getTotalPrice(),
      });

      recordOrder(order, user?.id);
      setMessage(`Đơn hàng ${order.id} đã được ghi nhận.`);
      clearCart();
      setTimeout(() => {
        onNavigate(`${routes.pendingPayments}?order=${order.id}`);
      }, 1200);
    } catch (apiError) {
      setError(
        apiError instanceof ApiRequestError && apiError.code === 'NETWORK_ERROR'
          ? 'Không kết nối được API server. Hãy chạy `npm run start:server` rồi thử lại.'
          : apiError.message || 'Không thể tạo đơn hàng.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Thanh Toán</h1>
      <p>Hoàn tất đơn hàng của bạn.</p>
      <div className="checkout-card">
        <p>Số lượng mặt hàng: {cartItems.length}</p>
        <p>Tổng thanh toán: {getTotalPrice().toLocaleString('vi-VN')} VND</p>
        {message ? <p className="api-success">{message}</p> : null}
        {error ? <p className="api-error">{error}</p> : null}
        <button className="primary-button" onClick={handleCheckout} disabled={isSubmitting}>
          {isSubmitting ? 'Đang gửi đơn hàng...' : 'Xác nhận đặt hàng'}
        </button>
      </div>
    </div>
  );
}
