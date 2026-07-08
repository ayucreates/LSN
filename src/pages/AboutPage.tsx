import { ShoppingBag, Heart, Sparkles, MapPin, Tag, Users } from 'lucide-react';

export function AboutPage() {
  return (
    <div>
      <section className="bg-gradient-to-r from-gold-800 via-gold-700 to-gold-800 text-white py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">About Little Sarojini Nagar</h1>
          <p className="text-gold-200 max-w-lg mx-auto">Kokrajhar's favorite fashion destination for trendy styles at unbeatable prices.</p>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <span className="text-xs font-semibold text-gold-600 uppercase tracking-[0.2em]">Our Story</span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">From Delhi's Streets to Kokrajhar's Heart</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Little Sarojini Nagar was born from a simple idea — bring trendy, affordable fashion to the beautiful town of Kokrajhar, Assam. What started as a passion for fashion has grown into a beloved local destination.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              Located at Habrubari Tengapara, opposite the Bodoland Guest House, our store is a treasure trove of trendy clothing for men, women, and kids. From everyday casuals to festive specials, we curate every piece with style and affordability in mind.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With a rating of 4.8 stars from our wonderful customers, we take pride in being a LGBTQ+ friendly, inclusive space where everyone can find fashion that makes them feel confident and beautiful.
            </p>
          </div>
          <div className="bg-gradient-to-br from-gold-100 to-gold-50 rounded-lg p-12 flex items-center justify-center aspect-square">
            <ShoppingBag className="w-24 h-24 text-gold-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { icon: Tag, label: 'Affordable', desc: 'Street-style prices starting from just ₹199' },
            { icon: Heart, label: 'Trendy', desc: 'Fresh arrivals every week with the latest styles' },
            { icon: Users, label: 'Inclusive', desc: 'LGBTQ+ friendly — fashion for everyone' },
            { icon: Sparkles, label: 'Quality', desc: 'Carefully selected pieces that last' },
          ].map((item) => (
            <div key={item.label} className="text-center p-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-50 text-gold-600 rounded-lg mb-3">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.label}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-cream border border-gold-200 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Visit Us Today</h2>
          <p className="text-gray-500 max-w-lg mx-auto mb-2">Jwhwlao Dwimalu Rd, opposite Bodoland Guest House</p>
          <p className="text-gray-500 max-w-lg mx-auto mb-4">Kokrajhar, Dimalgaon, Assam 783370</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gold-600 mb-6">
            <MapPin className="w-4 h-4" />
            <span>Open daily 10AM - 8PM</span>
          </div>
          <div className="flex max-w-md mx-auto gap-2">
            <input type="email" placeholder="Enter your email"
              className="flex-1 border border-gold-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
            <button className="bg-gold-600 hover:bg-gold-700 text-white font-semibold px-5 py-2.5 rounded transition-colors text-sm">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
}
