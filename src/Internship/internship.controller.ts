import { Controller, UseGuards, Post, Get, Body, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Auth/jwt.auth.guard';
import { RolesGuard } from 'src/Auth/roles.guard';
import { InternshipService } from 'src/Internship/internship.service';
import { Role } from 'src/Auth/roles.enum';
import { Roles } from 'src/Auth/roles.decorator';
import { Public } from 'src/Auth/public.decorator';
import { CreateInternshipDto } from './dto/create-internship.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('internships')
export class InternshipController {
  constructor(
    private internshipService: InternshipService,
  ) {}

  @Post()
  @Roles(Role.COMPANY)
  create(
    @Body() body: CreateInternshipDto,
    @Req() req,
  ) {
    return this.internshipService.create(
      body,
      req.user.userId,
    );
  }

  @Get()
  @Public()
  findAll() {
    return this.internshipService.findAll();
  }
}