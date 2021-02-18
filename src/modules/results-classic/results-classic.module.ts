import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassicResults, ClassicResultsSchema } from './entities/results-classic.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassicResults.name, schema: ClassicResultsSchema },
    ], 'classic')
  ],
  providers: [Logger]
})
export class ResultsClassicModule {}
