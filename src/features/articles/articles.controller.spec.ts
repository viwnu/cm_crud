// articles.controller.spec.ts
import 'reflect-metadata';
import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { ManagerInternalView } from '../managers/dto/view';
import { CreateArticleDTO, FindArticlesDto, UpdateArticleDTO } from './dto/input';
import { UserIdentityDTO } from '@app/auth/dto/input';
import { ArticleEntity } from 'src/db/entities';

jest.mock('../managers/guards', () => ({
  ManagerGuard: jest.fn(() => true),
}));
jest.mock('@app/auth/guards', () => ({
  JwtAuthGuard: jest.fn(() => true),
}));

describe('ArticlesController', () => {
  let controller: ArticlesController;
  let service: jest.Mocked<ArticlesService>;

  const serviceMock: jest.Mocked<ArticlesService> = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as unknown as jest.Mocked<ArticlesService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [{ provide: ArticlesService, useValue: serviceMock }],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
    service = module.get(ArticlesService);
  });

  describe('create', () => {
    it('calls service.create with manager and dto', async () => {
      service.create.mockResolvedValueOnce(undefined);

      const manager: ManagerInternalView = {
        id: 'manager-1',
        name: 'Test Manager',
        userIdentity: new UserIdentityDTO(),
      };
      const dto: CreateArticleDTO = {
        title: 'Hello',
        description: 'Short description',
        content: 'World',
      };

      await expect(controller.create(manager, dto)).resolves.toBeUndefined();

      expect(service.create).toHaveBeenCalledTimes(1);
      expect(service.create).toHaveBeenCalledWith(manager, dto);
    });

    it('propagates errors from service.create', async () => {
      const err = new Error('validation failed');
      service.create.mockRejectedValueOnce(err);

      const manager: ManagerInternalView = {
        id: 'manager-1',
        name: '',
        userIdentity: new UserIdentityDTO(),
      };
      const dto: CreateArticleDTO = {
        title: 'A',
        description: 'B',
        content: 'C',
      };

      await expect(controller.create(manager, dto)).rejects.toThrow(err);
    });
  });

  describe('findAll', () => {
    it('returns the service result and forwards dto', async () => {
      const result = {
        articles: [
          {
            id: 'a1',
            title: 'T',
            description: 'desc',
            content: 'content',
            created: new Date('2025-09-27T11:38:20.901Z'),
            author: {
              id: 'auth-1',
              name: 'Author Name',
              userIdentity: undefined, // or a mock UserIdentityDTO if needed
            },
          },
        ],
        count: 1,
      } as { articles: ArticleEntity[]; count: number };
      service.findAll.mockResolvedValueOnce(result);

      const dto: FindArticlesDto = {
        limit: 10,
        page: 0,
        authorId: 'auth-1',
        createdFromTo: [new Date('2024-09-27T11:38:20.901Z'), new Date('2025-09-27T11:38:20.901Z')],
      };

      await expect(controller.findAll(dto)).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(service.findAll).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('calls service.update with params and body', async () => {
      const articleId = 'article-123';
      const body: UpdateArticleDTO = { title: 'Updated' };
      const updated = { id: articleId, title: 'Updated' };

      service.update.mockResolvedValueOnce(updated as any);

      await expect(controller.update(articleId, body)).resolves.toEqual(updated);

      expect(service.update).toHaveBeenCalledTimes(1);
      expect(service.update).toHaveBeenCalledWith(articleId, body);
    });
  });

  describe('remove', () => {
    it('calls service.remove with id', async () => {
      const articleId = 'article-123';
      service.remove.mockResolvedValueOnce(undefined);

      await expect(controller.remove(articleId)).resolves.toBeUndefined();

      expect(service.remove).toHaveBeenCalledTimes(1);
      expect(service.remove).toHaveBeenCalledWith(articleId);
    });
  });
});
