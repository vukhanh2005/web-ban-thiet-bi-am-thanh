import React from 'react';
import ProductCard from '../components/ProductCard';
import { products as fallbackProducts } from '../data/products';
import { ApiRequestError, getProducts } from '../services/api';

export default function ProductsPage() {
  const [products, setProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const productList = await getProducts();
        if (isMounted) {
          setProducts(productList);
          setError('');
        }
      } catch (apiError) {
        if (isMounted) {
          setProducts(fallbackProducts);
          setError(
            apiError instanceof ApiRequestError && apiError.code === 'NETWORK_ERROR'
              ? 'API server chưa chạy, đang hiển thị sản phẩm mẫu cục bộ.'
              : apiError.message || 'Không tải được danh sách sản phẩm.'
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
    <div className="products-page">
      <h1>Sản Phẩm</h1>
      <p>Danh sách các sản phẩm đang có sẵn trong cửa hàng.</p>
      {isLoading ? <p>Đang tải danh sách sản phẩm...</p> : null}
      {error ? <p className="api-warning">{error}</p> : null}
      {!isLoading ? (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
