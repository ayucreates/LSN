import { useState } from 'react';
import type { FilterState, Product, ProductCategory } from './types';
import { useAuth } from './context/AuthContext';
import { useProducts } from './hooks/useProducts';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { BackToTop } from './components/BackToTop';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { ContactPage } from './pages/ContactPage';
import { AboutPage } from './pages/AboutPage';
import { ProductGridSkeleton } from './components/LoadingSkeleton';

const DEFAULT_FILTERS: FilterState = {
  categories: [],
  sizes: [],
  colors: [],
  priceRange: [0, 1500],
  searchQuery: '',
};

export default function App() {
  const { loading, showLoginModal, closeLoginModal } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState('newest');
  const { products, loading: productsLoading } = useProducts(filters);

  if (loading) {
    return (
      <div className="min-h-screen bg-gold-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const navigate = (page: string, product?: Product, category?: ProductCategory) => {
    if (product) setSelectedProduct(product);
    if (category) {
      setFilters((prev) => ({ ...prev, categories: [category] }));
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage products={products} onNavigate={(p, cat) => navigate(p, undefined, cat)} />;
      case 'shop': return (
        <ShopPage
          products={products}
          loading={productsLoading}
          onProductClick={(p) => navigate('product', p)}
          skeleton={<ProductGridSkeleton />}
          sortBy={sortBy}
        />
      );
      case 'product': return selectedProduct ? (
        <ProductDetailPage product={selectedProduct} products={products} onNavigate={(p, product) => navigate(p, product)} />
      ) : null;
      case 'checkout': return <CheckoutPage onNavigate={(p) => navigate(p)} />;
      case 'orders': return <OrdersPage onNavigate={(p) => navigate(p)} />;
      case 'wishlist': return <WishlistPage onNavigate={(p) => navigate(p)} />;
      case 'contact': return <ContactPage />;
      case 'about': return <AboutPage />;
      default: return <HomePage products={products} onNavigate={(p, cat) => navigate(p, undefined, cat)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gold-50 flex flex-col">
      <Navbar currentPage={currentPage} onNavigate={(p, cat) => navigate(p, undefined, cat)}
        searchQuery={filters.searchQuery}
        onSearchChange={(q) => setFilters((f) => ({ ...f, searchQuery: q }))}
        filters={filters}
        onFiltersChange={setFilters}
        productCount={products.length}
        sortBy={sortBy}
        onSortChange={setSortBy} />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={(p, cat) => navigate(p, undefined, cat)} />
      <CartDrawer onCheckout={() => navigate('checkout')} />
      <ToastContainer />
      <BackToTop />
      {showLoginModal && <LoginPage onClose={closeLoginModal} />}
    </div>
  );
}
