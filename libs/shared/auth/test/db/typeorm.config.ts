import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { UserIdentityEntity } from '../../src/db/user.identity.entity';

export const TypeOrmConfigService = (): TypeOrmModuleAsyncOptions => ({
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('PS_HOST'),
    port: Number(configService.get('PS_PORT')),
    username: configService.get('PS_USER'),
    password: configService.get('PS_PASSWORD'),
    database: configService.get('PS_DB_NAME'),
    entities: [UserIdentityEntity],
    autoLoadEntities: Boolean(configService.get('SYNC_DB') === 'true') || false,
    synchronize: Boolean(configService.get('SYNC_DB') === 'true') || false,
    logger: 'simple-console',
    logging: Boolean(configService.get('TYPEORM_LOGGING') === 'true') || false,
  }),
  inject: [ConfigService],
  imports: [ConfigModule],
});
