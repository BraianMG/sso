import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '@core/database/entities/user.entity';
import { RolesService } from '@modules/roles/roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto';
import { RolesEnum } from '@modules/auth/enums';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;
  let rolesService: RolesService;

  const userRepositoryToken = getRepositoryToken(User);

  const defaultRole = { name: RolesEnum.User };
  const someUserActive: User = {
    email: 'test@test.com',
    password: 'password',
    fullName: 'Test User',
    isActive: true,
    roles: [{ name: RolesEnum.User }],
  };
  const someUserInactive: User = {
    email: 'test@test.com',
    password: 'password',
    fullName: 'Test User',
    isActive: false,
    roles: [{ name: RolesEnum.User }],
  };
  const anySearchOption: FindOneOptions<User> = {
    where: { email: 'test@test.com' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: userRepositoryToken,
          useValue: {
            create: jest.fn().mockImplementation((user) => user),
            save: jest.fn().mockImplementation((users) => users),
            findOne: jest.fn(),
          },
        },
        {
          provide: RolesService,
          useValue: {
            findOneByName: jest.fn().mockImplementation((name) => ({ name })),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    rolesService = module.get<RolesService>(RolesService);
  });

  it('usersService should be defined', () => {
    expect(usersService).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('rolesService should be defined', () => {
    expect(rolesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with the default role USER.', async () => {
      const mockCreatedUserDto: CreateUserDto = {
        email: 'test@test.com',
        password: 'password',
        fullName: 'Test User',
      };

      await usersService.create(mockCreatedUserDto);

      expect(userRepository.create).toHaveBeenCalledTimes(1);
      expect(userRepository.create).toHaveBeenCalledWith({
        ...mockCreatedUserDto,
        roles: [defaultRole],
      });
      expect(userRepository.save).toHaveBeenCalledTimes(1);
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockCreatedUserDto,
        roles: [defaultRole],
      });
    });

    describe('findOneWithOptions', () => {
      it('should throw NotFoundException if a user is not found.', async () => {
        jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

        await expect(
          usersService.findOneWithOptions(anySearchOption),
        ).rejects.toThrow(NotFoundException);
      });

      it('should return a user if found.', async () => {
        jest
          .spyOn(userRepository, 'findOne')
          .mockResolvedValueOnce(someUserActive);

        const result = await usersService.findOneWithOptions(anySearchOption);

        expect(result).toEqual(someUserActive);
      });
    });

    describe('getUserAndValidateStatus', () => {
      it('should throw UnauthorizedException if the user is not inactive.', async () => {
        jest
          .spyOn(usersService, 'findOneWithOptions')
          .mockResolvedValueOnce(someUserInactive);

        await expect(
          usersService.getUserAndValidateStatus(anySearchOption),
        ).rejects.toThrow(UnauthorizedException);
      });

      it('should return a user if active.', async () => {
        jest
          .spyOn(usersService, 'findOneWithOptions')
          .mockResolvedValueOnce(someUserActive);

        const result =
          await usersService.getUserAndValidateStatus(anySearchOption);

        expect(result).toEqual(someUserActive);
      });
    });
  });
});
