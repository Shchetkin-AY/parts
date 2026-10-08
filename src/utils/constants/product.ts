import { PaletteGroupTypes } from '../enums'

export const purchaseKitItems = [
  'Суппорты: 2 шт',
  'Тормозные диски: 2 шт',
  'Колодки: комплект на ось',
  'Крепежный комплект: комплект на ось',
  'Тормозные магистрали: комплект на ось'
]

export const paletteSinglePreviewItems = new Set([
  'tiffany',
  'pink',
  'green',
  'gold',
  'purple'
])

export const paletteGroupDescriptions: Record<PaletteGroupTypes, string> = {
  [PaletteGroupTypes.base]: 'Вакуумное покрытие + анодирование, цвет в самом металле. Не выцветает и не отслаивается: цвет живёт в металле, а не на нём.',
  [PaletteGroupTypes.custom]: 'Вакуумное напыление металлов — фирменный переливающийся цвет. Не окисляется, честно передаёт цвет металла, решает проблему облезающей краски.',
  [PaletteGroupTypes.cerakote]: 'Cerackote — керамика (США). Матовая керамика с металлическими частицами — премиум-отделка. Устойчивость к химии и коррозии.'
}
