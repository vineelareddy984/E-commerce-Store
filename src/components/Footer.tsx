import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { Mail, ArrowRight, Instagram, Twitter, Facebook, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { setView } = useAppState();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address');
      return;
    }

    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer id="site-footer" className="bg-stone-950 text-stone-300 pt-20 pb-12 border-t border-stone-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        
        {/* Brand & Narrative */}
        <div className="lg:col-span-2 space-y-6">
          <button 
            id="footer-logo-btn"
            onClick={() => setView('home')} 
            className="text-xl tracking-[0.25em] font-serif uppercase text-white hover:opacity-90 transition-opacity"
          >
            SWARA <span className="font-sans font-light text-warm-brass lowercase">Heritage</span>
          </button>
          <p className="text-stone-400 text-sm font-light leading-relaxed max-w-sm">
            We curate and assemble premium old-growth seasoned Ceylon teakwood, hand-woven Pashmina cashmere handlooms, and lost-wax unlacquered brass diya objects. Crafted lovingly in Srinagar, Varanasi, and Aligarh.
          </p>
          <div className="flex items-center space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-white transition-colors" title="Instagram">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-white transition-colors" title="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-stone-400 hover:text-white transition-colors" title="Facebook">
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Column 1: Collections */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-[0.15em] font-semibold mb-6">Collections</h4>
          <ul className="space-y-4 text-sm font-light text-stone-400">
            <li>
              <button onClick={() => setView('products')} className="hover:text-white hover:underline transition-all cursor-pointer">
                Teak & Heritage Carvings
              </button>
            </li>
            <li>
              <button onClick={() => setView('products')} className="hover:text-white hover:underline transition-all cursor-pointer">
                Heritage Handlooms & Weaves
              </button>
            </li>
            <li>
              <button onClick={() => setView('products')} className="hover:text-white hover:underline transition-all cursor-pointer">
                Sacred Rituals & Accents
              </button>
            </li>
            <li>
              <button onClick={() => setView('products')} className="hover:text-white hover:underline transition-all cursor-pointer">
                Limited Royal Drops
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Studio */}
        <div>
          <h4 className="text-white text-xs uppercase tracking-[0.15em] font-semibold mb-6">The Studio</h4>
          <ul className="space-y-4 text-sm font-light text-stone-400">
            <li>
              <button onClick={() => setView('home')} className="hover:text-white hover:underline transition-all cursor-pointer">
                Our Narrative
              </button>
            </li>
            <li>
              <button onClick={() => setView('admin')} className="hover:text-white hover:underline transition-all cursor-pointer flex items-center gap-1.5">
                Staff Portal <ExternalLink className="w-3 h-3 text-stone-500" />
              </button>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">
                Artisan Guilds Foundation
              </span>
            </li>
            <li>
              <span className="hover:text-white transition-colors cursor-pointer">
                Weaving Legacies
              </span>
            </li>
          </ul>
        </div>

        {/* Column 3: Newsletter */}
        <div className="space-y-6">
          <h4 className="text-white text-xs uppercase tracking-[0.15em] font-semibold">Keep Apprised</h4>
          <p className="text-stone-400 text-sm font-light leading-relaxed">
            Receive exclusive notifications for limited seasonal collections and material essays.
          </p>

          <form onSubmit={handleSubscribe} className="space-y-2">
            <div className="relative">
              <input
                id="footer-newsletter-input"
                type="text"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
              />
              <button
                id="footer-subscribe-btn"
                type="submit"
                className="absolute right-3 top-2.5 text-stone-400 hover:text-white transition-colors"
                title="Subscribe"
              >
                <ArrowRight className="w-5 h-5 animate-pulse" />
              </button>
            </div>
            {subscribed && (
              <p className="text-green-500 text-xs font-medium">
                Thank you. You details have been logged in our registry.
              </p>
            )}
            {errorMsg && (
              <p className="text-red-500 text-xs font-medium">{errorMsg}</p>
            )}
          </form>
        </div>

      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-18 pt-8 border-t border-stone-900 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500 space-y-4 sm:space-y-0">
        <p>© 2026 Swara Heritage Inc. Co-crafted lovingly with Indian artisans.</p>
        <div className="flex space-x-6">
          <span className="hover:text-stone-300 cursor-pointer">Privacy Guidelines</span>
          <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
          <span className="hover:text-stone-300 cursor-pointer">Security Standards</span>
        </div>
      </div>
    </footer>
  );
}
