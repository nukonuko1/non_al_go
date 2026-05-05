'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { getStats, getSettings } from '@/lib/storage'
import { calcYearlyCost, formatYen } from '@/lib/calculations'
import type { Stats } from '@/lib/storage'

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [yearlyCost, setYearlyCost] = useState<number | null>(null)

  useEffect(() => {
    setStats(getStats())
    const s = getSettings()
    if (s) setYearlyCost(calcYearlyCost(s))
  }, [])

  if (!stats) return null

  const hasData = stats.noDrinkDays > 0 || stats.knowledgePoints > 0

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-black text-white">ダッシュボード</h1>
        <p className="text-gray-400 text-sm mt-1">あなたの記録</p>
      </div>

      <div className="px-6 space-y-4">
        {/* Streak */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 text-center animate-fade-up">
          {stats.streak > 0 ? (
            <>
              <p className="text-amber-400 text-5xl font-black">{stats.streak}</p>
              <p className="text-gray-400 text-sm mt-2">日連続で飲まなかった 🔥</p>
            </>
          ) : (
            <>
              <p className="text-gray-600 text-4xl font-black">0</p>
              <p className="text-gray-600 text-sm mt-2">連続記録</p>
              <p className="text-gray-700 text-xs mt-2">今日から始めよう</p>
            </>
          )}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 animate-fade-up" style={{ animationDelay: '0.08s' }}>
          <StatCard
            label="飲まなかった日数"
            value={`${stats.noDrinkDays}日`}
            color="text-white"
            sub={stats.noDrinkDays === 0 ? '記録なし' : undefined}
          />
          <StatCard
            label="累計節約金額"
            value={`¥${stats.totalSaved.toLocaleString()}`}
            color="text-emerald-400"
            sub={stats.totalSaved === 0 ? '節約なし' : undefined}
          />
          <StatCard
            label="回避した純アルコール"
            value={`${stats.totalAvoidedAlcohol}g`}
            color="text-blue-400"
          />
          <StatCard
            label="知識ポイント"
            value={`${stats.knowledgePoints}pt`}
            color="text-amber-400"
            sub={stats.knowledgePoints === 0 ? 'クイズで獲得' : undefined}
          />
        </div>

        {/* Yearly cost projection */}
        {yearlyCost && (
          <div
            className="bg-[#111] border border-red-900/40 rounded-2xl p-5 animate-fade-up"
            style={{ animationDelay: '0.16s' }}
          >
            <p className="text-red-400 text-xs font-bold mb-1 uppercase tracking-wide">
              このままだと1年間で
            </p>
            <p className="text-3xl font-black text-white">{formatYen(yearlyCost)}</p>
            <p className="text-gray-500 text-xs mt-1">をお酒に使います</p>
            <p className="text-gray-400 text-sm mt-3">
              酒代を<span className="text-emerald-400 font-bold">人生投資</span>に回しませんか？
            </p>
          </div>
        )}

        {/* Recent alternative actions */}
        {stats.recentActions.length > 0 && (
          <div
            className="bg-[#111] border border-gray-800 rounded-2xl p-5 animate-fade-up"
            style={{ animationDelay: '0.24s' }}
          >
            <p className="text-gray-400 text-sm font-bold mb-4">最近の勝ち行動</p>
            <div className="space-y-2.5">
              {stats.recentActions.slice(0, 10).map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-emerald-500 text-xs font-bold w-4">✓</span>
                  <span className="text-gray-300 text-sm flex-1">{item.action}</span>
                  <span className="text-gray-600 text-xs">{formatDate(item.date)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasData && (
          <div
            className="bg-[#111] border border-gray-800 rounded-2xl p-8 text-center animate-fade-up"
            style={{ animationDelay: '0.16s' }}
          >
            <p className="text-gray-500 text-lg mb-2">まだ記録がありません</p>
            <p className="text-gray-700 text-sm mb-6">
              「飲みたい衝動が来た」ボタンを押して<br />代替行動を選んでみましょう
            </p>
            <Link
              href="/"
              className="inline-block bg-red-600 text-white font-bold px-6 py-3 rounded-xl text-sm"
            >
              ホームへ
            </Link>
          </div>
        )}

        {/* Quick links */}
        <div
          className="grid grid-cols-2 gap-3 animate-fade-up"
          style={{ animationDelay: '0.32s' }}
        >
          <Link
            href="/quiz"
            className="bg-[#111] border border-amber-500/20 rounded-2xl p-4 text-center active:scale-95 transition-transform duration-100"
          >
            <p className="text-amber-400 font-bold text-sm">クイズに挑戦</p>
            <p className="text-gray-600 text-xs mt-1">知識ポイントを増やす</p>
          </Link>
          <Link
            href="/settings"
            className="bg-[#111] border border-gray-800 rounded-2xl p-4 text-center active:scale-95 transition-transform duration-100"
          >
            <p className="text-gray-300 font-bold text-sm">設定を見る</p>
            <p className="text-gray-600 text-xs mt-1">損失シミュレーター</p>
          </Link>
        </div>
      </div>

      <BottomNav />
    </main>
  )
}

function StatCard({
  label,
  value,
  color,
  sub,
}: {
  label: string
  value: string
  color: string
  sub?: string
}) {
  return (
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 text-center">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-gray-500 text-xs mt-1">{label}</p>
      {sub && <p className="text-gray-700 text-xs mt-0.5">{sub}</p>}
    </div>
  )
}

function formatDate(dateStr: string): string {
  const parts = dateStr.split('-')
  return `${parts[1]}/${parts[2]}`
}
