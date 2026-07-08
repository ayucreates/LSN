import { useState, type FormEvent } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName(''); setEmail(''); setSubject(''); setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div>
      <section className="bg-gradient-to-r from-gold-800 via-gold-700 to-gold-800 text-white py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Get in Touch</h1>
          <p className="text-gold-200 max-w-lg mx-auto">Visit our store or drop us a message. We'd love to hear from you!</p>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <Mail className="w-10 h-10 text-green-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-green-900 mb-1">Thank You!</h3>
                <p className="text-sm text-green-700">We'll get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white border border-gold-200 rounded-lg p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                      className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                      className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required
                    className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={5}
                    className="w-full border border-gold-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold-400 resize-none" />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 bg-gold-600 text-white font-semibold px-5 py-2.5 rounded hover:bg-gold-700 transition-colors">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6">
            {[
              { icon: MapPin, label: 'Address', value: 'Jwhwlao Dwimalu Rd, opp. Bodoland Guest House\nKokrajhar, Dimalgaon, Assam 783370' },
              { icon: Phone, label: 'Phone', value: '+91 93953 63043' },
              { icon: Mail, label: 'Email', value: 'littlesarojininagarkokrajhar@gmail.com' },
              { icon: Clock, label: 'Hours', value: 'Daily: 10AM - 8PM\nOpen 7 days a week' },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <div className="w-10 h-10 bg-gold-50 text-gold-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{item.label}</h3>
                  <p className="text-sm text-gray-500 whitespace-pre-line">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
