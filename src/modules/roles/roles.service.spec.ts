import { Test, TestingModule } from '@nestjs/testing';
import { RolesService } from './roles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Role } from '@core/database/entities/role.entity';
import { Repository } from 'typeorm';

describe('RolesService', () => {
  let rolesService: RolesService;
  let rolesRepository: Repository<Role>;

  const rolesRepositoryToken = getRepositoryToken(Role);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: rolesRepositoryToken,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    rolesService = module.get<RolesService>(RolesService);
    rolesRepository = module.get<Repository<Role>>(rolesRepositoryToken);
  });

  it('rolesService should be defined', () => {
    expect(rolesService).toBeDefined();
  });

  it('rolesRepository should be defined', () => {
    expect(rolesRepository).toBeDefined();
  });
});
