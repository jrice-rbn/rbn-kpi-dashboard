import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatCurrency, formatDate } from '../utils'
import type { FunnelWeek } from '../types'

interface Props {
  data: FunnelWeek[]
}

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
  const interval = Math.max(Math.floor(data.length / 12) - 1, 0)

  // New leads (buy vs sell)
  const leadsData = data.map(w => ({
    week: formatDate(w.week),
    Buy: w.newLeads.buy,
    Sell: w.newLeads.sell,
  }))

  // Pipeline value over time
  const valueData = data.map(w => ({
    week: formatDate(w.week),
    'New Leads': w.newLeads.totalValue,
    'Appt Scheduled': stageValue(w, 'apptScheduled'),
    'In Escrow': stageValue(w, 'inEscrow'),
    'Payment Received': stageValue(w, 'paymentReceived'),
  }))

  // Stage counts over time
  const stageData = data.map(w => ({
    week: formatDate(w.week),
    'Appt Scheduled': stageTotal(w, 'apptScheduled'),
    Matching: stageTotal(w, 'matching'),
    Connecting: stageTotal(w, 'connecting'),
    Connected: stageTotal(w, 'connected'),
    'In Escrow': stageTotal(w, 'inEscrow'),
    'Payment Received': stageTotal(w, 'paymentReceived'),
  }))

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Deal Pipeline Trends</h2>

      {/* Weekly new leads bar chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Weekly New Leads (Buy vs Sell)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leadsData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} interval={interval} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Buy" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Sell" stackId="a" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline stage counts over time */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Weekly Stage Activity</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stageData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} interval={interval} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Appt Scheduled" stroke="#8b5cf6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Matching" stroke="#a78bfa" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Connecting" stroke="#3b82f6" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Connected" stroke="#06b6d4" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="In Escrow" stroke="#f59e0b" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Payment Received" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline value over time */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Weekly Pipeline Value ($)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={valueData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} interval={interval} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v) => formatCurrency(Number(v))} />
              <Legend />
              <Bar dataKey="New Leads" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Appt Scheduled" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="In Escrow" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Payment Received" fill="#10b981" radius={[4, 4, 0, 0]} />
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
                <th className="text-right px-4 py-2 font-semibold text-gray-600">New Leads</th>
                <th className="text-right px-4 py-2 font-semibold text-gray-600">Appt Sched</th>
                <th className="text-right px-4 py-2 font-semibold text-gray-600">Matching</th>
                <th className="text-right px-4 py-2 font-semibold text-gray-600">Connecting</th>
                <th className="text-right px-4 py-2 font-semibold text-gray-600">Connected</th>
                <th className="text-right px-4 py-2 font-semibold text-gray-600">In Escrow</th>
                <th className="text-right px-4 py-2 font-semibold text-gray-600">Pmt Rec'd</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().slice(0, 26).map(w => {
                const stages = ['newLeads', 'apptScheduled', 'matching', 'connecting', 'connected', 'inEscrow', 'paymentReceived']
                return (
                  <tr key={w.week} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-800">{formatDate(w.week)}</td>
                    {stages.map(s => (
                      <td key={s} className="text-right px-4 py-2 text-gray-600">
                        {stageTotal(w, s)}
                        <span className="text-gray-400 text-xs ml-1">
                          ({formatCurrency(stageValue(w, s), true)})
                        </span>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
