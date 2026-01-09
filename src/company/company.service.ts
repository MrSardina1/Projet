import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Company, CompanyDocument, CompanyStatus } from 'src/company/company.schema';
import { User } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/Auth/roles.enum';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name)
    private companyModel: Model<CompanyDocument>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(data: any) {
    const existingUser = await this.userModel.findOne({ email: data.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const existingCompany = await this.companyModel.findOne({ email: data.email });
    if (existingCompany) {
      throw new ConflictException('Company with this email already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    // Create user account with COMPANY role
    const user = await this.userModel.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      role: Role.COMPANY,
    });

    // Create company profile with PENDING status (awaiting admin approval)
    const company = await this.companyModel.create({
      name: data.name,
      description: data.description,
      email: data.email,
      website: data.website,
      user: user._id,
      status: CompanyStatus.PENDING, // Default to PENDING
    });

    return {
      message: 'Company registration submitted successfully. Please wait for admin verification.',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        status: company.status,
      },
    };
  }

  async linkUserToCompany(userId: string, companyData: any) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingCompany = await this.companyModel.findOne({ user: userId });
    if (existingCompany) {
      throw new ConflictException('This user is already linked to a company');
    }

    const emailExists = await this.companyModel.findOne({ email: companyData.email });
    if (emailExists) {
      throw new ConflictException('Company with this email already exists');
    }

    const company = await this.companyModel.create({
      name: companyData.name,
      description: companyData.description,
      email: companyData.email,
      website: companyData.website,
      user: userId,
      status: CompanyStatus.PENDING,
    });

    return {
      message: 'Company linked to user successfully',
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        status: company.status,
      },
    };
  }

  findAll() {
    return this.companyModel
      .find({ status: CompanyStatus.APPROVED }) // Only show approved companies
      .populate('user', 'username email profilePicture');
  }

  async getCompanyByUserId(userId: string) {
    const company = await this.companyModel
      .findOne({ user: userId })
      .populate('user', 'username email profilePicture');
    
    if (!company) {
      throw new NotFoundException('Company profile not found');
    }
    
    return company;
  }

  async getCompanyStatus(userId: string) {
    const company = await this.companyModel.findOne({ user: userId });
    if (!company) {
      throw new NotFoundException('Company profile not found');
    }
    return { status: company.status };
  }
}