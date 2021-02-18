import { ClassicAxes } from '../entities/results-classic.entity';

export const calcAxes = (axes: ClassicAxes) => [
  {
    '__typename': 'ResultsAxis',
    'maxPoints': 100,
    'left': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Socjalizm',
        'en': null
      },
      'description': {
        'pl': 'Ideologia głosząca dążenie do zniesienia prywatnej własności środków produkcji oraz podziałów klasowych.',
        'en': null
      },
      'icon': {
        'type': 'url',
        'value': 'https://files.mypolitics.pl/mypolitics2/cdnv2-ion_rose.svg'
      },
      'color': '#E74C3C',
      'points': axes.communism,
    },
    'right': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Kapitalizm',
        'en': null
      },
      'description': {
        'pl': 'System społeczno-gospodarczy opierający się na własności prywatnej, konkurencji i gospodarce rynkowej.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-dollar-sign'
      },
      'color': '#2ecc71',
      'points': axes.capitalism
    }
  },
  {
    '__typename': 'ResultsAxis',
    'maxPoints': 100,
    'left': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Regulacjonizm',
        'en': null
      },
      'description': {
        'pl': 'Idea według której państwo powinno odziaływać na gospodarkę metodami ekonomicznymi i administracyjnymi.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-balance-scale'
      },
      'color': '#CD3944',
      'points': axes.interventionism,
    },
    'right': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Leseferyzm',
        'en': null
      },
      'description': {
        'pl': 'Koncepcja afirmująca rynkowy ład ekonomiczny, przyznająca państwu jedynie obowiązek czuwania nad przestrzeganiem reguł gry rynkowej, postulująca pełną swobodę działania podmiotom gospodarczym.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-dove'
      },
      'color': '#8E44AD',
      'points': axes.laissezfaire,
    }
  },
  {
    '__typename': 'ResultsAxis',
    'maxPoints': 100,
    'left': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Anarchizm',
        'en': null
      },
      'description': {
        'pl': 'Ideologia i ruch społeczny głoszące zbędność państwa i wszelkich jego organów, uznające wolność jednostki za wartość nadrzędną, postulujące oparcie życia społecznego na związkach wolnych gmin.',
        'en': null
      },
      'icon': {
        'type': 'url',
        'value': 'https://files.mypolitics.pl/mypolitics2/cdnv2-anarchy.svg'
      },
      'color': '#34495E',
      'points': axes.anarchism,
    },
    'right': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Autorytaryzm',
        'en': null
      },
      'description': {
        'pl': 'Ustrój polityczny, w którym władza jest skupiona w rękach przywódcy i jego najbliższego środowiska. Decyzje podejmowane przez przywódcę autorytarnego zatwierdzane są przez podporządkowany mu parlament.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-gavel'
      },
      'color': '#3498DB',
      'points': axes.authoritarianism,
    }
  },
  {
    '__typename': 'ResultsAxis',
    'maxPoints': 100,
    'left': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Pacyfizm',
        'en': null
      },
      'description': {
        'pl': 'Ruch społeczny i polityczny, którego głównym celem jest propagowanie pokoju i potępianie wszelkich działań wojennych.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-hand-peace'
      },
      'color': '#6C7A89',
      'points': axes.pacifism,
    },
    'right': {
      'name': {
        'pl': 'Militaryzm',
        'en': null
      },
      'description': {
        'pl': 'Ideologia podporządkowująca życie kraju przygotowaniom wojennym i uznająca prymat władzy wojskowej.',
        'en': null
      },
      'icon': {
        'type': 'url',
        'value': 'https://files.mypolitics.pl/mypolitics2/cdnv2-pistol.svg'
      },
      'color': '#C3272B',
      'points': axes.militarism,
    }
  },
  {
    '__typename': 'ResultsAxis',
    'maxPoints': 100,
    'left': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Ekologizm',
        'en': null
      },
      'description': {
        'pl': 'Ideologia głosząca prymat działań na rzecz ochrony środowiska naturalnego i podkreślająca związki człowieka z przyrodą.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-leaf'
      },
      'color': '#006442',
      'points': axes.environmentalism,
    },
    'right': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Industrializm',
        'en': null
      },
      'description': {
        'pl': 'System społeczno-gospodarczy oparty na rozwoju wielkich gałęzi przemysłu, szczególnie tanich towarów przemysłowych i zmechanizowanej produkcji żywności skoncentrowanej w obszarach miejskich.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-industry'
      },
      'color': '#FFA631',
      'points': axes.anthropocentrism,
    }
  },
  {
    '__typename': 'ResultsAxis',
    'maxPoints': 100,
    'left': {
      '__typename': 'ResultsIdeology',
      'name': {
        'pl': 'Progresywizm',
        'en': null
      },
      'description': {
        'pl': 'Wiara w postęp, przekonanie o dążeniu świata i ludzi do postępu.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-chart-line'
      },
      'color': '#9B59B6',
      'points': axes.progressivism,
    },
    'right': {
      'name': {
        'pl': 'Tradycjonalizm',
        'en': null
      },
      'description': {
        'pl': 'Ideologia wynikająca z przywiązania i szacunku do tradycji trakowanej jako najwyższa wartość.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-hourglass'
      },
      'color': '#1ABC9C',
      'points': axes.traditionalism,
    }
  },
  {
    '__typename': 'ResultsAxis',
    'maxPoints': 100,
    'left': {
      'name': {
        'pl': 'Kosmopolityzm',
        'en': null
      },
      'description': {
        'pl': 'Pogląd negujący wszelkie podziały kulturowo-polityczne i terytorialne, więzi narodowe i tradycję, za prawdziwą ojczyznę człowieka uznający cały świat.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-globe'
      },
      'color': '#4D8FAC',
      'points': axes.cosmopolitanism,
    },
    'right': {
      'name': {
        'pl': 'Nacjonalizm',
        'en': null
      },
      'description': {
        'pl': 'Ruch polityczny podporządkowujący interesy innych narodów we własnym celu.',
        'en': null
      },
      'icon': {
        'type': 'font-awesome',
        'value': 'fa-flag'
      },
      'color': '#F99E35',
      'points': axes.nationalism,
    }
  }
];
