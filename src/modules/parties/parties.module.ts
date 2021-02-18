import { Logger, Module } from '@nestjs/common';
import { PartiesService } from './parties.service';
import { PartiesResolver } from './parties.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Party, PartySchema } from './entities/party.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Party.name, schema: PartySchema },
    ], 'main'),
  ],
  providers: [PartiesResolver, PartiesService, Logger]
})
export class PartiesModule {}
