import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ApplicationDocument = Application & Document;

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Schema({ timestamps: true })
export class Application {

  // STUDENT who applied
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  student: Types.ObjectId;

  // Internship applied to
  @Prop({ type: Types.ObjectId, ref: 'Internship', required: true })
  internship: Types.ObjectId;

  // Application state
  @Prop({
    type: String,
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
