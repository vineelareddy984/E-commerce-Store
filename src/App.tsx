import React from 'react';
import { AppProvider, useAppState } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ProductListView from './components/ProductListView';
import ProductDetailView from './components/ProductDetailView';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import UserAccountView from './components/UserAccountView';
import AdminView from './components/AdminView';
import { motion, AnimatePresence } from 'motion/react';

function InnerAppContent() {
  const { currentView } = useAppState();

  return (
    <div className="flex flex-col min-h-screen bg-white text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* 24-hr layout alert banner (optional/elegant) */}
      <div id="promo-banner-badge" className="bg-stone-950 text-white text-[10px] tracking-widest uppercase py-2 px-4 text-center font-mono font-medium">
        Complimentary white-glove courier dispatching applied on all suites over $300.
      </div>

      {/* Modern floating top Header */}
      <Header />

      {/* Main Core dynamic screen view wrap */}
      <main className="flex-1 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="w-full"
          >
            {currentView === 'home' && <HomeView />}
            {currentView === 'products' && <ProductListView />}
            {currentView === 'detail' && <ProductDetailView />}
            {currentView === 'cart' && <CartView />}
            {currentView === 'checkout' && <CheckoutView />}
            {currentView === 'account' && <UserAccountView />}
            {currentView === 'admin' && <AdminView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Footer block */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <InnerAppContent />
    </AppProvider>
  );
}
