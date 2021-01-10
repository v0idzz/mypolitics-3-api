import { Logger, Module } from '@nestjs/common';
import { AxesService } from './quizzes.service';
import { AxesResolver } from './quizzes.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Axis, AxisSchema } from './entities/quiz.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Axis.name, schema: AxisSchema },
    ]),
  ],
  providers: [AxesResolver, AxesService, Logger]
})
export class AxesModule {}
