import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, CartItem, Order, User, Address, Review } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '../data';

interface AppContextType {
  products: Product[];
  categories: Category[];
  currentView: 'home' | 'products' | 'detail' | 'cart' | 'checkout' | 'account' | 'admin';
  selectedProductId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cart: CartItem[];
  wishlist: string[];
  user: User;
  activeCoupon: string | null;
  discountPercentage: number;
  promoCodeError: string | null;
  
  // View managers
  setView: (view: 'home' | 'products' | 'detail' | 'cart' | 'checkout' | 'account' | 'admin', productId?: string | null) => void;
  
  // Cart actions
  addToCart: (product: Product, color: { name: string; hex: string }, size: string, quantity: number) => void;
  removeFromCart: (productId: string, colorHex: string, size: string) => void;
  updateCartQuantity: (productId: string, colorHex: string, size: string, quantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  
  // Favorites
  toggleWishlist: (productId: string) => void;
  
  // User Actions
  updateProfile: (name: string, email: string, phone: string) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (address: Address) => void;
  deleteAddress: (id: string) => void;
  placeOrder: (shippingAddress: Omit<Address, 'id' | 'isDefault'>, paymentMethod: string, subtotal: number, tax: number, shippingFee: number) => Order;
  
  // Review Actions
  addProductReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
  
  // Admin Operations
  addProduct: (product: Omit<Product, 'id' | 'reviews' | 'rating' | 'numReviews'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  name: 'Ethan Devereaux',
  email: 'ethan@devereaux.studio',
  phone: '+1 (555) 234-5678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
  wishlist: ['lounge-chair-01'],
  addresses: [
    {
      id: 'addr-01',
      fullName: 'Ethan Devereaux',
      street: '452 Broome St, Penthouse B',
      city: 'New York',
      state: 'NY',
      zipCode: '10013',
      country: 'United States',
      isDefault: true
    }
  ],
  orders: [
    {
      id: 'ORD-984210',
      date: 'May 12, 2026',
      items: [
        {
          productId: 'brass-lamp-02',
          productName: 'Standard Brass Desk Lamp',
          price: 320,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=200',
          color: 'Raw Unlacquered Brass',
          size: 'Single Size'
        }
      ],
      shippingAddress: {
        fullName: 'Ethan Devereaux',
        street: '452 Broome St, Penthouse B',
        city: 'New York',
        state: 'NY',
        zipCode: '10013',
        country: 'United States'
      },
      paymentMethod: 'Visa ending in 4242',
      subtotal: 320,
      tax: 28.8,
      shippingFee: 0,
      discount: 0,
      total: 348.80,
      status: 'Delivered',
      trackingNumber: 'USPS-94001118995622108'
    }
  ]
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage if available
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxury_store_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('luxury_store_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [currentView, setCurrentView] = useState<AppContextType['currentView']>(() => {
    const saved = localStorage.getItem('luxury_store_view');
    return (saved as AppContextType['currentView']) || 'home';
  });

  const [selectedProductId, setSelectedProductId] = useState<string | null>(() => {
    return localStorage.getItem('luxury_store_selected_product_id');
  });

  const [searchQuery, setSearchQuery] = useState('');

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luxury_store_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('luxury_store_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [wishlist, setWishlist] = useState<string[]>(() => user.wishlist || []);

  const [activeCoupon, setActiveCoupon] = useState<string | null>(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [promoCodeError, setPromoCodeError] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('luxury_store_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('luxury_store_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('luxury_store_view', currentView);
  }, [currentView]);

  useEffect(() => {
    if (selectedProductId) {
      localStorage.setItem('luxury_store_selected_product_id', selectedProductId);
    } else {
      localStorage.removeItem('luxury_store_selected_product_id');
    }
  }, [selectedProductId]);

  useEffect(() => {
    localStorage.setItem('luxury_store_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const updatedUser = { ...user, wishlist };
    localStorage.setItem('luxury_store_user', JSON.stringify(updatedUser));
  }, [user, wishlist]);

  const setView = (view: AppContextType['currentView'], productId: string | null = null) => {
    setCurrentView(view);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart operations
  const addToCart = (product: Product, color: { name: string; hex: string }, size: string, quantity: number) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor.hex === color.hex &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const nextCart = [...prevCart];
        const newQty = nextCart[existingIndex].quantity + quantity;
        // Limit to available stock
        nextCart[existingIndex].quantity = Math.min(newQty, product.stock);
        return nextCart;
      } else {
        return [...prevCart, { product, selectedColor: color, selectedSize: size, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string, colorHex: string, size: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor.hex === colorHex &&
            item.selectedSize === size
          )
      )
    );
  };

  const updateCartQuantity = (productId: string, colorHex: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, colorHex, size);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedColor.hex === colorHex &&
          item.selectedSize === size
        ) {
          const validQuantity = Math.min(quantity, item.product.stock);
          return { ...item, quantity: validQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
    setDiscountPercentage(0);
  };

  const applyPromoCode = (code: string): boolean => {
    const uppercaseCode = code.toUpperCase().trim();
    setPromoCodeError(null);

    let rate = 0;
    if (uppercaseCode === 'MELLOW10') {
      rate = 10;
    } else if (uppercaseCode === 'LUXE20') {
      rate = 20;
    } else if (uppercaseCode === 'MINIMAL50') {
      rate = 50;
    } else {
      setPromoCodeError('Invalid coupon code. Try MELLOW10, LUXE20, or MINIMAL50');
      return false;
    }

    setActiveCoupon(uppercaseCode);
    setDiscountPercentage(rate);
    return true;
  };

  const removePromoCode = () => {
    setActiveCoupon(null);
    setDiscountPercentage(0);
    setPromoCodeError(null);
  };

  // Wishlist / favorites state
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // Profile management
  const updateProfile = (name: string, email: string, phone: string) => {
    setUser((prev) => ({
      ...prev,
      name,
      email,
      phone
    }));
  };

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`
    };

    setUser((prev) => {
      const addresses = prev.addresses.map((addr) =>
        newAddress.isDefault ? { ...addr, isDefault: false } : addr
      );
      return {
        ...prev,
        addresses: [...addresses, newAddress]
      };
    });
  };

  const updateAddress = (updatedAddress: Address) => {
    setUser((prev) => {
      const addresses = prev.addresses.map((addr) => {
        if (addr.id === updatedAddress.id) {
          return updatedAddress;
        }
        return updatedAddress.isDefault ? { ...addr, isDefault: false } : addr;
      });
      return {
        ...prev,
        addresses
      };
    });
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => {
      const filtered = prev.addresses.filter((addr) => addr.id !== id);
      // Ensure we still have a default if any remain
      if (filtered.length > 0 && !filtered.some((addr) => addr.isDefault)) {
        filtered[0].isDefault = true;
      }
      return {
        ...prev,
        addresses: filtered
      };
    });
  };

  // Order Placement
  const placeOrder = (
    shippingAddress: Omit<Address, 'id' | 'isDefault'>,
    paymentMethod: string,
    subtotal: number,
    tax: number,
    shippingFee: number
  ) => {
    const discount = (subtotal * discountPercentage) / 100;
    const total = subtotal + tax + shippingFee - discount;

    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 90000).toString()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric'
      }),
      items: cart.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.product.quantity,
        image: item.product.images[0],
        color: item.selectedColor.name,
        size: item.selectedSize
      })),
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      shippingFee,
      discount,
      total,
      status: 'Processing',
      trackingNumber: `USPS-${Math.floor(9400010000000000000000 + Math.random() * 90000000000000).toString()}`
    };

    // Update stock levels
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartItemForProduct = cart.filter((item) => item.product.id === p.id);
        if (cartItemForProduct.length > 0) {
          const purchasedQty = cartItemForProduct.reduce((sum, item) => sum + item.quantity, 0);
          return { ...p, stock: Math.max(0, p.stock - purchasedQty) };
        }
        return p;
      })
    );

    // Save order history to user state
    setUser((prev) => ({
      ...prev,
      orders: [newOrder, ...prev.orders]
    }));

    clearCart();
    return newOrder;
  };

  // Add Product Review
  const addProductReview = (productId: string, reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric'
      })
    };

    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const reviews = [newReview, ...p.reviews];
          const averageRating = parseFloat(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
          );
          return {
            ...p,
            reviews,
            numReviews: reviews.length,
            rating: averageRating
          };
        }
        return p;
      })
    );
  };

  // Admin Controls
  const addProduct = (newProductData: Omit<Product, 'id' | 'reviews' | 'rating' | 'numReviews'>) => {
    const newId = newProductData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newProduct: Product = {
      ...newProductData,
      id: newId,
      rating: 5.0,
      numReviews: 0,
      reviews: []
    };

    setProducts((prev) => [newProduct, ...prev]);

    // Update counts on relevant categories
    setCategories((prevCats) =>
      prevCats.map((c) => {
        if (c.id === newProductData.category) {
          return { ...c, count: c.count + 1 };
        }
        return c;
      })
    );
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === updatedProduct.id) {
          return updatedProduct;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    const targetProduct = products.find((p) => p.id === id);
    if (!targetProduct) return;

    setProducts((prev) => prev.filter((p) => p.id !== id));

    // Update counts on relevant categories
    setCategories((prevCats) =>
      prevCats.map((c) => {
        if (c.id === targetProduct.category) {
          return { ...c, count: Math.max(0, c.count - 1) };
        }
        return c;
      })
    );
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setUser((prev) => ({
      ...prev,
      orders: prev.orders.map((order) => {
        if (order.id === orderId) {
          return { ...order, status };
        }
        return order;
      })
    }));
  };

  return (
    <AppContext.Provider
      value={{
        products,
        categories,
        currentView,
        selectedProductId,
        searchQuery,
        setSearchQuery,
        cart,
        wishlist,
        user,
        activeCoupon,
        discountPercentage,
        promoCodeError,
        setView,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyPromoCode,
        removePromoCode,
        toggleWishlist,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        placeOrder,
        addProductReview,
        addProduct,
        updateProduct,
        deleteProduct,
        updateOrderStatus
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used inside AppProvider');
  }
  return context;
};
