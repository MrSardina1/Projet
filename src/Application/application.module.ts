import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Application, ApplicationSchema } from './application.schema';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { AuthModule } from 'src/Auth/auth.module';
import { Internship, InternshipSchema } from 'src/Internship/internship.schema';
import { Company, CompanySchema } from 'src/company/company.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
      { name: Internship.name, schema: InternshipSchema },
      { name: Company.name, schema: CompanySchema },
    ]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [ApplicationService], // Export the service
})
export class ApplicationModule {}