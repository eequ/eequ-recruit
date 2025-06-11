import { UserRole } from '../enums/user-role';

export class UserDto {
  id: number;

  firstName: string;

  lastName: string;

  email: string;

  role: UserRole;
}
