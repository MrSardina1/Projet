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

  // ADMIN, COMPANY, and STUDENT can see applications
  @Get()
  @Roles(Role.ADMIN, Role.COMPANY, Role.STUDENT)
  findAll(@Req() req) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    return this.applicationService.findAll(userId, userRole);
  }

  // NEW: Get my applications (STUDENT only)
  @Get('my-applications')
  @Roles(Role.STUDENT)
  getMyApplications(@Req() req) {
    return this.applicationService.getMyApplications(req.user.userId);
  }

  // NEW: Get accepted companies for student
  @Get('accepted-companies')
  @Roles(Role.STUDENT)
  getAcceptedCompanies(@Req() req) {
    return this.applicationService.getAcceptedCompanies(req.user.userId);
  }

  // NEW: Get application count for internship
  @Get('count/:internshipId')
  getApplicationCount(@Param('internshipId') internshipId: string) {
    return this.applicationService.getApplicationCount(internshipId);
  }

  // ADMIN and COMPANY can update status
  @Patch(':id/status')
  @Roles(Role.ADMIN, Role.COMPANY)
  updateStatus(
    @Req() req,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    return this.applicationService.updateStatus(id, dto.status, userId, userRole);
  }
}