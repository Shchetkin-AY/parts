import 'dotenv/config'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { CatalogCategories } from '../src/utils'
import type { CatalogItem, CompatibilityItem } from '../src/utils'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, '..')

function readEnv(name: string, fallback: string): string {
  return process.env[name]?.trim() ?? fallback
}

function resolveProjectPath(value: string): string {
  return path.isAbsolute(value) ? value : path.resolve(PROJECT_ROOT, value)
}

const SHEET_ID = readEnv(
  'GOOGLE_SHEET_ID',
  '1TwtaO56Hk7SRlFU27Ahpc6aMuFcJ-gqMjriW1FMK_JE'
)
const API_KEY = readEnv('GOOGLE_SHEETS_API_KEY', '')
const VALUE_RENDER_OPTION = 'FORMATTED_VALUE'

const GOODS_RANGE = readEnv('GOOGLE_SHEET_GOODS_RANGE', 'goods!A:V')
const COMPATIBILITY_RANGE = readEnv(
  'GOOGLE_SHEET_COMPATIBILITY_RANGE',
  'compatibility!A:H'
)

const CATALOG_TS_PATH = resolveProjectPath(
  readEnv('GOOGLE_SHEET_TS_OUTPUT', 'src/data/catalog.ts')
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

type CatalogHeader = (typeof CATALOG_HEADER_MAP)[keyof typeof CATALOG_HEADER_MAP]

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
  (typeof COMPATIBILITY_HEADER_MAP)[keyof typeof COMPATIBILITY_HEADER_MAP]

const CATALOG_NUMERIC_HEADERS = new Set<CatalogHeader>([
  'id',
  'pistonCount',
  'pistonArea',
  'discDiameter',
  'setId',
  'priceUsd',
  'priceCny'
])

const CATALOG_CATEGORY_VALUES: Record<string, CatalogCategories> = {
  [CatalogCategories.kit]: CatalogCategories.kit,
  [CatalogCategories.pads]: CatalogCategories.pads,
  [CatalogCategories.discs]: CatalogCategories.discs,
  [CatalogCategories.ccb]: CatalogCategories.ccb,
  [CatalogCategories.lines]: CatalogCategories.lines,
  Комплект: CatalogCategories.kit,
  Колодки: CatalogCategories.pads,
  'Тормозные диски': CatalogCategories.discs,
  'Карбон-керамика': CatalogCategories.ccb,
  'Тормозные магистрали': CatalogCategories.lines
}

const COMPATIBILITY_NUMERIC_HEADERS = new Set<CompatibilityHeader>([
  'id',
  'goodsId',
  'yearFrom',
  'yearTo',
  'wheelInch'
])

interface SheetValuesResponse {
  values?: SheetCell[][]
  error?: { code?: number;
    message?: string }
}

type SheetCell = boolean | number | string

function getHeaderKeys<T extends Record<string, string>>(
  headers: string[],
  map: T
): T[keyof T][] {
  const allowed = Object.keys(map)
  const unknown = headers.filter(h => !allowed.includes(h))
  if (unknown.length) {
    throw new Error(`Unknown headers: ${unknown.join(', ')}`)
  }

  const missing = allowed.filter(h => !headers.includes(h))
  if (missing.length) {
    throw new Error(`Missing headers: ${missing.join(', ')}`)
  }

  return headers.map(h => map[h as keyof T])
}

function convertValue(
  key: string,
  value: SheetCell | undefined,
  numericFields: Set<string>,
  booleanFields: Set<string>,
  row: number
): unknown {
  const normalized = value == null ? '' : String(value).trim()

  if (!normalized) {
    if (numericFields.has(key)) {
      // Эти поля могут быть пустыми → null
      if (
        key === 'yearFrom' ||
        key === 'yearTo' ||
        key === 'wheelInch' ||
        key === 'goodsId' || // ← добавить
        key === 'id' // ← на всякий случай
      ) {
        return null
      }
      throw new Error(`Empty numeric value. Row ${row}, field "${key}"`)
    }
    if (booleanFields.has(key)) {
      return false
    }

    return ''
  }

  if (booleanFields.has(key)) {
    return (
      normalized.toLowerCase() === 'true' ||
      normalized === '1' ||
      normalized.toLowerCase() === 'yes'
    )
  }

  if (key === 'category') {
    const category = CATALOG_CATEGORY_VALUES[normalized]

    if (!category) {
      throw new Error(`Invalid category "${normalized}". Row ${row}`)
    }

    return category
  }

  if (!numericFields.has(key)) {
    return normalized
  }

  const numberValue = Number(
    normalized.replace(/\s+/g, '').replace(',', '.')
  )
  if (!Number.isFinite(numberValue)) {
    throw new Error(`Invalid number "${normalized}". Row ${row}, field "${key}"`)
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

  const keys = getHeaderKeys(headers.map(String), headerMap)

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

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?${params}`

  const response = await fetch(url)
  const data = (await response.json()) as SheetValuesResponse

  if (!response.ok) {
    throw new Error(data.error?.message ?? response.statusText)
  }
  if (!data.values) {
    throw new Error(`Sheet "${range}" is empty`)
  }

  return data.values
}

async function writeTsModule(
  outputPath: string,
  variableName: string,
  typeExpression: string,
  importPath: string,
  data: unknown
) {
  const module = [
    '/* eslint-disable */',
    '// Auto-generated. Do not edit.',
    `import type { ${typeExpression.includes('CatalogItem') ? 'CatalogItem' : 'CompatibilityItem'} } from '${importPath}'`,
    '',
    `export const ${variableName}: ${typeExpression} = ${JSON.stringify(data)}`,
    '',
    `export default ${variableName}`,
    ''
  ].join('\n')

  await fs.mkdir(path.dirname(outputPath), { recursive: true })
  await fs.writeFile(outputPath, module, 'utf8')
}

/** Группировка + очистка */
function normalizeCompatibility(items: CompatibilityItem[]) {
  const result: Record<
    number,
    {
      brand: string
      model: string
      platform?: string
      yearFrom: number | null
      yearTo: number | null
      wheelInch: number | null
    }[]
  > = {}

  const seen = new Set<string>()

  for (const item of items) {
    const goodsId = item.goodsId
    if (!goodsId) {
      continue
    }

    const brand = String(item.brand ?? '').trim()
    const modelRaw = String(item.model ?? '').trim()

    // пропускаем полностью пустые модели
    if (!brand || !modelRaw) {
      continue
    }

    // разбиваем модели через запятую
    const models = modelRaw
      .split(',')
      .map(m => m.trim())
      .filter(Boolean)

    for (const model of models) {
      const yearFrom = item.yearFrom == null ? null : Number(item.yearFrom)
      const yearTo = item.yearTo == null ? null : Number(item.yearTo)
      const wheelInch = item.wheelInch == null ? null : Number(item.wheelInch)
      const platform = String(item.platform ?? '').trim() || undefined

      // ключ для дедупликации
      const dedupeKey = [
        goodsId,
        brand,
        model,
        yearFrom,
        yearTo,
        wheelInch,
        platform ?? ''
      ].join('|')

      if (seen.has(dedupeKey)) {
        continue
      }
      seen.add(dedupeKey)

      if (!result[goodsId]) {
        result[goodsId] = []
      }

      const entry: (typeof result)[number][number] = {
        brand,
        model,
        yearFrom: Number.isFinite(yearFrom) ? yearFrom : null,
        yearTo: Number.isFinite(yearTo) ? yearTo : null,
        wheelInch: Number.isFinite(wheelInch) ? wheelInch : null
      }

      if (platform) {
        entry.platform = platform
      }

      result[goodsId].push(entry)
    }
  }

  return result
}

async function main() {
  const [ goodsRows, compatibilityRows ] = await Promise.all([
    loadSheet(GOODS_RANGE),
    loadSheet(COMPATIBILITY_RANGE)
  ])

  const catalog = parseSheet<CatalogItem>(
    goodsRows,
    CATALOG_HEADER_MAP,
    CATALOG_NUMERIC_HEADERS
  )

  const compatibilityRaw = parseSheet<CompatibilityItem>(
    compatibilityRows,
    COMPATIBILITY_HEADER_MAP,
    COMPATIBILITY_NUMERIC_HEADERS
  )

  const compatibility = normalizeCompatibility(compatibilityRaw)

  await Promise.all([
    writeTsModule(
      CATALOG_TS_PATH,
      'catalog',
      'CatalogItem[]',
      '@/utils/catalog/catalog',
      catalog
    ),
    writeTsModule(
      COMPATIBILITY_TS_PATH,
      'compatibility',
      'Record<number, Array<{ brand: string; model: string; platform?: string; yearFrom: number | null; yearTo: number | null; wheelInch: number | null }>>',
      '@/utils/catalog/catalog',
      compatibility
    )
  ])
  // eslint-disable-next-line
  console.log(`✅ Catalog: ${catalog.length}`)
  // eslint-disable-next-line
  console.log(
    `✅ Compatibility: ${compatibilityRaw.length} raw → ${Object.keys(compatibility).length} goods`
  )
}
// eslint-disable-next-line
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
