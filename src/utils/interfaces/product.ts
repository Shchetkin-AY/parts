import { Icons, PaletteGroupTypes, RotorCenterTypes, SystemsSeriesTypes } from '../enums'

export interface Stat {
  label: string
  value: string
  icon: Icons
}

export interface SpecItem {
  label: string
  value: string
  unit?: string
}

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

export interface RotorCenterItem {
  id: RotorCenterTypes
  title: string
  description: string
  price: number
  previews?: string[]
}

export interface RotorCenterSelection {
  item: RotorCenterItem
}

export interface SystemCardItem {
  type: SystemsSeriesTypes
  title: string
  subtitle: string
  image: string
  features: string[]
}
