import { AppData, DrinkSettings, DayRecord } from './types'
import { calcDailyCost, calcDailyAlcohol } from './calculations'

const STORAGE_KEY = 'non_al_go_v1'

function localDateString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function load(): AppData {
  if (typeof window === 'undefined') {
    return { settings: null, records: [], knowledgePoints: 0 }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { settings: null, records: [], knowledgePoints: 0 }
    const data = JSON.parse(raw) as Partial<AppData>
    return {
      settings: data.settings ?? null,
      records: data.records ?? [],
      knowledgePoints: data.knowledgePoints ?? 0,
    }
  } catch {
    return { settings: null, records: [], knowledgePoints: 0 }
  }
}

function persist(data: AppData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getSettings(): DrinkSettings | null {
  return load().settings
}

export function saveSettings(settings: DrinkSettings): void {
  const data = load()
  data.settings = settings
  persist(data)
}

export function getRecords(): DayRecord[] {
  return load().records
}

export function getTodayRecord(): DayRecord | null {
  const today = localDateString()
  return getRecords().find(r => r.date === today) ?? null
}

function upsertToday(update: (r: DayRecord) => DayRecord): void {
  const data = load()
  const today = localDateString()
  const idx = data.records.findIndex(r => r.date === today)
  const base: DayRecord =
    idx >= 0
      ? data.records[idx]
      : {
          date: today,
          didNotDrink: false,
          alternativeActions: [],
          savedMoney: data.settings ? calcDailyCost(data.settings) : 0,
          avoidedAlcohol: data.settings ? calcDailyAlcohol(data.settings) : 0,
        }
  const updated = update(base)
  if (idx >= 0) {
    data.records[idx] = updated
  } else {
    data.records.push(updated)
  }
  persist(data)
}

export function recordNoAlcohol(): void {
  upsertToday(r => ({ ...r, didNotDrink: true }))
}

export function addAlternativeAction(action: string): void {
  upsertToday(r => ({
    ...r,
    alternativeActions: r.alternativeActions.includes(action)
      ? r.alternativeActions
      : [...r.alternativeActions, action],
  }))
}

export function getKnowledgePoints(): number {
  return load().knowledgePoints
}

export function addKnowledgePoints(n: number): void {
  const data = load()
  data.knowledgePoints = (data.knowledgePoints ?? 0) + n
  persist(data)
}

export interface Stats {
  streak: number
  totalSaved: number
  totalAvoidedAlcohol: number
  noDrinkDays: number
  knowledgePoints: number
  recentActions: { date: string; action: string }[]
}

export function getStats(): Stats {
  const data = load()
  const noDrinkRecords = data.records
    .filter(r => r.didNotDrink)
    .map(r => r.date)
    .sort()
    .reverse()

  // Calculate current streak
  let streak = 0
  if (noDrinkRecords.length > 0) {
    const today = localDateString()
    const yesterday = (() => {
      const d = new Date()
      d.setDate(d.getDate() - 1)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    })()

    const startDate = noDrinkRecords[0] === today || noDrinkRecords[0] === yesterday
      ? noDrinkRecords[0]
      : null

    if (startDate) {
      streak = 1
      const dateSet = new Set(noDrinkRecords)
      const cur = new Date(startDate)
      for (let i = 1; i < 365; i++) {
        cur.setDate(cur.getDate() - 1)
        const s = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`
        if (dateSet.has(s)) {
          streak++
        } else {
          break
        }
      }
    }
  }

  const noDrinkFull = data.records.filter(r => r.didNotDrink)
  const totalSaved = Math.round(noDrinkFull.reduce((s, r) => s + (r.savedMoney ?? 0), 0))
  const totalAvoidedAlcohol =
    Math.round(noDrinkFull.reduce((s, r) => s + (r.avoidedAlcohol ?? 0), 0) * 10) / 10

  const recentActions = data.records
    .flatMap(r => r.alternativeActions.map(a => ({ date: r.date, action: a })))
    .slice(-20)
    .reverse()

  return {
    streak,
    totalSaved,
    totalAvoidedAlcohol,
    noDrinkDays: noDrinkFull.length,
    knowledgePoints: data.knowledgePoints ?? 0,
    recentActions,
  }
}
