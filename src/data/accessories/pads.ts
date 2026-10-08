import { PadComposition } from '@/utils'

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
