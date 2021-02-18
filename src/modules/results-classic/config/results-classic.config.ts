import { ClassicResults } from '../entities/results-classic.entity';
import { calcAxes } from './results-classic-axes';
import { calcCompasses, SpheresType } from './results-classic-compass';
import { calcParties } from './results-classic-parties';
import { ResultsCompass } from '../../results/entities/results-compass.entity';

export const transformClassicResults = (results: ClassicResults) => {
  const { _id, additionDate } = results;
  const axes = calcAxes(results.axes);
  const compasses: ResultsCompass[] = calcCompasses(results);
  const sphereType: SpheresType = {
    social: compasses[0].point.vertical,
    economics: compasses[0].point.horizontal,
  };
  const parties = calcParties(sphereType);

  return {
    _id,
    createdAt: additionDate,
    updatedAt: additionDate,
    axes,
    compasses,
    parties,
    traits: [],
  };
};
