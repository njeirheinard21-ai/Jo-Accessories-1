# Firebase Security Rules Documentation

## Philosophy
The platform implements Least-Privilege Access control based on Firestore user document roles, bootstrapped by a setup wizard.

## Roles
- `super_admin`: Full access to everything
- `store_owner`: Full access to store operations
- `inventory_manager`: Access to products and stock
- `order_manager`: Access to orders
- `marketing_manager`: Access to marketing collections
- `customer_support`: Read access to customers and orders
- `staff`: General dashboard read access
- `customer`: Can only access their own data

## Implementation
Roles are defined in the `users` collection. The Firestore rules (`firestore.rules`) verify `getUserData().role`.
