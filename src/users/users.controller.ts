import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Patch,
  Param,
  Delete,
  NotFoundException
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserInput, UpdateUserInput } from './dto';
import { User } from './entities/user.entity';
import { Mutation, Query, Args } from '@nestjs/graphql';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  @Post()
  async createUser(
    @Args('data') data: CreateUserInput
  ): Promise<User> {
    const user = await this.usersService.createUser(data)
    return user
  }

  @Mutation(() => User)
  @Put(':id')
  async updateUser(
    @Args('id') id: string, 
    @Args('data') data?: UpdateUserInput
  ): Promise<User> {
    return this.usersService.update(id, data)
  }

  @Query(() => [User])
  @Get()
  async allUsers(): Promise<User[]> {
    return this.usersService.findAll()
  }

  @Query(() => User)
  @Get(':id')
  async user(
    @Args('id') id: string
  ): Promise<User> {
    const user = await this.usersService.findUserById(id)
    return user
  }

  @Mutation(() => Boolean)
  @Delete(':id')
  async deleteUser(
    @Args('id') id: string
  ): Promise<boolean> {
    const deleted = await this.usersService.remove(id)
    return deleted
  }
}
