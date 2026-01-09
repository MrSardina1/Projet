import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { AuthModule } from 'src/Auth/auth.module';
import { User, UserSchema } from 'src/user/user.schema';
import { Company, CompanySchema } from 'src/company/company.schema';
import { Internship, InternshipSchema } from 'src/Internship/internship.schema';
import { Application, ApplicationSchema } from 'src/Application/application.schema';
import { Review, ReviewSchema } from 'src/Review/review.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Company.name, schema: CompanySchema },
      { name: Internship.name, schema: InternshipSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}