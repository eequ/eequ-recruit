import { UserRole } from '../enums/user-role';

export class UserRequest {
  firstName: string;
  lastName: string;
  role: UserRole;
}
