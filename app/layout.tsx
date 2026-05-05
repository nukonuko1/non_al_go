import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'その1本、本当に飲む？',
  description: '飲みたい衝動が来たときに開くアプリ。飲酒の損失を可視化して、飲まない選択をサポートします。',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#0a0a0a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="bg-[#0a0a0a] text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  )
}
