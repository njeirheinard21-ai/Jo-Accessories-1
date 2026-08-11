# Firestore Collection Schema

## `users`
- `uid`: string
- `email`: string
- `fullName`: string
- `role`: string (customer, admin, store_owner, super_admin, etc.)
- `isStoreOwner`: boolean
- `createdAt`: timestamp
- `updatedAt`: timestamp
- `lastLogin`: timestamp

## `products`
- `id`: string
- `name`: string
- `price`: number
- `image`: string
- `category`: string
- `description`: string
- `stock`: number
- `status`: string (active, draft, archived)
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `orders`
- `id`: string
- `userId`: string
- `items`: array
- `totalAmount`: number
- `status`: string
- `paymentIntentId`: string
- `createdAt`: timestamp
- `updatedAt`: timestamp

## `audit_logs`
- `id`: string
- `userId`: string
- `action`: string
- `resourceType`: string
- `details`: string
- `createdAt`: timestamp
