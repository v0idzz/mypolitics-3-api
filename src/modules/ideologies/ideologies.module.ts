import { Logger, Module } from '@nestjs/common';
import { IdeologiesService } from './ideologies.service';
import { IdeologiesResolver } from './ideologies.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Ideology, IdeologySchema } from './entities/ideology.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Ideology.name, schema: IdeologySchema },
    ]),
  ],
  providers: [IdeologiesResolver, IdeologiesService, Logger]
})
export class IdeologiesModule {}
