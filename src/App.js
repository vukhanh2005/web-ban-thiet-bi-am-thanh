import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import CartNotice from './components/CartNotice';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HistoryPage from './pages/HistoryPage';
import UserPage from './pages/UserPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { getPageFromPath, navigateTo } from './utils/routing';

function App() {
  const [currentPage, setCurrentPage] = React.useState(() =>
    getPageFromPath(window.location.pathname)
  );

  React.useEffect(() => {
    const syncRoute = () => {
      setCurrentPage(getPageFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', syncRoute);
    syncRoute();

    return () => {
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'products':
        return <ProductsPage onNavigate={navigateTo} />;
      case 'cart':
        return <CartPage onNavigate={navigateTo} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigateTo} />;
      case 'history':
        return <HistoryPage />;
      case 'user':
        return <UserPage />;
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <Header currentPage={currentPage} onNavigate={navigateTo} />
          <CartNotice />
          <main className="main-content">
            {renderPage()}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
