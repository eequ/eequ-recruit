import { Controller, Get, NotFoundException, Param, Query, } from '@nestjs/common';
import { ProductDto } from "../dtos/product.dto";
import { PageDto } from "../dtos/page.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "../entities/product.entity";
import { Repository } from "typeorm";

@Controller('public-product')
export class PublicProductController {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
  ) {
  }

  @Get()
  async search(@Query() query: { search: string, limit: number, offset: number }) {
    const {limit, offset, search} = query;
    const queryBuilder = this.repository
      .createQueryBuilder('product');

    if (search) {
      queryBuilder.where('product.title LIKE :search', {
        search: `%${search}%`,
      })
    }

    const [products, count] = await queryBuilder
      .take(limit)
      .skip(offset)
      .orderBy('created_date')
      .getManyAndCount();

    const dtos = products.map(product => {
      const dto = new ProductDto();
      dto.id = product.id;
      dto.userId = product.userId;
      dto.number = product.number;
      dto.title = product.title;
      dto.description = product.description;
      return dto;
    })

    return new PageDto(dtos, count, limit, offset);
  }

  @Get(':id')
  async get(@Param('id') productId: string) {
    const product = await this.repository
      .createQueryBuilder('product')
      .where('id = :id', {id: productId})
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
}
