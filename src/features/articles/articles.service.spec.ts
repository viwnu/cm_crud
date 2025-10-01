import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import { ArticleEntity } from 'src/db/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ManagerInternalView } from '../managers/dto/view';
import { CreateArticleDTO, UpdateArticleDTO } from './dto/input';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let repo: jest.Mocked<Repository<ArticleEntity>>;

  beforeEach(async () => {
    const repoMock: Partial<jest.Mocked<Repository<ArticleEntity>>> = {
      save: jest.fn(),
      findAndCount: jest.fn(),
      findOneBy: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesService, { provide: getRepositoryToken(ArticleEntity), useValue: repoMock }],
    }).compile();

    service = module.get<ArticlesService>(ArticlesService);
    repo = module.get(getRepositoryToken(ArticleEntity));
  });

  describe('create', () => {
    it('calls repository.save with correct data', async () => {
      repo.save.mockResolvedValueOnce(undefined as any);

      const manager: ManagerInternalView = {
        id: 'manager-1',
        name: 'Test Manager',
        userIdentity: undefined,
      };
      const dto: CreateArticleDTO = {
        title: 'Hello',
        description: 'Short description',
        content: 'World',
      };

      await expect(service.create(manager, dto)).resolves.toBeUndefined();
      expect(repo.save).toHaveBeenCalledWith({ ...dto, author: manager });
    });
  });

  describe('findAll', () => {
    it('returns filtered articles and count', async () => {
      const articles: ArticleEntity[] = [
        {
          id: 'a1',
          title: 'T',
          description: 'desc',
          content: 'content',
          created: new Date('2025-09-27T11:38:20.901Z'),
          author: {
            id: 'auth-1',
            name: 'Author Name',
            userIdentity: undefined,
          } as any,
        },
      ];
      repo.findAndCount.mockResolvedValueOnce([articles, 1]);

      const options = {
        limit: 10,
        page: 0,
        authorId: 'auth-1',
        createdFromTo: [new Date('2024-09-27T11:38:20.901Z'), new Date('2025-09-27T11:38:20.901Z')] as [Date, Date],
      };

      await expect(service.findAll(options)).resolves.toEqual({ articles, count: 1 });
      expect(repo.findAndCount).toHaveBeenCalledTimes(1);
      expect(repo.findAndCount.mock.calls[0][0]).toMatchObject({
        relations: { author: true },
        skip: 0,
        take: 10,
      });
    });
  });

  describe('update', () => {
    it('updates an article', async () => {
      const existing: ArticleEntity = {
        id: 'a1',
        title: 'Old',
        description: 'desc',
        content: 'content',
        created: new Date(),
        author: { id: 'auth-1', name: 'Author Name', userIdentity: undefined } as any,
      };
      repo.findOneBy.mockResolvedValueOnce(existing);
      repo.save.mockResolvedValueOnce(undefined as any);

      const dto: UpdateArticleDTO = { title: 'New' };
      await expect(service.update('a1', dto)).resolves.toBeUndefined();
      expect(repo.save).toHaveBeenCalledWith({ ...existing, ...dto });
    });

    it('throws if article not found', async () => {
      repo.findOneBy.mockResolvedValueOnce(undefined);

      await expect(service.update('bad-id', { title: 'New' })).rejects.toThrow('Article was not found!');
    });
  });

  describe('remove', () => {
    it('removes an article', async () => {
      const existing: ArticleEntity = {
        id: 'a1',
        title: 'Old',
        description: 'desc',
        content: 'content',
        created: new Date(),
        author: { id: 'auth-1', name: 'Author Name', userIdentity: undefined } as any,
      };
      repo.findOneBy.mockResolvedValueOnce(existing);
      repo.remove.mockResolvedValueOnce(undefined as any);

      await expect(service.remove('a1')).resolves.toBeUndefined();
      expect(repo.remove).toHaveBeenCalledWith(existing);
    });

    it('throws if article not found', async () => {
      repo.findOneBy.mockResolvedValueOnce(undefined);

      await expect(service.remove('bad-id')).rejects.toThrow('Article was not found!');
    });
  });

  describe('findOneById', () => {
    it('returns article if found', async () => {
      const existing: ArticleEntity = {
        id: 'a1',
        title: 'T',
        description: 'desc',
        content: 'content',
        created: new Date(),
        author: { id: 'auth-1', name: 'Author Name', userIdentity: undefined } as any,
      };
      repo.findOneBy.mockResolvedValueOnce(existing);

      await expect(service.findOneById('a1')).resolves.toBe(existing);
    });

    it('throws if not found', async () => {
      repo.findOneBy.mockResolvedValueOnce(undefined);

      await expect(service.findOneById('bad-id')).rejects.toThrow('Article was not found!');
    });
  });
});
