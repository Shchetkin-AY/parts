import { FilterFieldProps } from '../interfaces'
import { CatalogFilterField } from '../enums'

export const FilterFields: FilterFieldProps[] = [
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
  },
  {
    field: CatalogFilterField.series,
    label: 'Серия',
    ariaLabel: 'Серия',
    placeholder: 'Выберите серию'
  }
]
