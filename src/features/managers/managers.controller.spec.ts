import { Test, TestingModule } from '@nestjs/testing';
import { ManagersController } from './managers.controller';
import { ManagersService } from './managers.service';
import { ManagerInternalView } from './dto/view/manager.internal.view.dto';
import { CreateManagerDto, UpdateManagerDto } from './dto/input';

jest.mock('./guards', () => ({
  ManagerGuard: jest.fn(() => true),
}));
jest.mock('@app/auth/guards', () => ({
  JwtAuthGuard: jest.fn(() => true),
}));

describe('ManagersController', () => {
  let controller: ManagersController;
  let service: jest.Mocked<ManagersService>;

  const serviceMock: jest.Mocked<ManagersService> = {
    create: jest.fn(),
    update: jest.fn(),
  } as unknown as jest.Mocked<ManagersService>;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ManagersController],
      providers: [{ provide: ManagersService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ManagersController>(ManagersController);
    service = module.get(ManagersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signup', () => {
    it('calls service.create with dto', async () => {
      service.create.mockResolvedValueOnce(undefined);
      const dto: CreateManagerDto = { name: 'Test Manager', password: '123456', email: 'test@email.com' };
      await expect(controller.signup(dto)).resolves.toBeUndefined();
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findOne', () => {
    it('returns manager', async () => {
      const manager: ManagerInternalView = {
        id: 'manager-1',
        name: 'Test Manager',
        userIdentity: undefined,
      };
      await expect(controller.findOne(manager)).resolves.toBe(manager);
    });
  });

  describe('update', () => {
    it('calls service.update with manager and dto', async () => {
      service.update.mockResolvedValueOnce(undefined);
      const manager: ManagerInternalView = {
        id: 'manager-1',
        name: 'Test Manager',
        userIdentity: undefined,
      };
      const dto: UpdateManagerDto = { name: 'Updated Name' };
      await expect(controller.update(manager, dto)).resolves.toBeUndefined();
      expect(service.update).toHaveBeenCalledWith(manager, dto);
    });
  });
});
