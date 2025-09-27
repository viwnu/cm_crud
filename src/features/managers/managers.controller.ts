import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiDoc } from '@app/api-doc';
import { ApiDocExceptions } from '@app/api-doc/responses';
import { SerializeView } from '@app/serializer';
import { JwtAuthGuard } from '@app/auth/guards';

import { RequestManager } from 'src/decorators';
import { ManagersService } from './managers.service';
import { CreateManagerDto, UpdateManagerDto } from './dto/input';
import { ManagerInternalView, ManagerSelfView } from './dto/view';
import { ManagerGuard } from './guards';

@ApiTags('Managers')
@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @ApiDoc({
    title: 'Register Manager',
    response: { status: 201, description: 'Empty response' },
    exceptions: [ApiDocExceptions.forbidden, ApiDocExceptions.badRequest],
  })
  @Post('signup')
  async signup(@Body() createManagerDto: CreateManagerDto): Promise<void> {
    await this.managersService.create(createManagerDto);
  }

  @ApiDoc({
    title: 'Show Manager info for self',
    response: { status: 200, type: ManagerSelfView, description: 'Manager info for self' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.forbidden],
    auth: 'bearer',
  })
  @SerializeView(ManagerSelfView)
  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Get('me')
  async findOne(@RequestManager() manager: ManagerInternalView): Promise<ManagerInternalView> {
    return manager;
  }

  @ApiDoc({
    title: 'Update Manager',
    response: { status: 200, description: 'Empty response' },
    exceptions: [ApiDocExceptions.unauthorized, ApiDocExceptions.forbidden, ApiDocExceptions.badRequest],
    auth: 'bearer',
  })
  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Patch()
  async update(@RequestManager() manager: ManagerInternalView, @Body() updateManagerDto: UpdateManagerDto): Promise<void> {
    await this.managersService.update(manager, updateManagerDto);
  }
}
