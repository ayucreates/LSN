import { ShoppingBag, Mail, Phone, MapPin, Clock } from 'lucide-react';
import type { ProductCategory } from '../types';

interface FooterProps {
  onNavigate: (page: string, category?: ProductCategory) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-gold-900 text-gold-300">
      <div className="px-4 sm:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag className="w-5 h-5 text-gold-400" />
              <span className="text-lg font-bold text-white">Little Sarojini Nagar</span>
            </div>
            <p className="text-sm leading-relaxed text-gold-400">
              Kokrajhar's favorite fashion destination. Trendy styles, unbeatable prices for everyone.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('home')} className="text-sm hover:text-white transition-colors">Home</button></li>
              <li><button onClick={() => onNavigate('shop')} className="text-sm hover:text-white transition-colors">Shop All</button></li>
              <li><button onClick={() => onNavigate('about')} className="text-sm hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => onNavigate('contact')} className="text-sm hover:text-white transition-colors">Contact</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Categories</h3>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('shop', 'Women Western')} className="text-sm hover:text-white transition-colors">Women Western</button></li>
              <li><button onClick={() => onNavigate('shop', 'Women Ethnic')} className="text-sm hover:text-white transition-colors">Women Ethnic</button></li>
              <li><button onClick={() => onNavigate('shop', 'Kids')} className="text-sm hover:text-white transition-colors">Kids</button></li>
              <li><button onClick={() => onNavigate('shop', 'Gifting')} className="text-sm hover:text-white transition-colors">Gifting</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Contact</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gold-400">
                <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
                Jwhwlao Dwimalu Rd, opp. Bodoland Guest House, Kokrajhar, Assam 783370
              </li>
              <li className="flex items-center gap-2 text-sm text-gold-400">
                <Phone className="w-4 h-4 text-gold-400 flex-shrink-0" />
                +91 93953 63043
              </li>
              <li className="flex items-center gap-2 text-sm text-gold-400">
                <Mail className="w-4 h-4 text-gold-400 flex-shrink-0" />
                littlesarojininagarkokrajhar@gmail.com
              </li>
              <li className="flex items-center gap-2 text-sm text-gold-400">
                <Clock className="w-4 h-4 text-gold-400 flex-shrink-0" />
                Daily 10AM - 8PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gold-400">&copy; {new Date().getFullYear()} Little Sarojini Nagar. All rights reserved.</p>
          <p className="text-[10px] text-gold-500 mt-1">Made with love by Ayushman B.</p>
          <div className="flex items-center gap-4 text-xs text-gold-400">
            <button className="hover:text-white transition-colors">Privacy Policy</button>
            <button className="hover:text-white transition-colors">Terms of Service</button>
            <button className="hover:text-white transition-colors">Shipping Policy</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
