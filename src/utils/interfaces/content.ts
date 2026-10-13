import { Icons } from '../enums'

export interface BenefitItem {
  icon: Icons
  title: string
  text: string
}

export interface ProductionRouteStep {
  step: string
  icon: string
  title: string
  text: string
}

export interface AboutHistoryItem {
  accent?: boolean
  text: string
  title: string
}

export interface AboutMediaCard {
  image: string
  text: string
}

export interface AboutMaterialSpec {
  label: string
  value: string
}

export interface AboutPrecisionFeature {
  text: string
}

export interface AboutStatCard {
  icon: string
  label: string
  value: string
}
