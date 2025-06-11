import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './controllers/user.contoller';
import { Product } from './entities/product.entity';
import { ProductController } from './controllers/product.controller';
import { PublicProductController } from './controllers/public-product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  providers: [],
  controllers: [
    UserController,
    ProductController,
    PublicProductController,
  ],
})
export class MainModule {
}
