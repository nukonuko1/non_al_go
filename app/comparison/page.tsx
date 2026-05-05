'use client'

import Link from 'next/link'

const DRINK_FUTURE = [
  { emoji: '💸', text: 'お金が消える' },
  { emoji: '😵', text: '睡眠が浅くなる' },
  { emoji: '🍔', text: '食欲が増えて太る' },
  { emoji: '😩', text: '翌日がだるい' },
  { emoji: '😔', text: '自己嫌悪が残る' },
  { emoji: '📉', text: '仕事・副業が進まない' },
]

const SOBER_FUTURE = [
  { emoji: '💰', text: 'お金が手元に残る' },
  { emoji: '☀️', text: '明日の朝が軽い' },
  { emoji: '📖', text: '30分の勉強ができる' },
  { emoji: '💪', text: '体型改善に近づく' },
  { emoji: '😊', text: '自己肯定感が上がる' },
  { emoji: '🚀', text: '副業・キャリアが動く' },
]

export default function ComparisonPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col pb-8">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <Link href="/intervention" className="text-gray-500 text-sm flex items-center gap-1 mb-6">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          戻る
        </Link>
        <h1 className="text-2xl font-black text-white">2つの未来</h1>
        <p className="text-gray-400 text-sm mt-1">今夜の選択で、明日が変わる</p>
      </div>

      <div className="px-6 flex flex-col gap-4 flex-1">
        {/* Drink future card */}
        <div className="bg-[#1a0505] border border-red-900/60 rounded-2xl p-5 animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <h2 className="text-red-400 font-black text-base">飲んだ未来</h2>
          </div>
          <div className="space-y-2.5">
            {DRINK_FUTURE.map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">{item.emoji}</span>
                <span className="text-gray-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VS divider */}
        <div className="flex items-center gap-4 px-2">
          <div className="flex-1 h-px bg-gray-800" />
          <span className="text-gray-500 font-black text-sm">VS</span>
          <div className="flex-1 h-px bg-gray-800" />
        </div>

        {/* Sober future card */}
        <div
          className="bg-[#051a0a] border border-emerald-900/60 rounded-2xl p-5 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <h2 className="text-emerald-400 font-black text-base">飲まなかった未来</h2>
          </div>
          <div className="space-y-2.5">
            {SOBER_FUTURE.map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-lg w-7 text-center">{item.emoji}</span>
                <span className="text-gray-300 text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational copy */}
        <div
          className="text-center py-2 animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          <p className="text-gray-400 text-sm leading-relaxed">
            飲まない夜は、未来を取り戻す時間。<br />
            <span className="text-white font-bold">今日は飲まない。それだけで勝ち。</span>
          </p>
        </div>

        {/* CTA */}
        <div
          className="animate-fade-up"
          style={{ animationDelay: '0.28s' }}
        >
          <Link
            href="/alternatives"
            className="block w-full bg-emerald-600 text-white text-lg font-black py-5 rounded-2xl text-center active:scale-95 transition-transform duration-100 shadow-lg shadow-emerald-900/30"
          >
            代替行動を選ぶ →
          </Link>
        </div>
      </div>
    </main>
  )
}
