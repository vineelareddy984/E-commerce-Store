import React, { useState, useMemo } from 'react';
import { useAppState } from '../context/AppContext';
import { User, Mail, Phone, MapPin, Heart, ShoppingBag, Eye, Trash2, CheckCircle, Calendar, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function UserAccountView() {
  const {
    user,
    products,
    wishlist,
    toggleWishlist,
    setView,
    updateProfile,
    addAddress,
    deleteAddress,
    updateAddress
  } = useAppState();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses'>('profile');

  // Profile forms
  const [profileName, setProfileName] = useState(user.name);
  const [profileEmail, setProfileEmail] = useState(user.email);
  const [profilePhone, setProfilePhone] = useState(user.phone);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Address additions modal form
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addrName, setAddrName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrZip, setAddrZip] = useState('');
  const [addrCountry, setAddrCountry] = useState('United States');
  const [addrDefault, setAddrDefault] = useState(false);
  const [addrError, setAddrError] = useState('');

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess(false);

    if (profileName.trim().length < 3) {
      setProfileError('FullName should contain at least 3 characters');
      return;
    }
    if (!profileEmail.trim() || !profileEmail.includes('@')) {
      setProfileError('Please provide a legitimate communication email');
      return;
    }

    updateProfile(profileName, profileEmail, profilePhone);
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddrError('');

    if (!addrName.trim()) return setAddrError('Consignee recipient name is required');
    if (!addrStreet.trim()) return setAddrError('Street address cannot be empty');
    if (!addrCity.trim()) return setAddrError('City is required');
    if (addrZip.trim().length < 5) return setAddrError('ZIP contains at least 5 digits');

    addAddress({
      fullName: addrName,
      street: addrStreet,
      city: addrCity,
      state: addrState,
      zipCode: addrZip,
      country: addrCountry,
      isDefault: addrDefault
    });

    // Reset Form
    setAddrName('');
    setAddrStreet('');
    setAddrCity('');
    setAddrState('');
    setAddrZip('');
    setAddrDefault(false);
    setShowAddressModal(false);
  };

  return (
    <div id="user-account-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Title */}
      <div className="text-left border-b border-stone-100 pb-6 mb-10">
        <h1 className="text-3xl font-light tracking-wide text-stone-900 uppercase">
          Client Workspace
        </h1>
        <p className="text-stone-450 text-xs mt-1.5 font-mono">
          Update specifications, track transit timelines, and sift saved objects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
        
        {/* Navigation Tabs (Left Sidebar) */}
        <aside id="account-sidebar" className="bg-stone-50 p-5 rounded-lg border border-stone-150 space-y-2 text-left">
          
          <div className="flex items-center space-x-3 pb-4 mb-4 border-b border-stone-200">
            <div className="w-10 h-10 bg-stone-950 text-white rounded-full flex items-center justify-center font-semibold text-sm">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <strong className="text-stone-950 block text-xs uppercase">{user.name}</strong>
              <span className="text-[10px] text-stone-450 lowercase">{user.email}</span>
            </div>
          </div>

          {[
            { key: 'profile', label: 'Identity Settings' },
            { key: 'orders', label: 'Order History & Status' },
            { key: 'wishlist', label: 'Wishlist Catalog' },
            { key: 'addresses', label: 'Saved Addresses' }
          ].map((tab) => (
            <button
              id={`account-tab-${tab.key}`}
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`w-full text-left font-light text-xs px-3.5 py-2.5 rounded transition-all cursor-pointer ${
                activeTab === tab.key ? 'bg-stone-950 text-white font-medium shadow-sm' : 'text-stone-600 hover:bg-stone-150'
              }`}
            >
              {tab.label}
            </button>
          ))}

        </aside>

        {/* Dynamic Inner Panel View (Right 3 Cols) */}
        <main className="lg:col-span-3">
          <AnimatePresence mode="wait">
            
            {/* PROFILE SPECIFICATION SETTINGS */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                id="profile-tab-panel"
                className="space-y-6 text-left"
              >
                <div className="bg-stone-50 p-4 border border-stone-150 rounded">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950">Identity Credentials</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">Edit public billing registry variables securely</p>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-2xl">
                  {profileSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 text-xs font-medium">
                      Profiles logs updated inside studio directories!
                    </div>
                  )}
                  {profileError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-xs font-semibold">
                      {profileError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Assigned Brand Signature</label>
                    <input
                      id="update-name"
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-250 select-text rounded px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Billing Registry Email</label>
                      <input
                        id="update-email"
                        type="text"
                        value={profileEmail}
                        onChange={(e) => setProfileEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-250 select-text rounded px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Consignment Phone</label>
                      <input
                        id="update-phone"
                        type="text"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-250 select-text rounded px-4 py-2.5 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    id="save-profile-btn"
                    type="submit"
                    className="px-6 py-3 bg-stone-950 text-white rounded text-xs uppercase font-bold tracking-wider hover:bg-stone-850 cursor-pointer shadow"
                  >
                    Commit Settings
                  </button>
                </form>
              </motion.div>
            )}

            {/* ORDER HISTORY & TIMELINES */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                id="orders-tab-panel"
                className="space-y-6 text-left"
              >
                <div className="bg-stone-50 p-4 border border-stone-150 rounded">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950">Shipment Timeline Ledger</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">Audit transit pathways and packing references of your suites</p>
                </div>

                {user.orders.length === 0 ? (
                  <div className="py-12 text-center text-stone-400 font-light text-sm italic border rounded bg-stone-50/20">
                    No historic orders recorded under this billing registry.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {user.orders.map((or) => (
                      <div key={or.id} className="p-6 bg-white border border-stone-200 rounded-lg shadow-sm space-y-6">
                        
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-105 pb-4 gap-2 text-xs">
                          <div className="space-y-1">
                            <span className="font-mono text-stone-400 block uppercase">Reference ID</span>
                            <strong className="text-stone-900 font-mono text-xs">{or.id}</strong>
                          </div>
                          <div className="space-y-1 sm:text-right">
                            <span className="font-mono text-stone-400 block uppercase">Placed on</span>
                            <span className="font-semibold text-stone-700">{or.date}</span>
                          </div>
                          <div className="space-y-1 sm:text-right">
                            <span className="font-mono text-stone-400 block uppercase">Gross Paid</span>
                            <strong className="text-stone-955 font-mono">${or.total.toFixed(2)}</strong>
                          </div>
                          <div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide font-mono ${
                              or.status === 'Delivered'
                                ? 'bg-green-105 text-green-700 border border-green-200'
                                : 'bg-stone-100 text-stone-700 border border-stone-200'
                            }`}>
                              ● {or.status}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="divide-y divide-stone-100">
                          {or.items.map((it, i) => (
                            <div key={i} className="py-3 flex justify-between items-center first:pt-0 last:pb-0">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 aspect-[4/5] bg-stone-50 rounded overflow-hidden border border-stone-100">
                                  <img src={it.image} alt={it.productName} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div className="text-xs">
                                  <strong className="text-stone-900 block">{it.productName}</strong>
                                  <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">Finish: {it.color} | Sizes: {it.size}</span>
                                </div>
                              </div>
                              <span className="text-xs font-mono text-stone-400">{it.quantity} x ${it.price}</span>
                            </div>
                          ))}
                        </div>

                        {/* Status Timeline */}
                        <div className="pt-4 border-t border-stone-100 space-y-3">
                          <span className="text-[9px] uppercase tracking-wider font-mono text-stone-400 font-bold block">Transit Tracking timeline</span>
                          
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] uppercase tracking-wide font-semibold text-stone-400 relative">
                            {/* Line graphic */}
                            <div className="absolute top-2.5 inset-x-8 h-[2px] bg-stone-200 z-0" />

                            <div className="z-10 bg-white space-y-1">
                              <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center border font-mono text-[9px] ${
                                ['Processing', 'Shipped', 'Delivered'].includes(or.status)
                                  ? 'bg-stone-950 text-white border-stone-950'
                                  : 'bg-white text-stone-400 border-stone-200'
                              }`}>1</div>
                              <span className={or.status === 'Processing' ? 'text-stone-950 font-bold' : ''}>Processed</span>
                            </div>

                            <div className="z-10 bg-white space-y-1">
                              <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center border font-mono text-[9px] ${
                                ['Shipped', 'Delivered'].includes(or.status)
                                  ? 'bg-stone-950 text-white border-stone-950'
                                  : 'bg-white text-stone-400 border-stone-200'
                              }`}>2</div>
                              <span className={or.status === 'Shipped' ? 'text-stone-950 font-bold' : ''}>Transit courier</span>
                            </div>

                            <div className="z-10 bg-white space-y-1">
                              <div className={`w-5 h-5 rounded-full mx-auto flex items-center justify-center border font-mono text-[9px] ${
                                or.status === 'Delivered'
                                  ? 'bg-stone-950 text-white border-stone-950'
                                  : 'bg-white text-stone-400 border-stone-402'
                              }`}>3</div>
                              <span className={or.status === 'Delivered' ? 'text-stone-950 font-bold' : ''}>Delivered</span>
                            </div>

                            <div className="z-10 bg-white space-y-1 opacity-50">
                              <div className="w-5 h-5 rounded-full mx-auto flex items-center justify-center border font-mono text-[9px] bg-white text-stone-400 border-stone-200">
                                ✓
                              </div>
                              <span>Concluded</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* WISHLIST SAVED OBJECTS */}
            {activeTab === 'wishlist' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                id="wishlist-tab-panel"
                className="space-y-6 text-left"
              >
                <div className="bg-stone-50 p-4 border border-stone-150 rounded">
                  <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950">Wishlist Vault</h3>
                  <p className="text-[10px] text-stone-400 mt-0.5">Sift your pre-curated design suites</p>
                </div>

                {wishlistProducts.length === 0 ? (
                  <div className="py-12 text-center text-stone-450 font-light text-sm italic border rounded bg-stone-50/20">
                    Your favorites folder is current empty. Save details on products grids.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {wishlistProducts.map((p) => (
                      <div key={p.id} className="p-4 bg-white border border-stone-200 rounded-lg flex items-center gap-4 relative">
                        <button
                          id={`wishlist-remove-${p.id}`}
                          onClick={() => toggleWishlist(p.id)}
                          className="absolute top-2.5 right-2.5 text-stone-400 hover:text-red-650 p-1 cursor-pointer"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <div 
                          className="w-16 aspect-[4/5] bg-stone-100 rounded overflow-hidden cursor-pointer flex-shrink-0"
                          onClick={() => setView('detail', p.id)}
                        >
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        
                        <div className="text-xs space-y-1">
                          <h4 
                            className="font-semibold text-stone-950 hover:underline cursor-pointer line-clamp-1"
                            onClick={() => setView('detail', p.id)}
                          >
                            {p.name}
                          </h4>
                          <span className="block text-stone-900 font-mono font-medium">${p.price}</span>
                          <button
                            id={`wishlist-view-btn-${p.id}`}
                            onClick={() => setView('detail', p.id)}
                            className="text-[10px] uppercase font-bold tracking-widest text-stone-500 hover:text-stone-950 cursor-pointer pt-1"
                          >
                            Inspect Piece
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* SAVED ADDRESSES TABLE */}
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                id="addresses-tab-panel"
                className="space-y-6 text-left"
              >
                <div className="bg-stone-50 p-4 border border-stone-150 rounded flex justify-between items-center">
                  <div>
                    <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950">Shipment Consignment Cards</h3>
                    <p className="text-[10px] text-stone-400 mt-0.5">Manage default destination indices</p>
                  </div>
                  <button
                    id="add-address-btn"
                    onClick={() => setShowAddressModal(true)}
                    className="px-3.5 py-1.5 bg-stone-950 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider rounded hover:bg-stone-850 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Card
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {user.addresses.map((addr) => (
                    <div key={addr.id} className={`p-5 bg-white border border-stone-200 rounded-lg shadow-sm font-sans space-y-3 relative ${
                      addr.isDefault ? 'border-stone-950 ring-[0.5px] ring-stone-950 bg-stone-50/5' : ''
                    }`}>
                      <div className="flex justify-between items-start pt-1">
                        <div>
                          <strong className="text-stone-900 text-xs block">{addr.fullName}</strong>
                          {addr.isDefault && (
                            <span className="text-[9px] uppercase tracking-wider font-mono font-bold bg-stone-900 text-white px-2 py-0.5 rounded mt-1.5 inline-block">Default Card</span>
                          )}
                        </div>
                        
                        <button
                          id={`address-delete-${addr.id}`}
                          onClick={() => deleteAddress(addr.id)}
                          className="p-1.5 text-stone-400 hover:text-red-650 rounded hover:bg-stone-50 transition-colors cursor-pointer"
                          title="Delete Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-stone-600 text-xs space-y-0.5 pt-1.5 border-t border-stone-50 font-light">
                        <p>{addr.street}</p>
                        <p>{addr.city}, {addr.state} {addr.zipCode}</p>
                        <p className="text-stone-400 font-medium">{addr.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>

      </div>

      {/* ================= ADDRESS ADDITION MODAL ================= */}
      <AnimatePresence>
        {showAddressModal && (
          <>
            <motion.div
              id="address-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddressModal(false)}
              className="fixed inset-0 bg-black z-50 animate-fade-in"
            />
            
            <motion.div
              id="address-modal-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-md bg-white z-50 shadow-2xl rounded-xl p-6 text-left font-sans"
            >
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-stone-100">
                <span className="text-xs uppercase font-bold tracking-widest text-stone-950">Add Shipping Address</span>
                <button
                  id="close-address-modal-btn"
                  onClick={() => setShowAddressModal(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddAddressSubmit} className="space-y-4">
                {addrError && (
                  <p className="text-red-600 text-xs font-semibold leading-relaxed">
                    {addrError}
                  </p>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Consignee Full Name</label>
                  <input
                    id="addr-form-fullName"
                    type="text"
                    required
                    value={addrName}
                    onChange={(e) => setAddrName(e.target.value)}
                    placeholder="e.g., Jean-Luc P."
                    className="w-full bg-stone-50 border border-stone-250 rounded px-3.5 py-2 text-xs select-text focus:outline-none placeholder-stone-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Street Address</label>
                  <input
                    id="addr-form-street"
                    type="text"
                    required
                    value={addrStreet}
                    onChange={(e) => setAddrStreet(e.target.value)}
                    placeholder="e.g., 452 Broome St"
                    className="w-full bg-stone-50 border border-stone-250 rounded px-3.5 py-2 text-xs select-text focus:outline-none placeholder-stone-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">City</label>
                    <input
                      id="addr-form-city"
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      placeholder="NY"
                      className="w-full bg-stone-50 border border-stone-250 rounded px-3.5 py-2 text-xs select-text focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">State</label>
                    <input
                      id="addr-form-state"
                      type="text"
                      required
                      value={addrState}
                      onChange={(e) => setAddrState(e.target.value)}
                      placeholder="NY"
                      className="w-full bg-stone-50 border border-stone-250 rounded px-3.5 py-2 text-xs select-text focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">ZIP</label>
                    <input
                      id="addr-form-zip"
                      type="text"
                      required
                      value={addrZip}
                      onChange={(e) => setAddrZip(e.target.value)}
                      placeholder="10013"
                      className="w-full bg-stone-50 border border-stone-250 rounded px-3.5 py-2 text-xs select-text focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Country</label>
                  <select
                    id="addr-form-country"
                    value={addrCountry}
                    onChange={(e) => setAddrCountry(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-250 rounded px-3.5 py-2 text-xs focus:outline-none"
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Denmark">Denmark</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2.5 pt-2">
                  <input
                    id="addr-form-default"
                    type="checkbox"
                    checked={addrDefault}
                    onChange={(e) => setAddrDefault(e.target.checked)}
                    className="w-4 h-4 text-stone-950 border-stone-300 rounded cursor-pointer"
                  />
                  <label htmlFor="addr-form-default" className="text-xs text-stone-600 font-medium cursor-pointer">
                    Set as Default Consignment Card
                  </label>
                </div>

                <button
                  id="addr-form-submit"
                  type="submit"
                  className="w-full py-3 mt-4 bg-stone-950 text-white rounded text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-stone-850"
                >
                  Save Shipping Address
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
