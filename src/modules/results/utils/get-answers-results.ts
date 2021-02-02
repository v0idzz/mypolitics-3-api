import { ResultsParty } from '../entities/results-party.entity';
import { ResultsAxis } from '../entities/results-axis.entity';
import { SurveyAnswerType } from '../../surveys/anums/survey-answer-type.enum';
import { ResultsIdeology } from '../entities/results-ideology.entity';
import { Survey } from '../../surveys/entities/survey.entity';
import { ResultsCompass } from '../entities/results-compass.entity';
import { QuizCompassAxisInput } from '../../quiz-versions/dto/quiz-compass-mode.input';

interface AnswersResults {
  parties: ResultsParty[];
  axes: ResultsAxis[];
  compasses: ResultsCompass[];
}

const sum = (numbers: number[]) => numbers.reduce((total, aNumber) => total + aNumber, 0);

export const getAnswersResults = ({ answers, quizVersion }: Survey): AnswersResults => {
  const partiesObj: Record<string, ResultsParty> = {};
  const ideologiesObj: Record<string, ResultsIdeology> = {};

  answers.forEach(({ question, type, weight }) => {
    const effectsType = type === SurveyAnswerType.AGREE ? 'agree' : 'disagree';
    const oppositeEffect = effectsType === 'agree' ? 'disagree' : 'agree';
    const effects = question.effects[effectsType];
    const oppositeEffects = question.effects[oppositeEffect];

    effects.parties.forEach((party) => {
      const { _id } = party;
      const partyObjExists = partiesObj[_id] !== undefined;

      if (partyObjExists) {
        partiesObj[_id].agreementPoints += weight;
      } else {
        partiesObj[_id] = {
          ...party['_doc'],
          agreementPoints: weight,
          disagreementPoints: 0
        };
      }
    });

    oppositeEffects.parties.forEach((party) => {
      const { _id } = party;
      const partyObjExists = partiesObj[_id] !== undefined;

      if (partyObjExists) {
        partiesObj[_id].disagreementPoints += weight;
      } else {
        partiesObj[_id] = {
          ...party['_doc'],
          agreementPoints: 0,
          disagreementPoints: weight
        };
      }
    });

    effects.ideologies.forEach((ideology) => {
      const { _id } = ideology;
      const ideologyObjExists = ideologiesObj[_id] !== undefined;

      if (ideologyObjExists) {
        ideologiesObj[_id].points += weight;
        ideologiesObj[_id].maxPoints += weight;
      } else {
        ideologiesObj[_id] = {
          ...ideology['_doc'],
          points: weight,
          maxPoints: weight
        };
      }
    });

    oppositeEffects.ideologies.forEach((ideology) => {
      if (type !== SurveyAnswerType.NEUTRAL) {
        return;
      }

      const { _id } = ideology;
      const ideologyObjExists = ideologiesObj[_id] !== undefined;

      if (ideologyObjExists) {
        ideologiesObj[_id].maxPoints += weight;
      } else {
        ideologiesObj[_id] = {
          ...ideology['_doc'],
          points: 0,
          maxPoints: weight
        };
      }
    });
  });

  const axes = quizVersion.axes.map((axis): ResultsAxis => {
    const { left, right } = axis;

    const countPoints = (id: string) => {
      const ideology = ideologiesObj[id];
      return ideology !== undefined ? ideology.points : 0;
    };

    const countMaxPoints = (leftId: string, rightId: string) => (
      countPoints(leftId) + countPoints(rightId)
    );

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

  const parties = Object.values(partiesObj)
    .map(party => {
      const percent = (party.agreementPoints / (party.agreementPoints + party.disagreementPoints)) * 100;
      const percentValue = isNaN(percent) ? 0 : percent;
      const percentAgreement = parseInt(percentValue.toFixed(0));

      return {
        ...party,
        percentAgreement,
      };
    })
    .sort((a, b) => (a.percentAgreement < b.percentAgreement) ? 1 : -1);

  const compasses = quizVersion.compassModes.map(({ name, ...compassMode }): ResultsCompass => {
    const compassAxes: QuizCompassAxisInput[] = Object.values(compassMode['_doc']).filter(
      (compassAxis) => typeof compassAxis['name'] !== 'undefined'
    );
    const countPoints = (id: string) => {
      const ideology = ideologiesObj[id];
      return ideology !== undefined ? ideology.points : 0;
    };

    const pointEntries = compassAxes.map((compassAxis): [string, number] => {
      const { leftIdeologies, rightIdeologies, name } = compassAxis;
      const toPoints = ({ ideology, weight }) => weight * countPoints(ideology);

      const leftPoints = sum(leftIdeologies.map(toPoints));
      const rightPoints = sum(rightIdeologies.map(toPoints));
      const value = (rightPoints - leftPoints) / (rightPoints + leftPoints);
      const key = Object.keys(compassMode['_doc']).find(key => (
        compassMode['_doc'][key] && compassMode['_doc'][key].name == name
      ));

      return [key, isNaN(value) ? 0 : value];
    });

    return {
      ...compassMode['_doc'],
      point: Object.fromEntries(pointEntries),
      name,
    };
  });

  return { parties, axes, compasses };
};
