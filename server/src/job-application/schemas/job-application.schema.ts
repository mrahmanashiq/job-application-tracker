import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum ApplicationStatus {
  APPLIED = 'applied',
  UNDER_REVIEW = 'under_review',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  OFFER_RECEIVED = 'offer_received',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  ACCEPTED = 'accepted',
}

export enum WorkType {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid',
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship',
}

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  ONSITE = 'onsite',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  PANEL = 'panel',
}

export enum QuestionCategory {
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  SYSTEM_DESIGN = 'system_design',
  CODING = 'coding',
  EXPERIENCE = 'experience',
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Schema({ _id: false })
export class InterviewQuestion {
  @Prop({ required: true })
  question: string;

  @Prop()
  answer?: string;

  @Prop({ enum: QuestionCategory, required: true })
  category: QuestionCategory;

  @Prop({ enum: QuestionDifficulty })
  difficulty?: QuestionDifficulty;

  @Prop()
  leetcodeLink?: string;
}

const InterviewQuestionSchema = SchemaFactory.createForClass(InterviewQuestion);

@Schema({ timestamps: true })
export class JobApplication extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  companyName: string;

  @Prop({ required: true })
  jobTitle: string;

  @Prop()
  jobDescription?: string;

  @Prop({ enum: ApplicationStatus, default: ApplicationStatus.APPLIED })
  applicationStatus: ApplicationStatus;

  @Prop({ required: true })
  applicationDate: Date;

  @Prop()
  resumeUsed?: string;

  @Prop()
  jobUrl?: string;

  @Prop()
  salary?: string;

  @Prop()
  location?: string;

  @Prop({ enum: WorkType })
  workType?: WorkType;

  @Prop({ enum: JobType })
  jobType?: JobType;

  @Prop()
  contactPerson?: string;

  @Prop()
  contactEmail?: string;

  @Prop()
  notes?: string;

  @Prop()
  interviewDate?: Date;

  @Prop({ enum: InterviewType })
  interviewType?: InterviewType;

  @Prop({ type: [InterviewQuestionSchema], default: [] })
  interviewQuestions?: InterviewQuestion[];

  @Prop()
  responseDate?: Date;

  @Prop()
  rejectionReason?: string;

  @Prop()
  followUpDate?: Date;
}

export const JobApplicationSchema = SchemaFactory.createForClass(JobApplication);