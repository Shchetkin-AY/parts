import fs from 'node:fs/promises'
import path from 'node:path'

const SHEET_ID = process.env.GOOGLE_SHEET_ID ?? '10XC-Ab6XCYZdWfRCblSXygXX6A3Dk9R6W85tgQBbqy0'
const API_KEY = process.env.GOOGLE_SHEETS_API_KEY ?? 'AIzaSyD7LWKP0roTMELxgJxttiLm2NQdyKL7hqo'
const RANGE = process.env.GOOGLE_SHEET_RANGE ?? 'goods!A:X'
const OUTPUT_PATH = path.resolve(process.env.GOOGLE_SHEET_OUTPUT ?? 'src/data/data.json')
const TS_OUTPUT_PATH = path.resolve(process.env.GOOGLE_SHEET_TS_OUTPUT ?? 'src/data/catalog.ts')

const RECOMMENDED_HEADERS = [
  'id',
  'category',
  'brand',
  'series',
  'model',
  'pistonCount',
  'wheelDiameterInch',
  'pistonAreaCm2',
  'discDiameterMm',
  'padFrictionArea',
  'dimensionsMm',
  'constructionType',
  'coating',
  'features',
  'application',
  'setId',
  'priceUsd',
  'priceCny',
  'compatibilityClass',
  'vehicleBrand',
  'vehicleModel',
  'factoryDiscDiameterMm',
  'dataStatus',
  'description'
] as const

type CatalogHeader = typeof RECOMMENDED_HEADERS[number]

interface SheetValuesResponse {
  values?: string[][]
  error?: {
    code?: number
    message?: string
  }
}

const HEADER_ALIASES: Record<string, CatalogHeader> = {
  id: 'id',
  category: 'category',
  категория: 'category',
  brand: 'brand',
  бренд: 'brand',
  series: 'series',
  серия: 'series',
  model: 'model',
  модель: 'model',
  pistoncount: 'pistonCount',
  pistons: 'pistonCount',
  колвопоршней: 'pistonCount',
  wheeldiameterinch: 'wheelDiameterInch',
  diameterwheel: 'wheelDiameterInch',
  диаметрколесадюйм: 'wheelDiameterInch',
  pistonareacm2: 'pistonAreaCm2',
  pistonarea: 'pistonAreaCm2',
  площадьпоршнейсм2: 'pistonAreaCm2',
  discdiametermm: 'discDiameterMm',
  diameterdisc: 'discDiameterMm',
  диаметрдискамм: 'discDiameterMm',
  padfrictionarea: 'padFrictionArea',
  frictionarea: 'padFrictionArea',
  площадьтренияколодоксм2: 'padFrictionArea',
  dimensionsmm: 'dimensionsMm',
  dimensions: 'dimensionsMm',
  габаритымм: 'dimensionsMm',
  constructiontype: 'constructionType',
  construction: 'constructionType',
  типконструкции: 'constructionType',
  coating: 'coating',
  покрытие: 'coating',
  features: 'features',
  peculiarities: 'features',
  особенности: 'features',
  application: 'application',
  применение: 'application',
  setid: 'setId',
  set: 'setId',
  priceusd: 'priceUsd',
  pricedollars: 'priceUsd',
  pricecny: 'priceCny',
  priceyuan: 'priceCny',
  цена: 'priceCny',
  compatibilityclass: 'compatibilityClass',
  compatibility: 'compatibilityClass',
  совместимостькласавто: 'compatibilityClass',
  vehiclebrand: 'vehicleBrand',
  carbrand: 'vehicleBrand',
  бренд2: 'vehicleBrand',
  vehiclemodel: 'vehicleModel',
  carmodel: 'vehicleModel',
  моделиавто: 'vehicleModel',
  factorydiscdiametermm: 'factoryDiscDiameterMm',
  factorydiscsize: 'factoryDiscDiameterMm',
  заводскойразмердискамм: 'factoryDiscDiameterMm',
  datastatus: 'dataStatus',
  статусданных: 'dataStatus',
  description: 'description'
}

function normalizeHeaderKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, '')
}

function resolveHeader(header: string): CatalogHeader {
  const alias = HEADER_ALIASES[normalizeHeaderKey(header)]

  if (!alias) {
    throw new Error(
      `Unknown sheet header "${header}". Recommended headers: ${RECOMMENDED_HEADERS.join(', ')}`
    )
  }

  return alias
}

function convertValue(value: string): number | string {
  const normalized = value.trim()

  if (!normalized) {
    return ''
  }

  const compact = normalized.replace(/\s+/g, '')

  if (/^-?\d+,\d+$/.test(compact)) {
    return Number(compact.replace(',', '.'))
  }

  if (/^-?\d+(\.\d+)?$/.test(compact)) {
    return Number(compact)
  }

  return normalized
}

function toJson(rows: string[][]) {
  const [ headers, ...data ] = rows

  if (!headers?.length) {
    throw new Error('Sheet header row is empty')
  }

  const keys = headers.map(resolveHeader)
  const duplicatedKeys = keys.filter((key, index) => keys.indexOf(key) !== index)

  if (duplicatedKeys.length > 0) {
    throw new Error(`Duplicate resolved headers: ${[ ...new Set(duplicatedKeys) ].join(', ')}`)
  }

  return data
    .filter(row => row.some(cell => cell?.trim()))
    .map(row => {
      const obj: Record<string, number | string> = {}

      keys.forEach((key, index) => {
        obj[key] = convertValue(row[index] ?? '')
      })

      return obj
    })
}

async function main() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`

  const res = await fetch(url)
  const data = await res.json() as SheetValuesResponse

  if (!res.ok) {
    const message = data.error?.message ?? res.statusText

    throw new Error(`Google Sheets request failed: ${res.status} ${message}`)
  }

  if (!data.values) {
    throw new Error('No data received from Google Sheets')
  }

  const json = toJson(data.values)
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(json, null, 2), 'utf-8')

  const tsModule = '// Auto-generated by scripts/sync-catalog.ts — do not edit.\n' +
    `export const catalog = ${JSON.stringify(json, null, 2)} as const;\n` +
    'export type CatalogItem = (typeof catalog)[number];\n' +
    'export default catalog;\n'

  await fs.writeFile(TS_OUTPUT_PATH, tsModule, 'utf-8')

  // eslint-disable-next-line
  console.log('✅ Catalog JSON updated:', OUTPUT_PATH)
  // eslint-disable-next-line
  console.log('✅ Catalog TS module updated:', TS_OUTPUT_PATH)
}

// eslint-disable-next-line
main().catch(error => {
  console.error('❌ Failed to sync Google Sheets catalog')
  console.error(error)
  process.exitCode = 1
})
