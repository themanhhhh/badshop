# 🛠️ Tổng Hợp Công Nghệ Sử Dụng — Dự Án BadmintonPro

> **Dự án:** BadmintonPro (BadShop) — Website thương mại điện tử bán đồ cầu lông  
> **Kiến trúc:** Monorepo gồm 2 phần: `client/` (Frontend) và `server/` (Backend)  
> **Cập nhật:** 06/05/2026

---

## 📋 Mục Lục

- [1. Frontend (Client)](#1-frontend-client)
- [2. Backend (Server)](#2-backend-server)
- [3. Cơ Sở Dữ Liệu](#3-cơ-sở-dữ-liệu)
- [4. Dịch Vụ Bên Thứ Ba](#4-dịch-vụ-bên-thứ-ba)
- [5. Triển Khai & DevOps](#5-triển-khai--devops)
- [6. Công Cụ Phát Triển](#6-công-cụ-phát-triển)
- [7. Kiến Trúc Dự Án](#7-kiến-trúc-dự-án)

---

## 1. Frontend (Client)

### 🔧 Framework & Runtime

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **Next.js** | `16.1.1` | React framework hỗ trợ SSR/SSG, App Router |
| **React** | `19.2.3` | Thư viện UI, sử dụng React 19 với RSC (React Server Components) |
| **React DOM** | `19.2.3` | Kết xuất giao diện React lên trình duyệt |
| **TypeScript** | `^5` | Ngôn ngữ lập trình kiểu tĩnh |

### 🎨 Styling & UI Components

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **Tailwind CSS** | `^4` | Framework CSS utility-first |
| **@tailwindcss/postcss** | `^4` | Plugin PostCSS cho Tailwind CSS v4 |
| **tw-animate-css** | `^1.4.0` | Thư viện animation cho Tailwind |
| **shadcn/ui** | `^3.6.3` | Component library dựa trên Radix UI (style: `radix-vega`) |
| **Radix UI** | nhiều packages | Headless UI components (Dialog, Tooltip, Collapsible, Slot, VisuallyHidden) |
| **@base-ui/react** | `^1.0.0` | Base UI components |
| **class-variance-authority** | `^0.7.1` | Quản lý variant cho component |
| **clsx** | `^2.1.1` | Utility gộp className có điều kiện |
| **tailwind-merge** | `^3.4.0` | Hợp nhất Tailwind class thông minh |
| **Lucide React** | `^0.562.0` | Bộ icon SVG |

### ✏️ Rich Text Editor

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **@tiptap/react** | `^3.20.2` | Editor WYSIWYG dựa trên ProseMirror |
| **@tiptap/starter-kit** | `^3.20.2` | Các extension cơ bản (bold, italic, heading,...) |
| **@tiptap/extension-image** | `^3.20.2` | Hỗ trợ chèn ảnh |
| **@tiptap/extension-link** | `^3.20.2` | Hỗ trợ chèn link |
| **@tiptap/extension-underline** | `^3.20.2` | Hỗ trợ gạch chân |

### 🎬 Animation

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **Framer Motion** | `^12.29.0` | Thư viện animation cho React |

### 🔔 UI Utilities

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **Sonner** | `^2.0.7` | Toast notification library |
| **js-cookie** | `^3.0.5` | Quản lý cookie phía client |
| **xlsx** | `^0.18.5` | Xuất dữ liệu ra file Excel |

### 🔤 Fonts (Google Fonts)

- **Inter** — Font chính (`--font-sans`)
- **Geist** — Font phụ (`--font-geist-sans`)
- **Geist Mono** — Font monospace (`--font-geist-mono`)

### 📐 Cấu Trúc Frontend

```
client/
├── app/                  # Next.js App Router
│   ├── (shop)/           # Route group cho trang shop
│   ├── admin/            # Trang quản trị
│   ├── products/         # Trang sản phẩm
│   ├── cart/             # Giỏ hàng
│   ├── checkout/         # Thanh toán
│   ├── login/            # Đăng nhập
│   ├── account/          # Tài khoản
│   ├── blog/             # Blog
│   ├── tracking/         # Theo dõi đơn hàng
│   └── ...
├── components/
│   ├── ui/               # 21 shadcn/ui components
│   ├── admin/            # Components cho trang admin
│   ├── shop/             # Components cho trang shop
│   └── scrollytelling/   # Components scrollytelling
├── contexts/             # React Context (Auth, Cart, Theme)
├── hooks/                # Custom hooks (useApi, useMobile)
└── lib/                  # Utilities, API client, types
```

---

## 2. Backend (Server)

### 🔧 Framework & Runtime

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **Node.js** | — | JavaScript runtime |
| **Express.js** | `^4.18.2` | Web framework cho Node.js |
| **TypeScript** | `^5.3.3` | Ngôn ngữ lập trình kiểu tĩnh |
| **ts-node** | `^10.9.2` | Chạy TypeScript trực tiếp không cần build |

### 🗄️ ORM & Database Driver

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **TypeORM** | `^0.3.20` | ORM cho TypeScript/JavaScript, hỗ trợ decorator |
| **pg** | `^8.11.3` | PostgreSQL driver cho Node.js |
| **postgres** | `^3.4.8` | PostgreSQL client |
| **reflect-metadata** | `^0.2.1` | Hỗ trợ decorator metadata cho TypeORM |

### 🔐 Bảo Mật & Xác Thực

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **jsonwebtoken (JWT)** | `^9.0.3` | Tạo và xác thực token JWT |
| **bcryptjs** | `^3.0.3` | Mã hoá mật khẩu (hash + salt) |
| **cors** | `^2.8.6` | Middleware quản lý CORS |

### 📧 Email

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **Nodemailer** | `^8.0.1` | Gửi email (OTP xác nhận đơn hàng qua Gmail SMTP) |

### 📁 Upload & Lưu Trữ

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **Multer** | `^2.0.2` | Middleware xử lý file upload (multipart/form-data) |
| **form-data** | `^4.0.5` | Tạo form data cho HTTP request |

### 🔧 Tiện Ích

| Công nghệ | Phiên bản | Mô tả |
|---|---|---|
| **dotenv** | `^16.3.1` | Quản lý biến môi trường từ file `.env` |
| **uuid** | `^9.0.1` | Tạo UUID (Unique Identifier) |

### 📐 Cấu Trúc Backend

```
server/src/
├── index.ts              # Entry point, Express setup
├── data-source.ts        # TypeORM DataSource config
├── entities/             # 17 entity models (User, Product, Order,...)
├── controllers/          # 17 controllers (REST API handlers)
├── services/             # 24 service classes (business logic)
├── routes/               # 17 route files (API endpoints)
├── middlewares/           # Auth, Error handling, Async wrapper
├── enums/                # Enums (UserRole, OrderStatus, ShipmentStatus,...)
└── seed.ts               # Database seeding script
```

### 📊 Danh Sách Entities (17)

| Entity | Mô tả |
|---|---|
| User | Người dùng (Admin / Customer) |
| Product | Sản phẩm |
| ProductImage | Ảnh sản phẩm |
| Category | Danh mục |
| Brand | Thương hiệu |
| Collection | Bộ sưu tập |
| Order | Đơn hàng |
| OrderItem | Chi tiết đơn hàng |
| Cart | Giỏ hàng |
| CartItem | Chi tiết giỏ hàng |
| Address | Địa chỉ giao hàng |
| Review | Đánh giá sản phẩm |
| Campaign | Chiến dịch khuyến mãi |
| FlashSale | Flash Sale |
| FlashSaleProduct | Sản phẩm Flash Sale |
| Shipment | Vận chuyển |
| Post | Bài viết / Blog |

### 🔗 API Endpoints (16 nhóm)

`/api/v1/auth` · `/api/v1/users` · `/api/v1/products` · `/api/v1/categories` · `/api/v1/brands` · `/api/v1/orders` · `/api/v1/carts` · `/api/v1/addresses` · `/api/v1/reviews` · `/api/v1/campaigns` · `/api/v1/flash-sales` · `/api/v1/upload` · `/api/v1/stats` · `/api/v1/posts` · `/api/v1/fulfillment` · `/api/v1/collections`

---

## 3. Cơ Sở Dữ Liệu

| Công nghệ | Mô tả |
|---|---|
| **PostgreSQL** | Hệ quản trị CSDL quan hệ |
| **Supabase** | Hosted PostgreSQL (sử dụng Connection Pooler qua pgBouncer) |

- **Host:** `aws-1-ap-south-1.pooler.supabase.com` (AWS Singapore region)
- **Port:** `6543` (Connection Pooler)
- **SSL:** Enabled (`rejectUnauthorized: false`)
- **Auto-sync schema:** Enabled trong môi trường development

---

## 4. Dịch Vụ Bên Thứ Ba

### 📦 Lưu Trữ Ảnh — Pinata (IPFS)

| Thành phần | Mô tả |
|---|---|
| **Pinata Cloud** | Dịch vụ IPFS pinning để lưu trữ ảnh sản phẩm |
| **IPFS Gateway** | `https://gateway.pinata.cloud/ipfs` |
| **Tích hợp** | Cả client-side lẫn server-side upload |

### 📧 Email — Gmail SMTP

| Thành phần | Mô tả |
|---|---|
| **Gmail SMTP** | Gửi email OTP xác nhận đơn hàng |
| **Nodemailer** | Transport gửi email |
| **Template** | HTML email template inline |

---

## 5. Triển Khai & DevOps

### 🌐 Frontend Hosting

| Platform | Mô tả |
|---|---|
| **Vercel** | Hosting cho Next.js client (`https://badshop.vercel.app`) |

### 🖥️ Backend Hosting

| Platform | Mô tả |
|---|---|
| **Render** | Hosting cho Express API server |
| **Region** | Singapore |
| **Plan** | Free |
| **Health Check** | `/health` endpoint |
| **Build Command** | `npm ci --include=dev && npm run build` |
| **Start Command** | `npm start` |

### 📄 Render Blueprint (`render.yaml`)

```yaml
services:
  - type: web
    name: badshop-api
    env: node
    region: singapore
    plan: free
```

---

## 6. Công Cụ Phát Triển

| Công cụ | Mô tả |
|---|---|
| **TypeScript** | Ngôn ngữ chính cho cả frontend và backend |
| **ESLint** | Linting cho client (eslint-config-next) |
| **PostCSS** | CSS preprocessing (dùng với Tailwind CSS) |
| **Git** | Version control |
| **npm** | Package manager |
| **ts-node** | Chạy TypeScript code trực tiếp (development) |

---

## 7. Kiến Trúc Dự Án

```
hungprj/
├── client/               # 🖥️ Frontend — Next.js 16 + React 19
│   ├── app/              # App Router (pages, layouts)
│   ├── components/       # UI components (shadcn/ui + custom)
│   ├── contexts/         # State management (Auth, Cart, Theme)
│   ├── hooks/            # Custom React hooks
│   └── lib/              # API client, types, utilities
│
├── server/               # ⚙️ Backend — Express.js + TypeORM
│   └── src/
│       ├── entities/     # Database models
│       ├── controllers/  # Request handlers
│       ├── services/     # Business logic
│       ├── routes/       # API routing
│       └── middlewares/  # Auth, error handling
│
└── render.yaml           # 🚀 Deployment config (Render)
```

### Luồng Hoạt Động

```
[Client - Next.js / Vercel]
        │
        │  REST API (fetch)
        ▼
[Server - Express.js / Render]
        │
        │  TypeORM
        ▼
[PostgreSQL - Supabase]
        │
[Pinata IPFS - Image Storage]
[Gmail SMTP - Email Notifications]
```

### Tính Năng Chính

| Tính năng | Mô tả |
|---|---|
| 🛒 **E-commerce** | Quản lý sản phẩm, danh mục, thương hiệu, bộ sưu tập |
| 🛍️ **Giỏ hàng & Checkout** | Giỏ hàng, thanh toán, xác nhận OTP qua email |
| 📦 **Fulfillment** | Quy trình xử lý đơn hàng (picking → packing → shipping → delivery) |
| 🎯 **Khuyến mãi** | Campaigns, Flash Sales, mã giảm giá |
| 📝 **Blog/CMS** | Quản lý bài viết với rich text editor (Tiptap) |
| 👥 **Quản lý người dùng** | Đăng ký, đăng nhập, phân quyền (Admin/Customer) |
| 📊 **Dashboard** | Thống kê doanh thu, đơn hàng, khách hàng |
| 📤 **Export dữ liệu** | Xuất Excel (sản phẩm, đơn hàng, khách hàng) |
| 🖼️ **Upload ảnh** | Upload ảnh qua Pinata IPFS |
| 📱 **Responsive** | Hỗ trợ mobile (custom hook `useMobile`) |
| 🌙 **Dark Mode** | Hỗ trợ chế độ tối (ThemeContext) |
| 🔐 **Bảo mật** | JWT authentication, bcrypt password hashing, CORS |
| 🚚 **Tracking** | Theo dõi đơn hàng, tracking number |

---

> **Tổng kết:** Dự án sử dụng stack hiện đại với **Next.js 16 + React 19** cho frontend, **Express.js + TypeORM** cho backend, **PostgreSQL (Supabase)** cho database, triển khai trên **Vercel** (client) và **Render** (server). Ảnh được lưu trữ phân tán qua **Pinata IPFS**.
