import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type {
  CatalogItem,
  CompatibilityItem
} from '../src/utils/types/catalog'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..')

function readEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim()

  return value ?? fallback
}

function resolveProjectPath(value: string): string {
  if (path.isAbsolute(value)) {
    return value
  }

  return path.resolve(PROJECT_ROOT, value)
}

const SHEET_ID = readEnv(
  'GOOGLE_SHEET_ID',
  '1TwtaO56Hk7SRlFU27Ahpc6aMuFcJ-gqMjriW1FMK_JE'
)

const API_KEY = readEnv(
  'GOOGLE_SHEETS_API_KEY',
  'AIzaSyDTJB_VoqtrpXBQcY-9G7keK4x33OZ3FKc'
)

const VALUE_RENDER_OPTION = 'FORMATTED_VALUE'

const GOODS_RANGE = readEnv(
  'GOOGLE_SHEET_GOODS_RANGE',
  'goods!A:V'
)

const COMPATIBILITY_RANGE = readEnv(
  'GOOGLE_SHEET_COMPATIBILITY_RANGE',
  'compatibility!A:H'
)

const CATALOG_TS_PATH = resolveProjectPath(
  readEnv(
    'GOOGLE_SHEET_TS_OUTPUT',
    'src/data/catalog.ts'
  )
)

const COMPATIBILITY_TS_PATH = resolveProjectPath(
  readEnv(
    'GOOGLE_SHEET_TS_COMPATIBILITY_OUTPUT',
    'src/data/compatibility.ts'
  )
)

const CATALOG_HEADER_MAP = {
  id: 'id',
  category: 'category',
  brand: 'brand',
  series: 'series',
  model: 'model',
  pistonCount: 'pistonCount',
  wheelDiameter: 'wheelDiameter',
  pistonArea: 'pistonArea',
  discDiameter: 'discDiameter',
  padFrictionArea: 'padFrictionArea',
  dimensions: 'dimensions',
  depth: 'depth',
  height: 'height',
  width: 'width',
  constructionType: 'constructionType',
  coating: 'coating',
  features: 'features',
  application: 'application',
  setId: 'setId',
  priceUsd: 'priceUsd',
  priceCny: 'priceCny',
  description: 'description'
} as const

type CatalogHeader =
    typeof CATALOG_HEADER_MAP[keyof typeof CATALOG_HEADER_MAP]

const COMPATIBILITY_HEADER_MAP = {
  id: 'id',
  goods_id: 'goodsId',
  brand: 'brand',
  model: 'model',
  platform: 'platform',
  year_from: 'yearFrom',
  year_to: 'yearTo',
  wheel_inch: 'wheelInch'
} as const

type CompatibilityHeader =
    typeof COMPATIBILITY_HEADER_MAP[keyof typeof COMPATIBILITY_HEADER_MAP]

const CATALOG_NUMERIC_HEADERS = new Set<CatalogHeader>([
  'id',
  'pistonCount',
  'pistonArea',
  'discDiameter',
  'setId',
  'priceUsd',
  'priceCny'
])

const COMPATIBILITY_NUMERIC_HEADERS =
  new Set<CompatibilityHeader>([
    'id',
    'goodsId'
  ])

interface SheetValuesResponse {
  values?: SheetCell[][]
  error?: {
    code?: number
    message?: string
  }
}

type SheetCell =
  | boolean
  | number
  | string

function getHeaderKeys<T extends Record<string, string>>(
  headers: string[],
  map: T
): T[keyof T][] {
  const allowed = Object.keys(map)

  const unknown = headers.filter(header => !allowed.includes(header))

  if (unknown.length > 0) {
    throw new Error(
      `Unknown headers: ${unknown.join(', ')}`
    )
  }

  const missing = allowed.filter(header => !headers.includes(header))

  if (missing.length > 0) {
    throw new Error(
      `Missing headers: ${missing.join(', ')}`
    )
  }

  return headers.map(header => map[header as keyof T])
}

