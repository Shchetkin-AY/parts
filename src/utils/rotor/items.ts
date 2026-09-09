import { RotorCenterTypes } from './center-type'
import { RotorCenterItem } from './rotor'

export const rotorCenterItems: RotorCenterItem[] = [
  {
    id: RotorCenterTypes.champagne,
    title: 'Шампань',
    description: 'Твёрдое анодирование алюминия',
    price: 4000,
    previews: [ '/images/rotor/champagne/0.webp' ]
  },
  {
    id: RotorCenterTypes.neochrome,
    title: 'Неохром',
    description: 'CVD – вакуумное напыление, переливающийся цвет',
    price: 4000,
    previews: [ '/images/rotor/neochrome/0.webp' ]
  }
]
