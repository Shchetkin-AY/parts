import { CatalogItem } from '../interfaces/catalog'

export type CatalogFilterItem = Pick<
  CatalogItem,
  'series' | 'wheelDiameter'
>
