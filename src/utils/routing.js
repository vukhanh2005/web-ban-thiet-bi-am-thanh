export const routes = {
  home: '/',
  products: '/products',
  cart: '/cart',
  checkout: '/checkout',
  history: '/history',
  user: '/user',
};

export const routeEntries = Object.entries(routes);

export const getPageFromPath = (pathname) => {
  const normalizedPath = pathname === '' ? '/' : pathname;
  const match = routeEntries.find(([, path]) => path === normalizedPath);

  return match ? match[0] : 'home';
};

export const navigateTo = (path) => {
  if (window.location.pathname === path) {
    return;
  }

  window.history.pushState({}, '', path);
  
  window.dispatchEvent(new PopStateEvent('popstate'));
};
