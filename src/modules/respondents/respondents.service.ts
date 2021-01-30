import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../../shared/base/base.service';
import { Respondent, RespondentDocument } from './entities/respondent.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Language } from '../../shared/enums/language.enum';
import { codesSets, getRandomCode } from './utils/codes-sets';

@Injectable()
export class RespondentsService extends BaseService<RespondentDocument> {
  constructor(
    readonly logger: Logger,
    @InjectModel(Respondent.name) readonly respondentsModel: Model<RespondentDocument>
  ) {
    super(logger, respondentsModel);
  }

  async generateCode(lang: Language): Promise<string[]> {
    const set = codesSets[lang];
    let code: string[];
    let respondentFound: Respondent | null;

    do {
      code = getRandomCode(set);
      respondentFound = await this.findOneOrNull({ code });
    } while (respondentFound !== null);

    return code;
  }
}
