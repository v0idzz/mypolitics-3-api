import { Logger, Module } from '@nestjs/common';
import { RespondentsService } from './respondents.service';
import { RespondentsResolver } from './respondents.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Respondent, RespondentSchema } from './entities/respondent.entity';

@Module({
  imports: [MongooseModule.forFeature([{name: Respondent.name, schema: RespondentSchema }], 'main')],
  providers: [RespondentsResolver, RespondentsService, Logger]
})
export class RespondentsModule {}
