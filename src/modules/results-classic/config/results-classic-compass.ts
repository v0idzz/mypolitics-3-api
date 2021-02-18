import { ClassicAxes, ClassicResults } from '../entities/results-classic.entity';

export type SpheresType = {
  economics: number
  social: number
};

export enum SpheresVariant {
  Classic,
  Extended,
}

export const axesSides = [
  {
    left: 'communism',
    right: 'capitalism',
  },
  {
    left: 'interventionism',
    right: 'laissezfaire',
  },
  {
    left: 'anarchism',
    right: 'authoritarianism',
  },
  {
    left: 'pacifism',
    right: 'militarism',
  },
  {
    left: 'environmentalism',
    right: 'anthropocentrism',
    notApplicableToSpheres: true,
  },
  {
    left: 'progressivism',
    right: 'traditionalism',
  },
  {
    left: 'cosmopolitanism',
    right: 'nationalism',
  },
];

const sum = (numbers: number[]) => numbers.reduce((total, aNumber) => total + aNumber, 0);
const average = (numbers: number[]) => sum(numbers) / numbers.length;

const calcEconomicsSphere = (axes: ClassicAxes, method: SpheresVariant): number => {
  const calcExtended = () => {
    const econAxesSides = axesSides.slice(0, 2);
    const econLeft = econAxesSides.map((side) => axes[side.left]);
    const econRight = econAxesSides.map((side) => axes[side.right]);
    const econLeftAverage = average(econLeft);
    const econRightAverage = average(econRight);
    const econDifference = econRightAverage - econLeftAverage;
    return econDifference / 100;
  };

  const calcClassic = () => {
    const { left, right } = axesSides[0];
    const econLeft = axes[left];
    const econRight = axes[right];
    const econDifference = econRight - econLeft;
    return econDifference / 100;
  };

  return method === SpheresVariant.Classic ? calcClassic() : calcExtended();
};

const calcSocialSphere = (axes: ClassicAxes, method: SpheresVariant): number => {
  const calcExtended = () => {
    const socialAxesSides = axesSides
      .slice(2)
      .filter((side) => !side.notApplicableToSpheres);

    const socialLeft = socialAxesSides.map((side) => axes[side.left]);
    const socialRight = socialAxesSides.map((side) => axes[side.right]);
    const socialLeftAverage = average(socialLeft);
    const socialRightAverage = average(socialRight);
    const socialDifference = socialRightAverage - socialLeftAverage;
    return socialDifference / 100;
  };

  const calcClassic = () => {
    const { left, right } = axesSides[2];
    const socialLeft = axes[left];
    const socialRight = axes[right];
    const socialDifference = socialRight - socialLeft;
    return socialDifference / 100;
  };

  return method === SpheresVariant.Classic ? calcClassic() : calcExtended();
};

const calcSpheresResults = (
  results: ClassicResults,
  method: SpheresVariant,
): SpheresType => ({
  economics: calcEconomicsSphere(results.axes, method),
  social: calcSocialSphere(results.axes, method),
});

export const calcCompasses = (results: ClassicResults) => {
  const classicCompass = calcSpheresResults(results, SpheresVariant.Classic);
  const extendedCompass = calcSpheresResults(results, SpheresVariant.Extended);

  const thirdAxisPosition = () => {
    const { axes } = results;
    const centerPoints = (axes.progressivism + axes.traditionalism) / 100;
    const halfCenter = centerPoints / 2;
    const leftPoints = axes.progressivism + halfCenter;
    const rightPoints = axes.traditionalism + halfCenter;
    return (rightPoints - leftPoints) / 100;
  }

  return [
    {
      '__typename': 'ResultsCompass',
      'name': {
        '__typename': 'TextTranslation',
        'pl': 'Rozszerzony',
        'en': null
      },
      'horizontal': {
        '__typename': 'QuizCompassAxis',
        'name': {
          '__typename': 'TextTranslation',
          'pl': 'Gospodarka',
          'en': null
        }
      },
      'vertical': {
        '__typename': 'QuizCompassAxis',
        'name': {
          '__typename': 'TextTranslation',
          'pl': 'Światopogląd',
          'en': null
        }
      },
      'third': {
        '__typename': 'QuizCompassAxis',
        'name': null
      },
      'point': {
        '__typename': 'ResultsCompassPoint',
        'horizontal': extendedCompass.economics,
        'vertical': extendedCompass.social,
        'third': null
      }
    },
    {
      '__typename': 'ResultsCompass',
      'name': {
        '__typename': 'TextTranslation',
        'pl': 'Klasyczny',
        'en': null
      },
      'horizontal': {
        '__typename': 'QuizCompassAxis',
        'name': {
          '__typename': 'TextTranslation',
          'pl': 'Gospodarka',
          'en': null
        }
      },
      'vertical': {
        '__typename': 'QuizCompassAxis',
        'name': {
          '__typename': 'TextTranslation',
          'pl': 'Światopogląd',
          'en': null
        }
      },
      'third': {
        '__typename': 'QuizCompassAxis',
        'name': {
          '__typename': 'TextTranslation',
          'pl': 'Progresywizm',
          'en': null
        }
      },
      'point': {
        '__typename': 'ResultsCompassPoint',
        'horizontal': classicCompass.economics,
        'vertical': classicCompass.social,
        'third': thirdAxisPosition(),
      }
    }
  ];
};
