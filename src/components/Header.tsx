import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ShoppingBag, Search, User, Heart, Settings, Menu, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Header() {
  const { cart, wishlist, currentView, setView, searchQuery, setSearchQuery, removeFromCart } = useAppState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setView('products');
    setSearchOpen(false);
  };

  const menuItems = [
    { label: 'Home', view: 'home' as const },
    { label: 'Shop All', view: 'products' as const },
    { label: 'Wishlist & Account', view: 'account' as const },
    { label: 'Studio Admin', view: 'admin' as const },
  ];

  return (
    <>
      <header id="site-header" className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Mobile Menu Icon */}
          <button 
            id="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-stone-600 hover:text-stone-900 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Elegant Indian Heritage Logo */}
          <div className="flex-1 md:flex-initial">
            <button 
              id="header-logo-btn"
              onClick={() => setView('home')} 
              className="text-2xl tracking-[0.22em] font-serif uppercase text-stone-900 hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <span>SWARA</span>
              <span className="font-sans font-light tracking-[0.1em] text-[10px] uppercase text-warm-brass bg-royal-emerald/10 px-2 py-0.5 rounded border border-warm-brass/20">
                Heritage
              </span>
            </button>
          </div>

          {/* Desktop Navigation Link Array */}
          <nav id="desktop-nav" className="hidden md:flex items-center space-x-8 uppercase text-xs tracking-widest font-medium text-stone-600">
            {menuItems.map((item) => (
              <button
                id={`nav-${item.view}`}
                key={item.label}
                onClick={() => setView(item.view)}
                className={`hover:text-stone-950 transition-colors cursor-pointer py-2 relative ${
                  currentView === item.view ? 'text-stone-950' : ''
                }`}
              >
                {item.label}
                {currentView === item.view && (
                  <motion.div 
                    layoutId="header-active-dot" 
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-stone-900" 
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Action Icons Panel */}
          <div id="header-actions" className="flex items-center space-x-1 sm:space-x-3">
            
            {/* Search Toggle */}
            <div className="relative">
              <button
                id="search-toggle-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-50 rounded-full transition-all"
                title="Search Store"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Account Tab */}
            <button
              id="account-nav-btn"
              onClick={() => setView('account')}
              className={`p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-50 rounded-full transition-all ${
                currentView === 'account' ? 'text-stone-950 bg-stone-50' : ''
              }`}
              title="User Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist Indicator */}
            <button
              id="wishlist-nav-btn"
              onClick={() => setView('account')}
              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-50 rounded-full transition-all relative"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-stone-850" />
              )}
            </button>

            {/* Cart Icon Button */}
            <button
              id="cart-drawer-btn"
              onClick={() => setCartDrawerOpen(true)}
              className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-50 rounded-full transition-all relative"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-stone-950 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-semibold">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Desktop Collapsible Search Slider */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              id="search-dropdown-bar"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-stone-50 border-b border-stone-100 overflow-hidden"
            >
              <div className="max-w-3xl mx-auto px-4 py-4 sm:py-6">
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <Search className="w-5 h-5 text-stone-400 absolute left-4" />
                  <input
                    id="search-input-field"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search premium collections (e.g., Lounge, Oak, Brass)..."
                    className="w-full pl-12 pr-20 py-3 bg-white border border-stone-200 rounded-lg text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-500 focus:border-stone-500"
                    autoFocus
                  />
                  <div className="absolute right-2 flex items-center space-x-1">
                    <button
                      id="search-submit-btn"
                      type="submit"
                      className="px-3 py-1.5 bg-stone-950 text-white text-xs uppercase tracking-wider font-semibold rounded-md hover:bg-stone-800"
                    >
                      Search
                    </button>
                    <button
                      id="search-cancel-btn"
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchOpen(false);
                      }}
                      className="p-1 px-2 text-xs text-stone-500 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Navigation Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              id="mobile-menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50 md:hidden"
            />
            <motion.div
              id="mobile-menu-panel"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 md:hidden flex flex-col"
            >
              <div className="h-18 px-6 flex items-center justify-between border-b border-stone-100">
                <span className="text-sm font-semibold uppercase tracking-widest text-stone-900">Navigation</span>
                <button 
                  id="close-mobile-menu-btn"
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 text-stone-500 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 px-6 py-8 space-y-6">
                {menuItems.map((item) => (
                  <button
                    id={`mobile-nav-${item.view}`}
                    key={item.label}
                    onClick={() => {
                      setView(item.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left text-lg font-light tracking-wide uppercase py-2 border-b border-stone-50 ${
                      currentView === item.view ? 'text-stone-950 border-stone-200' : 'text-stone-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <div className="p-6 border-t border-stone-105 bg-stone-50 text-xs text-stone-500 space-y-2">
                <p>© 2026 Swara Heritage. All rights reserved.</p>
                <p>Curating royal Indian artistry for sovereign sanctuaries.</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Slide-out Cart Preview Drawer */}
      <AnimatePresence>
        {cartDrawerOpen && (
          <>
            <motion.div
              id="cart-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            <motion.div
              id="cart-drawer-panel"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              className="fixed inset-y-0 right-0 w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
            >
              {/* Drawer Header */}
              <div className="h-18 px-6 flex items-center justify-between border-b border-stone-100 bg-stone-50/50">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-stone-800" />
                  <span className="text-sm font-semibold uppercase tracking-widest text-stone-950">
                    Shopping Bag ({cartItemsCount})
                  </span>
                </div>
                <button 
                  id="close-cart-drawer-btn"
                  onClick={() => setCartDrawerOpen(false)} 
                  className="p-2 text-stone-500 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                      <ShoppingBag className="w-6 h-6 text-stone-400" />
                    </div>
                    <p className="text-sm text-stone-500 font-medium max-w-xs leading-relaxed">
                      Your premium shopping carrier is currently empty.
                    </p>
                    <button
                      id="empty-cart-drawer-shop-btn"
                      onClick={() => {
                        setView('products');
                        setCartDrawerOpen(false);
                      }}
                      className="mt-6 px-5 py-2.5 bg-stone-955 text-white text-xs font-semibold tracking-wider uppercase rounded hover:bg-stone-850"
                    >
                      Explore Products
                    </button>
                  </div>
                ) : (
                  cart.map((item, idx) => (
                    <div key={`${item.product.id}-${item.selectedColor.hex}-${item.selectedSize}`} className="py-4 flex gap-4 first:pt-2 last:pb-2">
                      <div className="w-20 h-20 bg-stone-50 rounded overflow-hidden flex-shrink-0 border border-stone-100 cursor-pointer"
                           onClick={() => { setView('detail', item.product.id); setCartDrawerOpen(false); }}>
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium text-stone-900 line-clamp-1 hover:underline cursor-pointer"
                                onClick={() => { setView('detail', item.product.id); setCartDrawerOpen(false); }}>
                              {item.product.name}
                            </h4>
                            <span className="text-sm font-medium text-stone-900 ml-2">
                              ${item.product.price * item.quantity}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5 font-mono">
                            Color: {item.selectedColor.name} | Size: {item.selectedSize}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-stone-500">Qty: {item.quantity}</span>
                          <button
                            id={`remove-cart-drawer-item-${idx}`}
                            onClick={() => removeFromCart(item.product.id, item.selectedColor.hex, item.selectedSize)}
                            className="text-stone-400 hover:text-red-600 p-1 flex items-center space-x-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-semibold tracking-wider font-mono uppercase">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer Summary */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">Subtotal</span>
                    <span className="text-lg font-bold text-stone-950">${cartSubtotal}</span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-relaxed">
                    VAT and calculated shipping variables are integrated during dynamic checkout screens.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      id="drawer-view-cart-btn"
                      onClick={() => {
                        setView('cart');
                        setCartDrawerOpen(false);
                      }}
                      className="w-full py-3 border border-stone-300 text-stone-700 rounded text-center text-xs font-semibold uppercase tracking-wider hover:bg-neutral-100 transition-colors"
                    >
                      View Bag
                    </button>
                    <button
                      id="drawer-checkout-btn"
                      onClick={() => {
                        setView('checkout');
                        setCartDrawerOpen(false);
                      }}
                      className="w-full py-3 bg-stone-950 text-white rounded text-center text-xs font-semibold uppercase tracking-wider hover:bg-stone-850 transition-colors"
                    >
                      Checkout Securely
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
