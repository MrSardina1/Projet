import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './jwt.strategy';
import { Company, CompanySchema } from 'src/company/company.schema';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema }
    ]),
    JwtModule.register({
      secret: process.env.SECRET, 
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}