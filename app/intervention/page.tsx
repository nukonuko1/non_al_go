'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSettings } from '@/lib/storage'
import {
  calcDailyCost,
  calcMonthlyCost,
  calcYearlyCost,
  calcDailyAlcohol,
  calcCaloriesPerUnit,
  formatYen,
} from '@/lib/calculations'
import type { DrinkSettings } from '@/lib/types'

const LOSS_ITEMS = [
  {
    emoji: '⏱',
    text: '今日の自由時間',
    sub: '翌朝のだるさに消える',
  },
  {
    emoji: '🧠',
    text: '明日の集中力',
    sub: '仕事・勉強・副業が進まない',
  },
  {
    emoji: '😴',
    text: '睡眠の質',
    sub: '深い眠りが減り、疲れが抜けない',
  },
  {
    emoji: '💰',
    text: 'お金',
    sub: '今夜の酒代が消える',
  },
  {
    emoji: '🏃',
    text: '体型',
    sub: '食欲増加＋余分なカロリー',
  },
  {
    emoji: '🧘',
    text: 'メンタルの安定',
    sub: '翌日の自己嫌悪が残る',
  },
]

export default function InterventionPage() {
  const [settings, setSettings] = useState<DrinkSettings | null>(null)
  const [visibleCount, setVisibleCount] = useState(0)
  const [showNumbers, setShowNumbers] = useState(false)
  const [showActions, setShowActions] = useState(false)

  useEffect(() => {
    setSettings(getSettings())

    // Staggered reveal
    const timers: ReturnType<typeof setTimeout>[] = []
    LOSS_ITEMS.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleCount(i + 1), i * 180))
    })
    timers.push(setTimeout(() => setShowNumbers(true), LOSS_ITEMS.length * 180 + 200))
    timers.push(setTimeout(() => setShowActions(true), LOSS_ITEMS.length * 180 + 500))

    return () => timers.forEach(clearTimeout)
  }, [])

  const dailyCost = settings ? calcDailyCost(settings) : null
  const monthlyCost = settings ? calcMonthlyCost(settings) : null
  const yearlyCost = settings ? calcYearlyCost(settings) : null
  const dailyAlcohol = settings ? calcDailyAlcohol(settings) : null
  const calories = settings ? calcCaloriesPerUnit(settings) * settings.unitsPerDay : null

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1a0505] to-[#0a0a0a] flex flex-col pb-8">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <Link href="/" className="text-gray-500 text-sm flex items-center gap-1 mb-6">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          戻る
        </Link>
        <h1 className="text-3xl font-black text-red-500 leading-tight">
          今飲むと<br />失うもの
        </h1>
      </div>

      {/* Loss items */}
      <div className="px-6 space-y-1 flex-1">
        {LOSS_ITEMS.map((item, i) => (
          <div
            key={item.text}
            className="flex items-center gap-4 py-3.5 border-b border-gray-800/50"
            style={{
              opacity: i < visibleCount ? 1 : 0,
              transform: i < visibleCount ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
            }}
          >
            <span className="text-2xl w-10 text-center flex-shrink-0">{item.emoji}</span>
            <div>
              <p className="text-white font-bold text-lg leading-tight">{item.text}</p>
              <p className="text-gray-500 text-sm">{item.sub}</p>
            </div>
          </div>
        ))}

        {/* Personal loss numbers */}
        {settings && showNumbers && (
          <div
            className="mt-6 bg-black/40 border border-red-900/50 rounded-2xl p-5 space-y-3"
            style={{
              animation: 'fadeInUp 0.5s ease-out both',
            }}
          >
            <p className="text-red-400 text-xs font-bold uppercase tracking-wide">
              あなたの場合（{settings.drinkName}×{settings.unitsPerDay}本）
            </p>
            <LossRow label="今夜の酒代" value={formatYen(dailyCost!)} />
            <LossRow label="1か月の酒代" value={formatYen(monthlyCost!)} />
            <LossRow label="1年の酒代" value={formatYen(yearlyCost!)} large />
            <LossRow label="今夜の純アルコール" value={`${dailyAlcohol}g`} />
            <LossRow label="アルコール由来カロリー" value={`${calories}kcal`} />
          </div>
        )}

        {!settings && showNumbers && (
          <div
            className="mt-6 bg-[#111] border border-gray-800 rounded-2xl p-5"
            style={{ animation: 'fadeInUp 0.5s ease-out both' }}
          >
            <p className="text-gray-400 text-sm text-center mb-3">
              損失を数値化するには設定が必要です
            </p>
            <Link
              href="/settings"
              className="block w-full bg-gray-800 text-white text-sm font-bold py-3 rounded-xl text-center"
            >
              設定する →
            </Link>
          </div>
        )}
      </div>

      {/* CTA buttons */}
      {showActions && (
        <div
          className="px-6 mt-6 space-y-3"
          style={{ animation: 'fadeInUp 0.5s ease-out both' }}
        >
          <p className="text-gray-400 text-sm text-center font-bold">どうする？</p>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/comparison"
              className="bg-[#111] border border-gray-700 text-white font-bold py-4 px-3 rounded-2xl text-center text-sm active:scale-95 transition-transform duration-100"
            >
              飲む vs 飲まない<br />
              <span className="text-gray-400 font-normal text-xs">比較する</span>
            </Link>
            <Link
              href="/alternatives"
              className="bg-red-600 text-white font-bold py-4 px-3 rounded-2xl text-center text-sm active:scale-95 transition-transform duration-100 shadow-lg shadow-red-900/30"
            >
              代替行動を<br />
              <span className="text-white/80 font-normal text-xs">今すぐ選ぶ</span>
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}

function LossRow({
  label,
  value,
  large,
}: {
  label: string
  value: string
  large?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`font-black ${large ? 'text-xl text-red-400' : 'text-base text-white'}`}>
        {value}
      </span>
    </div>
  )
}
