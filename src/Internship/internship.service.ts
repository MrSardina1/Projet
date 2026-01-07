import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Internship, InternshipDocument } from 'src/Internship/internship.schema';
import { Model } from 'mongoose';

@Injectable()
export class InternshipService {
  constructor(
    @InjectModel(Internship.name)
    private internshipModel: Model<InternshipDocument>,
  ) {}

  create(data: any, companyId: string) {
    return this.internshipModel.create({
      ...data,
      company: companyId,
    });
  }

  findAll() {
    return this.internshipModel
      .find()
      .populate('company', 'name website');
  }
}
