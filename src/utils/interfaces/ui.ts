import { SVGAttributes } from 'vue'
import { MenuItemRole, MenuItemVariant } from '../types'

export interface IconObject {
  name: string
  attributes: SVGAttributes
}

export interface SelectOption {
  ariaLabel?: string
  disabled?: boolean
  label: string
  value: string
}

export interface MenuPosition {
  minWidth?: number
  x: number
  y: number
}

export interface MenuItem {
  ariaLabel?: string
  disabled?: boolean
  id: string
  isActive?: boolean
  label: string
  role?: MenuItemRole
  variant?: MenuItemVariant
}
