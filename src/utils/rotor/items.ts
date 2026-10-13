import { RotorCenterTypes } from '../enums'
import { RotorCenterItem } from '../interfaces'

export const rotorCenterPrices: Record<RotorCenterTypes, number> = {
  [RotorCenterTypes.champagne]: 0,
  [RotorCenterTypes.neochrome]: 4000
}

export const rotorCenterItems: RotorCenterItem[] = [
  {
    id: RotorCenterTypes.champagne,
    title: 'Шампань',
    description: 'Твёрдое анодирование алюминия',
    price: rotorCenterPrices.champagne,
    previews: [ '/images/rotor/champagne/0.webp' ]
  },
  {
    id: RotorCenterTypes.neochrome,
    title: 'Неохром',
    description: 'CVD – вакуумное напыление, переливающийся цвет',
    price: rotorCenterPrices.neochrome,
    previews: [ '/images/rotor/neochrome/0.webp' ]
  }
]
