import { AuthService } from '@app/auth/auth.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ManagerEntity } from 'src/db/entities';
import { Repository } from 'typeorm';
import { CreateManagerDto, UpdateManagerDto } from './dto/input';
import { plainToInstance } from 'class-transformer';
import { ManagerInternalView } from './dto/view';
import { WinstonLogger } from '@app/logger';

@Injectable()
export class ManagersService {
  private readonly logger = new WinstonLogger(ManagersService.name);

  constructor(
    @InjectRepository(ManagerEntity) private readonly managerRepository: Repository<ManagerEntity>,
    private readonly authService: AuthService,
  ) {}

  async create(createUserDto: CreateManagerDto): Promise<void> {
    this.logger.log(`Register Manager, email: ${createUserDto.email}`);
    const existing = await this.findOneByEmail(createUserDto.email);
    if (existing) {
      this.logger.warn(`Manager already exists, email: ${createUserDto.email}`);
      throw new ForbiddenException('Manager already exist');
    }
    const userIdentity = await this.authService.signup(createUserDto);
    await this.managerRepository.save({ ...createUserDto, userIdentity });
  }

  async update(user: ManagerInternalView, updateUserDto: UpdateManagerDto): Promise<void> {
    this.logger.log(`Updating Manager, id: ${user.id}`);
    await this.managerRepository.save({ ...user, ...updateUserDto });
  }

  async findOneByEmail(email: string): Promise<ManagerInternalView> {
    this.logger.log(`Looking for Manager by email: ${email}`);
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
