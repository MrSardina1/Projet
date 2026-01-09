import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { Company, CompanyDocument, CompanyStatus } from 'src/company/company.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    ) {}

    async login(email: string, password: string){
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if user is a company and verify status
        if (user.role === 'COMPANY') {
            const company = await this.companyModel.findOne({ user: user._id });
            
            if (!company) {
                throw new UnauthorizedException('Company profile not found');
            }

            if (company.status === CompanyStatus.PENDING) {
                throw new UnauthorizedException(
                    'Your company account is pending admin verification. Please wait for approval.'
                );
            }

            if (company.status === CompanyStatus.REJECTED) {
                throw new UnauthorizedException(
                    'Your company account has been rejected. Please contact support.'
                );
            }
        }

        const payload = {
            sub: user._id,
            username: user.username,
            role: user.role,
        };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
            }
        };
    }
}