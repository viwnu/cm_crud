import { Module } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { ManagersController } from './managers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManagerEntity } from 'src/db/entities';
import { AuthModule } from '@app/auth';

@Module({
  imports: [TypeOrmModule.forFeature([ManagerEntity]), AuthModule],
  controllers: [ManagersController],
  providers: [ManagersService],
  exports: [ManagersService],
})
export class ManagersModule {}
