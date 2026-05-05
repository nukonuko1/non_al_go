'use client'

import { useState } from 'react'
import Link from 'next/link'
import { addAlternativeAction, recordNoAlcohol, getStats } from '@/lib/storage'
import type { Stats } from '@/lib/storage'

const ACTIONS = [
  { id: 'water', emoji: '💧', label: '炭酸水を飲む', desc: '口の渇きを満たす' },
  { id: 'teeth', emoji: '🦷', label: '歯を磨く', desc: '飲む気が自然と落ち着く' },
  { id: 'shower', emoji: '🚿', label: 'シャワーを浴びる', desc: 'リフレッシュして気分転換' },
  { id: 'walk', emoji: '🚶', label: '5分散歩する', desc: '外の空気で衝動が落ち着く' },
  { id: 'study', emoji: '📖', label: '仕事の復習をする', desc: '5分だけ。明日への準備' },
  { id: 'sidejob', emoji: '✏️', label: '副業アイデアを書く', desc: '5分だけ。未来への投資' },
  { id: 'family', emoji: '👨‍👩‍👧', label: '家族と話す', desc: 'つながりが衝動を和らげる' },
  { id: 'sleep', emoji: '😴', label: 'すぐ寝る', desc: '寝落ちが最強の対処法' },
]

export default function AlternativesPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showWin, setShowWin] = useState(false)
  const [winStats, setWinStats] = useState<Stats | null>(null)

  function handleActionPress(id: string, label: string) {
    addAlternativeAction(label)
    setSelected(prev => new Set(Array.from(prev).concat(id)))
  }

  function handleNoAlcohol() {
    recordNoAlcohol()
    const s = getStats()
    setWinStats(s)
    setShowWin(true)
  }

  if (showWin && winStats) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
        <div className="animate-scale-in">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-4xl font-black text-emerald-400 mb-2">今日の勝ち！</h1>
          <p className="text-gray-400 text-lg mb-8">素晴らしい。未来の自分が喜んでいる。</p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-8">
            <StatCard
              label="連続記録"
              value={`${winStats.streak}日`}
              color="text-amber-400"
            />
            <StatCard
              label="累計節約"
              value={`¥${winStats.totalSaved.toLocaleString()}`}
              color="text-emerald-400"
            />
            <StatCard
              label="回避した純アルコール"
              value={`${winStats.totalAvoidedAlcohol}g`}
              color="text-blue-400"
            />
            <StatCard
              label="飲まなかった日数"
              value={`${winStats.noDrinkDays}日`}
              color="text-purple-400"
            />
          </div>

          <Link
            href="/dashboard"
            className="block w-full bg-emerald-600 text-white text-lg font-black py-5 rounded-2xl text-center active:scale-95 transition-transform duration-100 mb-3"
          >
            記録を見る →
          </Link>
          <Link
            href="/"
            className="block text-gray-500 text-sm py-3"
          >
            ホームに戻る
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col pb-8">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <Link href="/comparison" className="text-gray-500 text-sm flex items-center gap-1 mb-6">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          戻る
        </Link>
        <h1 className="text-2xl font-black text-white">今からこれをやる</h1>
        <p className="text-gray-400 text-sm mt-1">代替行動を選んで、衝動を乗り越えよう</p>
      </div>

      {/* Actions grid */}
      <div className="px-6 flex-1">
        <div className="grid grid-cols-2 gap-3">
          {ACTIONS.map((action, i) => {
            const isDone = selected.has(action.id)
            return (
              <button
                key={action.id}
                onClick={() => handleActionPress(action.id, action.label)}
                className={`relative rounded-2xl p-4 text-left transition-all duration-150 active:scale-95 animate-fade-up ${
                  isDone
                    ? 'bg-emerald-900/40 border border-emerald-500/50'
                    : 'bg-[#111] border border-gray-800 active:border-gray-600'
                }`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {isDone && (
                  <div className="absolute top-3 right-3 text-emerald-400 text-xs font-bold">
                    ✓
                  </div>
                )}
                <span className="text-2xl block mb-2">{action.emoji}</span>
                <p className={`font-bold text-sm leading-snug ${isDone ? 'text-emerald-300' : 'text-white'}`}>
                  {action.label}
                </p>
                <p className="text-gray-500 text-xs mt-1">{action.desc}</p>
              </button>
            )
          })}
        </div>

        {/* Selected actions feedback */}
        {selected.size > 0 && (
          <div className="mt-5 bg-[#111] border border-gray-800 rounded-2xl p-4 animate-scale-in">
            <p className="text-gray-400 text-sm text-center">
              {selected.size}つの代替行動を選びました 👍
            </p>
            <p className="text-gray-500 text-xs text-center mt-1">
              今日の勝ち行動として保存されています
            </p>
          </div>
        )}

        {/* No alcohol today button */}
        <div className="mt-6 space-y-3">
          <button
            onClick={handleNoAlcohol}
            className="w-full bg-emerald-600 text-white text-lg font-black py-5 rounded-2xl active:scale-95 transition-transform duration-100 shadow-lg shadow-emerald-900/30"
          >
            今日は飲まなかった ✓
          </button>
          <Link
            href="/"
            className="block text-center text-gray-600 text-sm py-2"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string
  value: string
  color: string
}) {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 text-center">
      <p className={`text-xl font-black ${color}`}>{value}</p>
      <p className="text-gray-500 text-xs mt-1">{label}</p>
    </div>
  )
}
