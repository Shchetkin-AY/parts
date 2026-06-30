import { CatalogFilterField } from '../enums'
import type { CatalogItem } from '../types'

export type CatalogFilterItem = Pick<
  CatalogItem,
  'discDiameterMm' | 'series' | 'vehicleBrand' | 'vehicleModel' | 'wheelDiameterInch'
>

export interface CatalogFilterParams {
  [CatalogFilterField.diameter]?: string
  [CatalogFilterField.mark]?: string
  [CatalogFilterField.model]?: string
  [CatalogFilterField.series]?: string
  [CatalogFilterField.wheelDiameter]?: string
}

export interface CatalogFilterSubmitPayload<Item = CatalogFilterItem> {
  items: Item[]
  params: CatalogFilterParams
}
