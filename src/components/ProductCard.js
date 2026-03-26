import React from 'react';
import { useCart } from '../hooks/useCart';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [isConfirmOpen, setIsConfirmOpen] = React.useState(false);
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    setQuantity(1);
    setIsConfirmOpen(true);
  };

  const handleConfirmAdd = () => {
    addToCart(product, quantity);
    setIsConfirmOpen(false);
  };

  return (
    <div className={isConfirmOpen ? 'product-card confirm-open' : 'product-card'}>
      <img src={product.image} alt={product.name} />
      <span className="product-category">{product.category}</span>
      <h3>{product.name}</h3>
      <p className="price">{product.price.toLocaleString('vi-VN')} VND</p>
      <p className="description">{product.description}</p>
      <button className="add-to-cart" onClick={handleAddToCart}>
        Thêm vào giỏ
      </button>

      {isConfirmOpen ? (
        <div className="product-confirm-overlay" onClick={() => setIsConfirmOpen(false)}>
          <div
            className="product-confirm-card"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`Xác nhận thêm ${product.name} vào giỏ hàng`}
          >
            <p className="confirm-label">Xác nhận thêm vào giỏ</p>
            <h4>{product.name}</h4>
            <p>{product.price.toLocaleString('vi-VN')} VND</p>
            <p className="confirm-description">{product.description}</p>
            <div className="confirm-quantity">
              <span>Số lượng</span>
              <div className="confirm-quantity-controls">
                <button onClick={() => setQuantity((current) => Math.max(1, current - 1))}>-</button>
                <strong>{quantity}</strong>
                <button onClick={() => setQuantity((current) => current + 1)}>+</button>
              </div>
            </div>
            <div className="confirm-actions">
              <button className="secondary-button" onClick={() => setIsConfirmOpen(false)}>
                Hủy
              </button>
              <button className="primary-button" onClick={handleConfirmAdd}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
