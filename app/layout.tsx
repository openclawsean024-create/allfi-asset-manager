import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AllFi — 你的全部資產，一目了然',
  description: '整合式資產管理平台：銀行存款 + 股票績效 + 虛擬貨幣餘額，單一儀表板完整掌握。',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  )
}
