import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AllFi 資產管家 — 純前端零帳號',
  description: '6 種帳戶類型、6 種幣別，純前端資產 dashboard',
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1 }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-Hant"><body className="min-h-screen antialiased">{children}</body></html>
}
