const ORDER_STORAGE_KEY = 'web-ban-hang-orders-by-user';

const readOrderStore = () => {
  try {
    const rawStore = window.localStorage.getItem(ORDER_STORAGE_KEY);
    return rawStore ? JSON.parse(rawStore) : {};
  } catch (error) {
    console.error('Khong the doc lich su don hang tu localStorage', error);
    return {};
  }
};

const writeOrderStore = (store) => {
  window.localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(store));
};

export const getStoredOrders = (userId) => {
  if (!userId) {
    return [];
  }

  const store = readOrderStore();
  return Array.isArray(store[userId]) ? store[userId] : [];
};

export const mergeOrders = (primaryOrders = [], secondaryOrders = []) => {
  const orderMap = new Map();

  [...primaryOrders, ...secondaryOrders].forEach((order) => {
    if (!order?.id) {
      return;
    }

    orderMap.set(order.id, order);
  });

  return [...orderMap.values()].sort((left, right) => {
    const leftDate = new Date(left.createdAt || 0).getTime();
    const rightDate = new Date(right.createdAt || 0).getTime();
    return rightDate - leftDate;
  });
};

export const saveOrderForUser = (userId, order) => {
  if (!userId || !order?.id) {
    return [];
  }

  const store = readOrderStore();
  const nextOrders = mergeOrders([order], store[userId] || []);
  store[userId] = nextOrders;
  writeOrderStore(store);
  return nextOrders;
};
