import { CatalogFilterParams } from '../interfaces'

export const buildCatalogFilterQuery = (params: CatalogFilterParams): Record<string, string> => {
  return Object.entries(params).reduce<Record<string, string>>((result, [ field, value ]) => {
    if (value) {
      result[field] = value
    }

    return result
  }, {})
}
