import { Role, Permission } from '../../types/auth';

export interface User {
  uid: string;
  fullName: string;
  email: string;
  role: Role;
  isStoreOwner: boolean;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: any;
  updatedAt: any;
  lastLogin: any;
  phone?: string;
}
