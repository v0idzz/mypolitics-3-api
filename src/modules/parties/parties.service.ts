import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Party, PartyDocument } from './entities/party.entity';
import { Model } from 'mongoose';

@Injectable()
export class PartiesService extends BaseService<PartyDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(Party.name) readonly partiesModel: Model<PartyDocument>
  ) {
    super(logger, partiesModel);
  }
}
