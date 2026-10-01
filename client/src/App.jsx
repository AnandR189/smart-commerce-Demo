import { createContext, useContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCart } from './hooks/useCart';
import { useWishlist } from './hooks/useWishlist';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GroupCartPage from './pages/GroupCartPage';
import AdminProducts from './pages/AdminProducts';
import NotFound from './pages/NotFound';

// Global shop context
export const ShopContext = createContext(null);

export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be inside ShopContext.Provider');
  return ctx;
};

function App() {
  const cart = useCart();
  const wishlist = useWishlist();
  const [cartOpen, setCartOpen] = useState(false);

  const contextValue = {
    ...cart,
    ...wishlist,
    cartOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
  };

  return (
    <AuthProvider>
      <ShopContext.Provider value={contextValue}>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
            <Navbar />
            <CartDrawer />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/group-cart" element={<GroupCartPage />} />
                <Route path="/group-cart/:code" element={<GroupCartPage />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ShopContext.Provider>
    </AuthProvider>
  );
}

export default App;
