export function formatAriary(amount: number): string {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} Ar`;
}

export function formatArea(area: number): string {
  if (area >= 10000) {
    return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(area / 10000)} Ha`;
  }
  return `${new Intl.NumberFormat('fr-FR').format(area)} m²`;
}
