import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobApplicationService } from './job-application.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';

@Controller('job-applications')
export class JobApplicationController {
  constructor(private readonly jobApplicationService: JobApplicationService) {}

  @Post()
  create(@Body() createJobApplicationDto: CreateJobApplicationDto) {
    return this.jobApplicationService.create(createJobApplicationDto);
  }

  @Get()
  findAll(
    @Query('userId') userId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 25;
    return this.jobApplicationService.findAll(userId, pageNum, limitNum, status);
  }

  @Get('stats')
  getStats(@Query('userId') userId: string) {
    return this.jobApplicationService.getStats(userId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.jobApplicationService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Query('userId') userId: string,
    @Body() updateJobApplicationDto: UpdateJobApplicationDto,
  ) {
    return this.jobApplicationService.update(id, userId, updateJobApplicationDto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.jobApplicationService.remove(id, userId);
  }
}