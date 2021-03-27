import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';
import { RateLimiterModule } from 'nestjs-rate-limiter/dist';

@Module({
  controllers: [UtilsController],
  providers: [UtilsService],
  imports: [RateLimiterModule]
})
export class UtilsModule {}
