import React, { useState, useMemo } from 'react';
import { useAppState } from '../context/AppContext';
import { Settings, Lock, Plus, Trash2, Edit2, Check, DollarSign, Package, ShoppingCart, AlertCircle, Eye, RefreshCw, X } from 'lucide-react';
import { Product } from '../types';

export default function AdminView() {
  const {
    products,
    categories,
    user,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus
  } = useAppState();

  // Gates: lock gate state
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(() => {
    return localStorage.getItem('luxury_store_admin_unlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Sorter / view tabs
  const [activeTab, setActiveTab] = useState<'kpis' | 'products' | 'orders'>('kpis');

  // Stateful ADD / EDIT Product Form fields
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [pName, setPName] = useState('');
  const [pTagline, setPTagline] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState('150');
  const [pCategory, setPCategory] = useState('products');
  const [pImages, setPImages] = useState('');
  const [pColors, setPColors] = useState(''); // comma-separated name|hex, e.g. Sand|#F4ECE1,Basalt|#1C1C1C
  const [pSizes, setPSizes] = useState('Standard'); // comma-separated
  const [pStock, setPStock] = useState('10');
  const [pDetails, setPDetails] = useState(''); // newline-separated
  const [formError, setFormError] = useState('');

  // 1. Password verification gate
  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordInput === 'studio2026') {
      setIsAdminUnlocked(true);
      localStorage.setItem('luxury_store_admin_unlocked', 'true');
    } else {
      setPasswordError('Invalid credentials. Hint: Enter password "studio2026"');
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    localStorage.removeItem('luxury_store_admin_unlocked');
  };

  // KPIs Calculations
  const analytics = useMemo(() => {
    const historicalOrders = user.orders || [];
    
    // Sum totals safely
    const totalOrders = historicalOrders.length;
    const grossRevenue = historicalOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? parseFloat((grossRevenue / totalOrders).toFixed(2)) : 0;
    
    // Locate critical stock thresholds
    const criticalStockItems = products.filter((p) => p.stock <= 5);

    return {
      totalOrders,
      grossRevenue,
      avgOrderValue,
      criticalStockCount: criticalStockItems.length,
      criticalStockItems
    };
  }, [user.orders, products]);

  // Form triggers
  const triggerAddMode = () => {
    setFormMode('add');
    setEditingId(null);
    setPName('');
    setPTagline('');
    setPDesc('');
    setPPrice('100');
    setPCategory(categories[0]?.id || 'furniture');
    setPImages('https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600');
    setPColors('Warm Charcoal|#3E3E3E, Chalk White|#FFFFFF');
    setPSizes('Standard, Long');
    setPStock('12');
    setPDetails('Handcrafted wood frames\nPremium oiled finishes\nSoft organic texture lines');
    setFormError('');
    setIsFormOpen(true);
  };

  const triggerEditMode = (p: Product) => {
    setFormMode('edit');
    setEditingId(p.id);
    setPName(p.name);
    setPTagline(p.tagline);
    setPDesc(p.description);
    setPPrice(p.price.toString());
    setPCategory(p.category);
    setPImages(p.images.join(', '));
    setPColors(p.colors.map((c) => `${c.name}|${c.hex}`).join(', '));
    setPSizes(p.sizes.join(', '));
    setPStock(p.stock.toString());
    setPDetails(p.details.join('\n'));
    setFormError('');
    setIsFormOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!pName.trim()) return setFormError('Product title is required');
    if (!pDesc.trim() || pDesc.length < 15) return setFormError('Description must span at least 15 letters');

    // Parse Comma formats
    const parsedImages = pImages
      .split(',')
      .map((img) => img.trim())
      .filter((img) => img.startsWith('http'));
    
    if (parsedImages.length === 0) {
      return setFormError('Please input at least one valid HTTP Unsplash or catalog source image link');
    }

    const parsedColors = pColors
      .split(',')
      .map((item) => {
        const parts = item.split('|');
        return {
          name: parts[0]?.trim() || 'Neutral',
          hex: parts[1]?.trim() || '#CCCCCC'
        };
      });

    const parsedSizes = pSizes
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const parsedDetails = pDetails
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const priceNum = parseFloat(pPrice) || 50;
    const stockNum = parseInt(pStock) || 10;

    const payload: any = {
      name: pName.trim(),
      tagline: pTagline.trim(),
      description: pDesc.trim(),
      price: priceNum,
      category: pCategory,
      images: parsedImages,
      colors: parsedColors,
      sizes: parsedSizes,
      stock: stockNum,
      details: parsedDetails
    };

    if (formMode === 'add') {
      addProduct(payload);
    } else if (formMode === 'edit' && editingId) {
      // Keep existing reviews
      const originalProduct = products.find((p) => p.id === editingId);
      updateProduct({
        ...payload,
        id: editingId,
        rating: originalProduct?.rating || 5.0,
        numReviews: originalProduct?.numReviews || 0,
        reviews: originalProduct?.reviews || []
      });
    }

    setIsFormOpen(false);
  };

  if (!isAdminUnlocked) {
    /* ================= UNLOCK LOCK SCREEN GATE ================= */
    return (
      <div id="admin-lock-screen" className="max-w-md mx-auto px-4 py-24 font-sans text-left">
        <div className="bg-white border border-stone-250 rounded-xl shadow-2xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto border border-stone-105">
              <Lock className="w-6 h-6 text-stone-750 animate-pulse" />
            </div>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-950">Staff Studio Registry</h2>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Authorized personnel only. Access key verification gate.
            </p>
          </div>

          <form onSubmit={handleUnlockAdmin} className="space-y-4">
            
            {passwordError && (
              <p className="text-red-650 text-xs font-semibold text-center">{passwordError}</p>
            )}

            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Terminal Pass Key</label>
              <input
                id="admin-pass"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-stone-50 select-text border border-stone-250 rounded px-4 py-3 text-xs focus:outline-none tracking-widest font-mono text-center placeholder-stone-300"
              />
            </div>

            <button
              id="unlock-admin"
              type="submit"
              className="w-full py-3 bg-stone-950 text-white rounded text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-stone-850"
            >
              Verify Credentials
            </button>
          </form>

          <p className="text-[10px] text-stone-400 text-center">
            Verification Hint: Enter development password <strong className="text-stone-900 font-mono">studio2026</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans text-left">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-stone-100 pb-6 mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-light tracking-wide text-stone-900 uppercase">
            Administrative terminal
          </h1>
          <p className="text-stone-405 text-xs mt-1.5 font-mono uppercase">
            Logged into registry as Developer | Host Port 3000
          </p>
        </div>

        <button
          id="lock-admin-btn"
          onClick={handleLockAdmin}
          className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-bold uppercase tracking-wider rounded cursor-pointer bg-white"
        >
          Lock Console
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b border-stone-200 pb-3 mb-8">
        {[
          { key: 'kpis', label: 'Suite Performance' },
          { key: 'products', label: 'Vault Listings' },
          { key: 'orders', label: 'Processing Consignments' }
        ].map((tab) => (
          <button
            id={`admin-tab-${tab.key}`}
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key as any);
              setIsFormOpen(false);
            }}
            className={`text-xs uppercase tracking-wider font-semibold cursor-pointer relative py-1 ${
              activeTab === tab.key ? 'text-stone-950 font-bold' : 'text-stone-450 hover:text-stone-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-stone-950" />}
          </button>
        ))}
      </div>

      {/* TABS RENDER CONTENT */}

      {/* STATUS KPIS */}
      {activeTab === 'kpis' && (
        <div id="admin-tab-kpis" className="space-y-10 animate-fade-in">
          
          {/* Main Analytics Cards grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white border border-stone-200 rounded-lg p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-50 text-stone-950 border border-stone-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">Gross revenue logs</span>
                <strong className="text-xl font-bold font-mono text-stone-900">${analytics.grossRevenue.toFixed(2)}</strong>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-50 text-stone-950 border border-stone-100 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">Calculated order counts</span>
                <strong className="text-xl font-bold font-mono text-stone-900">{analytics.totalOrders} total</strong>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-stone-50 text-stone-950 border border-stone-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">Average suite values</span>
                <strong className="text-xl font-bold font-mono text-stone-900">${analytics.avgOrderValue}</strong>
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${analytics.criticalStockCount > 0 ? 'bg-red-50 text-red-650' : 'bg-stone-50 text-stone-950 border-stone-100'}`}>
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-stone-400 block">Stock depletion flags</span>
                <strong className={`text-xl font-bold font-mono ${analytics.criticalStockCount > 0 ? 'text-red-700' : 'text-stone-900'}`}>{analytics.criticalStockCount} warnings</strong>
              </div>
            </div>

          </div>

          {/* List of critical stock alerts */}
          {analytics.criticalStockCount > 0 && (
            <div className="bg-red-50/20 border border-red-200 rounded-lg p-6 space-y-4">
              <h3 className="text-red-750 text-xs uppercase tracking-widest font-bold">Depleted inventory monitors</h3>
              <div className="divide-y divide-red-100">
                {analytics.criticalStockItems.map((p) => (
                  <div key={p.id} className="py-2 flex justify-between items-center text-xs">
                    <span className="font-medium text-stone-800">{p.name} ({p.category})</span>
                    <strong className="text-red-650 font-bold">Only {p.stock} remaining</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* PRODUCTS CRUD VIEW */}
      {activeTab === 'products' && (
        <div id="admin-tab-products" className="space-y-6 animate-fade-in">
          
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950">Ledger Products Directory</h3>
            {!isFormOpen && (
              <button
                id="admin-form-add-trigger"
                onClick={triggerAddMode}
                className="px-4 py-2 bg-stone-950 text-white hover:bg-stone-850 text-xs font-bold uppercase tracking-wider rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Assemble New Piece
              </button>
            )}
          </div>

          {/* Form Overlay blocks */}
          {isFormOpen && (
            <div className="bg-stone-50/50 border border-stone-250 p-6 rounded-lg space-y-6 max-w-3xl">
              <div className="flex justify-between items-center pb-3 border-b border-stone-200">
                <h4 className="text-xs uppercase font-bold tracking-widest text-stone-950">
                  {formMode === 'add' ? 'Assemble Piece specs' : `Refactor Product: #${editingId}`}
                </h4>
                <button
                  id="admin-form-close"
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProductSubmit} className="space-y-4">
                {formError && <p className="text-red-600 text-xs font-semibold">{formError}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Assigned Title Name</label>
                    <input
                      id="form-pname"
                      type="text"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="e.g., Lounge chair No.2"
                      className="w-full bg-white border border-stone-250 rounded px-4 py-2 text-xs select-text focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Minimal tagline brochure text</label>
                    <input
                      id="form-ptagline"
                      type="text"
                      value={pTagline}
                      onChange={(e) => setPTagline(e.target.value)}
                      placeholder="Dense text summary..."
                      className="w-full bg-white border border-stone-250 rounded px-4 py-2 text-xs select-text focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Narrative Description</label>
                  <textarea
                    id="form-pdesc"
                    rows={3}
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Provide deep material structural definitions..."
                    className="w-full bg-white border border-stone-250 rounded px-4 py-2 text-xs select-text focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Base Price value ($)</label>
                    <input
                      id="form-pprice"
                      type="number"
                      value={pPrice}
                      onChange={(e) => setPPrice(e.target.value)}
                      className="w-full bg-white border border-stone-250 rounded px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Suite Category</label>
                    <select
                      id="form-pcategory"
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full bg-white border border-stone-250 rounded px-3 py-2 text-xs focus:outline-none"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Active Stock reserves</label>
                    <input
                      id="form-pstock"
                      type="number"
                      value={pStock}
                      onChange={(e) => setPStock(e.target.value)}
                      className="w-full bg-white border border-stone-250 rounded px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Commas separated Image URL sources</label>
                  <input
                    id="form-pimages"
                    type="text"
                    value={pImages}
                    onChange={(e) => setPImages(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-white border border-stone-250 rounded px-4 py-2 text-xs select-text focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Colors Config (Name|Hex, Name|Hex)</label>
                    <input
                      id="form-pcolors"
                      type="text"
                      value={pColors}
                      onChange={(e) => setPColors(e.target.value)}
                      placeholder="e.g. Basalt|#1C1C1C, Sand|#E6DCCF"
                      className="w-full bg-white border border-stone-250 rounded px-4 py-2 text-xs select-text focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Sizes (Comma separated)</label>
                    <input
                      id="form-psizes"
                      type="text"
                      value={pSizes}
                      onChange={(e) => setPSizes(e.target.value)}
                      placeholder="Standard, Extended, 500ml"
                      className="w-full bg-white border border-stone-250 rounded px-4 py-2 text-xs select-text focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-stone-550 font-bold block">Specifications list (Newline separated)</label>
                  <textarea
                    id="form-pdetails"
                    rows={3}
                    value={pDetails}
                    onChange={(e) => setPDetails(e.target.value)}
                    placeholder="Handcrafted premium wood...&#13;&#10;Dimensions: W 52cm...&#13;&#10;Sustainably sourced..."
                    className="w-full bg-white border border-stone-250 rounded px-4 py-2 text-xs select-text focus:outline-none"
                  />
                </div>

                <button
                  id="admin-form-submit"
                  type="submit"
                  className="px-6 py-3 mt-4 bg-stone-950 text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-stone-850 cursor-pointer shadow"
                >
                  {formMode === 'add' ? 'Publish Piece' : 'Commit Refactoring'}
                </button>
              </form>
            </div>
          )}

          {/* Simple CRUD grid rendering table */}
          <div className="overflow-x-auto shadow rounded-lg border border-stone-200 bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-50 border-b border-stone-158 uppercase tracking-wider font-semibold text-stone-500">
                <tr>
                  <th className="px-4 py-3">Piece Details</th>
                  <th className="px-4 py-3">Suite Section</th>
                  <th className="px-4 py-3">Pricing Index</th>
                  <th className="px-4 py-3 text-center">Remaining Stock</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3.5 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.name} className="w-8 aspect-[4/5] object-cover rounded" />
                      <div>
                        <strong className="text-stone-900 block font-semibold">{p.name}</strong>
                        <span className="text-[10px] font-mono text-stone-400">ID: {p.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-stone-605">{p.category}</td>
                    <td className="px-4 py-3.5 font-bold text-stone-900">${p.price}</td>
                    <td className="px-4 py-3.5 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold ${p.stock <= 5 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-1.5">
                      <button
                        id={`edit-item-${p.id}`}
                        onClick={() => triggerEditMode(p)}
                        className="p-1 px-2 border border-stone-250 text-stone-600 hover:text-stone-950 hover:border-stone-500 rounded font-semibold cursor-pointer"
                        title="Edit Spec"
                      >
                        Refactor
                      </button>
                      <button
                        id={`delete-item-${p.id}`}
                        onClick={() => deleteProduct(p.id)}
                        className="p-1 px-2 border border-red-200 text-red-650 hover:text-red-700 hover:bg-red-50 rounded font-semibold cursor-pointer"
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* CONSIGNMENT/ORDER MANAGER */}
      {activeTab === 'orders' && (
        <div id="admin-tab-orders" className="space-y-6 animate-fade-in">
          <div className="bg-stone-50 p-4 border border-stone-150 rounded">
            <h3 className="text-xs uppercase font-bold tracking-widest text-stone-950">Active Consignment Ledger</h3>
            <p className="text-[10px] text-stone-400 mt-0.5 font-light">Advance active packing levels of submitted client orders</p>
          </div>

          <div className="shadow rounded-lg border border-stone-200 bg-white overflow-hidden">
            {user.orders.length === 0 ? (
              <div className="py-12 text-center text-stone-400 font-light italic">
                No orders compiled inside current memory threads.
              </div>
            ) : (
              <div className="divide-y divide-stone-150">
                {user.orders.map((or) => (
                  <div key={or.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-stone-50/20">
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <strong className="text-stone-950 font-mono font-bold">{or.id}</strong>
                        <span className="text-[9px] font-mono text-stone-400">({or.date})</span>
                      </div>
                      
                      <p className="text-[11px] text-stone-600">
                        Consignee: <strong className="text-stone-900 font-bold">{or.shippingAddress.fullName}</strong> — {or.shippingAddress.street}, {or.shippingAddress.city}
                      </p>
                      
                      <div className="flex gap-2.5">
                        {or.items.map((it, idx) => (
                          <span key={idx} className="bg-stone-100 text-[10px] px-2 py-0.5 rounded text-stone-704 font-mono">
                            {it.quantity}x {it.productName}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div>
                        <span className={`px-2.5 py-1 rounded-full text-[9px] uppercase font-bold tracking-wider font-mono ${
                          or.status === 'Delivered' ? 'bg-green-105 text-green-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {or.status}
                        </span>
                      </div>

                      {/* Advance buttons */}
                      {or.status === 'Processing' && (
                        <button
                          id={`advance-ship-${or.id}`}
                          onClick={() => updateOrderStatus(or.id, 'Shipped')}
                          className="px-3 py-1.5 bg-stone-950 hover:bg-stone-850 text-white text-[10px] uppercase font-bold rounded cursor-pointer animate-pulse"
                        >
                          Ship Out
                        </button>
                      )}
                      
                      {or.status === 'Shipped' && (
                        <button
                          id={`advance-deliver-${or.id}`}
                          onClick={() => updateOrderStatus(or.id, 'Delivered')}
                          className="px-3 py-1.5 bg-green-700 hover:bg-green-800 text-white text-[10px] uppercase font-bold rounded cursor-pointer"
                        >
                          Deliver Log
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
