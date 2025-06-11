import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';
import { typeormTestOptions } from './providers/database.provider';
import { UserTestService } from './services/entity/user-test.service';
import { EntityTestService } from './services/entity/entity-test.service';
import { TestDatabaseService } from './services/test-database.service';
import { ProductTestService } from './services/entity/product-test.service';

export const getMainModule = async (): Promise<TestingModule> => {
  return Test.createTestingModule({
    imports: [AppModule],
    providers: [
      TestDatabaseService,
      UserTestService,
      ProductTestService,
      EntityTestService,
    ],
  })
    .overrideProvider(DataSource)
    .useFactory({
      factory: typeormTestOptions.useFactory,
      inject: typeormTestOptions.inject,
    })
    .compile();
};
