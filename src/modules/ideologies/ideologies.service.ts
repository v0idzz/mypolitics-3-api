import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Ideology, IdeologyDocument } from './entities/ideology.entity';
import { Model } from 'mongoose';

@Injectable()
export class IdeologiesService extends BaseService<IdeologyDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(Ideology.name) readonly ideologiesModel: Model<IdeologyDocument>
  ) {
    super(logger, ideologiesModel);
  }
}
