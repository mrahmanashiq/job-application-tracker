import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobApplication } from './schemas/job-application.schema';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectModel(JobApplication.name)
    private jobApplicationModel: Model<JobApplication>,
  ) {}

  async create(createJobApplicationDto: CreateJobApplicationDto): Promise<JobApplication> {
    const createdJobApplication = new this.jobApplicationModel(createJobApplicationDto);
    return createdJobApplication.save();
  }

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 25,
    status?: string,
  ): Promise<PaginatedResult<JobApplication>> {
    const skip = (page - 1) * limit;
    const filter: Record<string, unknown> = { userId };
    if (status) filter.applicationStatus = status;

    const [data, total] = await Promise.all([
      this.jobApplicationModel
        .find(filter)
        .sort({ applicationDate: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.jobApplicationModel.countDocuments(filter).exec(),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOne(id: string, userId: string): Promise<JobApplication> {
    const jobApplication = await this.jobApplicationModel
      .findOne({ _id: id, userId })
      .exec();
    
    if (!jobApplication) {
      throw new NotFoundException('Job application not found');
    }
    
    return jobApplication;
  }

  async update(
    id: string,
    userId: string,
    updateJobApplicationDto: UpdateJobApplicationDto,
  ): Promise<JobApplication> {
    const updatedJobApplication = await this.jobApplicationModel
      .findOneAndUpdate(
        { _id: id, userId },
        updateJobApplicationDto,
        { new: true },
      )
      .exec();

    if (!updatedJobApplication) {
      throw new NotFoundException('Job application not found');
    }

    return updatedJobApplication;
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.jobApplicationModel
      .deleteOne({ _id: id, userId })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Job application not found');
    }
  }

  async getStats(userId: string): Promise<any> {
    const stats = await this.jobApplicationModel.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$applicationStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalApplications = await this.jobApplicationModel.countDocuments({ userId });
    
    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    return {
      totalApplications,
      statusCounts,
    };
  }
}