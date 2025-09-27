import { AuthService } from '@app/auth/auth.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerEntity } from 'src/db/entities';
import { Repository } from 'typeorm';
import { CreateManagerDto, UpdateManagerDto } from './dto/input';
import { plainToInstance } from 'class-transformer';
import { ManagerInternalView } from './dto/view';

@Injectable()
export class ManagersService {
  constructor(
    @InjectRepository(ManagerEntity) private readonly managerRepository: Repository<ManagerEntity>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateManagerDto): Promise<void> {
    const existing = await this.findOneByEmail(createUserDto.email);
    if (existing) throw new ForbiddenException('User already exist');
    const userIdentity = await this.authService.signup(createUserDto);
    await this.managerRepository.save(plainToInstance(ManagerEntity, { ...createUserDto, userIdentity }));
  }

  async update(user: ManagerInternalView, updateUserDto: UpdateManagerDto): Promise<void> {
    await this.managerRepository.save(plainToInstance(ManagerEntity, { ...user, ...updateUserDto }));
  }

  async findOneByEmail(email: string): Promise<ManagerInternalView> {
    const manager = await this.managerRepository.findOne({
      where: { userIdentity: { email } },
      relations: { userIdentity: true },
    });
    return plainToInstance(ManagerInternalView, manager, {
      excludeExtraneousValues: true,
      enableImplicitConversion: true,
    });
  }
}
