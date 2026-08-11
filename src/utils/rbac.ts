import { Role, Permission } from '../types/auth';

const rolePermissions: Record<Role, Permission[]> = {
  super_admin: [
    'manage_products', 'delete_products', 'create_products', 'manage_categories',
    'manage_collections', 'manage_brands', 'manage_inventory', 'manage_orders',
    'manage_customers', 'manage_reviews', 'manage_coupons', 'manage_discounts',
    'manage_shipping', 'manage_taxes', 'manage_homepage', 'manage_cms', 'manage_blog',
    'manage_media_library', 'manage_analytics', 'manage_reports', 'manage_staff',
    'assign_roles', 'remove_roles', 'invite_staff', 'manage_settings',
    'manage_payment_methods', 'manage_notifications', 'manage_email_templates',
    'view_audit_logs', 'manage_security', 'export_data', 'import_data', 'backup_settings'
  ],
  store_owner: [
    'manage_products', 'delete_products', 'create_products', 'manage_categories',
    'manage_collections', 'manage_brands', 'manage_inventory', 'manage_orders',
    'manage_customers', 'manage_reviews', 'manage_coupons', 'manage_discounts',
    'manage_shipping', 'manage_taxes', 'manage_homepage', 'manage_cms', 'manage_blog',
    'manage_media_library', 'manage_analytics', 'manage_reports', 'manage_staff',
    'assign_roles', 'remove_roles', 'invite_staff', 'manage_settings',
    'manage_payment_methods', 'manage_notifications', 'manage_email_templates',
    'view_audit_logs', 'manage_security', 'export_data', 'import_data', 'backup_settings'
  ],
  admin: [
    'manage_products', 'create_products', 'manage_categories',
    'manage_collections', 'manage_brands', 'manage_inventory', 'manage_orders',
    'manage_customers', 'manage_reviews', 'manage_coupons', 'manage_discounts',
    'manage_shipping', 'manage_taxes', 'manage_homepage', 'manage_cms', 'manage_blog',
    'manage_media_library', 'manage_analytics', 'manage_reports', 'manage_settings',
    'manage_payment_methods', 'manage_notifications', 'manage_email_templates'
  ],
  inventory_manager: [
    'manage_products', 'create_products', 'manage_categories', 'manage_brands', 'manage_inventory'
  ],
  order_manager: [
    'manage_orders', 'manage_customers', 'manage_shipping', 'manage_taxes'
  ],
  marketing_manager: [
    'manage_collections', 'manage_coupons', 'manage_discounts', 'manage_homepage',
    'manage_cms', 'manage_blog', 'manage_media_library', 'manage_analytics'
  ],
  customer_support: [
    'manage_orders', 'manage_customers', 'manage_reviews'
  ],
  staff: [],
  customer: [],
  guest: []
};

export const hasPermission = (userRole: Role | undefined, permission: Permission): boolean => {
  if (!userRole) return false;
  if (userRole === 'super_admin' || userRole === 'store_owner') return true;
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
};
