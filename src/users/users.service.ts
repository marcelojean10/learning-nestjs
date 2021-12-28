import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { CreateUserInput, UpdateUserInput } from './dto'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createUser(data: CreateUserInput): Promise<User> {
    const user = this.usersRepository.create(data)
    const userSaved = await this.usersRepository.save(user)

    if (!userSaved) {
      throw new InternalServerErrorException('Problema para criar um usuário.')
    }

    return userSaved
  }

  async update(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.findUserById(id)

    await this.usersRepository.update(user, { ...data })

    const userUpdated = this.usersRepository.create({
      ...user, 
      ...data
    })
    return userUpdated
  }

  async findAll(): Promise<User[]> {
    const users = await this.usersRepository.find();
    return users
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne(id)
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.')
    }
    return user
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.findUserById(id)
    const deleted = await this.usersRepository.delete(user)

    if (!deleted) {
      return false
    }
    return true
  }
}
