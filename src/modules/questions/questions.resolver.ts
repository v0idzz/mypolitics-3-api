import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { QuestionsService } from './questions.service';
import { Question } from './entities/question.entity';
import { CreateQuestionInput } from './dto/create-question.input';
import { UpdateQuestionInput } from './dto/update-question.input';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../shared/guards/admin.guard';
import { QuizVersionsService } from '../quiz-versions/quiz-versions.service';
import { AddPartyAnswersInput } from './dto/add-party-answers-input';
import { SurveyAnswerType } from '../surveys/enums/survey-answer-type.enum';
import { PartiesService } from '../parties/parties.service';
import { GqlAuthGuard } from '../../shared/guards/gql-auth.guard';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Question)
@UseGuards(GqlAuthGuard)
export class QuestionsResolver {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly quizVersionsService: QuizVersionsService,
    private readonly partiesService: PartiesService,
  ) {}

  @Mutation(() => Question)
  async createQuestion(
    @Args('createQuestionInput') createQuestionInput: CreateQuestionInput,
    @CurrentUser() user: User,
  ): Promise<Question> {
    return await this.questionsService.createOne({
      ...createQuestionInput,
      authors: [user]
    });
  }

  @UseGuards(AdminGuard)
  @Mutation(() => [Question])
  async createManyQuestions(
    @CurrentUser() user: User,
    @Args({ name: 'quizVersion', type: () => String }) quizVersion: string,
    @Args({ name: 'createManyQuestionsInput', type: () => [CreateQuestionInput] })
      createManyQuestionsInput: CreateQuestionInput[],
  ) {
    const questions = await Promise.all(
      createManyQuestionsInput.map(q => this.questionsService.createOne({ ...q, authors: [user] }))
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
    @CurrentUser() user: User
  ): Promise<Question> {
    const question = await this.questionsService.findOne({ _id });
    const hasPermission = user.isAdmin() || question.isAuthor(user);

    if (!hasPermission) {
      throw new UnauthorizedException();
    }

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
          console.error(e);
        }
      }
    }

    return true;
  }
}
