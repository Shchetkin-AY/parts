export type MenuItemRole = 'menuitem' | 'menuitemradio'

export type MenuItemVariant = 'danger' | 'default'

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
