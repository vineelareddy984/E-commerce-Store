import React, { useState, useMemo } from 'react';
import { useAppState } from '../context/AppContext';
import { SlidersHorizontal, Grid, List, Search, Star, Heart, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductListView() {
  const { products, categories, setView, toggleWishlist, wishlist, searchQuery, setSearchQuery } = useAppState();
  
  // Local Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(2000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isListView, setIsListView] = useState<boolean>(false);
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Quick reset for filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setMaxPrice(2000);
    setMinRating(0);
    setSortBy('featured');
    setSearchQuery('');
  };

  // Filter and Sort core logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesPrice = p.price <= maxPrice;
        const matchesRating = p.rating >= minRating;
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesPrice && matchesRating && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        // Default matches 'featured' or standard order
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [products, selectedCategory, maxPrice, minRating, sortBy, searchQuery]);

  return (
    <div id="product-list-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Title & Metadata Summary */}
      <div className="text-left border-b border-warm-brass/25 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif text-stone-900 uppercase tracking-widest">
            Heritage Vault
          </h1>
          <p className="text-warm-brass text-[11px] mt-1.5 font-mono uppercase tracking-wider font-semibold">
            Sifting {filteredProducts.length} of {products.length} sovereign creations
          </p>
        </div>
      </div>

      {/* Primary Grid Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        
        {/* ================= DESKTOP FILTER BAR (LEFT COLUMN) ================= */}
        <aside id="desktop-filters" className="hidden lg:block space-y-8 bg-stone-50/50 p-6 rounded-lg border border-stone-100 text-left">
          
          <div className="flex justify-between items-center pb-4 border-b border-stone-200">
            <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Sift Vault
            </h3>
            <button
              id="reset-filters-btn"
              onClick={handleResetFilters}
              className="text-[10px] uppercase font-mono font-bold text-stone-400 hover:text-stone-900 cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Search Term Filter */}
          <div className="space-y-2.5">
            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">Full-Text Query</label>
            <div className="relative">
              <input
                id="filter-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search index..."
                className="w-full pl-9 pr-4 py-2 border border-stone-200 bg-white rounded text-xs select-text focus:outline-none focus:ring-1 focus:ring-stone-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">Category</label>
            <div className="space-y-2" id="category-filter-group">
              <button
                id="cat-filter-all"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs px-3 py-2 rounded transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-stone-950 text-white font-medium shadow-sm'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                All Curations
              </button>
              {categories.map((cat) => (
                <button
                  id={`cat-filter-${cat.id}`}
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left text-xs px-3 py-2 rounded transition-all flex justify-between items-center cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-stone-950 text-white font-medium shadow-sm'
                      : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className={`text-[10px] font-mono ${selectedCategory === cat.id ? 'text-white' : 'text-stone-400'}`}>
                    ({cat.count})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
              <span>Threshold Cap</span>
              <span className="font-mono text-royal-emerald font-bold">${maxPrice}</span>
            </div>
            <input
              id="filter-price-slider"
              type="range"
              min="40"
              max="2000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-royal-emerald"
            />
            <div className="flex justify-between text-[10px] font-mono text-stone-400">
              <span>$40</span>
              <span>$2000</span>
            </div>
          </div>

          {/* Rating filter */}
          <div className="space-y-3">
            <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">Minimum Deserved Satisfaction</label>
            <div className="space-y-1.5">
              {[4.8, 4.6, 4.0, 0].map((rating) => (
                <button
                  id={`rating-filter-${rating}`}
                  key={rating}
                  onClick={() => setMinRating(rating)}
                  className={`w-full text-left font-light text-xs px-2.5 py-1.5 rounded transition-all flex items-center space-x-2 cursor-pointer ${
                    minRating === rating ? 'bg-stone-250 font-medium' : 'text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center space-x-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < Math.floor(rating || 5) ? 'fill-stone-850 text-stone-850' : 'text-stone-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-stone-700">
                    {rating === 0 ? 'Any Rating' : `${rating}+ Stars`}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </aside>

        {/* ================= COMPACT MOUNT & GRID CONTAINER (RIGHT BLOCK) ================= */}
        <main className="lg:col-span-3 space-y-6">
          
          {/* Top Control Bar (Sort & Grid/List toggles & Mobile Filter triggers) */}
          <div className="flex justify-between items-center bg-stone-50 p-4 rounded-lg border border-stone-150">
            
            {/* Mobile filter button */}
            <button
              id="mobile-filter-drawer-btn"
              onClick={() => setShowFiltersMobile(true)}
              className="lg:hidden px-3.5 py-2 border border-stone-300 text-xs uppercase tracking-wider font-semibold rounded hover:bg-stone-100 flex items-center gap-1.5 cursor-pointer bg-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Sift Vault
            </button>

            {/* Sorter Selector */}
            <div className="flex items-center space-x-2 text-left">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 hidden sm:inline">Sort ledger:</span>
              <select
                id="sort-select-field"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-white border border-stone-300 rounded px-2.5 py-1.5 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-500 cursor-pointer"
              >
                <option value="featured">Editorial Recommend</option>
                <option value="price-low">Price: Ascent</option>
                <option value="price-high">Price: Descent</option>
                <option value="rating">Satisfaction Index</option>
              </select>
            </div>

            {/* Layout view buttons */}
            <div className="flex items-center space-x-1 bg-white border border-stone-200 rounded p-1 shadow-sm">
              <button
                id="toggle-grid-view"
                onClick={() => setIsListView(false)}
                className={`p-1.5 rounded transition-all cursor-pointer ${!isListView ? 'bg-stone-950 text-white' : 'text-stone-400 hover:text-stone-800'}`}
                title="Grid Layout"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                id="toggle-list-view"
                onClick={() => setIsListView(true)}
                className={`p-1.5 rounded transition-all cursor-pointer ${isListView ? 'bg-stone-950 text-white' : 'text-stone-400 hover:text-stone-800'}`}
                title="List Layout"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Interactive Products Rendering Layout */}
          {filteredProducts.length === 0 ? (
            /* EMPTY FILTER RESULT STATE */
            <div className="py-20 text-center bg-stone-50 rounded-lg border border-stone-150">
              <div className="w-16 h-16 bg-white border border-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-stone-400" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-stone-800">No Matched Curations</h3>
              <p className="text-xs text-stone-500 font-light mt-2 max-w-sm mx-auto leading-relaxed">
                We couldn't coordinate any luxury designs mapping to your specific filter arrays. Adjust your thresholds and try anew.
              </p>
              <button
                id="no-results-reset-btn"
                onClick={handleResetFilters}
                className="mt-6 px-6 py-2.5 bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase rounded hover:bg-stone-850"
              >
                Refresh Sift Vault
              </button>
            </div>
          ) : (
            <div className={`grid gap-8 ${isListView ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
              
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((p, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    id={`product-card-${p.id}`}
                    key={p.id}
                    className={`bg-white border border-stone-150 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all flex ${
                      isListView ? 'flex-col sm:flex-row' : 'flex-col justify-between'
                    }`}
                  >
                    
                    {/* Visual Media Thumbnail Cover */}
                    <div className={`aspect-[4/5] bg-stone-50 overflow-hidden relative flex-shrink-0 ${isListView ? 'w-full sm:w-56' : 'w-full'}`}>
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        onClick={() => setView('detail', p.id)}
                        className="w-full h-full object-cover hover:scale-101 cursor-pointer transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />

                      {/* Wishlist Heart Icon */}
                      <button
                        id={`wishlist-toggle-${p.id}`}
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur shadow rounded-full text-stone-500 hover:text-red-500 transition-colors cursor-pointer"
                        title="Toggle Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${wishlist.includes(p.id) ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>

                      {p.featured && (
                        <div className="absolute top-3 left-3 bg-stone-950 text-white text-[9px] uppercase tracking-widest font-bold px-2 py-1 rounded">
                          Studio Handpick
                        </div>
                      )}
                    </div>

                    {/* Meta Specifications Description Content */}
                    <div className="p-5 text-left flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider font-mono">
                            {p.category}
                          </span>
                          <span className="text-sm font-semibold text-stone-900">${p.price}</span>
                        </div>
                        <h3
                          onClick={() => setView('detail', p.id)}
                          className="text-sm font-semibold text-stone-950 hover:underline cursor-pointer line-clamp-1"
                        >
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-stone-400 font-light leading-relaxed line-clamp-2">
                          {p.tagline}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 fill-stone-850 text-stone-850" />
                          <span className="text-[10px] font-bold text-stone-700 font-mono">{p.rating}</span>
                          <span className="text-[9px] text-stone-450 font-mono">({p.numReviews} essays)</span>
                        </div>
                        <button
                          id={`examine-btn-${idx}`}
                          onClick={() => setView('detail', p.id)}
                          className="text-[10px] uppercase font-bold tracking-widest text-stone-850 hover:text-stone-950 hover:underline cursor-pointer"
                        >
                          Details →
                        </button>
                      </div>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>

            </div>
          )}

        </main>

      </div>

      {/* ================= MOBILE FILTER DRAWER POPUP ================= */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            <motion.div
              id="mobile-filters-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.div
              id="mobile-filters-drawer-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white z-50 shadow-2xl lg:hidden flex flex-col text-left"
            >
              <div className="h-18 px-6 flex items-center justify-between border-b border-stone-150 bg-stone-50">
                <span className="text-sm font-semibold uppercase tracking-widest text-stone-950">Filters</span>
                <button
                  id="close-mobile-filters-btn"
                  onClick={() => setShowFiltersMobile(false)}
                  className="p-2 text-stone-400 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {/* Search Term Filter */}
                <div className="space-y-2.5">
                  <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">Full-Text Query</label>
                  <div className="relative">
                    <input
                      id="mobile-filter-search"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search index..."
                      className="w-full pl-9 pr-4 py-2 border border-stone-200 bg-white rounded text-xs select-text focus:outline-none"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-3">
                  <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">Category</label>
                  <div className="space-y-2">
                    <button
                      id="mobile-cat-filter-all"
                      onClick={() => { setSelectedCategory('all'); setShowFiltersMobile(false); }}
                      className={`w-full text-left text-xs px-3 py-2 rounded transition-all cursor-pointer ${selectedCategory === 'all' ? 'bg-stone-950 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'}`}
                    >
                      All Curations
                    </button>
                    {categories.map((cat) => (
                      <button
                        id={`mobile-cat-filter-${cat.id}`}
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setShowFiltersMobile(false); }}
                        className={`w-full text-left text-xs px-3 py-2 rounded transition-all flex justify-between items-center cursor-pointer ${selectedCategory === cat.id ? 'bg-stone-950 text-white font-medium' : 'text-stone-600 hover:bg-stone-100'}`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] font-mono">({cat.count})</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-[11px] uppercase tracking-wider text-stone-500 font-semibold">
                    <span>Threshold Cap</span>
                    <span className="font-mono text-stone-900 font-bold">${maxPrice}</span>
                  </div>
                  <input
                    id="mobile-price-slider"
                    type="range"
                    min="40"
                    max="1500"
                    step="10"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-950"
                  />
                </div>

                {/* Rating filter */}
                <div className="space-y-3">
                  <label className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">Minimum Deserved Satisfaction</label>
                  <div className="space-y-1.5">
                    {[4.8, 4.6, 4.0, 0].map((rating) => (
                      <button
                        id={`mobile-rating-filter-${rating}`}
                        key={rating}
                        onClick={() => { setMinRating(rating); setShowFiltersMobile(false); }}
                        className={`w-full text-left font-light text-xs px-2.5 py-1.5 rounded transition-all flex items-center space-x-2 cursor-pointer ${minRating === rating ? 'bg-stone-250 font-medium' : 'text-stone-600 hover:bg-stone-100'}`}
                      >
                        <div className="flex items-center space-x-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating || 5) ? 'fill-stone-850 text-stone-850' : 'text-stone-200'}`} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-stone-700">{rating === 0 ? 'Any Rating' : `${rating}+ Stars`}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-stone-150 bg-stone-50 flex items-center justify-between">
                <button
                  id="mobile-filters-reset-btn"
                  onClick={() => { handleResetFilters(); setShowFiltersMobile(false); }}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-800"
                >
                  Clear All
                </button>
                <button
                  id="mobile-filters-apply-btn"
                  onClick={() => setShowFiltersMobile(false)}
                  className="px-5 py-2.5 bg-stone-950 text-white text-xs font-semibold tracking-wider uppercase rounded"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