function convertValue(
  key: string,
  value: SheetCell | undefined,
  numericFields: Set<string>,
  booleanFields: Set<string>,
  row: number
): unknown {
  const normalized =
    value == null
      ? ''
      : String(value).trim()

  if (!normalized) {
    if (numericFields.has(key)) {
      throw new Error(
        `Empty numeric value. Row ${row}, field "${key}"`
      )
    }

    if (booleanFields.has(key)) {
      return false
    }

    return ''
  }

  if (booleanFields.has(key)) {
    return normalized.toLowerCase() === 'true'
      || normalized === '1'
      || normalized.toLowerCase() === 'yes'
  }

  if (!numericFields.has(key)) {
    return normalized
  }

  const numberValue = Number(
    normalized
      .replace(/\s+/g, '')
      .replace(',', '.')
  )

  if (!Number.isFinite(numberValue)) {
    throw new Error(
      `Invalid number "${normalized}". Row ${row}, field "${key}"`
    )
  }

  return numberValue
}

function parseSheet<T extends object>(
  rows: SheetCell[][],
  headerMap: Record<string, string>,
  numericFields: Set<string>,
  booleanFields = new Set<string>()
): T[] {
  const [ headers, ...values ] = rows

  if (!headers) {
    throw new Error('Sheet is empty')
  }

  const keys = getHeaderKeys(
    headers.map(String),
    headerMap
  )

  return values.map((row, index) => {
    const object: Record<string, unknown> = {}

    keys.forEach((key, column) => {
      object[key] = convertValue(
        key,
        row[column],
        numericFields,
        booleanFields,
        index + 2
      )
    })

    return object as T
  })
}

async function loadSheet(range: string): Promise<SheetCell[][]> {
  const params = new URLSearchParams({
    key: API_KEY,
    valueRenderOption: VALUE_RENDER_OPTION
  })

  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?${params}`

  const response = await fetch(url)

  const data =
    await response.json() as SheetValuesResponse

  if (!response.ok) {
    throw new Error(
      data.error?.message ?? response.statusText
    )
  }

  if (!data.values) {
    throw new Error(
      `Sheet "${range}" is empty`
    )
  }

  return data.values
}

async function writeTsModule<T>(
  outputPath: string,
  variableName: string,
  typeName: string,
  importPath: string,
  data: T[]
) {
  const module = [
    '/* eslint-disable */',
    '// Auto-generated. Do not edit.',
    `import type { ${typeName} } from '${importPath}'`,
    '',
    `export const ${variableName}: ${typeName}[] = ${JSON.stringify(data, null, 2)}`,
    '',
    `export default ${variableName}`,
    ''
  ].join('\n')

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, module, 'utf8')
}

async function main() {
  const [
    goodsRows,
    compatibilityRows
  ] = await Promise.all([
    loadSheet(GOODS_RANGE),
    loadSheet(COMPATIBILITY_RANGE)
  ])

  const catalog = parseSheet<CatalogItem>(
    goodsRows,
    CATALOG_HEADER_MAP,
    CATALOG_NUMERIC_HEADERS
  )

  const compatibility = parseSheet<CompatibilityItem>(
    compatibilityRows,
    COMPATIBILITY_HEADER_MAP,
    COMPATIBILITY_NUMERIC_HEADERS
  )

  await Promise.all([
    writeTsModule(
      CATALOG_TS_PATH,
      'catalog',
      'CatalogItem',
      '@/utils/types/catalog',
      catalog
    ),

    writeTsModule(
      COMPATIBILITY_TS_PATH,
      'compatibility',
      'CompatibilityItem',
      '@/utils/types/catalog',
      compatibility
    )

  ])

  // eslint-disable-next-line
  console.log(`✅ Catalog: ${catalog.length}`)
  // eslint-disable-next-line
  console.log(`✅ Compatibility: ${compatibility.length}`)
}

// eslint-disable-next-line
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
