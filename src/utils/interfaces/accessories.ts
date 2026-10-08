import { PadId, WeightCompareModifier } from '../types'

export interface AccessoryItem {
  id: number
  title: string
  description: string
  priceUsd?: number
  image: string
}

export interface PadComposition {
  id: PadId
  title: string
  subtitle: string
  description: string
  temperature: string
  range: [number, number]
  usage: string
  image: string
}

export interface FeatureItem {
  title: string
  description: string
}

export interface WeightCompareItem {
  label: string
  value: string
  modifier: WeightCompareModifier
}

export interface CcbMetric {
  label: string
  value: string
}
