export interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  avatarUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  stock: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
  featured?: boolean;
  bestSeller?: boolean;
  details: string[];
}

export interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
  count: number;
}

export interface CartItem {
  product: Product;
  selectedColor: { name: string; hex: string };
  selectedSize: string;
  quantity: number;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
    color: string;
    size: string;
  }[];
  shippingAddress: Omit<Address, 'id' | 'isDefault'>;
  paymentMethod: string;
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Returned';
  trackingNumber?: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string;
  wishlist: string[]; // Product IDs
  addresses: Address[];
  orders: Order[];
}
