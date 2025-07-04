import { BaseRepository } from './BaseRepository';
import User from '@/models/User.model';
import { UserData, CreateUserData, UpdateUserData } from '@/types/user.types';

class UserRepository extends BaseRepository<UserData, CreateUserData, UpdateUserData> {
  protected readonly tableName = 'users';
  protected readonly modelClass = User;
}

export default new UserRepository();
