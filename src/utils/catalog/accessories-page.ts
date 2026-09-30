export type PadId = 'f600' | 's750' | 's800' | 'r900'

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

export type DiscSizeRow = [
  diameter: string,
  weight: string,
  ventilation: string
]

export type GalleryItem = [
  image: string,
  caption: string
]

export interface FeatureItem {
  title: string
  description: string
}

export type WeightCompareModifier = 'ccb' | 'iron'

export interface WeightCompareItem {
  label: string
  value: string
  modifier: WeightCompareModifier
}

export interface CcbMetric {
  label: string
  value: string
}

