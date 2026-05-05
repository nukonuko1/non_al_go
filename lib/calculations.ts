import { DrinkSettings } from './types'

export function calcPureAlcoholPerUnit(s: DrinkSettings): number {
  return Math.round(s.volumePerUnit * (s.alcoholPercentage / 100) * 0.8 * 10) / 10
}

export function calcDailyAlcohol(s: DrinkSettings): number {
  return Math.round(calcPureAlcoholPerUnit(s) * s.unitsPerDay * 10) / 10
}

export function calcCaloriesPerUnit(s: DrinkSettings): number {
  // alcohol calories only (7kcal/g)
  return Math.round(calcPureAlcoholPerUnit(s) * 7)
}

export function calcDailyCost(s: DrinkSettings): number {
  return s.pricePerUnit * s.unitsPerDay
}

export function calcWeeklyCost(s: DrinkSettings): number {
  return calcDailyCost(s) * s.daysPerWeek
}

export function calcMonthlyCost(s: DrinkSettings): number {
  return Math.round(calcWeeklyCost(s) * 4.3)
}

export function calcYearlyCost(s: DrinkSettings): number {
  return calcDailyCost(s) * s.daysPerWeek * 52
}

export function formatYen(n: number): string {
  return `¥${n.toLocaleString('ja-JP')}`
}
