import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly mongo: Connection) {}

  @Get()
  check() {
    const dbReady = this.mongo.readyState === 1;
    return {
      status: dbReady ? 'ok' : 'degraded',
      db: dbReady ? 'up' : 'down',
      uptime: process.uptime(),
    };
  }
}
