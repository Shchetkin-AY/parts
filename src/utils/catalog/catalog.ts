import { CatalogCategory } from './categories'

export interface CatalogItem {
  id: number
  category: CatalogCategory
  brand: string
  series: string
  model: string
  pistonCount: number
  wheelDiameter: string
  pistonArea: number
  discDiameter: number
  padFrictionArea: string
  dimensions: string
  depth: string
  height: string
  width: string
  constructionType: string
  coating: string
  features: string
  application: string
  setId: number
  priceUsd: number
  priceCny: number
  description: string
}

export interface CompatibilityItem {
  id: number
  goodsId: number
  brand: string
  model: string
  platform: string
  yearFrom: string
  yearTo: string
  wheelInch: string
}
