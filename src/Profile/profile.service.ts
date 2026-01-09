import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Company, CompanyDocument } from 'src/company/company.schema';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  async getProfile(userId: string, userRole: string) {
    if (userRole === 'COMPANY') {
      const company = await this.companyModel
        .findOne({ user: new Types.ObjectId(userId) })
        .populate('user', '-password');
      
      if (!company) {
        throw new NotFoundException('Company profile not found');
      }
      return company;
    }

    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserProfile(userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Invalid user ID');
    }

    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getCompanyProfile(companyId: string) {
    if (!Types.ObjectId.isValid(companyId)) {
      throw new NotFoundException('Invalid company ID');
    }

    const company = await this.companyModel
      .findById(companyId)
      .populate('user', 'username email profilePicture');
    
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    return company;
  }

  async updateProfile(userId: string, userRole: string, data: any) {
    // Prevent updating sensitive fields
    const { email, password, role, ...allowedData } = data;

    if (userRole === 'COMPANY') {
      const company = await this.companyModel
        .findOneAndUpdate(
          { user: new Types.ObjectId(userId) },
          { $set: allowedData },
          { new: true }
        );
      
      if (!company) {
        throw new NotFoundException('Company profile not found');
      }
      return company;
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { $set: allowedData },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new BadRequestException('New password must be at least 6 characters');
    }

    // Hash new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    return { message: 'Password changed successfully' };
  }

  async updateProfilePicture(userId: string, userRole: string, filename: string) {
    const picturePath = `uploads/profiles/${filename}`;

    if (userRole === 'COMPANY') {
      const company = await this.companyModel
        .findOneAndUpdate(
          { user: new Types.ObjectId(userId) },
          { profilePicture: picturePath },
          { new: true }
        );
      
      if (!company) {
        throw new NotFoundException('Company profile not found');
      }
      return { profilePicture: picturePath };
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { profilePicture: picturePath },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { profilePicture: picturePath };
  }

  async removeProfilePicture(userId: string, userRole: string) {
    if (userRole === 'COMPANY') {
      const company = await this.companyModel.findOne({ 
        user: new Types.ObjectId(userId) 
      });
      
      if (!company) {
        throw new NotFoundException('Company profile not found');
      }

      // Delete old file if exists
      if (company.profilePicture) {
        const filePath = path.join(process.cwd(), company.profilePicture);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      company.profilePicture = undefined;
      await company.save();

      return { message: 'Profile picture removed successfully' };
    }

    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete old file if exists
    if (user.profilePicture) {
      const filePath = path.join(process.cwd(), user.profilePicture);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.profilePicture = undefined;
    await user.save();

    return { message: 'Profile picture removed successfully' };
  }
}