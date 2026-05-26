import { SystemsCardTypes } from '../enums/systems'

export interface SystemCard {
  type: SystemsCardTypes
  title: string
  subtitle: string
  image: string
  features: string[]
}
