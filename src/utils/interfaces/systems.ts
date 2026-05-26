import { SystemsSeriesTypes } from '../enums/systems'

export interface SystemCard {
  type: SystemsSeriesTypes
  title: string
  subtitle: string
  image: string
  features: string[]
}
