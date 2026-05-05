'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { getSettings, getStats, recordNoAlcohol, getTodayRecord } from '@/lib/storage'
import type { Stats } from '@/lib/storage'

export default function Home() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [hasSettings, setHasSettings] = useState(false)
  const [didNotDrinkToday, setDidNotDrinkToday] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    setHasSettings(!!getSettings())
    setStats(getStats())
    setDidNotDrinkToday(getTodayRecord()?.didNotDrink ?? false)
  }, [])

  function handleNoAlcohol() {
    recordNoAlcohol()
    setDidNotDrinkToday(true)
    setStats(getStats())
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col pb-20">
      {/* Success toast */}
      {showSuccess && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-emerald-600 text-white rounded-2xl px-5 py-4 text-center font-bold text-lg animate-scale-in shadow-xl">
          🎉 今日の勝ち！素晴らしい。
        </div>
      )}

      <div className="flex flex-col items-center justify-center flex-1 px-6 pt-16 pb-6 gap-8">
        {/* Streak badge */}
        {stats && stats.streak > 0 && (
          <div className="w-full bg-[#111] border border-amber-500/30 rounded-2xl px-5 py-4 text-center animate-fade-up">
            <p className="text-amber-400 text-3xl font-black">{stats.streak}日連続</p>
            <p className="text-gray-400 text-sm mt-1">飲まない日が続いています 🔥</p>
          </div>
        )}

        {/* Hero */}
        <div className="text-center animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <p className="text-gray-500 text-sm mb-3 tracking-wide">飲みたい衝動が来たら開く</p>
          <h1 className="text-[2.8rem] font-black leading-[1.1] text-white">
            その1本、<br />
            <span className="text-red-500">本当に</span>飲む？
          </h1>
          <p className="text-gray-400 text-base mt-4">今飲むと、明日の自分が払う。</p>
        </div>

        {/* Main CTA */}
        <div className="w-full animate-fade-up" style={{ animationDelay: '0.12s' }}>
          <Link
            href="/intervention"
            className="block w-full bg-red-600 text-white text-xl font-black py-6 px-6 rounded-2xl text-center active:scale-95 transition-transform duration-100 shadow-lg shadow-red-900/40"
            style={{ animation: 'pulseRed 2.5s ease-in-out infinite' }}
          >
            飲みたい衝動が来た
          </Link>
        </div>

        {/* No drink today button */}
        <div className="w-full animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {didNotDrinkToday ? (
            <div className="w-full bg-emerald-900/30 border border-emerald-500/40 rounded-2xl py-4 px-6 text-center">
              <p className="text-emerald-400 font-bold text-lg">✓ 今日は飲まなかった</p>
              <p className="text-gray-500 text-sm mt-1">記録済み。今日も勝ち。</p>
            </div>
          ) : (
            <button
              onClick={handleNoAlcohol}
              className="w-full bg-[#111] border border-gray-700 text-gray-300 font-bold py-4 px-6 rounded-2xl text-center active:scale-95 transition-transform duration-100"
            >
              今日は飲まなかった ✓
            </button>
          )}
        </div>

        {/* Settings prompt */}
        {!hasSettings && (
          <div
            className="w-full bg-[#111] border border-gray-700 rounded-2xl px-5 py-4 animate-fade-up"
            style={{ animationDelay: '0.28s' }}
          >
            <p className="text-gray-300 text-sm font-bold mb-2">📊 損失を数値化するには</p>
            <p className="text-gray-500 text-xs mb-3">よく飲むお酒の情報を登録すると、あなた専用の損失計算ができます。</p>
            <Link
              href="/settings"
              className="block w-full bg-gray-800 text-white text-sm font-bold py-3 rounded-xl text-center"
            >
              初期設定をする →
            </Link>
          </div>
        )}

        {/* Stats summary if available */}
        {stats && stats.noDrinkDays > 0 && (
          <div
            className="w-full grid grid-cols-2 gap-3 animate-fade-up"
            style={{ animationDelay: '0.32s' }}
          >
            <div className="bg-[#111] rounded-2xl p-4 text-center border border-gray-800">
              <p className="text-2xl font-black text-white">{stats.noDrinkDays}日</p>
              <p className="text-gray-500 text-xs mt-1">飲まなかった日数</p>
            </div>
            <div className="bg-[#111] rounded-2xl p-4 text-center border border-gray-800">
              <p className="text-2xl font-black text-emerald-400">
                ¥{stats.totalSaved.toLocaleString()}
              </p>
              <p className="text-gray-500 text-xs mt-1">累計節約金額</p>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p
          className="text-gray-700 text-xs text-center leading-relaxed animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          このアプリは行動変容サポートを目的としています。<br />
          健康への不安がある場合は医師に相談してください。
        </p>
      </div>

      <BottomNav />
    </main>
  )
}
