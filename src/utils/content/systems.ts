import { SystemsSeriesTypes } from './system-type'
import { SystemCardItem } from './system'

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
