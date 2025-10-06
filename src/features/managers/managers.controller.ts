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
    title: { summary: 'Register Manager' },
    responses: [{ status: 201, description: 'Empty response' }, ApiDocExceptions.forbidden, ApiDocExceptions.badRequest],
  })
  @Post('signup')
  async signup(@Body() createManagerDto: CreateManagerDto): Promise<void> {
    await this.managersService.create(createManagerDto);
  }

  @ApiDoc({
    title: { summary: 'Show Manager info for self' },
    responses: [
      { status: 200, type: ManagerSelfView, description: 'Manager info for self' },
      ApiDocExceptions.unauthorized,
      ApiDocExceptions.forbidden,
    ],
  })
  @SerializeView(ManagerSelfView)
  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Get('me')
  async findOne(@RequestManager() manager: ManagerInternalView): Promise<ManagerInternalView> {
    return manager;
  }

  @ApiDoc({
    title: { summary: 'Update Manager' },
    responses: [
      { status: 200, description: 'Empty response' },
      ApiDocExceptions.unauthorized,
      ApiDocExceptions.forbidden,
      ApiDocExceptions.badRequest,
    ],
  })
  @UseGuards(JwtAuthGuard, ManagerGuard)
  @Patch()
  async update(@RequestManager() manager: ManagerInternalView, @Body() updateManagerDto: UpdateManagerDto): Promise<void> {
    await this.managersService.update(manager, updateManagerDto);
  }
}
