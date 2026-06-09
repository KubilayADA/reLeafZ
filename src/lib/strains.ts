export type StrainTagVariant = 'indica' | 'sativa' | 'hybrid'

export const STRAIN_IMAGE_LIBRARY: Record<string, string> = {
  'Mac Driver': '/strains/mac-driver.webp',
  'Black Cherry Punch': '/strains/black-cherry-punch.webp',
  'White Widow': '/strains/white-widow-cheese.jpg',
  Slurricane: '/strains/slurricane.webp',
  'Hi Society': '/strains/hi-society-dfr.webp',
  DFR: '/strains/hi-society-dfr.webp',
  Madrecan: '/strains/madrecan-granddaddy-og.webp',
  GDY: '/strains/madrecan-granddaddy-og.webp',
  Granddaddy: '/strains/madrecan-granddaddy-og.webp',
  'Medical Saints': '/strains/medical-saints-lemon-skunk.jpg',
  LSK: '/strains/medical-saints-lemon-skunk.jpg',
  'Lemon Skunk': '/strains/medical-saints-lemon-skunk.jpg',
  'Organic Sweetgrass': '/strains/organic-sweetgrass-mint-chocolate.webp',
  MCC: '/strains/organic-sweetgrass-mint-chocolate.webp',
  'Mint Chocolate': '/strains/organic-sweetgrass-mint-chocolate.webp',
  Remexian: '/strains/remexian-arr.webp',
  ARR: '/strains/remexian-arr.webp',
  Slouw: '/strains/slouw-ps3-og-kush.webp',
  PS3: '/strains/slouw-ps3-og-kush.webp',
  OGK: '/strains/slouw-ps3-og-kush.webp',
  ZOIKS: '/strains/zoiks-bb.webp',
  BB: '/strains/zoiks-bb.webp',
  'Space Rider': '/strains/zoiks-space-rider.webp',
}

export const STRAIN_PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2334d399'/%3E%3Cstop offset='100%25' stop-color='%2310b981'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='%23f0fdf4'/%3E%3Ccircle cx='100' cy='85' r='50' fill='url(%23g1)' opacity='0.9'/%3E%3Cellipse cx='80' cy='75' rx='20' ry='25' fill='%2322c55e'/%3E%3Cellipse cx='120' cy='75' rx='20' ry='25' fill='%2316a34a'/%3E%3Cellipse cx='100' cy='95' rx='25' ry='20' fill='%2315803d'/%3E%3Ccircle cx='85' cy='70' r='3' fill='%23fbbf24' opacity='0.8'/%3E%3Ccircle cx='110' cy='80' r='2' fill='%23fb923c' opacity='0.7'/%3E%3Cpath d='M100 115 Q100 140 100 155' stroke='%2315803d' stroke-width='4' fill='none'/%3E%3Cpath d='M100 130 Q85 125 75 135' stroke='%2322c55e' stroke-width='2' fill='none'/%3E%3Cpath d='M100 130 Q115 125 125 135' stroke='%2322c55e' stroke-width='2' fill='none'/%3E%3C/svg%3E"

export function findStrainImage(productName: string): string | null {
  const nameLower = productName.toLowerCase()
  for (const [strainPattern, imageUrl] of Object.entries(STRAIN_IMAGE_LIBRARY)) {
    if (nameLower.includes(strainPattern.toLowerCase())) {
      return imageUrl
    }
  }
  return null
}

export function getStrainType(name: string): { type: string; variant: StrainTagVariant } {
  const nameLower = name.toLowerCase()
  if (
    nameLower.includes('indica') ||
    nameLower.includes('kush') ||
    nameLower.includes('og') ||
    nameLower.includes('punch') ||
    nameLower.includes('slurricane')
  ) {
    return { type: 'Indica', variant: 'indica' }
  }
  if (
    nameLower.includes('sativa') ||
    nameLower.includes('haze') ||
    nameLower.includes('lemon') ||
    nameLower.includes('skunk')
  ) {
    return { type: 'Sativa', variant: 'sativa' }
  }
  return { type: 'Hybrid', variant: 'hybrid' }
}

export function getStrainImage(name: string, imageUrl?: string): string {
  if (imageUrl) return imageUrl
  const strainImage = findStrainImage(name)
  if (strainImage) return strainImage
  return STRAIN_PLACEHOLDER_IMAGE
}
