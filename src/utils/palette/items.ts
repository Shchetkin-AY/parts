import { PaletteGroupTypes } from './group-type'
import { PaletteItem } from './palette'

export const paletteGroups: Record<PaletteGroupTypes, string> = {
  base: 'Стандартные',
  custom: 'Индивидуальные',
  cerakote: 'Cerakote'
}

export const paletteGroupPrices: Record<PaletteGroupTypes, number> = {
  base: 0,
  custom: 5000,
  cerakote: 9000
}

export const paletteItemsByGroup: Record<PaletteGroupTypes, PaletteItem[]> = {
  base: [
    {
      id: 'red',
      title: 'Красный',
      preview: '/colors/base/red.webp'
    },
    {
      id: 'silver',
      title: 'Никель',
      preview: '/colors/base/silver.webp'
    },
    {
      id: 'blue',
      title: 'Синий',
      preview: '/colors/base/blue.webp'
    }
  ],
  custom: [
    {
      id: 'gray',
      title: 'Серый',
      preview: '/colors/custom/gray.webp'
    },
    {
      id: 'neochrome',
      title: 'Неохром',
      preview: '/colors/custom/neochrome.webp'
    }
  ],
  cerakote: [
    {
      id: 'lemon',
      title: 'Лимонный',
      preview: '/colors/cerakote/lemon.webp'
    },
    {
      id: 'tiffany',
      title: 'Тиффани',
      preview: '/colors/cerakote/tiffany.webp'
    },
    {
      id: 'gold',
      title: 'Золотой',
      preview: '/colors/cerakote/gold.webp'
    },
    {
      id: 'pink',
      title: 'Розовый',
      preview: '/colors/cerakote/pink.webp'
    },
    {
      id: 'green',
      title: 'Зелёный',
      preview: '/colors/cerakote/green.webp'
    },
    {
      id: 'purple',
      title: 'Фиолетовый',
      preview: '/colors/cerakote/purple.webp'
    }
  ]
}
