import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompanyInternshipController } from './company-internship.controller';
import { InternshipModule } from 'src/Internship/internship.module';
import { ApplicationModule } from 'src/Application/application.module';
import { AuthModule } from 'src/Auth/auth.module';
import { Company, CompanySchema } from 'src/company/company.schema';

@Module({
  imports: [
    AuthModule,
    InternshipModule,
    ApplicationModule,
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
    ]),
  ],
  controllers: [CompanyInternshipController],
})
export class CompanyInternshipModule {}