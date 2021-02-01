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
  maxPoints: number;
}

export const getAnswersResults = ({ answers, quizVersion }: Survey): AnswersResults => {
  const partiesObj: Record<string, ResultsParty> = {};
  const ideologiesObj: Record<string, ResultsIdeology> = {};

  answers.forEach(({ question, type, weight }) => {
    const effectsType = type === SurveyAnswerType.AGREE ? 'agree' : 'disagree';
    const negativeEffect = effectsType === 'agree' ? 'disagree' : 'agree';
    const effects = question.effects[effectsType];
    const negativeEffects = question.effects[negativeEffect];

    const calcEffect = <A extends BaseEntity, B extends BaseEffect>(
      inputArray: A[],
      outputObject: Record<string, B>,
      negative = false,
      withPoints = true,
    ) => (
        inputArray.forEach((entity) => {
          const { _id } = entity;
          const alreadyInObj = outputObject[_id] !== undefined;

          const getPoints = () => {
            const currentPoints = alreadyInObj ? outputObject[_id].points : 0;
            if (!withPoints) {
              return currentPoints;
            }

            return negative ? currentPoints - weight : currentPoints + weight;
          };

          const getMaxPoints = () => {
            const currentMaxPoints = alreadyInObj ? outputObject[_id].maxPoints : 0;
            return currentMaxPoints + weight;
          };

          outputObject[_id] = {
            ...entity['_doc'],
            points: getPoints(),
            maxPoints: getMaxPoints()
          };
        })
      );

    calcEffect<Party, ResultsParty>(effects.parties, partiesObj);
    calcEffect<Party, ResultsParty>(negativeEffects.parties, partiesObj, true);
    calcEffect<Ideology, ResultsIdeology>(effects.ideologies, ideologiesObj);
    calcEffect<Ideology, ResultsIdeology>(negativeEffects.ideologies, ideologiesObj, false, false);
  });

  const axes = quizVersion.axes.map((axis) => {
    const { left, right } = axis;

    const countPoints = (id: string) => {
      const ideology = ideologiesObj[id];
      return ideology !== undefined ? ideology.points : 0;
    };

    const countMaxPoints = (leftId: string, rightId: string) => {
      const leftIdeology = ideologiesObj[leftId];
      const leftValue = leftIdeology !== undefined ? leftIdeology.maxPoints : 0;
      const rightIdeology = ideologiesObj[rightId];
      const rightValue = rightIdeology !== undefined ? rightIdeology.maxPoints : 0;
      return leftValue + rightValue;
    };

    return {
      ...axis['_doc'],
      left: {
        ...left['_doc'],
        points: countPoints(left._id),
      },
      right: {
        ...right['_doc'],
        points: countPoints(right._id),
      },
      maxPoints: countMaxPoints(left._id, right._id),
    };
  });

  const parties = Object.values(partiesObj).sort((a, b) => (a.points < b.points) ? 1 : -1);

  return { parties, axes };
};
