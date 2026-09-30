import type { CcbMetric, FeatureItem, WeightCompareItem } from '@/utils'

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
