export interface ParsedPurchase {
  product: string
  quantity: number
  quantityUnit: string
  pricePerUnit: number
  totalPrice: number
  supplier?: string
  supplierType: 'wholesaler' | 'middleman' | 'unknown'
  confidence: number
}

const PRODUCTS: Record<string, string[]> = {
  rice: ['rice', 'ofada', 'long grain', 'parboiled rice', 'basmati'],
  beans: ['beans', 'black-eyed peas', 'oloyin', 'honey beans'],
  tomatoes: ['tomato', 'tomatoes', 'tomatoe'],
  garri: ['garri', 'gari', 'cassava flakes'],
  flour: ['flour', 'wheat flour'],
  sugar: ['sugar', 'granulated sugar'],
  salt: ['salt', 'iodized salt'],
  oil: ['oil', 'palm oil', 'groundnut oil', 'vegetable oil', 'cooking oil'],
  yam: ['yam', 'puna yam'],
  corn: ['corn', 'maize', 'sweet corn'],
  pepper: ['pepper', 'scotch bonnet', 'tatashe', 'rodo'],
  onion: ['onion', 'onions', 'red onion'],
  bread: ['bread', 'loaf', 'agege bread'],
  egg: ['egg', 'eggs', 'crate of eggs'],
  chicken: ['chicken', 'broiler', 'frozen chicken'],
  fish: ['fish', 'catfish', 'stockfish', 'crayfish', 'tilapia', 'titus'],
  noodles: ['noodles', 'indomie', 'pasta'],
  detergent: ['detergent', 'omo', 'ariel', 'soap'],
  milk: ['milk', 'peak milk', 'powdered milk'],
  beverages: ['milo', 'ovaltine', 'beverages', 'bournvita'],
}

const UNITS: Record<string, string> = {
  bag: 'bag', bags: 'bag', sack: 'bag', sacks: 'bag',
  kg: 'kg', kilogram: 'kg', kilograms: 'kg',
  g: 'g', gram: 'g', grams: 'g',
  litre: 'litre', litres: 'litre', liter: 'litre', liters: 'litre', l: 'litre',
  piece: 'piece', pieces: 'piece', pcs: 'piece', unit: 'piece', units: 'piece',
  crate: 'crate', crates: 'crate',
  carton: 'carton', cartons: 'carton',
  dozen: 'dozen', dozens: 'dozen',
  tin: 'tin', tins: 'tin', can: 'tin', cans: 'tin',
  pack: 'pack', packs: 'pack', packet: 'pack', packets: 'pack',
  bundle: 'bundle', bundles: 'bundle',
  tuber: 'tuber', tubers: 'tuber',
  tray: 'tray', trays: 'tray',
  box: 'box', boxes: 'box',
  truck: 'truck', lorry: 'truck',
}

function normalizePrice(priceStr: string): number {
  const cleaned = priceStr.replace(/[₦,\s]/g, '')
  if (cleaned.toLowerCase().endsWith('k')) {
    return parseFloat(cleaned.slice(0, -1)) * 1000
  }
  return parseFloat(cleaned) || 0
}

function detectProduct(text: string): string {
  const lower = text.toLowerCase()
  for (const [canonical, synonyms] of Object.entries(PRODUCTS)) {
    for (const synonym of synonyms) {
      if (lower.includes(synonym)) {
        return canonical
      }
    }
  }
  const match = lower.match(/(?:bought?|buy|purchased?|got)\s+[\d.,\s]*(?:\w+\s+)?(?:of\s+)?(\w+(?:\s+\w+)?)\s+(?:at|for|@)/)
  if (match) return match[1]
  return 'unknown product'
}

export function parseMessage(message: string): ParsedPurchase {
  const text = message.toLowerCase()
  let confidence = 0.5

  const product = detectProduct(text)
  if (product !== 'unknown product') confidence += 0.2

  let quantity = 1
  let quantityUnit = 'piece'

  const qtyUnitMatch = text.match(/(\d+(?:\.\d+)?)\s*([a-z]+)/)
  if (qtyUnitMatch) {
    const num = parseFloat(qtyUnitMatch[1])
    const unitWord = qtyUnitMatch[2]
    if (UNITS[unitWord]) {
      quantity = num
      quantityUnit = UNITS[unitWord]
      confidence += 0.15
    } else if (!isNaN(num)) {
      quantity = num
    }
  }

  let pricePerUnit = 0
  let totalPrice = 0

  const pricePatterns = [
    /(?:at|@|for|costs?|price(?:d)?\s+at)\s*[₦#]?\s*([\d,k.]+k?)/i,
    /[₦#]\s*([\d,k.]+k?)/i,
    /([\d,k.]+k?)\s*(?:per|each|\/)/i,
  ]

  for (const pattern of pricePatterns) {
    const match = text.match(pattern)
    if (match) {
      pricePerUnit = normalizePrice(match[1])
      totalPrice = pricePerUnit * quantity
      confidence += 0.15
      break
    }
  }

  if (pricePerUnit === 0) {
    const totalMatch = text.match(/(?:spent|paid|total|cost)\s*[₦#]?\s*([\d,k.]+k?)/i)
    if (totalMatch) {
      totalPrice = normalizePrice(totalMatch[1])
      pricePerUnit = quantity > 0 ? totalPrice / quantity : totalPrice
      confidence += 0.1
    }
  }

  let supplier: string | undefined
  let supplierType: 'wholesaler' | 'middleman' | 'unknown' = 'unknown'

  const supplierMatch = text.match(/(?:from|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*(?:market|store|shop)?/)
  if (supplierMatch) {
    supplier = supplierMatch[1]
    supplierType = 'wholesaler'
  }

  return {
    product,
    quantity,
    quantityUnit,
    pricePerUnit,
    totalPrice: totalPrice || pricePerUnit * quantity,
    supplier,
    supplierType,
    confidence: Math.min(confidence, 1.0),
  }
}
