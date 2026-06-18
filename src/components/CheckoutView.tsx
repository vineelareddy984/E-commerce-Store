import React, { useState, useMemo } from 'react';
import { useAppState } from '../context/AppContext';
import { ShoppingBag, ChevronRight, Lock, CheckCircle, CreditCard, Printer, ExternalLink, RefreshCw, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function CheckoutView() {
  const {
    cart,
    setView,
    placeOrder,
    activeCoupon,
    discountPercentage,
    user
  } = useAppState();

  // Wizard state: 'shipping' | 'payment' | 'confirmation'
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Step 1 Form state
  const [fullName, setFullName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [street, setStreet] = useState(user.addresses?.[0]?.street || '');
  const [city, setCity] = useState(user.addresses?.[0]?.city || '');
  const [stateProv, setStateProv] = useState(user.addresses?.[0]?.state || '');
  const [zipCode, setZipCode] = useState(user.addresses?.[0]?.zipCode || '');
  const [country, setCountry] = useState(user.addresses?.[0]?.country || 'United States');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 2 Stripe form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentErrors, setPaymentErrors] = useState<string | null>(null);

  // Calculations
  const cartSubtotal = cart.reduce((add, item) => add + item.product.price * item.quantity, 0);
  const discountVal = (cartSubtotal * discountPercentage) / 100;
  const shippingFee = cartSubtotal > 300 || cartSubtotal === 0 ? 0 : 35;
  const estimatedTax = parseFloat(((cartSubtotal - discountVal) * 0.088).toFixed(2));
  const orderTotal = cartSubtotal - discountVal + shippingFee + estimatedTax;

  // Handle auto-formatting for Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const matches = value.match(/\d{1,4}/g);
    setCardNumber(matches ? matches.join(' ') : '');
  };

  // Handle auto-formatting for Expiry (adds slash after 2 digits)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      setCardExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setCardExpiry(value);
    }
  };

  // Handle digit validation for CVC
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCardCvc(value);
  };

  // Form Val Check 1 (Shipping & Email)
  const validateShippingForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim() || fullName.length < 3) errors.fullName = 'Full name must contain at least 3 letters';
    if (!email.trim() || !email.includes('@')) errors.email = 'Please provide a valid shipping email';
    if (!street.trim()) errors.street = 'Street address cannot be empty';
    if (!city.trim()) errors.city = 'City is required';
    if (!stateProv.trim()) errors.stateProv = 'State is required';
    if (!zipCode.trim() || zipCode.length < 5) errors.zipCode = 'ZIP contains at least 5 character codes';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep('payment');
    }
  };

  // Stripe Card Payment Submissions
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentErrors(null);

    // Format matches checking
    const unspacedCard = cardNumber.replace(/\s+/g, '');
    if (unspacedCard.length !== 16) {
      setPaymentErrors('Credit Card Number must contain exactly 16 digits');
      return;
    }
    if (cardExpiry.length !== 5) {
      setPaymentErrors('Expiry must map to MM/YY guidelines');
      return;
    }
    if (cardCvc.length < 3) {
      setPaymentErrors('CVC Security code must span at least 3 digits');
      return;
    }

    // Trigger loading spinner to emulate real stripe security gateway checking
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      const details = {
        fullName,
        street,
        city,
        state: stateProv,
        zipCode,
        country
      };

      const finalOrder = placeOrder(
        details,
        `Credit Card ending in ${unspacedCard.slice(-4)}`,
        cartSubtotal,
        estimatedTax,
        shippingFee
      );

      setPlacedOrder(finalOrder);
      setStep('confirmation');
    }, 2200);
  };

  // Autofill address card for rapid testing
  const autofillAddressCard = () => {
    setFullName('Elena Rostova');
    setEmail('elena@rostovadesigns.com');
    setStreet('12 Mercer St, Suite 402');
    setCity('New York');
    setStateProv('NY');
    setZipCode('10013');
    setCountry('United States');
  };

  return (
    <div id="checkout-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* 1. Header with dynamic progress indicators */}
      {step !== 'confirmation' && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-6 mb-10 gap-4">
          <div className="text-left font-sans">
            <h1 className="text-2xl font-light tracking-wide text-stone-900 uppercase">Secure Checkout</h1>
            <p className="text-stone-400 text-[10px] uppercase font-mono mt-0.5">SSL Secured TLS Encrypted Socket Connection</p>
          </div>
          
          {/* Progress Tracker Bar */}
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-stone-400">
            <span className={`${step === 'shipping' ? 'text-stone-950 underline font-bold decoration-2' : 'text-stone-500'}`}>1. Shipping</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <span className={`${step === 'payment' ? 'text-stone-950 underline font-bold decoration-2' : ''}`}>2. Payment details</span>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300" />
            <span>3. Order Placed</span>
          </div>
        </div>
      )}

      {/* ================= LOADING SCREEN OVERLAY ================= */}
      {isLoading && (
        <div id="payment-loading-modal" className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="mb-6"
          >
            <RefreshCw className="w-12 h-12 text-stone-300" />
          </motion.div>
          <h3 className="text-sm font-semibold uppercase tracking-widest">Verifying Ledger Integrity...</h3>
          <p className="text-xs text-stone-400 font-light mt-2 max-w-sm text-center leading-relaxed">
            Standard Secure Stripe handshakes are logging keys with routing banks. This will conclude within seconds. Do not refresh.
          </p>
        </div>
      )}

      {/* ================= MAIN CHECKOUT SPLITS ================= */}
      {step !== 'confirmation' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* ================= LEFT HALF - DYNAMIC STEPS ================= */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              
              {/* STEP 1: SHIPPING & CONTACT */}
              {step === 'shipping' && (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  id="checkout-shipping-section"
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center bg-stone-50 p-4 rounded border border-stone-200">
                    <div>
                      <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950">Shipment Consignment</h3>
                      <p className="text-[10px] text-stone-400 mt-0.5">Please specify precise delivery instructions</p>
                    </div>
                    <button
                      id="autofill-btn"
                      type="button"
                      onClick={autofillAddressCard}
                      className="px-2.5 py-1.5 border border-stone-300 hover:bg-stone-100 text-stone-700 text-[9px] uppercase tracking-wider font-bold rounded bg-white cursor-pointer"
                    >
                      Autofill Mock Address
                    </button>
                  </div>

                  <form onSubmit={submitShipping} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Consignee Full Name</label>
                        <input
                          id="ship-fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={`w-full bg-stone-50 border rounded px-4 py-2.5 text-xs select-text focus:outline-none focus:ring-1 focus:ring-stone-500 placeholder-stone-400 ${
                            formErrors.fullName ? 'border-red-500 bg-red-50/20' : 'border-stone-250'
                          }`}
                          placeholder="e.g., Jean-Luc Piccard"
                        />
                        {formErrors.fullName && <p className="text-red-500 text-[10px] font-semibold">{formErrors.fullName}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Consignment Email</label>
                        <input
                          id="ship-email"
                          type="text"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`w-full bg-stone-50 border rounded px-4 py-2.5 text-xs select-text focus:outline-none focus:ring-1 focus:ring-stone-400 placeholder-stone-400 ${
                            formErrors.email ? 'border-red-500 bg-red-50/20' : 'border-stone-250'
                          }`}
                          placeholder="jean@piccardstudios.com"
                        />
                        {formErrors.email && <p className="text-red-500 text-[10px] font-semibold">{formErrors.email}</p>}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Consignway Street Address</label>
                      <input
                        id="ship-street"
                        type="text"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className={`w-full bg-stone-50 border rounded px-4 py-2.5 text-xs select-text focus:outline-none focus:ring-1 focus:ring-stone-500 placeholder-stone-400 ${
                          formErrors.street ? 'border-red-500 bg-red-50/20' : 'border-stone-250'
                        }`}
                        placeholder="452 Broome Street, Apt B"
                      />
                      {formErrors.street && <p className="text-red-500 text-[10px] font-semibold">{formErrors.street}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      
                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">City</label>
                        <input
                          id="ship-city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={`w-full bg-stone-50 border rounded px-4 py-2.5 text-xs select-text focus:outline-none ${
                            formErrors.city ? 'border-red-500' : 'border-stone-250'
                          }`}
                          placeholder="New York"
                        />
                        {formErrors.city && <p className="text-red-500 text-[10px] font-semibold">{formErrors.city}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">State</label>
                        <input
                          id="ship-state"
                          type="text"
                          value={stateProv}
                          onChange={(e) => setStateProv(e.target.value)}
                          className={`w-full bg-stone-50 border rounded px-4 py-2.5 text-xs select-text focus:outline-none ${
                            formErrors.stateProv ? 'border-red-500' : 'border-stone-250'
                          }`}
                          placeholder="NY"
                        />
                        {formErrors.stateProv && <p className="text-red-500 text-[10px] font-semibold">{formErrors.stateProv}</p>}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">ZIP Postal Code</label>
                        <input
                          id="ship-zip"
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className={`w-full bg-stone-50 border rounded px-4 py-2.5 text-xs select-text focus:outline-none ${
                            formErrors.zipCode ? 'border-red-500' : 'border-stone-250'
                          }`}
                          placeholder="10013"
                        />
                        {formErrors.zipCode && <p className="text-red-500 text-[10px] font-semibold">{formErrors.zipCode}</p>}
                      </div>

                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Country</label>
                      <select
                        id="ship-country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-250 rounded px-3.5 py-2.5 text-xs cursor-pointer focus:outline-none"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Denmark">Denmark (Copenhagen)</option>
                      </select>
                    </div>

                    <button
                      id="shipping-next-btn"
                      type="submit"
                      className="w-full py-3.5 mt-8 bg-stone-950 hover:bg-stone-850 text-white rounded text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow"
                    >
                      <span>Proceed to Payment</span>
                      <ChevronRight className="w-4.5 h-4.5" />
                    </button>

                  </form>
                </motion.div>
              )}

              {/* STEP 2: PAYMENT WITH MOCK INTEGRITY */}
              {step === 'payment' && (
                <motion.div
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                  id="checkout-payment-section"
                  className="space-y-6"
                >
                  <div className="bg-stone-900 text-stone-300 p-5 rounded-lg border border-stone-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-stone-100 text-xs uppercase font-bold tracking-widest flex items-center gap-2">
                        <Lock className="w-4 h-4 text-stone-400" />
                        Cardholder Settlement Terminal
                      </h3>
                      <span className="text-[9px] uppercase font-mono bg-white/10 px-2 py-0.5 rounded text-stone-300 font-bold">Stripe Inline</span>
                    </div>
                    <p className="text-[11px] text-stone-400 font-light leading-relaxed">
                      This is a real-working sandbox payment frame styled after Stripe Components. Enter any realistic 16-digit structure (e.g. Test Key: <code className="text-white font-mono font-bold bg-white/5 py-0.5 px-1 rounded">4242 4242 4242 4242</code>) to pass checking sequences.
                    </p>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-4 bg-stone-50 p-6 rounded-lg border border-stone-150">
                    
                    {paymentErrors && (
                      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-xs font-semibold">
                        {paymentErrors}
                      </div>
                    )}

                    {/* Styled Card inputs mimicking stripe element */}
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Credit Card Numbers</label>
                      <div className="relative">
                        <input
                          id="stripe-cc-number"
                          type="text"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4242 4242 4242 4242"
                          className="w-full pl-11 pr-4 py-3 bg-white border border-stone-250 rounded text-xs select-text tracking-widest font-mono font-semibold focus:outline-none"
                        />
                        <CreditCard className="w-5 h-5 text-stone-400 absolute left-4.5 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Expiry Date</label>
                        <input
                          id="stripe-cc-expiry"
                          type="text"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full bg-white border border-stone-250 rounded px-4 py-3 text-xs select-text tracking-widest font-mono focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Security Code (CVC)</label>
                        <input
                          id="stripe-cc-cvc"
                          type="password"
                          value={cardCvc}
                          onChange={handleCvcChange}
                          placeholder="•••"
                          className="w-full bg-white border border-stone-250 rounded px-4 py-3 text-xs select-text tracking-widest font-mono focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded border border-stone-100 flex items-center justify-between text-xs mt-4">
                      <span className="text-stone-500 font-light">Allocated Address:</span>
                      <strong className="text-stone-900 line-clamp-1 max-w-[200px]">{street}, {city}</strong>
                    </div>

                    <div className="pt-6 flex gap-4">
                      <button
                        id="payment-back-btn"
                        type="button"
                        onClick={() => setStep('shipping')}
                        className="px-5 py-3.5 border border-stone-300 text-stone-700 rounded text-xs uppercase tracking-widest font-bold cursor-pointer hover:bg-stone-100 bg-white"
                      >
                        Back
                      </button>
                      <button
                        id="stripe-pay-btn"
                        type="submit"
                        className="flex-1 py-3.5 bg-stone-950 text-white rounded text-xs uppercase font-bold tracking-widest hover:bg-stone-850 flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Authorize Charge of ${orderTotal.toFixed(2)}</span>
                      </button>
                    </div>

                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ================= RIGHT HALF - CART LEDGER BREAKDOWN ================= */}
          <aside className="lg:col-span-5 bg-stone-50 p-6 rounded-lg border border-stone-150 space-y-6">
            
            <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950 pb-3 border-b border-stone-250 flex items-center justify-between">
              <span>Clearing Bag</span>
              <span className="font-mono text-stone-500 text-xs">({cart.length} Suites)</span>
            </h3>

            {/* List */}
            <div className="divide-y divide-stone-200 overflow-y-auto max-h-[280px] pr-2">
              {cart.map((item, idx) => (
                <div key={idx} className="py-3 first:pt-0 last:pb-0 flex gap-4">
                  <div className="w-14 aspect-[4/5] bg-white rounded overflow-hidden border border-stone-200 relative flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-medium text-stone-900 line-clamp-1">{item.product.name}</h4>
                      <strong className="text-stone-950 ml-2 font-mono">${item.product.price * item.quantity}</strong>
                    </div>
                    <p className="text-[10px] text-stone-400 mt-0.5">Color: {item.selectedColor.name} | Size: {item.selectedSize}</p>
                    <p className="text-[10px] text-stone-400 font-mono mt-1">Multiplier: {item.quantity}x</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals panel split */}
            <div className="space-y-3.5 pt-4 border-t border-stone-200 border-dashed text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Ledger subtotal</span>
                <span className="font-mono text-stone-900 font-medium">${cartSubtotal}</span>
              </div>
              {activeCoupon && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>Discount Key applied ({discountPercentage}%)</span>
                  <span className="font-mono">-${discountVal}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated hand-packing courier</span>
                <span className="font-mono text-stone-900 font-medium">
                  {shippingFee === 0 ? 'Complimentary' : `$${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Allocated Local Tax rate (8.8%)</span>
                <span className="font-mono text-stone-900 font-medium">${estimatedTax}</span>
              </div>
              
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-150">
                <span>Gross Due</span>
                <span className="font-mono">${orderTotal.toFixed(2)}</span>
              </div>
            </div>

          </aside>

        </div>
      ) : (
        /* ================= STEP 3: ORDER CONFIRMATION / INVOICE TICKET ================= */
        <motion.section
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white border border-stone-300 rounded-xl shadow-2xl p-6 sm:p-10 text-left relative overflow-hidden font-sans"
          id="confirmation-receipt-panel"
        >
          
          {/* Aesthetic receipt margins */}
          <div className="absolute top-0 inset-x-0 h-2 bg-stone-950" />
          
          {/* Success Logo Banner */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 mb-8 border-b border-stone-200">
            <div>
              <div className="flex items-center space-x-2 text-green-700 font-bold uppercase text-xs tracking-widest mb-2">
                <CheckCircle className="w-5 h-5" />
                <span>Consignment Captured Successfully</span>
              </div>
              <h2 className="text-3xl font-serif text-stone-900 tracking-wider uppercase">Swara Heritage</h2>
            </div>
            
            <button
              id="print-receipt-btn"
              onClick={() => window.print()}
              className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-semibold uppercase tracking-wider rounded hover:bg-stone-50 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs mb-8">
            <div className="space-y-2 text-left">
              <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">Ledger Reference</span>
              <p className="text-sm font-bold text-stone-950 font-mono">{placedOrder?.id || 'ORD-984211'}</p>
              
              <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block pt-2">Consigned Date</span>
              <p className="text-stone-800">{placedOrder?.date}</p>
              
              <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block pt-2">Transit Tracking Ref</span>
              <span className="font-mono text-stone-500 hover:underline cursor-pointer inline-flex items-center gap-1">
                {placedOrder?.trackingNumber || 'USPS-94001118995622109'}
                <ExternalLink className="w-3 h-3 text-stone-405" />
              </span>
            </div>

            <div className="space-y-2 text-left">
              <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">Conveyance Address</span>
              <p className="font-bold text-stone-900">{placedOrder?.shippingAddress?.fullName || fullName}</p>
              <p className="text-stone-700">{placedOrder?.shippingAddress?.street || street}</p>
              <p className="text-stone-700">{placedOrder?.shippingAddress?.city || city}, {placedOrder?.shippingAddress?.state || stateProv} {placedOrder?.shippingAddress?.zipCode || zipCode}</p>
              <p className="text-stone-500">{placedOrder?.shippingAddress?.country || country}</p>
            </div>
          </div>

          {/* Receipt Items list */}
          <div className="border-t border-b border-stone-200 py-6 my-6 text-xs">
            <h4 className="text-[10px] uppercase font-mono font-bold text-stone-450 mb-4 tracking-wider">Deposited Suites</h4>
            
            <div className="divide-y divide-stone-100">
              {placedOrder?.items?.map((item: any, idx: number) => (
                <div key={idx} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 aspect-[4/5] bg-stone-50 border border-stone-150 rounded overflow-hidden">
                      <img src={item.image} alt={item.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <strong className="text-stone-900 block">{item.productName}</strong>
                      <span className="text-[10px] text-stone-400 font-mono block">Color: {item.color} | Size: {item.size}</span>
                      <span className="text-[10px] text-stone-400 font-mono block">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <strong className="font-mono text-stone-950">${item.price * item.quantity}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Breakdown Total cost */}
          <div className="flex flex-col items-end text-xs text-stone-600 space-y-2 bg-stone-50/50 p-5 rounded border border-stone-100">
            <div className="flex justify-between w-full sm:max-w-[280px]">
              <span>Cart items base</span>
              <strong className="font-mono text-stone-900">${placedOrder?.subtotal}</strong>
            </div>
            {placedOrder?.discount > 0 && (
              <div className="flex justify-between w-full sm:max-w-[280px] text-green-600 font-bold">
                <span>Discount applied</span>
                <strong className="font-mono">-${placedOrder?.discount}</strong>
              </div>
            )}
            <div className="flex justify-between w-full sm:max-w-[280px]">
              <span>Packing carriers</span>
              <strong className="font-mono text-stone-900">{placedOrder?.shippingFee === 0 ? 'Complimentary' : `$${placedOrder?.shippingFee}`}</strong>
            </div>
            <div className="flex justify-between w-full sm:max-w-[280px]">
              <span>Allocated Sales Tax</span>
              <strong className="font-mono text-stone-900">${placedOrder?.tax}</strong>
            </div>
            <div className="flex justify-between w-full sm:max-w-[280px] text-sm font-bold text-stone-955 pt-3 border-t border-stone-200">
              <span>Paid Gross Value</span>
              <strong className="font-mono">${placedOrder?.total?.toFixed(2)}</strong>
            </div>
          </div>

          {/* Post checkout greeting */}
          <div className="mt-8 pt-8 border-t border-stone-250 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-light text-stone-505 bg-stone-50/20">
            <p>A digital packing receipt has been transmitted to <strong className="text-stone-950 font-bold">{email || 'your customer registry'}</strong></p>
            <button
              id="success-shop-more"
              onClick={() => setView('products')}
              className="px-6 py-2.5 bg-stone-950 hover:bg-stone-850 text-white font-bold rounded uppercase tracking-wider cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>

        </motion.section>
      )}

    </div>
  );
}
