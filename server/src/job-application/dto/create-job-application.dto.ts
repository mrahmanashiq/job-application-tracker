import { IsString, IsOptional, IsEnum, IsDateString, IsArray, ValidateNested, IsUrl, IsEmail } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApplicationStatus, WorkType, JobType, InterviewType, QuestionCategory, QuestionDifficulty } from '../schemas/job-application.schema';

const emptyStringToUndefined = ({ value }: { value: unknown }) =>
  typeof value === 'string' && value.trim() === '' ? undefined : value;

export class InterviewQuestionDto {
  @IsString()
  question: string;

  @IsOptional()
  @IsString()
  answer?: string;

  @IsEnum(QuestionCategory)
  category: QuestionCategory;

  @IsOptional()
  @IsEnum(QuestionDifficulty)
  difficulty?: QuestionDifficulty;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl()
  leetcodeLink?: string;
}

export class CreateJobApplicationDto {
  @IsString()
  userId: string;

  @IsString()
  companyName: string;

  @IsString()
  jobTitle: string;

  @IsOptional()
  @IsString()
  jobDescription?: string;

  @IsEnum(ApplicationStatus)
  applicationStatus: ApplicationStatus;

  @IsDateString()
  applicationDate: Date;

  @IsOptional()
  @IsString()
  resumeUsed?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsUrl()
  jobUrl?: string;

  @IsOptional()
  @IsString()
  salary?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsEnum(WorkType)
  workType?: WorkType;

  @IsOptional()
  @IsEnum(JobType)
  jobType?: JobType;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @Transform(emptyStringToUndefined)
  @IsEmail()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsDateString()
  interviewDate?: Date;

  @IsOptional()
  @IsEnum(InterviewType)
  interviewType?: InterviewType;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InterviewQuestionDto)
  interviewQuestions?: InterviewQuestionDto[];

  @IsOptional()
  @IsDateString()
  responseDate?: Date;

  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsDateString()
  followUpDate?: Date;
}