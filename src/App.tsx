import { useState, useMemo } from 'react'
import ExecutiveSummary from './components/ExecutiveSummary'
import FunnelPipeline from './components/FunnelPipeline'
import FinancialKPIs from './components/FinancialKPIs'
import WeeklyScorecard from './components/WeeklyScorecard'
import DateRangeFilter from './components/DateRangeFilter'
import funnelDataRaw from './data/funnel_data.json'
import scorecardDataRaw from './data/scorecard_data.json'
import financialDataRaw from './data/financial_data.json'
import type { FunnelWeek, ScorecardWeek, FinancialWeek } from './types'

const funnelData = funnelDataRaw as FunnelWeek[]
const scorecardData = scorecardDataRaw as ScorecardWeek[]
const financialData = financialDataRaw as FinancialWeek[]

type Section = 'summary' | 'funnel' | 'financial' | 'scorecard'

const NAV: { key: Section; label: string }[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'funnel', label: 'Deal Funnel' },
  { key: 'financial', label: 'Financial' },
  { key: 'scorecard', label: 'Scorecard' },
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

export default function App() {
  const [section, setSection] = useState<Section>('summary')
  const [range, setRange] = useState('26')

  const filteredFunnel = useMemo(() => filterByRange(funnelData, range), [range])
  const filteredScorecard = useMemo(() => filterByRange(scorecardData, range), [range])
  const filteredFinancial = useMemo(() => filterByRange(financialData, range), [range])

  const latestWeek = funnelData.length > 0 ? funnelData[funnelData.length - 1].week : 'N/A'

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
            <div className="text-sm text-gray-400">
              Last updated: {latestWeek}
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
        {section === 'scorecard' && <WeeklyScorecard data={filteredScorecard} />}
      </main>
    </div>
  )
}
