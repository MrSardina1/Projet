import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './Database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './Auth/auth.module';
import { AIChatModule } from './AIChat/aichat.module';
import { CompanyModule } from './company/company.module';
import { InternshipModule } from './Internship/internship.module';
import { ApplicationModule } from './Application/application.module';
import { ReviewModule } from './Review/review.module';
import { AdminModule } from './Admin/admin.module';
import { ProfileModule } from './Profile/profile.module';
import { CompanyInternshipModule } from './CompanyInternship/company-internship.module';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    UserModule,
    AuthModule,
    AIChatModule,
    CompanyModule,
    InternshipModule,
    ApplicationModule,
    ReviewModule,
    AdminModule,
    ProfileModule,
    CompanyInternshipModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}