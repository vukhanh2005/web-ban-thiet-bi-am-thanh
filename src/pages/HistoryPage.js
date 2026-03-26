import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function HistoryPage() {
  const { user } = useAuth();
  const paidOrders = (user?.orders || []).filter((order) => order.status === 'paid');
  const [expandedOrderId, setExpandedOrderId] = React.useState('');
  const [isShowingAllOrders, setIsShowingAllOrders] = React.useState(false);
  const visibleOrders = isShowingAllOrders ? paidOrders : paidOrders.slice(0, 10);

  if (!user) {
    return (
      <div className="history-page">
        <h1>Lịch Sử</h1>
        <div className="empty-state">
          <p>Đăng nhập để xem lịch sử đơn hàng đã thanh toán.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h1>Lịch Sử</h1>
      <p>Các đơn hàng đã thanh toán của bạn được lưu tại đây.</p>
      {paidOrders.length === 0 ? (
        <div className="empty-state">
          <p>Bạn chưa có đơn hàng nào đã thanh toán.</p>
        </div>
      ) : (
        <>
          <div className="history-toolbar">
            <p className="history-caption">
              {isShowingAllOrders
                ? `Lịch sử toàn bộ hóa đơn (${paidOrders.length} đơn)`
                : `Lịch sử 10 đơn gần nhất (${Math.min(paidOrders.length, 10)} đơn)`}
            </p>
            <button
              className="text-button"
              onClick={() => setIsShowingAllOrders((current) => !current)}
            >
              {isShowingAllOrders ? 'Thu gọn' : 'Hiển thị toàn bộ đơn hàng'}
            </button>
          </div>
          <div className="history-list">
            {visibleOrders.map((order) => (
            <div key={order.id} className="history-card">
              <div>
                <h3>ID Hóa Đơn: {order.id}</h3>
                <p>{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                <p>{order.items.reduce((total, item) => total + item.quantity, 0)} sản phẩm</p>
                <p className="history-total">{order.totalPrice.toLocaleString('vi-VN')} VND</p>
              </div>
              <div className="history-actions">
                <button
                  className="primary-button"
                  onClick={() => setExpandedOrderId((current) => current === order.id ? '' : order.id)}
                >
                  {expandedOrderId === order.id ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                </button>
              </div>
              {expandedOrderId === order.id ? (
                <div className="history-detail">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="history-detail-row">
                      <strong>ID Sản Phẩm: {item.id}</strong>
                      <span>{item.name}</span>
                      <span>Số lượng: {item.quantity}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
