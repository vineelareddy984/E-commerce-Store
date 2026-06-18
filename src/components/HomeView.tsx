import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ArrowRight, Star, Heart, Check, Copy } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomeView() {
  const { products, categories, setView, toggleWishlist, wishlist } = useAppState();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const featuredProducts = products.filter((p) => p.featured);
  const bestSellers = products.filter((p) => p.bestSeller);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const editorialQuotes = [
    {
      source: 'Architectural Digest India',
      quote: 'Swara Heritage handles seasoned teakwood, fine mulberry silks, and unlacquered brass with raw artistic majesty, making contemporary rooms feel like private heritage museums.'
    },
    {
      source: 'Vogue India',
      quote: 'By rejecting fast synthetics, Swara celebrates pure hand-spun Pashminas and traditional Varanasi zari weaves destined to stand as cherished generational heirlooms.'
    }
  ];

  return (
    <div id="home-view" className="space-y-24 pb-20 overflow-hidden font-sans">
      
      {/* 1. Hero Stage */}
      <section id="home-hero" className="relative min-h-[92vh] flex items-center bg-[#f7f4ed] overflow-hidden border-b border-warm-brass/10">
        
        {/* Ornate Indian Mandap/Jali Pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <div className="absolute top-[15%] right-[5%] w-[600px] h-[600px] rounded-full border-[1.5px] border-warm-brass/40 flex items-center justify-center">
            <div className="w-[500px] h-[500px] rounded-full border border-dashed border-warm-brass/35 flex items-center justify-center">
              <div className="w-[300px] h-[300px] rounded-full border border-warm-brass/20" />
            </div>
          </div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-warm-brass/5 blur-3xl" />
        </div>
        
        {/* Splits: Text & Image */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
          
          {/* Tagline & Call-To-Action */}
          <div className="lg:col-span-6 space-y-8 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-warm-brass block font-mono">
                ROYAL INDIAN HERITAGE ATELIER
              </span>
              <h1 className="text-4.5xl sm:text-5.5xl lg:text-6xl font-serif tracking-normal text-stone-900 leading-[1.1] font-medium">
                Sovereign <br />
                <span className="font-serif italic text-crimson-rich">Indian Artistry</span>
              </h1>
              <p className="text-stone-600 font-light text-sm sm:text-base leading-relaxed max-w-lg pt-2">
                Delve into centuries of timeless grand craftsmanship. Adorn your space with pure mountain-seasoned Kashmiri Walnut, traditional lost-wax Aligarh brassware, and gorgeous Varanasi hand-spun silks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button
                id="hero-explore-btn"
                onClick={() => setView('products')}
                className="group px-7 py-4 bg-royal-emerald text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-stone-900 transition-all shadow-md flex items-center gap-3 cursor-pointer border border-warm-brass/25"
              >
                Assemble Suite
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-warm-brass" />
              </button>
              <button
                id="hero-about-story-btn"
                onClick={() => {
                  const element = document.getElementById('studio-manifesto');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-4 border border-warm-brass/40 text-stone-800 text-xs uppercase tracking-widest font-semibold rounded hover:bg-stone-100/50 transition-all cursor-pointer bg-white/40"
              >
                Our Manifesto
              </button>
            </motion.div>

            {/* Quick Metrics */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="grid grid-cols-3 gap-6 pt-6 border-t border-warm-brass/20 border-dashed max-w-md"
            >
              <div>
                <span className="block text-2xl font-serif text-crimson-rich">100%</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-405 font-mono">Handloom Weaves</span>
              </div>
              <div>
                <span className="block text-2xl font-serif text-royal-emerald">Burma</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-405 font-mono">Reclaimed Teak</span>
              </div>
              <div>
                <span className="block text-2xl font-serif text-warm-brass">GI Tag</span>
                <span className="text-[10px] uppercase tracking-wider text-stone-405 font-mono">Artisan Provenance</span>
              </div>
            </motion.div>

          </div>

          {/* Large Hero Portrait Photo */}
          <div className="lg:col-span-6 flex justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative w-full max-w-[480px] h-[500px] sm:h-[555px] bg-stone-100 rounded-xl overflow-hidden shadow-2xl border border-warm-brass/25"
            >
              <img
                src="https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=1000"
                alt="Heritage Luxury Indian Carved Interior"
                className="w-full h-full object-cover select-none"
                referrerPolicy="no-referrer"
              />
              
              {/* Overlapping Info bubble */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-5 rounded-lg border border-warm-brass/20 flex justify-between items-center shadow-lg">
                <div className="text-left">
                  <span className="text-[9px] uppercase tracking-[0.15em] font-mono font-bold text-crimson-rich block">Royal Heirloom</span>
                  <span className="text-sm font-serif text-stone-900 font-semibold">Kashmir Walnut Armchair No.1</span>
                </div>
                <button
                  id="hero-featured-view-btn"
                  onClick={() => setView('detail', 'kashmir-lounge-01')}
                  className="p-3 bg-royal-emerald text-white rounded-full hover:bg-stone-950 transition-all flex items-center justify-center cursor-pointer shadow-md"
                  title="View Detail"
                >
                  <ArrowRight className="w-4.5 h-4.5 text-warm-brass" />
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* 2. Interactive Category Circle/Panel Portals */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-warm-brass block font-mono">
            TRADITIONAL SUITES
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif tracking-normal text-stone-900 uppercase font-medium">
            Shop by Heritage Suite
          </h2>
          <div className="w-16 h-0.5 bg-warm-brass mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              id={`category-portal-${cat.id}`}
              key={cat.id}
              whileHover={{ y: -6 }}
              className="group cursor-pointer bg-white border border-warm-brass/10 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              onClick={() => setView('products')}
            >
              <div className="h-64 overflow-hidden relative bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-stone-950/15 group-hover:bg-stone-950/0 transition-colors" />
              </div>
              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between bg-white">
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-serif font-semibold text-stone-900 uppercase tracking-widest">{cat.name}</h3>
                    <span className="text-[10px] text-warm-brass font-mono bg-warm-brass/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{cat.count} Suites</span>
                  </div>
                  <p className="text-stone-500 font-light text-xs leading-relaxed line-clamp-2">
                    {cat.description}
                  </p>
                </div>
                <div className="pt-4 flex items-center gap-1.5 text-xs text-stone-800 tracking-wider font-semibold group-hover:text-royal-emerald">
                  <span>Browse Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-warm-brass" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Editorial Studio Manifesto Block */}
      <section id="studio-manifesto" className="bg-[#fcfaf6] py-20 border-y border-warm-brass/15 relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-10 left-10 w-24 h-24 border border-warm-brass rounded-full" />
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-dashed border-warm-brass rounded-full" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <span className="text-xs uppercase tracking-[0.25em] font-mono text-warm-brass font-bold block">
            THE SWARA MANIFESTO
          </span>
          <p className="text-lg sm:text-2.5xl font-serif font-light italic text-stone-800 leading-relaxed">
            "We believe true luxury is a sacred union of ancestry, spirit, and dedicated raw handwork. Our pieces represent an unyielding rejection of sterile mass automation. Every handworked teakwood fluting groove, lost-wax cast unlacquered brass diya, and fine gold zari thread is an authentic expression of the master artisans of India."
          </p>
          <div className="inline-flex items-center gap-4 text-warm-brass">
            <span className="w-8 h-[1px] bg-warm-brass/40" />
            <span className="text-xs uppercase tracking-widest font-semibold font-mono text-royal-emerald">SWARA HERITAGE BOARD</span>
            <span className="w-8 h-[1px] bg-warm-brass/40" />
          </div>
        </div>
      </section>

      {/* 4. Best Sellers Grid */}
      <section id="best-sellers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-warm-brass/20 pb-6">
          <div className="space-y-1 text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-semibold text-warm-brass block">
              IMPERIAL CRAFT SIGNATURES
            </span>
            <h2 className="text-xl sm:text-2xl font-serif text-stone-900 uppercase font-semibold">
              Most Coveted Treasures
            </h2>
          </div>
          <button
            id="view-all-best-sellers-btn"
            onClick={() => setView('products')}
            className="text-xs uppercase tracking-widest font-semibold text-stone-750 hover:text-royal-emerald hover:underline inline-flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            Sift Full Vault
            <ArrowRight className="w-3.5 h-3.5 text-warm-brass" />
          </button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.slice(0, 4).map((p, idx) => (
            <div
              id={`best-seller-card-${p.id}`}
              key={p.id}
              className="group relative flex flex-col justify-between h-full bg-white border border-warm-brass/10 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Thumbnail Container */}
              <div className="aspect-[4/5] bg-stone-50 overflow-hidden relative">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700 cursor-pointer"
                  onClick={() => setView('detail', p.id)}
                  referrerPolicy="no-referrer"
                />

                {/* Wishlist Heart Overlay */}
                <button
                  id={`wishlist-toggle-${p.id}`}
                  onClick={() => toggleWishlist(p.id)}
                  className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur shadow rounded-full text-stone-400 hover:text-red-500 transition-colors cursor-pointer border border-stone-100"
                  title="Toggle Wishlist"
                >
                  <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? 'fill-crimson-rich text-crimson-rich' : ''}`} />
                </button>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur p-3 rounded-lg shadow-md border border-warm-brass/25 flex justify-between items-center">
                  <span className="text-xs font-mono font-bold text-stone-900">${p.price}</span>
                  <button
                    id={`quick-view-btn-${idx}`}
                    onClick={() => setView('detail', p.id)}
                    className="text-[9px] uppercase font-bold tracking-widest bg-royal-emerald text-white px-3 py-1.5 rounded-md hover:bg-stone-900"
                  >
                    Inspect Piece
                  </button>
                </div>
              </div>

              {/* Specs */}
              <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3
                      onClick={() => setView('detail', p.id)}
                      className="text-xs font-serif font-semibold text-stone-900 group-hover:underline cursor-pointer line-clamp-1"
                    >
                      {p.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1 line-clamp-1 font-light italic">{p.tagline}</p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 fill-marigold-gold text-marigold-gold" />
                    <span className="text-[10px] font-bold text-stone-700 font-mono">{p.rating}</span>
                    <span className="text-[9px] text-stone-400">({p.numReviews})</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-royal-emerald">${p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Editorial Reviews slider */}
      <section id="press-section" className="bg-[#faf7f2] py-18 border-y border-warm-brass/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
          <div className="space-y-4 text-left">
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-warm-brass font-bold block">
              GLOBAL MONOGRAPH
            </span>
            <h2 className="text-2xl font-serif font-medium text-stone-900 uppercase">
              Lauded By Authorities
            </h2>
            <div className="w-12 h-0.5 bg-warm-brass" />
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            {editorialQuotes.map((q, idx) => (
              <div key={idx} className="bg-white border border-warm-brass/15 p-6 rounded-xl shadow-sm space-y-4">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-marigold-gold text-marigold-gold" />
                  ))}
                </div>
                <p className="text-xs text-stone-600 italic leading-relaxed font-light">
                  "{q.quote}"
                </p>
                <div className="pt-2 border-t border-stone-105 flex justify-between items-center">
                  <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-royal-emerald">{q.source}</span>
                  <span className="text-[9px] text-stone-405">Review Essay</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. High-Conversion Promo Panel */}
      <section id="cop-promotions" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 rounded-2xl overflow-hidden shadow-xl text-white relative border border-warm-brass/25">
          <div className="absolute inset-0 bg-gradient-to-tr from-stone-950/90 via-stone-905/70 to-stone-800/20 mix-blend-multiply" />
          <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Promo Pitch */}
            <div className="lg:col-span-7 space-y-4 text-left">
              <span className="text-[10px] font-mono text-warm-brass uppercase tracking-[0.2em] font-bold">
                Limited Grand Opening Registry Discount
              </span>
              <h2 className="text-2.5xl sm:text-3.5xl font-serif tracking-normal text-white uppercase sm:leading-snug">
                Assemble Your Ornate Haven <br />
                <span className="font-serif italic text-warm-brass">With Prophetic Grace</span>
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 font-light max-w-lg leading-relaxed">
                Receive sovereign discounts on high-end Indian weaves, teakwood fittings, and sacred elements. Copy code values to apply during billing registries.
              </p>
            </div>

            {/* Coupons Card */}
            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 space-y-3.5 text-left">
              <h4 className="text-xs uppercase tracking-widest text-stone-300 font-bold font-mono">Verified Checkout Keys</h4>
              
              <div className="space-y-2.5">
                {[
                  { code: 'UTSAV50', desc: '50% off heritage accents' },
                  { code: 'SHAADI20', desc: '20% off luxury weaves' },
                  { code: 'SWARA10', desc: '10% off general orders' }
                ].map((item) => (
                  <div key={item.code} className="flex justify-between items-center bg-stone-950/60 border border-white/5 px-4 py-2.5 rounded-lg hover:border-white/20 transition-all">
                    <div>
                      <span className="font-mono text-sm font-semibold tracking-wide text-warm-brass">{item.code}</span>
                      <span className="block text-[9px] text-stone-400 font-light">{item.desc}</span>
                    </div>
                    <button
                      id={`copy-promo-${item.code}`}
                      onClick={() => handleCopyCode(item.code)}
                      className="p-1.5 px-3 bg-warm-brass text-stone-950 text-[10px] font-semibold rounded-md uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      {copiedCode === item.code ? (
                        <>
                          <Check className="w-3 h-3 text-green-700" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
