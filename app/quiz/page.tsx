'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import BottomNav from '@/components/BottomNav'
import { QUIZ_QUESTIONS, shuffleQuestions } from '@/lib/quiz'
import type { QuizQuestion } from '@/lib/quiz'
import { addKnowledgePoints, getKnowledgePoints } from '@/lib/storage'

type Phase = 'answering' | 'result' | 'complete'

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [phase, setPhase] = useState<Phase>('answering')
  const [score, setScore] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [pointsEarned, setPointsEarned] = useState(0)

  useEffect(() => {
    setQuestions(shuffleQuestions(QUIZ_QUESTIONS))
    setTotalPoints(getKnowledgePoints())
  }, [])

  const current = questions[currentIndex]

  function handleSelect(optionIndex: number) {
    if (phase !== 'answering') return
    setSelected(optionIndex)
    const isCorrect = optionIndex === current.answer
    if (isCorrect) {
      setScore(prev => prev + 1)
      setPointsEarned(prev => prev + 1)
      addKnowledgePoints(1)
      setTotalPoints(getKnowledgePoints())
    }
    setPhase('result')
  }

  function handleNext() {
    if (currentIndex + 1 >= questions.length) {
      setPhase('complete')
    } else {
      setCurrentIndex(prev => prev + 1)
      setSelected(null)
      setPhase('answering')
    }
  }

  function handleRestart() {
    setQuestions(shuffleQuestions(QUIZ_QUESTIONS))
    setCurrentIndex(0)
    setSelected(null)
    setPhase('answering')
    setScore(0)
    setPointsEarned(0)
  }

  if (questions.length === 0) return null

  if (phase === 'complete') {
    const percent = Math.round((score / questions.length) * 100)
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 pb-24 text-center">
        <div className="animate-scale-in w-full max-w-sm">
          <div className="text-5xl mb-5">
            {percent >= 80 ? '🎉' : percent >= 50 ? '👍' : '📚'}
          </div>
          <h2 className="text-3xl font-black text-white mb-2">クイズ終了！</h2>
          <p className="text-gray-400 mb-6">
            {questions.length}問中{score}問正解
          </p>

          <div className="bg-[#111] border border-amber-500/30 rounded-2xl p-6 mb-6">
            <p className="text-amber-400 text-xs font-bold mb-1">今回獲得</p>
            <p className="text-4xl font-black text-amber-400">+{pointsEarned}pt</p>
            <p className="text-gray-400 text-sm mt-2">累計：{totalPoints}pt</p>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 mb-6 text-left">
            <p className="text-sm font-bold text-white mb-2">
              {percent >= 80
                ? '素晴らしい知識力です！'
                : percent >= 50
                  ? 'いい調子。もう少しで完璧です！'
                  : '学ぶことが行動変容の第一歩です。'}
            </p>
            <p className="text-gray-500 text-xs">
              お酒についての知識を深めることで、より賢い選択ができるようになります。
            </p>
          </div>

          <button
            onClick={handleRestart}
            className="w-full bg-amber-500 text-black text-lg font-black py-5 rounded-2xl active:scale-95 transition-transform duration-100 mb-3"
          >
            もう一度チャレンジ
          </button>
          <Link href="/" className="block text-gray-500 text-sm py-2">
            ホームに戻る
          </Link>
        </div>
        <BottomNav />
      </main>
    )
  }

  const isCorrect = selected !== null && selected === current.answer

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-white">知識クイズ</h1>
          <div className="bg-[#111] border border-amber-500/30 rounded-full px-3 py-1.5">
            <span className="text-amber-400 text-xs font-bold">⭐ {totalPoints}pt</span>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-2">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors duration-300 ${
                i < currentIndex
                  ? 'bg-amber-400'
                  : i === currentIndex
                    ? 'bg-gray-400'
                    : 'bg-gray-800'
              }`}
            />
          ))}
        </div>
        <p className="text-gray-500 text-xs">
          {currentIndex + 1} / {questions.length}問目
        </p>
      </div>

      {/* Question */}
      <div className="px-6 flex-1 flex flex-col gap-5">
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 animate-scale-in">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Q.</p>
          <p className="text-white font-bold text-lg leading-snug">{current.question}</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {current.options.map((option, i) => {
            let style = 'bg-[#111] border border-gray-700 text-white'
            if (phase === 'result') {
              if (i === current.answer) {
                style = 'bg-emerald-900/60 border border-emerald-500 text-emerald-200'
              } else if (i === selected && selected !== current.answer) {
                style = 'bg-red-900/60 border border-red-500 text-red-200'
              } else {
                style = 'bg-[#111] border border-gray-800 text-gray-500'
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={phase === 'result'}
                className={`w-full rounded-2xl p-4 text-left font-bold text-base transition-all duration-200 active:scale-95 ${style} ${
                  phase === 'answering' ? 'active:border-red-500' : ''
                }`}
                style={{
                  animation: `fadeInUp 0.3s ease-out both`,
                  animationDelay: `${i * 0.07}s`,
                }}
              >
                <span className="text-xs font-bold mr-2 text-gray-500">
                  {['A', 'B', 'C'][i]}.
                </span>
                {option}
              </button>
            )
          })}
        </div>

        {/* Result feedback */}
        {phase === 'result' && (
          <div
            className={`rounded-2xl p-5 animate-scale-in ${
              isCorrect
                ? 'bg-emerald-900/40 border border-emerald-500/50'
                : 'bg-red-900/40 border border-red-500/50'
            }`}
          >
            <p className={`font-black text-lg mb-2 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCorrect ? '🎉 正解！+1pt' : '❌ 不正解'}
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">{current.explanation}</p>

            <button
              onClick={handleNext}
              className="mt-4 w-full bg-white text-black font-black py-4 rounded-xl active:scale-95 transition-transform duration-100"
            >
              {currentIndex + 1 >= questions.length ? '結果を見る →' : '次の問題 →'}
            </button>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  )
}
