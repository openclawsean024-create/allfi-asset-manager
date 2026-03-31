import Header from '@/components/Header'
import NetWorthHero from '@/components/NetWorthHero'
import BankSection from '@/components/BankSection'
import StockSection from '@/components/StockSection'
import CryptoSection from '@/components/CryptoSection'

// Mock data for initial build
const mockNetWorth = 44893.50
const mockBankAccounts = [
  { id: '1', name: 'Chase Checking', institution: 'Chase', balance: 12450.00, lastUpdated: new Date().toISOString() },
  { id: '2', name: 'HSBC Savings', institution: 'HSBC', balance: 8200.00, lastUpdated: new Date().toISOString() },
]
const mockHoldings = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, price: 178.50, value: 1785.00, gainLoss: 55.00, gainLossPct: 3.18 },
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 5, price: 175.20, value: 876.00, gainLoss: -12.50, gainLossPct: -1.41 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 3, price: 875.00, value: 2625.00, gainLoss: 187.50, gainLossPct: 7.69 },
]
const mockCrypto = [
  { symbol: 'BTC', name: 'Bitcoin', amount: 0.25, price: 65000, value: 16250.00 },
  { symbol: 'ETH', name: 'Ethereum', amount: 2.0, price: 3500, value: 7000.00 },
  { symbol: 'SOL', name: 'Solana', amount: 15, price: 145, value: 2175.00 },
]

export default function DashboardPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        <NetWorthHero
          total={mockNetWorth}
          bankTotal={mockBankAccounts.reduce((s, a) => s + a.balance, 0)}
          stockTotal={mockHoldings.reduce((s, h) => s + h.value, 0)}
          cryptoTotal={mockCrypto.reduce((s, c) => s + c.value, 0)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div>
            <BankSection accounts={mockBankAccounts} />
          </div>
          <div>
            <StockSection holdings={mockHoldings} />
          </div>
          <div>
            <CryptoSection assets={mockCrypto} />
          </div>
        </div>
      </main>
    </div>
  )
}
