const hebrewDateFormatter = new Intl.DateTimeFormat('he-IL', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

export function formatDate(dateString: string): string {
  return hebrewDateFormatter.format(new Date(dateString))
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000
    return `${kg % 1 === 0 ? kg : kg.toFixed(1)} ק"ג`
  }
  return `${grams} גרם`
}

export function gramsToKg(grams: number): number {
  return grams / 1000
}

export function kgToGrams(kg: number): number {
  return kg * 1000
}
