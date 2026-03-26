const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

export class ApiRequestError extends Error {
  constructor(message, code = 'API_ERROR') {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
  }
}

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch (error) {
    throw new ApiRequestError(
      'Không kết nối được tới API server. Hãy chạy `npm run start:server`.',
      'NETWORK_ERROR'
    );
  }

  let data = null;

  try {
    data = await response.json();
  } catch (error) {
    data = null;
  }

  if (!response.ok) {
    throw new ApiRequestError(data?.message || 'Yêu cầu API thất bại.', 'HTTP_ERROR');
  }

  return data;
};

export const getProducts = () => request('/products');

export const getProductById = (id) => request(`/products/${id}`);

export const createOrder = (orderData) =>
  request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });

export const syncGoogleUser = (userData) =>
  request('/auth/google', {
    method: 'POST',
    body: JSON.stringify(userData),
  });

export const getUserProfile = (userId) => request(`/users/${userId}`);
