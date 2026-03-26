export const buildInvoiceData = (order, customerName) => ({
  id: `INV-${Date.now()}`,
  issuedAt: new Date().toISOString(),
  customerName: customerName || order.customerName || 'Khách hàng',
});

export const buildInvoiceHtml = (order, customerName) => `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Hoa don ${order.id}</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 32px; color: #1f2937; }
    h1 { margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
    th { background: #f3f4f6; }
    .total { margin-top: 20px; font-size: 18px; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Hóa đơn ${order.id}</h1>
  <p>Mã bill: ${order.invoice?.id || 'Chưa có'}</p>
  <p>Khách hàng: ${customerName || order.customerName || 'Khách hàng'}</p>
  <p>Ngày thanh toán: ${new Date(order.invoice?.issuedAt || order.paidAt || order.createdAt).toLocaleString('vi-VN')}</p>
  <table>
    <thead>
      <tr>
        <th>Sản phẩm</th>
        <th>Số lượng</th>
        <th>Đơn giá</th>
        <th>Thành tiền</th>
      </tr>
    </thead>
    <tbody>
      ${order.items.map((item) => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.price.toLocaleString('vi-VN')} VND</td>
          <td>${(item.price * item.quantity).toLocaleString('vi-VN')} VND</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
  <p class="total">Tổng thanh toán: ${order.totalPrice.toLocaleString('vi-VN')} VND</p>
</body>
</html>
`.trim();

