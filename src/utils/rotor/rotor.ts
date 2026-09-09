import { RotorCenterTypes } from './center-type'

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
