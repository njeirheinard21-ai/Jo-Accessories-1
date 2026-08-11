export type Role = 
  | 'super_admin'
  | 'store_owner'
  | 'admin'
  | 'inventory_manager'
  | 'order_manager'
  | 'marketing_manager'
  | 'customer_support'
  | 'staff'
  | 'customer'
  | 'guest';

export type Permission = 
  | 'manage_products'
  | 'delete_products'
  | 'create_products'
  | 'manage_categories'
  | 'manage_collections'
  | 'manage_brands'
  | 'manage_inventory'
  | 'manage_orders'
  | 'manage_customers'
  | 'manage_reviews'
  | 'manage_coupons'
  | 'manage_discounts'
  | 'manage_shipping'
  | 'manage_taxes'
  | 'manage_homepage'
  | 'manage_cms'
  | 'manage_blog'
  | 'manage_media_library'
  | 'manage_analytics'
  | 'manage_reports'
  | 'manage_staff'
  | 'assign_roles'
  | 'remove_roles'
  | 'invite_staff'
  | 'manage_settings'
  | 'manage_payment_methods'
  | 'manage_notifications'
  | 'manage_email_templates'
  | 'view_audit_logs'
  | 'manage_security'
  | 'export_data'
  | 'import_data'
  | 'backup_settings';

export interface UserDocument {
  uid: string;
  fullName: string;
  email: string;
  role: Role;
  isStoreOwner: boolean;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: any; // Firestore serverTimestamp
  updatedAt: any;
  lastLogin: any;
  phone?: string;
}
