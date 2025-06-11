import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { ProductRequest } from '../requests/product.request';
import { ProductDto } from '../dtos/product.dto';
import { PageDto } from '../dtos/page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('product')
export class ProductController {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {}

  @Get()
  async find(
    @Query() query: { search: string; limit: number; offset: number },
  ) {
    const { limit, offset, search } = query;
    const queryBuilder = this.repository.createQueryBuilder('product');

    if (search) {
      queryBuilder.where('product.title LIKE :search', {
        search: `%${search}%`,
      });
    }

    const [products, count] = await queryBuilder
      .take(limit)
      .skip(offset)
      .orderBy('created_date')
      .getManyAndCount();
    const dtos = products.map((product) => {
      const dto = new ProductDto();
      dto.id = product.id;
      dto.userId = product.userId;
      dto.number = product.number;
      dto.title = product.title;
      dto.description = product.description;

      return dto;
    });
    return new PageDto(dtos, count, limit, offset);
  }

  @Get(':id')
  async getProduct(@Param('id') productId: string) {
    const product = await this.repository
      .createQueryBuilder('product')
      .where('id = :id', { id: productId })
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const dto = new ProductDto();
    dto.id = product.id;
    dto.userId = product.userId;
    dto.number = product.number;
    dto.title = product.title;
    dto.description = product.description;

    return dto;
  }

  @Post()
  async createProduct(@Body() body: ProductRequest) {
    const { userId, number, title, description } = body;

    const product = new Product();
    product.userId = userId;
    product.title = title;
    product.description = description;
    product.number = number;

    const createdProduct = await this.repository.save(product);
    const dto = new ProductDto();
    dto.id = createdProduct.id;
    dto.userId = createdProduct.userId;
    dto.number = createdProduct.number;
    dto.title = createdProduct.title;
    dto.description = createdProduct.description;

    return dto;
  }

  @Put(':id')
  async updateProduct(
    @Param('id') productId: string,
    @Body() body: ProductRequest,
  ) {
    const product = await this.repository
      .createQueryBuilder('product')
      .where('id = :id', { id: productId })
      .getOne();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { userId, number, title, description } = body;

    if (product.userId !== userId) {
      throw new ForbiddenException('You do not have access to this product');
    }

    product.userId = userId;
    product.title = title;
    product.description = description;
    product.number = number;

    const updatedProduct = await this.repository.save(product);
    const dto = new ProductDto();
    dto.id = updatedProduct.id;
    dto.userId = updatedProduct.userId;
    dto.number = updatedProduct.number;
    dto.title = updatedProduct.title;
    dto.description = updatedProduct.description;

    return dto;
  }

  @Delete(':id')
  async delete(@Param('id') productId: string) {
    const product = await this.repository
      .createQueryBuilder('product')
      .where('id = :id', { id: productId })
      .getOne();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.repository.delete(productId);
  }
}
