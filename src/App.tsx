import { useState, useMemo } from 'react'
import ExecutiveSummary from './components/ExecutiveSummary'
import FunnelPipeline from './components/FunnelPipeline'
import FinancialKPIs from './components/FinancialKPIs'
import DateRangeFilter from './components/DateRangeFilter'
import funnelDataRaw from './data/funnel_data.json'
import financialDataRaw from './data/financial_data.json'
import type { FunnelWeek, FinancialWeek } from './types'

const funnelData = funnelDataRaw as FunnelWeek[]
const financialData = financialDataRaw as FinancialWeek[]

// SHA-256 hash of the password — update by running:
// echo -n "yourpassword" | shasum -a 256
const PASSWORD_HASH = '6f0853e81dafcb5cf4cc9a70d386a6a4cd4af4170d66558f163ea3aeefe9ecf1'

async function hashPassword(pw: string): Promise<string> {
  const data = new TextEncoder().encode(pw)
  const buf = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

type Section = 'summary' | 'funnel' | 'financial'

const NAV: { key: Section; label: string }[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'funnel', label: 'Deal Funnel' },
  { key: 'financial', label: 'Financial' },
]

function filterByRange<T extends { week: string }>(data: T[], range: string): T[] {
  if (range === 'all') return data
  const now = new Date()
  if (range === 'ytd') {
    const yearStart = `${now.getFullYear()}-01-01`
    return data.filter(w => w.week >= yearStart)
  }
  const weeks = parseInt(range)
  return data.slice(-weeks)
}

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const hash = await hashPassword(pw)
    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem('rbn-kpi-auth', 'true')
      onAuth()
    } else {
      setError(true)
      setPw('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-8 w-80 space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">RBN</div>
          <div className="text-sm text-gray-500">Executive KPI Dashboard</div>
        </div>
        <input
          type="password"
          value={pw}
          onChange={e => { setPw(e.target.value); setError(false) }}
          placeholder="Enter password"
          autoFocus
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {error && <div className="text-red-500 text-sm">Incorrect password</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}

export default function App() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('rbn-kpi-auth') === 'true')
  const [section, setSection] = useState<Section>('summary')
  const [range, setRange] = useState('26')

  const filteredFunnel = useMemo(() => filterByRange(funnelData, range), [range])
  const filteredFinancial = useMemo(() => filterByRange(financialData, range), [range])

  const latestWeek = funnelData.length > 0 ? funnelData[funnelData.length - 1].week : 'N/A'

  if (!authed) return <LoginGate onAuth={() => setAuthed(true)} />

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-xl font-bold text-gray-900">RBN</div>
              <div className="text-sm text-gray-500">Executive KPI Dashboard</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                Last updated: {latestWeek}
              </div>
              <button
                onClick={() => { sessionStorage.removeItem('rbn-kpi-auth'); setAuthed(false) }}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                Sign out
              </button>
            </div>
          </div>
          {/* Nav */}
          <div className="flex items-center justify-between pb-3 -mb-px">
            <nav className="flex gap-1">
              {NAV.map(n => (
                <button
                  key={n.key}
                  onClick={() => setSection(n.key)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    section === n.key
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </nav>
            <DateRangeFilter value={range} onChange={setRange} />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {section === 'summary' && (
          <ExecutiveSummary funnelData={filteredFunnel} financialData={filteredFinancial} />
        )}
        {section === 'funnel' && <FunnelPipeline data={filteredFunnel} />}
        {section === 'financial' && <FinancialKPIs data={filteredFinancial} />}
      </main>
    </div>
  )
}
