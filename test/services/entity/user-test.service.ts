import { Injectable } from '@nestjs/common';
import { User } from '../../../src/main/entities/user.entity';
import { TestDatabaseService } from '../test-database.service';
import { UserRole } from '../../../src/main/enums/user-role';

@Injectable()
export class UserTestService {
  constructor(private readonly database: TestDatabaseService) {}

  create(params?: Partial<User>) {
    const repository = this.database.getRepository(User);
    return repository.save(this.fixture(params));
  }

  fixture(params: Partial<User> = {}) {
    const {
      firstName = 'John',
      lastName = 'Doe',
      email = 'john@doe.com',
      password = 'secret',
      role = UserRole.admin,
    } = params;

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = password;
    user.role = role;

    return user;
  }
}
