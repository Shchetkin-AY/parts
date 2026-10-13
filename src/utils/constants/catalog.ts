import { CatalogFilterField, CatalogSortField } from '../enums'
import { CatalogFilterParams, FilterFieldProps, SelectOption } from '../interfaces'

export const catalogItemsPerPage = 12
export const catalogMobileBreakpoint = 1024
export const catalogEmptyFilterParams: CatalogFilterParams = {
  [CatalogFilterField.mark]: '',
  [CatalogFilterField.model]: '',
  [CatalogFilterField.series]: '',
  [CatalogFilterField.wheelDiameter]: ''
}

export const catalogSortOptions: SelectOption[] = [
  {
    label: 'По популярности',
    value: CatalogSortField.popularity
  },
  {
    label: 'Сначала дешевле',
    value: CatalogSortField.priceAsc
  },
  {
    label: 'Сначала дороже',
    value: CatalogSortField.priceDesc
  },
  {
    label: 'По диаметру диска',
    value: CatalogSortField.discDiameter
  }
]

export const catalogFilterFieldLabels: Record<CatalogFilterField, string> = {
  [CatalogFilterField.mark]: 'Марка',
  [CatalogFilterField.model]: 'Модель',
  [CatalogFilterField.series]: 'Серия',
  [CatalogFilterField.wheelDiameter]: 'Диаметр колёс'
}

export const homeFilterFieldsConfig: FilterFieldProps[] = [
  {
    field: CatalogFilterField.mark,
    label: 'Марка',
    ariaLabel: 'Марка автомобиля',
    placeholder: 'Выберите марку'
  },
  {
    field: CatalogFilterField.model,
    label: 'Модель',
    ariaLabel: 'Модель автомобиля',
    placeholder: 'Выберите модель'
  },
  {
    field: CatalogFilterField.wheelDiameter,
    label: 'Диаметр колёс',
    ariaLabel: 'Диаметр колёс',
    placeholder: 'Выберите диаметр колёс'
  }
]
