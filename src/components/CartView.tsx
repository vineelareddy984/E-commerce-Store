import React, { useState } from 'react';
import { useAppState } from '../context/AppContext';
import { ShoppingBag, Trash2, ArrowRight, Minus, Plus, CreditCard, Gift } from 'lucide-react';

export default function CartView() {
  const {
    cart,
    setView,
    updateCartQuantity,
    removeFromCart,
    applyPromoCode,
    removePromoCode,
    activeCoupon,
    discountPercentage,
    promoCodeError
  } = useAppState();

  const [promoInput, setPromoInput] = useState('');

  // Computations
  const cartSubtotal = cart.reduce((add, item) => add + item.product.price * item.quantity, 0);
  const discountVal = (cartSubtotal * discountPercentage) / 100;
  // Dynamic free shipping threshold
  const shippingFee = cartSubtotal > 300 || cartSubtotal === 0 ? 0 : 35;
  const estimatedTax = parseFloat(((cartSubtotal - discountVal) * 0.088).toFixed(2));
  const orderTotal = cartSubtotal - discountVal + shippingFee + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) {
      setPromoInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div id="cart-view-empty" className="max-w-xl mx-auto px-4 py-24 text-center font-sans">
        <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="w-8 h-8 text-stone-400 animate-bounce" />
        </div>
        <h2 className="text-xl font-light uppercase tracking-widest text-stone-900 mb-2">
          Your Cargo is Vacant
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto font-light mb-8">
          You haven't packed any handcrafted furniture, apparel accessories, or home-ritual stoneware objects inside your cart ledger yet.
        </p>
        <button
          id="cart-empty-shop-btn"
          onClick={() => setView('products')}
          className="px-8 py-3.5 bg-stone-950 text-white hover:bg-stone-850 rounded text-xs font-bold tracking-widest uppercase shadow transition-colors cursor-pointer"
        >
          Explore Vault Catalog
        </button>
      </div>
    );
  }

  return (
    <div id="cart-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Title */}
      <div className="text-left border-b border-stone-100 pb-6 mb-10">
        <h1 className="text-3xl font-light tracking-wide text-stone-900 uppercase">
          Your Carrying Vault
        </h1>
        <p className="text-stone-450 text-xs mt-1.5 font-mono">
          Manage your selected design suites before secure clearance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* ================= ACTIVE CART ITEMS (LEFT COLUMN - 7 COLS) ================= */}
        <div className="lg:col-span-7 space-y-6">
          {cart.map((item, index) => {
            return (
              <div
                id={`cart-item-${item.product.id}-${index}`}
                key={`${item.product.id}-${item.selectedColor.hex}-${item.selectedSize}`}
                className="p-5 bg-white border border-stone-150 rounded-lg shadow-sm flex flex-col sm:flex-row gap-5 text-left transition-all hover:border-stone-250"
              >
                {/* Product Thumbnail */}
                <div 
                  className="w-full sm:w-28 aspect-[4/5] bg-stone-50 rounded overflow-hidden flex-shrink-0 border border-stone-100 cursor-pointer"
                  onClick={() => setView('detail', item.product.id)}
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Configurations */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-4">
                      <h3
                        onClick={() => setView('detail', item.product.id)}
                        className="text-sm font-semibold text-stone-950 hover:underline cursor-pointer leading-snug line-clamp-1"
                      >
                        {item.product.name}
                      </h3>
                      <span className="text-sm font-semibold text-stone-900">
                        ${item.product.price * item.quantity}
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">
                      Finish: {item.selectedColor.name} | Dimensions: {item.selectedSize}
                    </p>
                    <p className="text-[10px] text-stone-400 font-light mt-1">
                      Unit Price: ${item.product.price}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-3 border-t border-stone-50">
                    
                    {/* Inline Qty Adjuster */}
                    <div className="flex items-center border border-stone-250 rounded bg-white">
                      <button
                        id={`qty-decrease-${index}`}
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.selectedColor.hex,
                            item.selectedSize,
                            item.quantity - 1
                          )
                        }
                        className="p-1.5 px-2.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer text-xs font-bold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      
                      <span className="px-3.5 text-xs font-bold text-stone-850 font-mono">
                        {item.quantity}
                      </span>
                      
                      <button
                        id={`qty-increase-${index}`}
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.selectedColor.hex,
                            item.selectedSize,
                            item.quantity + 1
                          )
                        }
                        className="p-1.5 px-2.5 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer text-xs font-bold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Trash Remover */}
                    <button
                      id={`cart-item-remove-${index}`}
                      onClick={() =>
                        removeFromCart(item.product.id, item.selectedColor.hex, item.selectedSize)
                      }
                      className="text-stone-400 hover:text-red-650 p-1 flex items-center space-x-1.5 cursor-pointer text-[10px] font-bold uppercase tracking-wider font-mono transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* ================= ORDER SUMMARY PANEL (RIGHT COLUMN - 5 COLS) ================= */}
        <div className="lg:col-span-5 space-y-6 text-left">
          
          <div className="bg-stone-50 rounded-lg p-6 border border-stone-150 space-y-6">
            <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950 pb-3 border-b border-stone-200">
              Subtotal Calculations
            </h3>

            {/* Calculations breakout */}
            <div className="space-y-4 text-xs font-light text-stone-600 border-b border-stone-200 border-dashed pb-4">
              <div className="flex justify-between">
                <span>Items Ledger Value</span>
                <span className="font-mono text-stone-900 font-medium">${cartSubtotal}</span>
              </div>
              
              {activeCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5" />
                    Ledger Discount ({discountPercentage}%)
                  </span>
                  <span className="font-mono">-${discountVal}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Est. Hand-Packed Transit Carriers</span>
                <span className="font-mono text-stone-900 font-medium">
                  {shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span>Allocated Sales Tax Rate (8.8%)</span>
                <span className="font-mono text-stone-900 font-medium">${estimatedTax}</span>
              </div>
            </div>

            {/* Complete cost */}
            <div className="flex justify-between items-end">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-stone-500 block">Ultimate Due</span>
                <span className="text-[10px] text-stone-400 mt-0.5 block">Includes standard local tariffs</span>
              </div>
              <span className="text-2xl font-bold text-stone-955 font-mono">${orderTotal.toFixed(2)}</span>
            </div>

            {/* Secure Clearance button */}
            <button
              id="cart-proceed-checkout-btn"
              onClick={() => setView('checkout')}
              className="w-full py-4 bg-stone-950 text-white hover:bg-stone-850 rounded text-center text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow cursor-pointer"
            >
              <CreditCard className="w-4.5 h-4.5" />
              Secure Clearance
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Dynamic Interactive Coupon Box */}
          <div className="bg-white border border-stone-250 p-6 rounded-lg space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-stone-950 font-bold">Ledger Discount Codes</h4>
            
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                id="cart-promo-input"
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="e.g., LUXE20"
                className="flex-1 bg-stone-50 border border-stone-250 rounded px-3.5 py-2 text-xs uppercase tracking-wider font-semibold select-text focus:outline-none focus:ring-1 focus:ring-stone-500 placeholder-stone-400"
              />
              <button
                id="apply-promo-btn"
                type="submit"
                className="px-4 py-2 bg-stone-950 hover:bg-stone-850 text-white rounded text-xs uppercase font-bold tracking-wider cursor-pointer"
              >
                Apply
              </button>
            </form>

            {promoCodeError && (
              <p className="text-red-600 text-xs font-semibold leading-relaxed">
                {promoCodeError}
              </p>
            )}

            {activeCoupon && (
              <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded text-xs flex justify-between items-center">
                <div>
                  <span className="font-bold">{activeCoupon} Code Applied</span>
                  <span className="block text-[10px] text-green-600">{discountPercentage}% overall subtotal deduction active.</span>
                </div>
                <button
                  id="remove-promo-btn"
                  onClick={removePromoCode}
                  className="p-1 hover:bg-green-100 rounded text-stone-600 hover:text-stone-950 cursor-pointer"
                  title="Remove Code"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="p-4 bg-stone-50 rounded border border-stone-100 text-left space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold block">Available Codes</span>
              <p className="text-[11px] text-stone-600">
                • <strong className="font-mono text-stone-900">MELLOW10</strong> — 10% subtotal off general orders
              </p>
              <p className="text-[11px] text-stone-600">
                • <strong className="font-mono text-stone-900">LUXE20</strong> — 20% off whole collections
              </p>
              <p className="text-[11px] text-stone-600">
                • <strong className="font-mono text-stone-900">MINIMAL50</strong> — 50% exclusive opening code
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
