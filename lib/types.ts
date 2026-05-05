export interface DrinkSettings {
  drinkName: string
  pricePerUnit: number   // 円
  volumePerUnit: number  // ml
  alcoholPercentage: number // %
  unitsPerDay: number    // 本/日
  daysPerWeek: number    // 日/週
}

export interface DayRecord {
  date: string           // YYYY-MM-DD (local time)
  didNotDrink: boolean
  alternativeActions: string[]
  savedMoney: number
  avoidedAlcohol: number // grams
}

export interface AppData {
  settings: DrinkSettings | null
  records: DayRecord[]
  knowledgePoints: number
}
