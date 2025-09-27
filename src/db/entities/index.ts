import { UserIdentityEntity } from '@app/auth/db';
import { ArticleEntity } from './articles';
import { ManagerEntity } from './managers';

export * from './articles';
export * from './managers';
export const ENTITIES = [UserIdentityEntity, ArticleEntity, ManagerEntity];
