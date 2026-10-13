import { CatalogFilterField } from '../enums'
import { CatalogFilterItem } from '../types'

export interface CatalogFilterParams {
  [CatalogFilterField.mark]?: string
  [CatalogFilterField.model]?: string
  [CatalogFilterField.series]?: string
  [CatalogFilterField.wheelDiameter]?: string
}

export interface CatalogFilterSubmitPayload<Item = CatalogFilterItem> {
  items: Item[]
  params: CatalogFilterParams
}

export interface FilterFieldProps {
  field: CatalogFilterField
  label: string
  ariaLabel: string
  placeholder: string
}
