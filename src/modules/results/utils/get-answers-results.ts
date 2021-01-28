import { ResultsParty } from '../entities/results-party.entity';
import { ResultsAxis } from '../entities/results-axis.entity';
import { SurveyAnswerType } from '../../surveys/anums/survey-answer-type.enum';
import { ResultsIdeology } from '../entities/results-ideology.entity';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Party } from '../../parties/entities/party.entity';
import { Ideology } from '../../ideologies/entities/ideology.entity';
import { Survey } from '../../surveys/entities/survey.entity';

interface AnswersResults {
  parties: ResultsParty[];
  axes: ResultsAxis[];
}

interface BaseEffect {
  _id?: string;
  points: number;
}

export const getAnswersResults = ({ answers, quizVersion }: Survey): AnswersResults => {
  const partiesObj: Record<string, ResultsParty> = {};
  const ideologiesObj: Record<string, ResultsIdeology> = {};

  answers.forEach(({ question, type, weight }) => {
    if (type === SurveyAnswerType.NEUTRAL) {
      return;
    }

    const effectsType = type === SurveyAnswerType.AGREE ? 'agree' : 'disagree';
    const effects = question.effects[effectsType];

    const calcEffect = <A extends BaseEntity, B extends BaseEffect>(
      inputArray: A[],
      outputObject: Record<string, B>
    ) => (
        inputArray.forEach((entity) => {
          const alreadyInObj = outputObject[entity._id] !== undefined;
          const currentPoints = alreadyInObj ? outputObject[entity._id].points : 0;

          outputObject[entity._id] = {
            ...entity['_doc'],
            points: currentPoints + weight,
          };
        })
      );

    calcEffect<Party, ResultsParty>(effects.parties, partiesObj);
    calcEffect<Ideology, ResultsIdeology>(effects.ideologies, ideologiesObj);
  });

  const axes = quizVersion.axes.map((axis) => {
    const countPoints = (id: string) => {
      const ideology = ideologiesObj[id];
      return ideology !== undefined ? ideology.points : 0;
    };

    return {
      ...axis['_doc'],
      left: {
        ...axis.left['_doc'],
        points: countPoints(axis.left._id),
      },
      right: {
        ...axis.left['_doc'],
        points: countPoints(axis.right._id),
      }
    };
  });

  const parties = Object.values(partiesObj).sort((a, b) => (a.points < b.points) ? 1 : -1);

  return { parties, axes };
};
