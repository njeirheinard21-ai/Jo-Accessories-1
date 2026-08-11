# Jo Accessories - Enterprise Architecture Documentation

## 1. Technical Architecture Overview
The Jo Accessories platform is a modern, decoupled Single Page Application (SPA) designed for enterprise scalability, performance, and maintainability.

- **Frontend Framework**: React 19 with Vite for lightning-fast HMR and optimized builds.
- **Language**: TypeScript for robust type safety and self-documenting code.
- **State Management**: 
  - **Server State**: `@tanstack/react-query` for fetching, caching, synchronizing, and updating asynchronous data.
  - **Client State**: `zustand` for persistent local state (Cart, Wishlist, Recently Viewed, Auth session).
- **Styling**: Tailwind CSS configured with a strictly defined design system (typography, spacing, color variables).
- **Routing**: React Router v6 using data routers.
- **Animations**: Framer Motion (`motion/react`) for fluid, GPU-accelerated micro-interactions and page transitions.
- **Backend as a Service (BaaS)**: Firebase (Authentication, Firestore, Storage, Cloud Functions).

## 2. Component Inventory
The UI is built on atomic design principles.

### Atoms
- `Button`: Primary, secondary, outline, ghost, link variants.
- `Input`, `Select`, `Checkbox`, `Radio`: Form primitives wrapped with `react-hook-form`.
- `Badge`: Status indicators (New In, Sold Out, Status).
- `Icons`: Lucide React library.

### Molecules
- `ProductCard`: Reusable component displaying product image, title, price, and wishlist toggle.
- `Breadcrumbs`: Navigation trace.
- `Pagination`: List navigation.
- `SearchAutocomplete`: Real-time search with debouncing.

### Organisms
- `Header`: Contains Mega Menu, Search Toggle, Account, and Mini Cart trigger.
- `Footer`: Newsletter signup, multi-column links, social integration.
- `CartDrawer`: Slide-out panel for cart management.
- `FilterSidebar`: Multi-faceted product filtering (price, category, brand, size).

### Layouts
- `PublicLayout`: Wraps consumer-facing pages.
- `AdminLayout`: Secure dashboard layout with sidebar navigation.

## 3. Database Schema (Firestore)

### `users` collection
```typescript
{
  id: string; // Auth UID
  email: string;
  role: 'admin' | 'customer';
  firstName: string;
  lastName: string;
  wishlist: string[]; // Array of product IDs
  createdAt: number;
  updatedAt: number;
}
```

### `products` collection
```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  stock: number;
  category: string;
  tags: string[];
  images: string[];
  status: 'active' | 'draft' | 'archived';
  variants?: { size: string, color: string, stock: number }[];
  createdAt: number;
  updatedAt: number;
}
```

### `orders` collection
```typescript
{
  id: string;
  userId: string;
  customerDetails: { email: string, name: string };
  shippingAddress: AddressObject;
  billingAddress: AddressObject;
  items: { productId: string, name: string, price: number, quantity: number }[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  totalAmount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: string;
  trackingNumber?: string;
  createdAt: number;
  updatedAt: number;
}
```

## 4. Security Rules (Firestore)
- **Least Privilege**: Users can only read/write their own data.
- **Admin Access**: Custom claims or specific `role: 'admin'` checks in the `users` collection govern access to `inventory`, `orders` (global), and `settings`.
- **Data Validation**: Rules enforce schema types and required fields to prevent injection of malicious data structures.

## 5. Cloud Functions Architecture Recommendations
To support an enterprise load, the following Cloud Functions should be implemented:
- **`onOrderCreated`**: Triggers email confirmations (SendGrid/Postmark), decrements inventory atomically, and syncs to analytics.
- **`syncAlgolia`**: Listens to `products` collection writes and syncs data to an Algolia search index for typo-tolerant, ultra-fast search.
- **`processPaymentWebhooks`**: Secure HTTP endpoint to handle Stripe/PayPal webhooks and update order status.
- **`generateInvoice`**: PDF generation triggered upon order fulfillment.
- **`scheduledBackInStock`**: CRON job to email users when wishlist items are replenished.

## 6. Deployment & Post-Launch Maintenance
- **CI/CD**: GitHub Actions configured to run `npm run lint`, `tsc`, and unit tests before deploying to Firebase Hosting.
- **Performance**: Enable CDN caching, aggressive asset minification, and Brotli compression.
- **Monitoring**: Firebase Crashlytics and Google Analytics integrated for error tracking and user journey mapping.
- **Backups**: GCP automated daily backups configured for Firestore.

## 7. Future Scalability Roadmap
1. **Q3**: Implement Algolia for advanced search and recommendations.
2. **Q4**: Develop a native mobile app using React Native, utilizing the exact same Firebase backend.
3. **Next Year**: Introduce Multi-Vendor Marketplace support (requires schema migration to support `vendorId` per product and order splitting).
