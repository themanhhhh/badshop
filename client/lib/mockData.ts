// Mock data cho trang web bán vợt cầu lông

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: "racket" | "shoes" | "accessories" | "shuttlecock";
  rating: number;
  reviews: number;
  badge?: "hot" | "new" | "sale";
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  products: string[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  date: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Yonex Astrox 99 Pro",
    brand: "Yonex",
    price: 4500000,
    originalPrice: 5200000,
    image: "/products/racket-1.jpg",
    category: "racket",
    rating: 4.9,
    reviews: 128,
    badge: "hot",
    inStock: true,
  },
  {
    id: "2",
    name: "Victor Thruster K 9900",
    brand: "Victor",
    price: 3800000,
    image: "/products/racket-2.jpg",
    category: "racket",
    rating: 4.7,
    reviews: 89,
    badge: "new",
    inStock: true,
  },
  {
    id: "3",
    name: "Li-Ning Axforce 80",
    brand: "Li-Ning",
    price: 3200000,
    originalPrice: 3800000,
    image: "/products/racket-3.jpg",
    category: "racket",
    rating: 4.6,
    reviews: 56,
    badge: "sale",
    inStock: true,
  },
  {
    id: "4",
    name: "Yonex Power Cushion 65Z3",
    brand: "Yonex",
    price: 2900000,
    image: "/products/shoes-1.jpg",
    category: "shoes",
    rating: 4.8,
    reviews: 234,
    inStock: true,
  },
  {
    id: "5",
    name: "Victor A970ACE",
    brand: "Victor",
    price: 2400000,
    originalPrice: 2800000,
    image: "/products/shoes-2.jpg",
    category: "shoes",
    rating: 4.5,
    reviews: 67,
    badge: "sale",
    inStock: true,
  },
  {
    id: "6",
    name: "Yonex Aerosensa 50",
    brand: "Yonex",
    price: 450000,
    image: "/products/shuttle-1.jpg",
    category: "shuttlecock",
    rating: 4.9,
    reviews: 345,
    badge: "hot",
    inStock: true,
  },
  {
    id: "7",
    name: "Túi đựng vợt Yonex Pro",
    brand: "Yonex",
    price: 1200000,
    image: "/products/bag-1.jpg",
    category: "accessories",
    rating: 4.4,
    reviews: 45,
    inStock: true,
  },
  {
    id: "8",
    name: "Cuốn cán Victor GR262",
    brand: "Victor",
    price: 85000,
    image: "/products/grip-1.jpg",
    category: "accessories",
    rating: 4.3,
    reviews: 189,
    inStock: true,
  },
];

export const categories: Category[] = [
  { id: "racket", name: "Vợt cầu lông", icon: "circle-dot", count: 156 },
  { id: "grip", name: "Quấn cán", icon: "grip", count: 89 },
  { id: "string", name: "Cước", icon: "cable", count: 45 },
  { id: "backpack", name: "Balo", icon: "backpack", count: 34 },
  { id: "bag", name: "Túi", icon: "briefcase", count: 67 },
];

export const orders: Order[] = [
  {
    id: "ORD-001",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    products: ["Yonex Astrox 99 Pro", "Cuốn cán Victor GR262"],
    total: 4585000,
    status: "delivered",
    date: "2026-01-13",
  },
  {
    id: "ORD-002",
    customer: "Trần Thị B",
    email: "tranthib@email.com",
    products: ["Victor Thruster K 9900"],
    total: 3800000,
    status: "shipped",
    date: "2026-01-12",
  },
  {
    id: "ORD-003",
    customer: "Lê Văn C",
    email: "levanc@email.com",
    products: ["Yonex Power Cushion 65Z3", "Yonex Aerosensa 50"],
    total: 3350000,
    status: "processing",
    date: "2026-01-12",
  },
  {
    id: "ORD-004",
    customer: "Phạm Thị D",
    email: "phamthid@email.com",
    products: ["Li-Ning Axforce 80"],
    total: 3200000,
    status: "pending",
    date: "2026-01-13",
  },
  {
    id: "ORD-005",
    customer: "Hoàng Văn E",
    email: "hoangvane@email.com",
    products: ["Túi đựng vợt Yonex Pro"],
    total: 1200000,
    status: "cancelled",
    date: "2026-01-11",
  },
];

export const stats = {
  totalRevenue: 125800000,
  totalOrders: 342,
  totalCustomers: 1256,
  totalProducts: 524,
  revenueGrowth: 12.5,
  ordersGrowth: 8.3,
  customersGrowth: 15.2,
  productsGrowth: 5.1,
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  status: "active" | "inactive";
  joinedDate: string;
  lastOrderDate: string;
}

export const customers: Customer[] = [
  {
    id: "CUS-001",
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    totalOrders: 12,
    totalSpent: 45850000,
    status: "active",
    joinedDate: "2025-06-15",
    lastOrderDate: "2026-01-13",
  },
  {
    id: "CUS-002",
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0912345678",
    totalOrders: 8,
    totalSpent: 28600000,
    status: "active",
    joinedDate: "2025-08-20",
    lastOrderDate: "2026-01-12",
  },
  {
    id: "CUS-003",
    name: "Lê Văn C",
    email: "levanc@email.com",
    phone: "0923456789",
    totalOrders: 5,
    totalSpent: 16750000,
    status: "active",
    joinedDate: "2025-10-01",
    lastOrderDate: "2026-01-12",
  },
  {
    id: "CUS-004",
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0934567890",
    totalOrders: 3,
    totalSpent: 9600000,
    status: "active",
    joinedDate: "2025-11-15",
    lastOrderDate: "2026-01-13",
  },
  {
    id: "CUS-005",
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0945678901",
    totalOrders: 1,
    totalSpent: 1200000,
    status: "inactive",
    joinedDate: "2025-12-01",
    lastOrderDate: "2026-01-11",
  },
  {
    id: "CUS-006",
    name: "Võ Thị F",
    email: "vothif@email.com",
    phone: "0956789012",
    totalOrders: 15,
    totalSpent: 52300000,
    status: "active",
    joinedDate: "2025-05-10",
    lastOrderDate: "2026-01-10",
  },
];

export const monthlyRevenue = [
  { month: "T1", revenue: 85000000, orders: 156 },
  { month: "T2", revenue: 92000000, orders: 178 },
  { month: "T3", revenue: 78000000, orders: 142 },
  { month: "T4", revenue: 105000000, orders: 198 },
  { month: "T5", revenue: 118000000, orders: 224 },
  { month: "T6", revenue: 135000000, orders: 267 },
  { month: "T7", revenue: 142000000, orders: 289 },
  { month: "T8", revenue: 128000000, orders: 256 },
  { month: "T9", revenue: 115000000, orders: 218 },
  { month: "T10", revenue: 138000000, orders: 276 },
  { month: "T11", revenue: 155000000, orders: 312 },
  { month: "T12", revenue: 168000000, orders: 342 },
];

