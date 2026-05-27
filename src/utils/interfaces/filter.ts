import { CatalogFilterField } from '../enums'

export interface CatalogFilterItem {
  discDiameterMm: number | string
  vehicleBrand: number | string
  vehicleModel: number | string,
  wheelDiameterInch: number | string
}

export interface CatalogFilterParams {
  [CatalogFilterField.diameter]?: string
  [CatalogFilterField.mark]?: string
  [CatalogFilterField.model]?: string,
  [CatalogFilterField.wheelDiameter]?: string
}

export interface CatalogFilterSubmitPayload<Item = CatalogFilterItem> {
  items: Item[]
  params: CatalogFilterParams
}
