import { Search, Heart, User, LogIn, UserPlus, LogOut, ShoppingCart, Menu, X, Mail, Package, ArrowUpDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';
import type { ProductCategory, FilterState } from '../types';
import { Filters } from './Filters';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string, category?: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  productCount: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const CATEGORIES = [
  { id: 'Women Western', label: 'Women Western' },
  { id: 'Women Ethnic', label: 'Women Ethnic' },
  { id: 'Kids', label: 'Kids' },
  { id: 'Accessories', label: 'Accessories' },
  { id: 'Festive Collection', label: 'Festive' },
  { id: 'Gifting', label: 'Gifting' },
];

const SEARCH_WORDS = ['Kurtis', 'Dresses', 'Tops', 'Jeans', 'Shirts', 'Suits', 'Ethnic Wear'];

export function Navbar({ currentPage, onNavigate, searchQuery, onSearchChange, filters, onFiltersChange, productCount, sortBy, onSortChange }: NavbarProps) {
  const { user, isAdmin, openLoginModal, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [showSort, setShowSort] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A-Z' },
    { value: 'name-desc', label: 'Name: Z-A' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % SEARCH_WORDS.length);
      setAnimKey((prev) => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const showOverlay = !searchQuery && !focused;

  const searchInput = (
    <div className="relative w-full max-w-md">
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full pl-4 pr-10 py-2 text-sm border border-gold-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gold-400 focus:border-gold-400 bg-gold-50/50"
        style={{ color: searchQuery ? undefined : 'transparent', caretColor: '#8B6914' }}
      />
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-500" />
      {showOverlay && (
        <div
          className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none truncate"
          onClick={() => inputRef.current?.focus()}
        >
          <span>Search for </span>
          <span key={animKey} className="inline-block animate-slide-down text-gold-600">
            {SEARCH_WORDS[wordIndex]}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <nav className="sticky top-0 z-40 bg-white">
      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>

      {/* Top Row */}
      <div className="border-b border-gold-100 bg-gold-50/50">
        <div className="px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => onNavigate('home')} className="flex-shrink-0">
              <span className="text-lg font-bold text-gold-700 tracking-wide">Little Sarojini Nagar</span>
            </button>

            <div className="hidden sm:block flex-1 max-w-lg mx-12">
              {searchInput}
            </div>

            <div className="flex items-center gap-3">
            <button
              onClick={() => { if (!user) { openLoginModal('Unlock Your Wishlist', 'Save your favorite items by signing in'); } else { onNavigate('wishlist'); } }}
              className="p-2 text-gray-600 hover:text-gold-600 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>

              <div
                className="relative"
                onMouseEnter={() => setShowProfileMenu(true)}
                onMouseLeave={() => setShowProfileMenu(false)}
              >
                <button className="p-2 text-gray-600 hover:text-gold-600 transition-colors" aria-label="Profile">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium ${
                    user ? (isAdmin ? 'bg-gold-600' : 'bg-gold-500') : 'bg-gray-300'
                  }`}>
                    {user ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                  </div>
                </button>

                {showProfileMenu && (
                  <div
                    className="absolute right-0 mt-1 w-52 bg-white rounded-md shadow-lg border border-gold-200 py-2 z-20"
                    onMouseEnter={() => setShowProfileMenu(true)}
                    onMouseLeave={() => setShowProfileMenu(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gold-100">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-medium text-gold-600 bg-gold-50 px-2 py-0.5 rounded capitalize">
                            {user.role}
                          </span>
                        </div>
                        <button onClick={() => { onNavigate('orders'); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                          <Package className="w-4 h-4" />
                          My Orders
                        </button>
                        <button onClick={() => { logout(); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Log out
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-gold-100">
                          <p className="text-sm font-medium text-gray-900">Welcome</p>
                          <p className="text-xs text-gray-500">Sign in to your account</p>
                        </div>
                        <button onClick={() => { openLoginModal(); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                          <LogIn className="w-4 h-4" />
                          Log in
                        </button>
                        <button onClick={() => { openLoginModal(); setShowProfileMenu(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                          <UserPlus className="w-4 h-4" />
                          Sign up
                        </button>
                        <div className="border-t border-gold-100 mt-1 pt-1">
                          <button onClick={() => { onNavigate('contact'); setShowProfileMenu(false); }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gold-50 hover:text-gold-700 transition-colors">
                            <Mail className="w-4 h-4" />
                            Contact Us
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button onClick={openCart} className="relative p-2 text-gray-600 hover:text-gold-600 transition-colors" aria-label="Cart">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-gold-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden p-2 text-gray-600 hover:text-gold-600">
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Categories */}
      <div className="hidden lg:block bg-white border-b border-gold-200">
        <div className="px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-center gap-1 h-10">
            <button
              onClick={() => onNavigate('home')}
              className={`px-4 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
                currentPage === 'home' ? 'text-gold-600 border-b-2 border-gold-500' : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              Home
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigate('shop', cat.id as ProductCategory)}
                className="px-4 py-1 text-xs font-medium uppercase tracking-wider text-gray-600 hover:text-gold-600 transition-colors"
              >
                {cat.label}
              </button>
            ))}
            <button
              onClick={() => onNavigate('about')}
              className={`px-4 py-1 text-xs font-medium uppercase tracking-wider transition-colors ${
                currentPage === 'about' ? 'text-gold-600 border-b-2 border-gold-500' : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              About Us
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar - only on shop page */}
      {currentPage === 'shop' && (
        <div className="bg-white border-b border-gold-200">
          <div className="px-3 sm:px-8 lg:px-12">
            <div className="flex items-center justify-between min-h-9 py-1 gap-2">
              <h2 className="text-xs sm:text-sm text-gray-600 truncate min-w-0">
                <span className="hidden sm:inline">{productCount === 0 ? '0' : `1-${Math.min(productCount, 48)}`} of {productCount > 48 ? 'over ' : ''}{productCount} result{productCount !== 1 ? 's' : ''} for </span>
                <span className="sm:hidden">{productCount} result{productCount !== 1 ? 's' : ''} for </span>
                <span className="text-gold-700 font-semibold">"{filters.searchQuery || filters.categories[0] || 'All Products'}"</span>
              </h2>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="relative">
                  <button onClick={() => setShowSort(!showSort)}
                    className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-white border border-gold-200 rounded px-1.5 sm:px-2 py-1 hover:bg-gold-50">
                    <ArrowUpDown className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Sort by</span>
                  </button>
                  {showSort && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                      <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gold-200 rounded shadow-lg z-20 py-1">
                        {SORT_OPTIONS.map((opt) => (
                          <button key={opt.value} onClick={() => { onSortChange(opt.value); setShowSort(false); }}
                            className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gold-50 ${sortBy === opt.value ? 'text-gold-700 font-semibold bg-gold-50' : 'text-gray-700'}`}>
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                <Filters filters={filters} onChange={onFiltersChange} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile search */}
      <div className="sm:hidden px-4 pb-3 pt-1">
        {searchInput}
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gold-200 bg-white">
          <div className="px-4 py-3 space-y-1">
            <button onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-3 py-2 text-sm font-medium rounded ${
                currentPage === 'home' ? 'text-gold-700 bg-gold-50' : 'text-gray-600 hover:bg-gold-50'
              }`}>Home</button>
            <div className="border-t border-gold-100 pt-1 mt-1">
              <p className="px-3 py-1 text-xs font-semibold text-gold-600 uppercase tracking-wider">Categories</p>
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => { onNavigate('shop', cat.id as ProductCategory); setMobileMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gold-50 hover:text-gold-700 rounded">
                  {cat.label}
                </button>
              ))}
            </div>
            <button onClick={() => { onNavigate('about'); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-3 py-2 text-sm font-medium rounded ${
                currentPage === 'about' ? 'text-gold-700 bg-gold-50' : 'text-gray-600 hover:bg-gold-50'
              }`}>About Us</button>
            <button onClick={() => { onNavigate('contact'); setMobileMenuOpen(false); }}
              className={`block w-full text-left px-3 py-2 text-sm font-medium rounded ${
                currentPage === 'contact' ? 'text-gold-700 bg-gold-50' : 'text-gray-600 hover:bg-gold-50'
              }`}>Contact Us</button>
            {!user && (
              <button onClick={() => { openLoginModal(); setMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 text-sm font-medium text-gold-600 hover:bg-gold-50 rounded">
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
