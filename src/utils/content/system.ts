import { SystemsSeriesTypes } from './system-type'

export interface SystemCardItem {
  type: SystemsSeriesTypes
  title: string
  subtitle: string
  image: string
  features: string[]
}
