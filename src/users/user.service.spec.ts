import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { UsersService } from "./users.service"

const mockUser = (): User => ({
  id: "any_id",
  username: "any_username",
  email: "any_email@mail.com",
  password: "any_password"
})

describe('UserService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        }]
    }).compile()

    service = module.get<UsersService>(UsersService)
  });

  beforeEach(() => {
    mockRepository.find.mockReset()
    mockRepository.findOne.mockReset()
    mockRepository.create.mockReset()
    mockRepository.save.mockReset()
    mockRepository.update.mockReset()
    mockRepository.delete.mockReset()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('When search all Users', () => {
    it('should be list all users', async () => {
        const user = mockUser()
        mockRepository.find.mockReturnValue([user, user])
        const users = await service.findAll()
        expect(users).toHaveLength(2)
        expect(mockRepository.find).toHaveBeenCalledTimes(1)
      })
  })

  describe('When search User By Id', () => {
    it('should find a existing user', async () => {
      const user = mockUser()
      mockRepository.findOne.mockReturnValue(user)
      const userFound = await service.findUserById('any_id')
      expect(userFound).toMatchObject({
        id: "any_id",
        username: "any_username",
        email: "any_email@mail.com",
        password: "any_password"
      })
    })

    it('should return a exception when dos not to find a user', () => {
      mockRepository.findOne.mockReturnValue(null)
      expect(service.findUserById('any_id_2'))
        .rejects
        .toBeInstanceOf(NotFoundException)
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1)
    })
    
  })

  describe('When create a user', () => {
    it('should create a user', async () => {
      const user = mockUser()
      mockRepository.create.mockReturnValue(user)
      mockRepository.save.mockReturnValue(user)
      const savedUser = await service.createUser(user)
      expect(savedUser).toMatchObject({
        id: "any_id",
        username: "any_username",
        email: "any_email@mail.com",
        password: "any_password"
      })
      expect(mockRepository.create).toBeCalledTimes(1)
      expect(mockRepository.save).toBeCalledTimes(1)
    })
    
    it('should return a exception when doesnt create a user', async () => {
      const user = mockUser()
      mockRepository.create.mockReturnValue(user)
      mockRepository.save.mockReturnValue(null)

      mockRepository.findOne.mockReturnValue(null)
      await service.createUser(user).catch(e => {
        expect(e).toBeInstanceOf(InternalServerErrorException)
        expect(e).toMatchObject({
          message: 'Problema para criar um usuário.'
        })
      })

      expect(mockRepository.create).toBeCalledTimes(1)
      expect(mockRepository.save).toBeCalledTimes(1)
    }) 
  })

  describe('When update User', () => {
    it('Should updated a user', async () => {
      const user = mockUser()
      const updatedUser = { username: 'Jean Marcelo' }
      const update = {...user, ...updatedUser}
      mockRepository.findOne.mockReturnValue(user)
      mockRepository.update.mockReturnValue(update)
      mockRepository.create.mockReturnValue(update)

      const resultUser = await service.update('any_id', update)
    
      expect(resultUser).toMatchObject(updatedUser)
      expect(mockRepository.findOne).toBeCalledTimes(1)
      expect(mockRepository.create).toBeCalledTimes(1)
      expect(mockRepository.update).toBeCalledTimes(1)
    })
  })

  describe('When delete User', () => {
    it('Should delete a existing user', async () => {
      const user = mockUser()
      mockRepository.findOne.mockReturnValue(user)
      mockRepository.delete.mockReturnValue(user)
      const deletedUser = await service.remove('any_id')

      expect(deletedUser).toBe(true)
      expect(mockRepository.findOne).toBeCalledTimes(1)
      expect(mockRepository.delete).toBeCalledTimes(1)
    })

    it('Should not delete a inexisting user', async () => {
      const user = mockUser()
      mockRepository.findOne.mockReturnValue(user)
      mockRepository.delete.mockReturnValue(null)
      const deletedUser = await service.remove('any_id_2')
      expect(deletedUser).toBe(false)
      expect(mockRepository.findOne).toBeCalledTimes(1)
      expect(mockRepository.delete).toBeCalledTimes(1)
    })
  })
})