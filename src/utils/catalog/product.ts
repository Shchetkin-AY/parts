import { Icons } from '../ui'

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
