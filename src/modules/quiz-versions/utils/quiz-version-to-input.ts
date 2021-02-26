
import { UpdateQuizVersionInput } from '../dto/update-quiz-version.input';

export const quizVersionToInput = ({
  questions: quizQuestions,
  traits: quizTraits,
  compassModes: quizCompassModes,
  parties: quizParties,
  ideologies: quizIdeologies,
}): UpdateQuizVersionInput => {
  const compassAxisToInput = ({
    name,
    leftIdeologies,
    rightIdeologies,
  }) => {
    const ideologyToInput = ({ weight, ideology }) => ({
      ideology: ideology._id.toString(),
      weight,
    });

    return {
      name,
      leftIdeologies: leftIdeologies.map(ideologyToInput),
      rightIdeologies: rightIdeologies.map(ideologyToInput),
    };
  };

  const compassModeToInput = ({
    name,
    horizontal,
    vertical,
    third,
  }) => ({
    name,
    horizontal: compassAxisToInput(horizontal),
    vertical: compassAxisToInput(vertical),
    ...(third
      ? {
        third: compassAxisToInput(third),
      }
      : {}),
  });

  const toIds = (entity) => entity._id.toString();
  const compassModes = quizCompassModes.map(compassModeToInput);
  const questions = quizQuestions.map(toIds);
  const traits = quizTraits.map(toIds);
  const parties = quizParties.map(toIds);
  const ideologies = quizIdeologies.map(toIds);

  return {
    questions,
    traits,
    compassModes,
    parties,
    ideologies,
  };
};
