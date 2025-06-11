import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query, } from '@nestjs/common';
import { UserRequest } from '../requests/user.request';
import { User } from '../entities/user.entity';
import { PageDto } from "../dtos/page.dto";
import { UserDto } from "../dtos/user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Controller('user')
export class UserController {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
  }

  @Get()
  async search(@Query() query: { search: string, limit: number, offset: number }) {
    const {limit, offset, search} = query;
    const queryBuilder = this.repository
      .createQueryBuilder('user');

    if (search) {
      queryBuilder.where('first_name LIKE :search', {
        search: `%${search}%`,
      })
    }
    const [users, count] = await queryBuilder
      .take(limit)
      .skip(offset)
      .orderBy('created_date')
      .getManyAndCount();

    const dtos = users.map(user => {
      const dto = new UserDto();
      dto.role = user.role;
      dto.id = user.id;
      dto.firstName = user.firstName;
      dto.lastName = user.lastName;
      dto.email = user.email;
      return dto;
    })

    return new PageDto(dtos, count, limit, offset);
  }

  @Get(':id')
  async get(@Param('id') userId: string) {
    const user = await this.repository
      .createQueryBuilder('user')
      .where('id = :id', {id: userId})
      .getOne();
    const dto = new UserDto();
    dto.role = user.role;
    dto.id = user.id;
    dto.firstName = user.firstName;
    dto.lastName = user.lastName;
    dto.email = user.email;
    return dto;
  }

  @Post()
  async create(@Body() body: UserRequest) {
    const {firstName, lastName, role} = body;

    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.role = role;

    const createdUser = await this.repository.save(user);
    const dto = new UserDto();
    dto.role = createdUser.role;
    dto.id = createdUser.id;
    dto.firstName = createdUser.firstName;
    dto.lastName = createdUser.lastName;
    dto.email = createdUser.email;

    return dto;
  }

  @Put(':id')
  async update(
    @Param('id') userId: string,
    @Body() body: UserRequest,
  ) {
    const userToUpdate = await this.repository
      .createQueryBuilder('user')
      .where('id = :id', {id: userId})
      .getOne();
    if (!userToUpdate) {
      throw new NotFoundException('User not found');
    }

    const {firstName, lastName, role} = body;

    userToUpdate.firstName = firstName;
    userToUpdate.lastName = lastName;
    userToUpdate.role = role;

    const updatedUser = await this.repository.save(userToUpdate);
    const dto = new UserDto();
    dto.role = updatedUser.role;
    dto.id = updatedUser.id;
    dto.firstName = updatedUser.firstName;
    dto.lastName = updatedUser.lastName;
    dto.email = updatedUser.email;

    return dto;
  }

  @Delete(':id')
  async delete(@Param('id') userId: string) {
    const userToDelete = await this.repository
      .createQueryBuilder('user')
      .where('id = :id', {id: userId})
      .getOne();
    if (!userToDelete) {
      throw new NotFoundException('User not found');
    }

    await this.repository.delete(userId);
  }
}
