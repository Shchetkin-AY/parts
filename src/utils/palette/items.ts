import { PaletteGroupTypes } from './group-type'
import { PaletteItem } from './palette'

export const paletteGroups: Record<PaletteGroupTypes, string> = {
  base: 'Стандартные',
  custom: 'Индивидуальные (+50$)',
  cerakote: 'Cerakote (+70$)'
}

export const paletteItemsByGroup: Record<PaletteGroupTypes, PaletteItem[]> = {
  base: [
    {
      id: 'red',
      title: 'Оксидированный красный'
    },
    {
      id: 'silver',
      title: 'Гальваническое серебро'

    },
    {
      id: 'blue',
      title: 'Оксидированный синий'

    }
  ],
  custom: [
    {
      id: 'gray',

      title: 'Серый'
    },
    {
      id: 'iridescent',

      title: 'Иризирующий'
    }
  ],
  cerakote: [
    {
      id: 'yellow',
      title: 'Лимонно-жёлтый'
    },
    {
      id: 'tiffany',
      title: 'Тиффани'
    },
    {
      id: 'gold',
      title: 'Пустынное золото'
    },
    {
      id: 'pink',
      title: 'Розовый'
    },
    {
      id: 'green',
      title: 'Травяной зелёный'
    },
    {
      id: 'purple',
      title: 'Баклажановый'
    }
  ]

}
