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
