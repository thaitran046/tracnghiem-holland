import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Trắc nghiệm sở thích Holland | 120 mệnh đề',
  description:
    'Khám phá nhóm sở thích nổi trội qua bài trắc nghiệm Holland 120 mệnh đề. Giao diện đơn giản, kết quả tự động tổng hợp 6 nhóm.',
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Trắc nghiệm sở thích Holland',
    description: '120 mệnh đề · 20 màn hình · Tự động chấm 6 nhóm',
    type: 'website',
    locale: 'vi_VN',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1f6feb',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
