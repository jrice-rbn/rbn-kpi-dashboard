import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatCurrency, formatDate } from '../utils'
import type { FunnelWeek } from '../types'

interface Props {
  data: FunnelWeek[]
}

const STAGES = [
  { key: 'newLeads', label: 'New Leads', color: '#6366f1' },
  { key: 'apptScheduled', label: 'Appt Scheduled', color: '#8b5cf6' },
  { key: 'matching', label: 'Matching', color: '#a78bfa' },
  { key: 'connecting', label: 'Connecting', color: '#3b82f6' },
  { key: 'connected', label: 'Connected', color: '#06b6d4' },
  { key: 'inEscrow', label: 'In Escrow', color: '#f59e0b' },
  { key: 'paymentReceived', label: 'Payment Received', color: '#10b981' },
] as const

function stageTotal(w: FunnelWeek, key: string): number {
  if (key === 'newLeads') return w.newLeads.total
  const stage = w[key as keyof FunnelWeek] as { buy: number; sell: number }
  return stage.buy + stage.sell
}

function stageValue(w: FunnelWeek, key: string): number {
  if (key === 'newLeads') return w.newLeads.totalValue
  const stage = w[key as keyof FunnelWeek] as { buyValue: number; sellValue: number }
  return stage.buyValue + stage.sellValue
}

export default function FunnelPipeline({ data }: Props) {
  // Bar chart data — weekly new leads by buy/sell
  const barData = data.map(w => ({
    week: formatDate(w.week),
    fullWeek: w.week,
    Buy: w.newLeads.buy,
    Sell: w.newLeads.sell,
  }))

  // Funnel summary — totals across the filtered range
  const funnelTotals = STAGES.map(s => ({
    ...s,
    count: data.reduce((sum, w) => sum + stageTotal(w, s.key), 0),
    value: data.reduce((sum, w) => sum + stageValue(w, s.key), 0),
  }))

  const maxCount = Math.max(...funnelTotals.map(s => s.count), 1)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Deal Pipeline Funnel</h2>

      {/* Funnel visualization */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Funnel Summary (Selected Period)</h3>
        <div className="space-y-3">
          {funnelTotals.map(stage => (
            <div key={stage.key} className="flex items-center gap-3">
              <div className="w-36 text-sm font-medium text-gray-700 shrink-0">{stage.label}</div>
              <div className="flex-1 relative">
                <div
                  className="h-8 rounded-md flex items-center px-3 text-white text-sm font-semibold"
                  style={{
                    width: `${Math.max((stage.count / maxCount) * 100, 8)}%`,
                    backgroundColor: stage.color,
                  }}
                >
                  {stage.count}
                </div>
              </div>
              <div className="w-28 text-right text-sm text-gray-500 shrink-0">
                {formatCurrency(stage.value, true)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly new leads bar chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Weekly New Leads (Buy vs Sell)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} interval={Math.max(Math.floor(data.length / 12) - 1, 0)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Buy" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Sell" stackId="a" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly detail table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-600 p-5 pb-3">Weekly Detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-2 font-semibold text-gray-600">Week</th>
                {STAGES.map(s => (
                  <th key={s.key} className="text-right px-4 py-2 font-semibold text-gray-600">{s.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().slice(0, 26).map(w => (
                <tr key={w.week} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium text-gray-800">{formatDate(w.week)}</td>
                  {STAGES.map(s => (
                    <td key={s.key} className="text-right px-4 py-2 text-gray-600">
                      {stageTotal(w, s.key)}
                      <span className="text-gray-400 text-xs ml-1">
                        ({formatCurrency(stageValue(w, s.key), true)})
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
