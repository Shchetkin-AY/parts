import { PaletteGroupTypes } from './group-type'

export interface PaletteItem {
  id: string
  title: string
  preview: string
  previews?: string[]
}

export interface PaletteSelection {
  group: PaletteGroupTypes
  item: PaletteItem
}

export interface PaletteGroup {
  title: string
  items: PaletteItem[]
}
