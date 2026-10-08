import { SystemsSeriesTypes } from '../enums'
import { SystemCardItem } from '../interfaces'

export const systemCardItems: SystemCardItem[] = [
  {
    type: SystemsSeriesTypes.s,
    title: 'S-series',
    subtitle: 'Ежедневная езда',
    image: '/images/categories/street.webp',
    features: [
      'Комфорт и надёжность',
      'Оптимальны для города',
      'Низкий уровень шума'
    ]
  },
  {
    type: SystemsSeriesTypes.r,
    title: 'R-series',
    subtitle: 'Активная езда',
    image: '/images/categories/sport.webp',
    features: [
      'Высокая эффективность',
      'Устойчивость к перегреву',
      'Точный контроль'
    ]
  },
  {
    type: SystemsSeriesTypes.n,
    title: 'N-series',
    subtitle: 'Трек и автоспорт',
    image: '/images/categories/track.webp',
    features: [
      'Максимальная мощность',
      'Работа при экстремальных нагрузках',
      'Для трека и соревнований'
    ]
  }
]

export const catalogSeriesByType: Record<SystemsSeriesTypes, string> = {
  [SystemsSeriesTypes.s]: 'S-Series',
  [SystemsSeriesTypes.r]: 'R-Series',
  [SystemsSeriesTypes.n]: 'N-Series',
  [SystemsSeriesTypes.sr]: 'SR-Series'
}
