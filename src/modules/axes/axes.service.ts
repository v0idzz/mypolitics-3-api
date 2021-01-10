import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Axis, AxisDocument } from './entities/axis.entity';
import { Model } from 'mongoose';

@Injectable()
export class AxesService extends BaseService<AxisDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(Axis.name) readonly axesModel: Model<AxisDocument>
  ) {
    super(logger, axesModel);
  }
}
