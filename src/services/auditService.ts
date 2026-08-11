import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';

export type AuditAction = 
  | 'login'
  | 'logout'
  | 'create_product'
  | 'delete_product'
  | 'update_inventory'
  | 'change_role'
  | 'change_settings'
  | 'modify_order'
  | 'create_super_admin';

export const auditService = {
  log: async (resource: string, action: AuditAction, details: string, targetUserId?: string) => {
    try {
      const currentUser = auth.currentUser;
      await addDoc(collection(db, 'audit_logs'), {
        userId: currentUser?.uid || targetUserId || 'system',
        userEmail: currentUser?.email || 'system',
        action,
        resource,
        details,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Failed to write audit log:', error);
    }
  }
};
