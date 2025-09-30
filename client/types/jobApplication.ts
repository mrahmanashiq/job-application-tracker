export interface JobApplication {
  _id?: string
  userId: string
  companyName: string
  jobTitle: string
  jobDescription?: string
  applicationDate: Date
  applicationStatus: ApplicationStatus
  resumeUsed?: string
  jobUrl?: string
  salary?: string
  location?: string
  workType?: WorkType
  jobType?: JobType
  contactPerson?: string
  contactEmail?: string
  notes?: string
  interviewDate?: Date
  interviewType?: InterviewType
  interviewQuestions?: InterviewQuestion[]
  responseDate?: Date
  rejectionReason?: string
  followUpDate?: Date
  createdAt?: Date
  updatedAt?: Date
}

export enum ApplicationStatus {
  APPLIED = 'applied',
  UNDER_REVIEW = 'under_review',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  INTERVIEWED = 'interviewed',
  OFFER_RECEIVED = 'offer_received',
  REJECTED = 'rejected',
  WITHDRAWN = 'withdrawn',
  ACCEPTED = 'accepted'
}

export enum WorkType {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid'
}

export enum JobType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  FREELANCE = 'freelance',
  INTERNSHIP = 'internship'
}

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  ONSITE = 'onsite',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  PANEL = 'panel'
}

export interface InterviewQuestion {
  question: string
  answer?: string
  category: QuestionCategory
  difficulty?: QuestionDifficulty
  leetcodeLink?: string
}

export enum QuestionCategory {
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral',
  SYSTEM_DESIGN = 'system_design',
  CODING = 'coding',
  EXPERIENCE = 'experience'
}

export enum QuestionDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface Column {
  key: string
  label: string
  visible: boolean
  required: boolean
  width?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}