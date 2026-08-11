import { User } from '../domain/User';

export interface IUserRepository {
  getUser(uid: string): Promise<User | null>;
  getUsers(): Promise<User[]>;
  updateUser(uid: string, updates: Partial<User>): Promise<void>;
  createUser(user: User): Promise<void>;
}
