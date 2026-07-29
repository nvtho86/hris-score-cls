import { Test, TestingModule } from '@nestjs/testing';
import { UserTrainingsService } from './user-trainings.service';

describe('UserTrainingsService', () => {
  let service: UserTrainingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTrainingsService],
    }).compile();

    service = module.get<UserTrainingsService>(UserTrainingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
