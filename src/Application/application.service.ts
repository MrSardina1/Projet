import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Application, ApplicationDocument, ApplicationStatus } from './application.schema';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private applicationModel: Model<ApplicationDocument>,
  ) {}

  async apply(studentId: string, internshipId: string) {
    return this.applicationModel.create({
      student: studentId,
      internship: internshipId,
    });
  }

  async findAll() {
    return this.applicationModel
      .find()
      .populate('student')
      .populate('internship');
  }

  async updateStatus(
    applicationId: string,
    status: ApplicationStatus,
  ) {
    const application = await this.applicationModel.findById(applicationId);
    if (!application) throw new NotFoundException('Application not found');

    application.status = status;
    return application.save();
  }
}
