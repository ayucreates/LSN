import { ArrowRight, Sparkles, ShoppingBag, Tag, Truck, Heart, RotateCcw } from 'lucide-react';
import type { Product, ProductCategory } from '../types';
import { RecentlyViewed } from '../components/RecentlyViewed';

interface HomePageProps {
  products: Product[];
  onNavigate: (page: string, category?: ProductCategory) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Women Western', 'Women Ethnic', 'Kids', 'Accessories', 'Festive Collection', 'Gifting',
];

const FEATURES = [
  { icon: Tag, title: 'Street-Style Prices', desc: 'Budget-friendly fashion starting from just ₹199' },
  { icon: Truck, title: 'Daily New Arrivals', desc: 'Fresh stock every week with the latest trends' },
  { icon: Heart, title: 'All Sizes Available', desc: 'From XS to XXL, we have styles for every body type' },
  { icon: RotateCcw, title: 'Easy Exchange', desc: 'Hassle-free exchange policy at our Kokrajhar store' },
];

export function HomePage({ products, onNavigate }: HomePageProps) {
  const featured = products.slice(0, 4);

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-gold-800 via-gold-700 to-gold-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.08),transparent_60%)]" />
        <div className="w-full px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded px-4 py-1.5 text-sm text-gold-200 mb-5">
              <Sparkles className="w-4 h-4" />
              Kokrajhar's Favorite Fashion Destination
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-4">
              Trendy Styles,
              <span className="text-gold-200"> Unbeatable Prices</span>
            </h1>
            <p className="text-base md:text-lg text-gold-100/80 mb-8 leading-relaxed max-w-xl">
              We bring you the latest fashion trends — from chic western wear to elegant ethnic pieces — all at prices that won't break the bank.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('shop')}
                className="inline-flex items-center gap-2 bg-white text-gold-800 hover:bg-gold-100 font-semibold px-6 py-3 rounded transition-colors"
              >
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="inline-flex items-center gap-2 border border-white/30 hover:border-white/60 text-white/80 hover:text-white font-semibold px-6 py-3 rounded transition-colors"
              >
                Our Story
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-8 -mt-7 relative z-10 mb-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onNavigate('shop', cat)}
              className="group bg-white rounded-lg border border-gold-200 p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gold-50 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-gold-100 transition-colors">
                <ShoppingBag className="w-5 h-5 text-gold-500" />
              </div>
              <p className="text-xs font-medium text-gray-700 group-hover:text-gold-700 transition-colors truncate">
                {cat === 'Women Western' ? 'Women Western' : cat === 'Women Ethnic' ? 'Women Ethnic' : cat === 'Festive Collection' ? 'Festive' : cat}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="w-full px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center p-5">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-50 text-gold-600 rounded-lg mb-3">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">{f.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-cream py-14 border-y border-gold-200">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-xs font-semibold text-gold-600 uppercase tracking-[0.2em]">New Arrivals</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">Fresh Collection</h2>
            <p className="text-sm text-gray-500 mt-1">Check out our latest drops — updated weekly!</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map((product) => (
              <button
                key={product.id}
                onClick={() => onNavigate('shop')}
                className="group bg-white rounded-lg border border-gold-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="aspect-square bg-gradient-to-br from-gold-50 to-gold-100 flex items-center justify-center">
                  <ShoppingBag className="w-12 h-12 text-gold-300 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-semibold text-gold-600 uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900 mt-1 truncate">{product.name}</h3>
                  <p className="text-sm font-bold text-gold-700 mt-1">₹{product.price.toFixed(2)}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-8">
            <button
              onClick={() => onNavigate('shop')}
              className="inline-flex items-center gap-2 border border-gold-400 text-gold-700 hover:bg-gold-50 font-semibold px-6 py-2.5 rounded transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Store Story Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-gradient-to-br from-gold-100 to-gold-50 rounded-lg p-12 flex items-center justify-center aspect-[4/3]">
            <ShoppingBag className="w-24 h-24 text-gold-400" />
          </div>
          <div>
            <span className="text-xs font-semibold text-gold-600 uppercase tracking-[0.2em]">About Our Store</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-4">Kokrajhar's Fashion Hub</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Located in the heart of Kokrajhar, Little Sarojini Nagar is your go-to destination for trendy fashion at the most affordable prices. We offer styles for women, kids, and everyone at prices that fit your budget.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              From everyday casuals to festive specials, our racks are always stocked with the latest styles. Visit us at Habrubari Tengapara and discover fashion that fits your budget.
            </p>
            <button
              onClick={() => onNavigate('about')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gold-700 hover:text-gold-800 transition-colors"
            >
              Know More
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Recently Viewed */}
      <RecentlyViewed onProductClick={() => onNavigate('shop')} />

      {/* Newsletter */}
      <section className="bg-gold-800 py-12">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Stay in the Know</h2>
          <p className="text-gold-200 text-sm mb-6 max-w-md mx-auto">
            Get updates on new arrivals, special offers, and exclusive deals
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border border-gold-400 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 bg-white/10 text-white placeholder:text-gold-300"
            />
            <button className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
