import { Test, TestingModule } from '@nestjs/testing';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

describe('SeedController', () => {
  let seedController: SeedController;
  let seedService: SeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SeedController],
      providers: [
        SeedService,
        {
          provide: SeedService,
          useValue: {
            runSeed: jest.fn(),
          },
        },
      ],
    }).compile();

    seedController = module.get<SeedController>(SeedController);
    seedService = module.get<SeedService>(SeedService);
  });

  it('seedController should be defined', () => {
    expect(seedController).toBeDefined();
  });

  describe('execute seed', () => {
    it('should invoke seedService', async () => {
      await seedController.executeSeed();

      expect(seedService.runSeed).toHaveBeenCalledTimes(1);
    });
  });
});
