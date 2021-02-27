import { SpheresType } from './results-classic-compass';
import { ResultsParty } from '../../results/entities/results-party.entity';
import { Country } from '../../../shared/enums/country.enum';

export interface Party {
  _id: string;
  name: string
  logoUrl: string
  spheresValues: SpheresType
}

export const parties: Party[] = [
  {
    _id: '600afd063ab6c926c8e660eb',
    name: 'Nowoczesna',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-nowoczesna_27611eba93.png',
    spheresValues: {
      economics: 0.5,
      social: -0.7,
    },
  },
  {
    _id: '600afcb13ab6c926c8e660ea',
    name: 'Platforma Obywatelska',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-po_f9b352a7ca.png',
    spheresValues: {
      economics: -0.05,
      social: -0.1,
    },
  },
  {
    _id: '600afd373ab6c926c8e660ee',
    name: 'KORWiN',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-korwin_78b4e81ca0.png',
    spheresValues: {
      economics: 0.9,
      social: -0.3,
    },
  },
  {
    _id: '600afd4b3ab6c926c8e660ef',
    name: 'Ruch Narodowy',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-rn_7b570a2dfc.png',
    spheresValues: {
      economics: 0.1,
      social: 0.7,
    },
  },
  {
    _id: '600afd153ab6c926c8e660ec',
    name: 'Prawo i Sprawiedliwość',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-pis_7f88c3bc85.png',
    spheresValues: {
      economics: -0.15,
      social: 0.33,
    },
  },
  {
    _id: '600afd263ab6c926c8e660ed',
    name: 'Polskie Stronnictwo Ludowe',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-psl_d2aef2c821.png',
    spheresValues: {
      economics: 0.05,
      social: 0.0,
    },
  },
  {
    _id: '601fd6688afe094480691f7b',
    name: 'Kukiz\'15',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-55604974_1048277702041147_4349954907592196096_n_012f4dc2be.png',
    spheresValues: {
      economics: 0.2,
      social: -0.1,
    },
  },
  {
    _id: 'classic-ued',
    name: 'Unia Europejskich Demokratów',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-ued_86db934d96.jpg',
    spheresValues: {
      economics: 0.2,
      social: -0.5,
    },
  },
  {
    _id: 'classic-pps',
    name: 'Polska Partia Socjalistyczna',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-thumbnail_pps_b8ead453fb.png',
    spheresValues: {
      economics: -0.9,
      social: 0.0,
    },
  },
  {
    _id: '600c0ce297d5a60a445e3d4c',
    name: 'Razem',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-razem_caa6d3e383.png',
    spheresValues: {
      economics: -0.66,
      social: -0.5,
    },
  },
  {
    _id: 'classic-sld',
    name: 'Sojusz Lewicy Demokratycznej',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-sld_cae8265442.png',
    spheresValues: {
      economics: -0.5,
      social: -0.3,
    },
  },
  {
    _id: 'classic-wiosna',
    name: 'Wiosna',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-wiosna_ac61bfdc22.png',
    spheresValues: {
      economics: -0.4,
      social: -0.5,
    },
  },
  {
    _id: '600afd6c3ab6c926c8e660f1',
    name: 'Libertarianie/Możemy',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-cdnv2_libmozemy_dc915b598d.png',
    spheresValues: {
      economics: 0.8,
      social: -0.55,
    },
  },
  {
    _id: 'classic-kpp',
    name: 'Komunistyczna Partia Polski',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-thumbnail_kpp_732e3da166.png',
    spheresValues: {
      economics: -0.9,
      social: 0.6,
    },
  },
  {
    _id: 'classic-kkp',
    name: 'Konfederacja Korony Polskiej',
    logoUrl: 'https://files.mypolitics.pl/mypolitics2/cdnv2-thumbnail_kkp_7ee9c7bd74.png',
    spheresValues: {
      economics: 0.5,
      social: 0.7,
    },
  },
];

export const calcParties = (
  spheresValues: SpheresType,
): ResultsParty[] => {
  const partiesList: ResultsParty[] = parties.map((party) => {
    const economicsDifference = (party.spheresValues.economics - spheresValues.economics) ** 2;
    const socialDifference = (party.spheresValues.social - spheresValues.social) ** 2;
    const distance = Math.sqrt(economicsDifference + socialDifference);
    const value = ((2 * Math.sqrt(2) - distance) / (2 * Math.sqrt(2))) * 100;

    return {
      ...party,
      agreementPoints: 0,
      disagreementPoints: 0,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      country: Country.POLAND,
      percentAgreement: parseInt(value.toFixed(0), 10),
    };
  });

  return partiesList.sort((a, b) => b.percentAgreement - a.percentAgreement);
};
