import React, { useState, useMemo } from 'react';
import { useAppState } from '../context/AppContext';
import { Star, Heart, Check, ShoppingBag, ArrowLeft, Send, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function ProductDetailView() {
  const {
    products,
    selectedProductId,
    setView,
    addToCart,
    toggleWishlist,
    wishlist,
    addProductReview
  } = useAppState();

  const product = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  // Gallery and specs state
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || { name: '', hex: '' });
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);
  const [addedNotification, setAddedNotification] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'provenance'>('details');

  // Review Form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewFormError, setReviewFormError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Auto-update state parameters when switching products
  React.useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setSelectedColor(product.colors[0]);
      setSelectedSize(product.sizes[0]);
      setQuantity(1);
      setReviewName('');
      setReviewRating(5);
      setReviewComment('');
      setReviewFormError('');
      setReviewSuccess(false);
    }
  }, [product]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 3);
  }, [products, product]);

  const ratingMetrics = useMemo(() => {
    if (!product || product.reviews.length === 0) {
      return { total: 0, average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const count = product.reviews.length;
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = parseFloat((sum / count).toFixed(1));

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product.reviews.forEach((r) => {
      const star = Math.floor(r.rating) as 5 | 4 | 3 | 2 | 1;
      if (distribution[star] !== undefined) {
        distribution[star]++;
      }
    });

    return { total: count, average, distribution };
  }, [product]);

  if (!product) {
    return (
      <div className="py-24 text-center max-w-md mx-auto font-sans leading-relaxed">
        <p className="text-stone-500 font-light">Unable to load requested catalog item detail.</p>
        <button
          onClick={() => setView('products')}
          className="mt-6 px-6 py-2.5 bg-stone-950 text-white text-xs uppercase"
        >
          Return to Vault
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedColor, selectedSize, quantity);
    setAddedNotification(true);
    setTimeout(() => setAddedNotification(false), 3000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewFormError('');

    if (!reviewName.trim()) {
      setReviewFormError('Please enter your full name or signature');
      return;
    }
    if (!reviewComment.trim() || reviewComment.length < 10) {
      setReviewFormError('Your remarks must span at least 10 characters');
      return;
    }

    addProductReview(product.id, {
      userName: reviewName.trim(),
      rating: reviewRating,
      comment: reviewComment.trim()
    });

    setReviewSuccess(true);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  return (
    <div id="product-detail-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      
      {/* 1. Header Navigation Shortcuts */}
      <div className="flex justify-between items-center mb-8 border-b border-stone-100 pb-4">
        <button
          id="back-to-shop-btn"
          onClick={() => setView('products')}
          className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-950 flex items-center gap-2 cursor-pointer font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Treasury
        </button>
        <span className="text-[10px] uppercase font-mono font-bold text-stone-400">
          Suite / {product.id}
        </span>
      </div>

      {/* 2. Primary Showcase Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
        
        {/* Gallery Panel (Left Half - 7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/5] bg-stone-50 rounded-lg overflow-hidden border border-stone-100 relative group">
            <img
              src={product.images[activeImageIdx]}
              alt={product.name}
              className="w-full h-full object-cover select-none group-hover:scale-101 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            {product.stock <= 5 && product.stock > 0 && (
              <span className="absolute top-4 left-4 bg-red-50 border border-red-200 text-red-700 text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded flex items-center gap-1.5 shadow-sm">
                <AlertTriangle className="w-3.5 h-3.5" />
                Critical Stock: {product.stock} left
              </span>
            )}
          </div>
          
          <div className="flex gap-4">
            {product.images.map((img, idx) => (
              <button
                id={`gallery-thumb-${idx}`}
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`w-20 sm:w-24 aspect-[4/5] bg-stone-50 rounded overflow-hidden border cursor-pointer relative ${
                  activeImageIdx === idx ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </button>
            ))}
          </div>
        </div>

        {/* Specifications & Purchasing Desk (Right Half - 5 Cols) */}
        <div className="lg:col-span-5 space-y-8 text-left">
          
          <div className="space-y-3">
            <span className="text-xs uppercase font-mono font-bold text-stone-400 tracking-wider">
              {product.category} Collection
            </span>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-stone-950 uppercase leading-snug">
              {product.name}
            </h1>
            <p className="text-lg font-semibold text-stone-900">${product.price}</p>
            <div className="flex items-center space-x-1 pt-1">
              <Star className="w-4 h-4 fill-stone-850 text-stone-850" />
              <span className="text-xs font-bold text-stone-700 font-mono">{product.rating}</span>
              <span className="text-stone-300">|</span>
              <span className="text-xs text-stone-400 font-light hover:underline cursor-pointer"
                    onClick={() => {
                      const el = document.getElementById('reviews-anchor');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                {product.reviews.length} custom essays
              </span>
            </div>
          </div>

          <div className="w-full h-[1px] bg-stone-100" />

          {/* Tagline & Core description */}
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            {product.description}
          </p>

          <div className="space-y-6">
            
            {/* Color Swatches */}
            <div className="space-y-2.5">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                Finish Surface: <span className="text-stone-900 font-bold">{selectedColor.name}</span>
              </span>
              <div className="flex space-x-3" id="color-selectors">
                {product.colors.map((color) => (
                  <button
                    id={`color-bubble-${color.name.toLowerCase().replace(/\s+/g, '-')}`}
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-8 h-8 rounded-full border border-stone-300 relative focus:outline-none flex items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-inner`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor.name === color.name && (
                      <Check className={`w-4 h-4 ${color.hex === '#FFFFFF' || color.hex === '#F4ECE1' || color.hex === '#E6DCCF' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes selector */}
            <div className="space-y-2.5">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                Standard Dimension Grid
              </span>
              <div className="flex flex-wrap gap-2.5" id="size-selectors">
                {product.sizes.map((size) => (
                  <button
                    id={`size-btn-${size.toLowerCase().replace(/\s+/g, '-')}`}
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4.5 py-2 border rounded text-xs tracking-wider uppercase font-semibold transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'border-stone-950 bg-stone-950 text-white font-semibold'
                        : 'border-stone-250 text-stone-650 hover:bg-stone-50'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector & Cart Placement */}
            <div className="space-y-2.5">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold block">
                Order Multiplier
              </span>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-stone-250 rounded bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 px-3 text-stone-550 hover:text-stone-850 cursor-pointer text-xs font-semibold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-stone-800 font-mono">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 px-3 text-stone-550 hover:text-stone-850 cursor-pointer text-xs font-semibold"
                  >
                    +
                  </button>
                </div>
                
                <span className="text-[10px] text-stone-400 font-mono leading-none">
                  Total Value: <span className="text-stone-800 font-bold">${product.price * quantity}</span>
                </span>
              </div>
            </div>

            {/* Master Actions (Checkout/Wishlist Addition) */}
            <div className="pt-4 flex gap-4">
              <button
                id="add-to-cart-action-btn"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`flex-1 py-4 text-center rounded text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 cursor-pointer shadow-md ${
                  product.stock === 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
                    : 'bg-stone-950 text-white hover:bg-stone-850'
                }`}
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {product.stock === 0 ? 'Out of Vault' : 'Secure Suite'}
              </button>

              <button
                id="wishlist-toggle-action-btn"
                onClick={() => toggleWishlist(product.id)}
                className="p-4 border border-stone-300 hover:bg-stone-100 rounded text-stone-600 hover:text-stone-950 transition-colors cursor-pointer"
                title="Save to Favorites"
              >
                <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>

            {/* Quick checkout notifications */}
            <AnimatePresence>
              {addedNotification && (
                <motion.div
                  id="checkout-notification-toast"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-xs font-medium flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <Check className="w-4.5 h-4.5" />
                    <span>Added {quantity} unit(s) of {product.name} to carrying catalog</span>
                  </div>
                  <button
                    onClick={() => setView('cart')}
                    className="underline text-[10px] font-bold tracking-wider uppercase ml-3 hover:text-green-900"
                  >
                    View Bag
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* 3. Specs Tab Layout */}
          <div className="pt-6 border-t border-stone-100">
            <div className="flex space-x-4 border-b border-stone-200 pb-2">
              {[
                { key: 'details', label: 'Specifications' },
                { key: 'shipping', label: 'Inbound Support' },
                { key: 'provenance', label: 'Ecological Roots' }
              ].map((tab) => (
                <button
                  id={`tab-${tab.key}`}
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`text-xs uppercase tracking-wider font-semibold cursor-pointer py-1 relative ${
                    activeTab === tab.key ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && <div className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-stone-900" />}
                </button>
              ))}
            </div>

            <div className="pt-4 text-xs font-light text-stone-600 leading-relaxed min-h-[140px]">
              {activeTab === 'details' && (
                <ul className="space-y-2 list-disc list-inside">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-2">
                  <p>• Complimentary white-glove curbside transit applied for contiguous states.</p>
                  <p>• Hand-packed inside secure double-walled custom linen storage boxes.</p>
                  <p>• Sells out fast. If out of raw stock, future assembly batches average 12 weeks latency.</p>
                  <p>• Standard 30-day trial return windows provided for fully unblemished packages.</p>
                </div>
              )}
              {activeTab === 'provenance' && (
                <p>
                  Our workshop collaborates directly with indigenous family-owned woodworking guilds, local copper beaters, and fair-trade handloom weavers across Srinagar, Aligarh, Saharanpur, and Rajasthan. We select fine, aged regional timber and hand-spun materials that retain natural organic checking, checks, and unique weave nodes, ensuring every Swara creation represents a sacred, completely unique portrait of Indian soil, time-tested heritage, and authentic geography.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* ================= REVIEWS HUB ANCHOR LAYER ================= */}
      <section id="reviews-anchor" className="border-t border-stone-200 pt-16 mb-20 text-left">
        <h2 className="text-xl font-light tracking-wide text-stone-950 uppercase mb-8">
          Customer Review Essays ({product.reviews.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Distribution Stats (Left - 4 Cols) */}
          <div className="lg:col-span-4 bg-stone-50 p-6 rounded-lg border border-stone-150 space-y-6">
            <div className="text-center py-4 bg-white rounded border border-stone-100 shadow-sm">
              <span className="block text-4xl font-extralight text-stone-900 font-mono">{ratingMetrics.average}</span>
              <div className="flex justify-center my-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(ratingMetrics.average) ? 'fill-stone-850 text-stone-850' : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[10px] uppercase font-mono font-bold text-stone-400">
                Composite Ledger Rating
              </span>
            </div>

            {/* Stars Bar chart */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingMetrics.distribution[star as 5 | 4 | 3 | 2 | 1] || 0;
                const pct = ratingMetrics.total ? Math.round((count / ratingMetrics.total) * 100) : 0;
                return (
                  <div key={star} className="flex items-center space-x-3 text-xs">
                    <span className="w-3 text-stone-500 font-bold font-mono">{star}★</span>
                    <div className="flex-1 h-2 bg-stone-200 rounded overflow-hidden">
                      <div className="h-full bg-stone-950" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-8 text-stone-400 text-right font-mono">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* List of Reviews & Feed back (Right - 8 Cols) */}
          <div className="lg:col-span-8 space-y-8 divide-y divide-stone-100">
            
            {/* Real reactive list */}
            {product.reviews.length === 0 ? (
              <div className="py-8 text-stone-400 font-light text-sm italic">
                No design essays recorded for this piece yet. Be the first to catalog your feedback.
              </div>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="pt-6 first:pt-0 space-y-2 text-left">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-semibold text-stone-950 block">{rev.userName}</span>
                        <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">{rev.date}</span>
                      </div>
                      <div className="flex space-x-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-stone-850 text-stone-850' : 'text-stone-205'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 font-light leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Custom Interactive Review Addition Form */}
            <div className="pt-8 text-left">
              <h4 className="text-sm font-semibold uppercase tracking-widest text-stone-900 mb-6">
                Submit Design Remark
              </h4>

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                
                {reviewSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-xs font-medium">
                    Thank you, your design remark has been recorded inside our catalog ledgers!
                  </div>
                )}
                {reviewFormError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-xs font-medium">
                    {reviewFormError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Signature (Full Name)</label>
                    <input
                      id="review-name"
                      type="text"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="e.g., Jean-Luc P."
                      className="w-full bg-stone-50 border border-stone-250 rounded px-4 py-2 text-xs select-text focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Assigned Satisfaction Indicator</label>
                    <select
                      id="review-rating"
                      value={reviewRating}
                      onChange={(e) => setReviewRating(parseInt(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-250 rounded px-3 py-2 text-xs cursor-pointer focus:outline-none"
                    >
                      <option value="5">★★★★★ Excellent Craft (5/5)</option>
                      <option value="4">★★★★☆ Solid Build (4/5)</option>
                      <option value="3">★★★☆☆ Moderate Quality (3/5)</option>
                      <option value="2">★★☆☆☆ Some Shortfalls (2/5)</option>
                      <option value="1">★☆☆☆☆ Displeasing Material (1/5)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Your Design Remark</label>
                  <textarea
                    id="review-comment"
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Provide a detailed tactile review about the wood checkings, upholstery touch, density, finishing coatings, and general layout suitability..."
                    className="w-full bg-stone-50 border border-stone-250 rounded px-4 py-2.5 text-xs select-text focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <button
                  id="submit-review-btn"
                  type="submit"
                  className="px-6 py-3 bg-stone-950 text-white hover:bg-stone-850 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow"
                >
                  <Send className="w-3.5 h-3.5" />
                  File Remark
                </button>

              </form>
            </div>

          </div>

        </div>
      </section>

      {/* ================= RELATED PRODUCTS GRID ================= */}
      {relatedProducts.length > 0 && (
        <section id="related-products" className="border-t border-stone-200 pt-16">
          <div className="text-left mb-8">
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-stone-400">
              Coordinated Suite Options
            </span>
            <h2 className="text-2xl font-light tracking-tight text-stone-950 uppercase mb-2">
              Related Curations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <div
                id={`related-product-card-${p.id}`}
                key={p.id}
                className="group relative flex flex-col justify-between h-full bg-white border border-stone-100 rounded-lg overflow-hidden"
              >
                <div className="aspect-[4/5] bg-stone-50 overflow-hidden relative">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-101 transition-transform duration-700 cursor-pointer animate-fade-in"
                    onClick={() => setView('detail', p.id)}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-4 space-y-2 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setView('detail', p.id)}
                      className="text-sm font-semibold text-stone-900 group-hover:underline cursor-pointer line-clamp-1"
                    >
                      {p.name}
                    </h3>
                    <p className="text-[10px] text-stone-400 mt-1 line-clamp-1">{p.tagline}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-stone-50">
                    <span className="text-xs font-bold text-stone-850">${p.price}</span>
                    <button
                      id={`related-view-btn-${p.id}`}
                      onClick={() => setView('detail', p.id)}
                      className="text-[10px] tracking-widest uppercase font-bold text-stone-500 hover:text-stone-950"
                    >
                      Inspect
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
