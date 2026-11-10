# ATELIER VANGUARD — Architectural Luxury E-Commerce Platform

A full-stack, strictly typed (`"strict": true`) luxury minimalist e-commerce monorepo built with **Node.js, Express, Prisma ORM (SQLite / PostgreSQL-ready), Zod, JWT `httpOnly` Cookies, React 18, Vite, Tailwind CSS, and TanStack Query**.

---

## Monorepo Architecture

```text
atelier-vanguard/
├── package.json              # Root scripts (dev, build, seed, typecheck, setup)
├── .env.example              # Environment template
├── README.md                 # Documentation & credentials
├── server/                   # Express + TypeScript + Prisma + Zod REST API (Port 5000)
│   ├── prisma/
│   │   ├── schema.prisma     # User, Product, ProductVariant, WishlistItem, PromoCode, Order, OrderItem
│   │   └── seed.ts           # Curated luxury catalog, variants, users, promo codes & sample order
│   └── src/
│       ├── index.ts
│       ├── config/db.ts
│       ├── middleware/       # auth.middleware.ts, validate.middleware.ts, error.middleware.ts
│       ├── routes/           # auth, product, cart/wishlist, order/checkout, admin routes
│       ├── controllers/      # auth, product, checkout, admin controllers
│       ├── schemas/          # Zod schemas (auth.schema.ts, order.schema.ts)
│       └── utils/token.ts
└── client/                   # React 18 + Vite + Tailwind CSS + TanStack Query (Port 5173)
    └── src/
        ├── components/       # common/, cart/, catalog/, checkout/
        ├── context/          # AuthContext.tsx, CartContext.tsx
        ├── hooks/            # useProducts.ts
        ├── pages/            # Home, Catalog, ProductDetail, Checkout, AdminDashboard
        └── services/api.ts
```

---

## Quick Start & One-Command Startup

### 1. First-Time Setup (Install, Generate Prisma Client, Push Schema & Seed DB)

```bash
npm run setup
```

Or run step-by-step:

```bash
npm install
npm --prefix server install
npm --prefix client install
npm --prefix server run prisma:generate
npm --prefix server run prisma:push
npm run seed
```

### 2. Launch Full-Stack Development Servers (One Command)

```bash
npm run dev
```

- **Backend API**: `http://localhost:5000`
- **Frontend Client**: `http://localhost:5173` (proxies `/api` to `http://localhost:5000`)

### 3. Typecheck & Production Builds

```bash
npm run typecheck
npm run build
```

---

## Seeded Test Credentials

| Role | Email | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin Director** | `admin@ateliervanguard.com` | `Admin123!` | Full access to `/admin` KPI Dashboard, Order status management, inline SKU stock editor, and Multi-Variant Product creation |
| **Private Client** | `client@ateliervanguard.com` | `Client123!` | Persistent server-synced wishlist, pre-populated order history, and express checkout |

> **Tip**: Open the **Account** modal in the top navigation bar to fill either credential set with a single click.

---

## Seeded Promo Codes for Checkout Testing

| Code | Type | Discount | Minimum Subtotal | Status |
| :--- | :--- | :--- | :--- | :--- |
| `VANGUARD10` | `PERCENTAGE` | **10% OFF** | `$150` | Active |
| `ATELIER50` | `FIXED` | **$50 OFF** | `$350` | Active |
| `ARCHIVE20` | `PERCENTAGE` | **20% OFF** | `$1,000` | Active |
| `EXPIRED25` | `PERCENTAGE` | **25% OFF** | `$100` | Expired (for validation error testing) |
