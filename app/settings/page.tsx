'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import BottomNav from '@/components/BottomNav'
import { getSettings, saveSettings } from '@/lib/storage'
import {
  calcPureAlcoholPerUnit,
  calcDailyCost,
  calcMonthlyCost,
  calcYearlyCost,
  formatYen,
} from '@/lib/calculations'
import type { DrinkSettings } from '@/lib/types'

const DEFAULT: DrinkSettings = {
  drinkName: 'ビール（350ml缶）',
  pricePerUnit: 250,
  volumePerUnit: 350,
  alcoholPercentage: 5,
  unitsPerDay: 2,
  daysPerWeek: 5,
}

export default function SettingsPage() {
  const router = useRouter()
  const [form, setForm] = useState<DrinkSettings>(DEFAULT)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const s = getSettings()
    if (s) setForm(s)
  }, [])

  function handleChange(key: keyof DrinkSettings, value: string | number) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function handleSave() {
    saveSettings(form)
    setSaved(true)
    setTimeout(() => {
      router.push('/')
    }, 1200)
  }

  const pureAlcohol = calcPureAlcoholPerUnit(form)
  const dailyCost = calcDailyCost(form)
  const monthlyCost = calcMonthlyCost(form)
  const yearlyCost = calcYearlyCost(form)

  return (
    <main className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-black text-white">飲酒の設定</h1>
        <p className="text-gray-400 text-sm mt-1">よく飲むお酒の情報を入力してください</p>
      </div>

      <div className="px-6 space-y-5">
        {/* Drink name */}
        <FieldGroup label="お酒の名前">
          <input
            type="text"
            value={form.drinkName}
            onChange={e => handleChange('drinkName', e.target.value)}
            placeholder="例：ビール、ハイボール、日本酒"
            className="w-full bg-[#111] border border-gray-700 text-white rounded-xl px-4 py-4 text-base focus:outline-none focus:border-red-500 transition-colors"
          />
        </FieldGroup>

        {/* Price */}
        <FieldGroup label="1本あたりの価格（円）">
          <NumberInput
            value={form.pricePerUnit}
            onChange={v => handleChange('pricePerUnit', v)}
            min={0}
            step={10}
            suffix="円"
          />
        </FieldGroup>

        {/* Volume */}
        <FieldGroup label="1本あたりの容量（ml）">
          <NumberInput
            value={form.volumePerUnit}
            onChange={v => handleChange('volumePerUnit', v)}
            min={0}
            step={50}
            suffix="ml"
          />
        </FieldGroup>

        {/* Alcohol % */}
        <FieldGroup label="アルコール度数（%）">
          <NumberInput
            value={form.alcoholPercentage}
            onChange={v => handleChange('alcoholPercentage', v)}
            min={0}
            max={100}
            step={0.5}
            suffix="%"
          />
        </FieldGroup>

        {/* Units per day */}
        <FieldGroup label="1日に飲む本数">
          <NumberInput
            value={form.unitsPerDay}
            onChange={v => handleChange('unitsPerDay', v)}
            min={0}
            step={1}
            suffix="本/日"
          />
        </FieldGroup>

        {/* Days per week */}
        <FieldGroup label="週に飲む日数">
          <NumberInput
            value={form.daysPerWeek}
            onChange={v => handleChange('daysPerWeek', Math.min(7, Math.max(0, v)))}
            min={0}
            max={7}
            step={1}
            suffix="日/週"
          />
        </FieldGroup>

        {/* Preview */}
        <div className="bg-[#111] border border-gray-800 rounded-2xl p-5 space-y-3">
          <p className="text-gray-400 text-sm font-bold uppercase tracking-wide">損失プレビュー</p>
          <PreviewRow label="純アルコール（1本）" value={`${pureAlcohol}g`} />
          <PreviewRow label="今日の酒代" value={formatYen(dailyCost)} highlight />
          <PreviewRow label="1か月の酒代" value={formatYen(monthlyCost)} highlight />
          <PreviewRow
            label="1年の酒代"
            value={formatYen(yearlyCost)}
            highlight
            large
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full bg-red-600 text-white text-lg font-black py-5 rounded-2xl active:scale-95 transition-transform duration-100 shadow-lg shadow-red-900/30"
        >
          {saved ? '✓ 保存しました' : '保存する'}
        </button>

        <p className="text-gray-700 text-xs text-center pb-4">
          データはこのデバイスのみに保存されます
        </p>
      </div>

      <BottomNav />
    </main>
  )
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-gray-300 text-sm font-bold mb-2">{label}</label>
      {children}
    </div>
  )
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  suffix,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  suffix?: string
}) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        className="flex-1 bg-[#111] border border-gray-700 text-white rounded-xl px-4 py-4 text-base focus:outline-none focus:border-red-500 transition-colors"
      />
      {suffix && <span className="text-gray-400 text-sm w-14 text-right">{suffix}</span>}
    </div>
  )
}

function PreviewRow({
  label,
  value,
  highlight,
  large,
}: {
  label: string
  value: string
  highlight?: boolean
  large?: boolean
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}</span>
      <span
        className={`font-black ${large ? 'text-xl text-red-400' : highlight ? 'text-base text-white' : 'text-base text-gray-300'}`}
      >
        {value}
      </span>
    </div>
  )
}
