import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ENTITIES } from './entities';

export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: Number(configService.get('POSTGRES_PORT')),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    entities: ENTITIES,
    autoLoadEntities: Boolean(configService.get('SYNC_DB') === 'true') || false,
    synchronize: Boolean(configService.get('SYNC_DB') === 'true') || false,
    logger: 'simple-console',
    logging: Boolean(configService.get('TYPEORM_LOGGING') === 'true') || false,
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
