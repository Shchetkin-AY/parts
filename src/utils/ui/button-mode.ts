import { Primitive } from '@/ui/shared-props'
import { Icons } from './icon'
import { Color } from './color'

export enum ButtonMode {
  outline = 'outline',
  flat = 'flat'
}

export interface GroupButtonItem {
  value: Primitive
  label?: Primitive
  icon?: Icons
  color?: Color
  disabled?: boolean
}
