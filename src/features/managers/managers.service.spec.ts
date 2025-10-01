import { Test, TestingModule } from '@nestjs/testing';
import { ManagersService } from './managers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ManagerEntity } from 'src/db/entities';
import { Repository } from 'typeorm';
import { AuthService } from '@app/auth/auth.service';
import { CreateManagerDto, UpdateManagerDto } from './dto/input';
import { ManagerInternalView } from './dto/view';

describe('ManagersService', () => {
  let service: ManagersService;
  let repo: jest.Mocked<Repository<ManagerEntity>>;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const repoMock: Partial<jest.Mocked<Repository<ManagerEntity>>> = {
      save: jest.fn(),
      findOne: jest.fn(),
    };
    authService = {
      signup: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ManagersService,
        { provide: getRepositoryToken(ManagerEntity), useValue: repoMock },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();

    service = module.get<ManagersService>(ManagersService);
    repo = module.get(getRepositoryToken(ManagerEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('throws if user already exists', async () => {
      repo.findOne.mockResolvedValueOnce({} as ManagerEntity);
      await expect(service.create({ name: 'Test', email: 'test@email.com', password: '123' })).rejects.toThrow(
        'User already exist',
      );
    });

    it('creates manager if not exists', async () => {
      repo.findOne.mockResolvedValueOnce(undefined);
      authService.signup.mockResolvedValueOnce({ email: 'test@email.com' } as any);
      repo.save.mockResolvedValueOnce(undefined as any);

      const dto: CreateManagerDto = { name: 'Test', email: 'test@email.com', password: '123' };
      await expect(service.create(dto)).resolves.toBeUndefined();
      expect(authService.signup).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith({ ...dto, userIdentity: { email: 'test@email.com' } });
    });
  });

  describe('update', () => {
    it('updates manager', async () => {
      repo.save.mockResolvedValueOnce(undefined as any);
      const user: ManagerInternalView = { id: '1', name: 'Test', userIdentity: undefined };
      const dto: UpdateManagerDto = { name: 'New Name' };
      await expect(service.update(user, dto)).resolves.toBeUndefined();
      expect(repo.save).toHaveBeenCalledWith({ ...user, ...dto });
    });
  });

  describe('findOneByEmail', () => {
    it('returns manager if found', async () => {
      const managerEntity = { id: '1', name: 'Test', userIdentity: { email: 'test@email.com' } } as ManagerEntity;
      repo.findOne.mockResolvedValueOnce(managerEntity);

      const result = await service.findOneByEmail('test@email.com');
      expect(result).toMatchObject({ id: '1', name: 'Test', userIdentity: { email: 'test@email.com' } });
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { userIdentity: { email: 'test@email.com' } },
        relations: { userIdentity: true },
      });
    });

    it('returns undefined if not found', async () => {
      repo.findOne.mockResolvedValueOnce(undefined);
      const result = await service.findOneByEmail('notfound@email.com');
      expect(result).toBeUndefined();
    });
  });
});
