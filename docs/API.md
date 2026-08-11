# API Documentation

## Node.js Express Backend (`server.ts`)

### `POST /api/admin/set-claims`
Sets custom claims for a user (deprecated in favor of Firestore document roles).
- **Auth**: Requires `super_admin`
- **Body**: `{ targetUid: string, role: string }`

### `POST /api/payments/create-intent`
Initializes a payment intent for multiple providers.
- **Auth**: Required
- **Body**: `{ amount: number, currency: string, provider: string }`

### `GET /api/health`
Healthcheck endpoint.
