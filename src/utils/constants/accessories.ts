import {
  CcbMetric,
  FeatureItem,
  PadComposition,
  PageSubnavItem,
  WeightCompareItem
} from '../interfaces'
import { DiscSizeRow, GalleryItem } from '../types'

export const ccbMetrics: CcbMetric[] = [
  {
    label: 'рабочая температура',
    value: '> 1300 °C'
  },
  {
    label: 'км ресурса кольца',
    value: '> 400 000'
  },
  {
    label: 'прочность к стали',
    value: '× 7–9'
  },
  {
    label: 'твёрдость покрытия SiC',
    value: '800 HB'
  }
]

export const weightCompare: WeightCompareItem[] = [
  {
    label: 'Высокоуглеродистый чугун',
    value: '7 770–9 290 г',
    modifier: 'iron'
  },
  {
    label: 'Карбон-керамика CCB',
    value: '3 885–4 645 г',
    modifier: 'ccb'
  }
]

export const weightCompareNote = 'Кольца диаметром 380 мм, масса за штуку. Соотношение сохраняется во всех типоразмерах.'

export const ccbFeatures: FeatureItem[] = [
  {
    title: 'Короткое волокно T400 · Racing',
    description: 'Серийная и стабильная технология с меньшей неподрессоренной массой.'
  },
  {
    title: 'Длинное волокно T700 · Sport',
    description: 'Стабильный коэффициент трения во всём диапазоне температур для трека.'
  }
]

export const discFeatures: FeatureItem[] = [
  {
    title: 'Уличное исполнение · высокоуглеродистый чугун',
    description: 'Легирование марганцем и закалка с отпуском повышают вязкость: кольцо не растрескивается и не коробится при экстренных торможениях.'
  },
  {
    title: 'Трековое исполнение · чугун с молибденом',
    description: 'Добавка молибдена поднимает прочность: кольцо держит непрерывное торможение до 1000 °C и многократные циклы нагрева.'
  }
]

export const discGallery: GalleryItem[] = [
  [ '/images/accessories/disc-ring-34.webp', 'Кольцо трекового исполнения' ],
  [ '/images/accessories/disc-macro-edge.webp', 'Слоты и каналы охлаждения' ],
  [ '/images/accessories/disc-ring-front.webp', 'Посадка под плавающие втулки' ]
]

export const discSizes: DiscSizeRow[] = [
  [ '282 × 23', '3 810 г', '60 каналов охлаждения · 6 слотов' ],
  [ '300 × 23', '3 810 г', '60 каналов охлаждения · 6 слотов' ],
  [ '332 × 26/32', '6 180–7 160 г', '72 канала охлаждения · 6 слотов' ],
  [ '355 × 26/32', '7 740–8 710 г', '72 канала охлаждения · 6 слотов' ],
  [ '380 × 26/34', '7 770–9 290 г', '84 канала охлаждения · 6 слотов' ],
  [ '400 × 34', '10 180 г', '84 канала охлаждения · 6 слотов' ]
]

export const discSizesNote = 'Задние увеличенные диски под штатный суппорт: 332 × 10 и 355 × 12 мм'

export const linesFeatures: FeatureItem[] = [
  {
    title: 'Точная педаль',
    description: 'Шланг не раздувается под давлением: ход педали короче, усилие передаётся линейно.'
  },
  {
    title: 'Стабильность при нагреве',
    description: 'Тефлон и стальная оплётка держат геометрию при рабочих температурах тормозной жидкости.'
  },
  {
    title: 'Прямая установка',
    description: 'Комплекты под конкретную модель: штатные точки крепления, без резки и переделки магистралей.'
  }
]

export const pads: PadComposition[] = [
  {
    id: 'f600',
    title: 'F600',
    subtitle: 'Керамика-карбон · штатный состав',
    description: 'Работает с холодного старта, тихий, с малым пылением. Безмедная рецептура, щадит диск.',
    temperature: '0–650 °C · μ ≈0,5',
    range: [ 0, 650 ],
    usage: 'Город · спортивная езда',
    image: '/images/accessories/pads-f600.webp'
  },
  {
    id: 's750',
    title: 'S750',
    subtitle: 'Полуметалл · улица и трек-дни',
    description: 'Запас по температуре для тяжёлых автомобилей и серпантинов, где F600 работает на пределе.',
    temperature: '0–800 °C · μ ≈0,5',
    range: [ 0, 800 ],
    usage: 'Агрессивная езда · тяжёлые SUV',
    image: '/images/accessories/pads-s750.webp'
  },
  {
    id: 's800',
    title: 'S800',
    subtitle: 'Состав для карбон-керамических дисков',
    description: 'Формула под карбид-кремниевую поверхность: стабильное трение без повышенного износа кольца.',
    temperature: '0–850 °C · μ ≈0,5',
    range: [ 0, 850 ],
    usage: 'Только с дисками CCB',
    image: '/images/accessories/pads-s800.webp'
  },
  {
    id: 'r900',
    title: 'R900',
    subtitle: 'Карбон-металл · чистый трек',
    description: 'Гоночный состав уровня GT. Выходит на режим от 100 °C и для дорог общего пользования не предназначен.',
    temperature: '100–900 °C · μ ≈0,65',
    range: [ 100, 900 ],
    usage: 'Трек-дни · круговые и эндуранс-гонки',
    image: '/images/accessories/pads-r900.webp'
  }
]

export const axisLabels = [ '0', '200', '400', '600', '800', '1000 °C' ]

export const subnavItems: PageSubnavItem[] = [
  {
    id: 'discs',
    label: 'Диски'
  },
  {
    id: 'ccb',
    label: 'Карбон-керамика'
  },
  {
    id: 'pads',
    label: 'Колодки'
  },
  {
    id: 'lines',
    label: 'Магистрали'
  }
]
