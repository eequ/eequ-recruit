import { Injectable } from '@nestjs/common';
import { UserTestService } from './user-test.service';
import { ProductTestService } from './product-test.service';

@Injectable()
export class EntityTestService {
  constructor(
    private readonly userTestService: UserTestService,
    private readonly productTestService: ProductTestService,
  ) {
  }

  get user() {
    return this.userTestService;
  }

  get product() {
    return this.productTestService;
  }
}
