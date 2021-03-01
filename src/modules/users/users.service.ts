import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService extends BaseService<UserDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(User.name) readonly usersModel: Model<UserDocument>
  ) {
    super(logger, usersModel);
  }
}
