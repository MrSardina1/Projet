import { Controller, Post, Body, Req, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Auth/jwt.auth.guard';
import { RolesGuard } from 'src/Auth/roles.guard';
import { Roles } from 'src/Auth/roles.decorator';
import { Role } from 'src/Auth/roles.enum';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  // STUDENT applies
  @Post()
  @Roles(Role.STUDENT)
  apply(
    @Req() req,
    @Body() dto: CreateApplicationDto,
  ) {
    return this.applicationService.apply(
      req.user.userId,
      dto.internshipId,
    );
  }

  // ADMIN sees all
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.applicationService.findAll();
  }

  // COMPANY accepts / rejects
  @Patch(':id/status')
  @Roles(Role.COMPANY)
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationService.updateStatus(id, dto.status);
  }
}
