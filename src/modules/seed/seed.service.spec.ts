import { Test, TestingModule } from '@nestjs/testing';
import { SeedService } from './seed.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '@core/database/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '@core/database/entities/role.entity';
import { MethodNotAllowedException } from '@nestjs/common';
import { initialData } from './data/seedData';

const mockInitialData = {
  roles: [{ name: 'ADMIN' }, { name: 'USER' }],
  users: [
    {
      email: 'admin1@example.com',
      fullName: 'Administrador 1',
      password: 'Admin1@example',
      isActive: true,
      roles: [{ name: 'ADMIN' }],
    },
    {
      email: 'user1@example.com',
      fullName: 'Usuario 1',
      password: 'User1@example',
      isActive: true,
      roles: [{ name: 'USER' }],
    },
    {
      email: 'user2@example.com',
      fullName: 'Usuario 2',
      password: 'User2@example',
      isActive: true,
      roles: [{ name: 'USER' }],
    },
  ],
};

const isDevelopmentEnvironment = jest.fn();

jest.mock('@shared/functions', () => ({
  isEnvironmentMatch: () => isDevelopmentEnvironment(),
}));

jest.mock('./data/seedData', () => ({
  get initialData() {
    return mockInitialData;
  },
}));

describe('SeedService', () => {
  let seedService: SeedService;
  let userRepository: Repository<User>;
  let roleRepository: Repository<Role>;

  const userRepositoryToken = getRepositoryToken(User);
  const roleRepositoryToken = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedService,
        {
          provide: userRepositoryToken,
          useValue: {
            create: jest.fn().mockImplementation((user) => user),
            save: jest.fn().mockImplementation((users) => users),
            delete: jest.fn(),
          },
        },
        {
          provide: roleRepositoryToken,
          useValue: {
            create: jest.fn().mockImplementation((role) => role),
            save: jest.fn().mockImplementation((roles) => roles),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    seedService = module.get<SeedService>(SeedService);
    userRepository = module.get<Repository<User>>(userRepositoryToken);
    roleRepository = module.get<Repository<Role>>(roleRepositoryToken);
  });

  it('seedService should be defined', () => {
    expect(seedService).toBeDefined();
  });

  it('userRepository should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('roleRepositry should be defined', () => {
    expect(roleRepository).toBeDefined();
  });

  describe('runSeed', () => {
    beforeEach(() => {
      isDevelopmentEnvironment.mockReturnValue(true);
    });

    it('should throw MethodNotAllowedException if the runtime environment IS NOT development', async () => {
      isDevelopmentEnvironment.mockReturnValueOnce(false);

      await expect(seedService.runSeed()).rejects.toThrow(
        MethodNotAllowedException,
      );
    });

    it('should truncate user and role tables if the runtime environment IS development', async () => {
      await seedService.runSeed();

      expect(userRepository.delete).toHaveBeenCalledTimes(1);
      expect(userRepository.delete).toHaveBeenCalledWith({});
      expect(roleRepository.delete).toHaveBeenCalledTimes(1);
      expect(roleRepository.delete).toHaveBeenCalledWith({});
    });

    it('should insert roles if the runtime environment IS development', async () => {
      await seedService.runSeed();

      expect(roleRepository.create).toHaveBeenCalledTimes(
        initialData.roles.length,
      );
      expect(roleRepository.save).toHaveBeenCalledWith(initialData.roles);
    });

    it('should insert users if the runtime environment IS development', async () => {
      await seedService.runSeed();

      expect(userRepository.create).toHaveBeenCalledTimes(
        initialData.users.length,
      );
      expect(userRepository.save).toHaveBeenCalledWith(initialData.users);
    });

    it('should return SEED EXECUTED if the runtime environment IS development', async () => {
      const expectedResult = 'SEED EXECUTED';

      const result = await seedService.runSeed();

      expect(result).toEqual(expectedResult);
    });
  });
});
