import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { QuizVersionsService } from '../quiz-versions/quiz-versions.service';
import { AddPartyAnswersInput } from './dto/add-party-answers-input';
import { SurveyAnswerType } from '../surveys/anums/survey-answer-type.enum';
import { PartiesService } from '../parties/parties.service';

@Resolver(() => Question)
@UseGuards(AdminGuard)
export class QuestionsResolver {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly quizVersionsService: QuizVersionsService,
    private readonly partiesService: PartiesService,
  ) {}

  @Mutation(() => Question)
  async createQuestion(
    @Args({ name: 'quizVersion', type: () => String }) quizVersion: string,
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
  ): Promise<Question> {
    return await this.questionsService.createOne(createQuestionInput);
  }

  @Mutation(() => [Question])
  async createManyQuestions(
    @Args({ name: 'quizVersion', type: () => String }) quizVersion: string,
    @Args({ name: 'createManyQuestionsInput', type: () => [CreateQuestionInput] })
      createManyQuestionsInput: CreateQuestionInput[],
  ) {
    const questions = await Promise.all(
      createManyQuestionsInput.map(q => this.questionsService.createOne(q))
    );

    await this.quizVersionsService.updateOne({
      _id: quizVersion,
    }, {
      $push: { questions },
    });

    return questions;
  }

  @Mutation(() => Question)
  async updateQuestion(
    @Args({ name: 'id', type: () => String }) _id: string,
    @Args('updateQuestionInput') updateQuestionInput: UpdateQuestionInput,
  ): Promise<Question> {
    return this.questionsService.updateOne({ _id }, updateQuestionInput, {
      populate: {
        path: 'effects',
        populate: {
          path: 'agree disagree',
          populate: {
            path: 'ideologies parties',
          }
        }
      }
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(AdminGuard)
  async addPartyAnswers(
    @Args({ name: 'partyId', type: () => String }) partyId: string,
    @Args({ name: 'quizVersionId', type: () => String }) quizVersionId: string,
    @Args({ name: 'addPartyAnswersInput', type: () => [AddPartyAnswersInput] }) addPartyAnswersInput: AddPartyAnswersInput[],
  ): Promise<boolean> {
    const party = await this.partiesService.findOne({ _id: partyId });
    const quizVersion = await this.quizVersionsService.findOne({ _id: quizVersionId }, {}, {
      populate: {
        path: 'questions',
      }
    });
    const questionsIds = quizVersion.questions.map(q => q._id);

    for (let i = 0; i < addPartyAnswersInput.length; i++) {
      const { questionText, answer } = addPartyAnswersInput[i];
      if (answer !== SurveyAnswerType.NEUTRAL) {
        const answerName = answer === SurveyAnswerType.AGREE ? 'agree' : 'disagree';

        try {
          const question = await this.questionsService.findOneOrNull({ text: questionText, _id: { $in: questionsIds, } });
          if (question === null) {
            console.log(`Question does not exists: ${questionText.pl}`);
            continue;
          }

          await question.updateOne({
            $pull: {
              'effects.agree.parties': party._id,
              'effects.disagree.parties': party._id,
            },
          }, { multi: true });

          await question.updateOne({
            $addToSet: {
              [`effects.${answerName}.parties`]: party
            }
          });
        } catch (e) {
          // console.error(e);
        }
      }
    }

    return true;
  }
}
