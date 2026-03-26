import React from 'react';
import ProductCard from '../components/ProductCard';
import { products as fallbackProducts } from '../data/products';
import { ApiRequestError, getProducts } from '../services/api';
import { routes } from '../utils/routing';

export default function HomePage({ onNavigate }) {
  const [featuredProducts, setFeaturedProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const products = await getProducts();
        if (isMounted) {
          setFeaturedProducts(products.slice(0, 3));
          setError('');
        }
      } catch (apiError) {
        if (isMounted) {
          setFeaturedProducts(fallbackProducts.slice(0, 3));
          setError(
            apiError instanceof ApiRequestError && apiError.code === 'NETWORK_ERROR'
              ? 'API server chưa chạy, đang hiển thị sản phẩm mẫu cục bộ.'
              : apiError.message || 'Không tải được sản phẩm nổi bật.'
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div>
          <p className="section-tag">Cửa hàng công nghệ</p>
          <h1>Trang Chủ</h1>
          <p>Chào mừng đến với cửa hàng trực tuyến. Chọn nhanh sản phẩm nổi bật hoặc đi đến danh mục đầy đủ.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => onNavigate(routes.products)}>
              Xem sản phẩm
            </button>
            <button className="secondary-button" onClick={() => onNavigate(routes.cart)}>
              Mở giỏ hàng
            </button>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-heading">
          <h2>Sản phẩm nổi bật</h2>
          <button className="text-button" onClick={() => onNavigate(routes.products)}>
            Xem tất cả
          </button>
        </div>
        {isLoading ? <p>Đang tải sản phẩm nổi bật...</p> : null}
        {error ? <p className="api-warning">{error}</p> : null}
        {!isLoading ? (
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
