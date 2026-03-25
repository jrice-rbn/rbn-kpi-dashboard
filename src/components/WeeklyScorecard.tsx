import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import { formatCurrency, formatDate } from '../utils'
import type { ScorecardWeek } from '../types'

interface Props {
  data: ScorecardWeek[]
}

export default function WeeklyScorecard({ data }: Props) {
  const chartData = data.map(w => ({
    week: formatDate(w.week),
    newLeads: w.newLeads,
    referrals: w.referrals,
    consultsScheduled: w.consultsScheduled,
    consultsCompleted: w.consultsCompleted,
    matchedConsumers: w.matchedConsumers,
    timeToMatch: w.timeToMatch,
    connectedConsumers: w.connectedConsumers,
    newInEscrow: w.newInEscrow,
    referralFees: w.referralFees,
  }))

  const interval = Math.max(Math.floor(data.length / 10) - 1, 0)

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Weekly Scorecard</h2>

      {/* Leads & Consults */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">New Leads & Referrals</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} interval={interval} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="newLeads" fill="#6366f1" name="New Leads" radius={[4, 4, 0, 0]} />
                <Bar dataKey="referrals" fill="#a78bfa" name="Referrals" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Consults Scheduled vs Completed</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} interval={interval} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="consultsScheduled" stroke="#3b82f6" strokeWidth={2} dot={false} name="Scheduled" />
                <Line type="monotone" dataKey="consultsCompleted" stroke="#10b981" strokeWidth={2} dot={false} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Matching & Connecting */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Matched & Connected Consumers</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} interval={interval} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="matchedConsumers" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Matched" connectNulls />
                <Line type="monotone" dataKey="connectedConsumers" stroke="#ec4899" strokeWidth={2} dot={false} name="Connected" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Time to Match (Days)</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} interval={interval} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="timeToMatch" stroke="#f59e0b" strokeWidth={2} dot={false} name="Days to Match" connectNulls />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Escrow & Fees */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">New In Escrow</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} interval={interval} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="newInEscrow" fill="#f59e0b" name="In Escrow" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Weekly Referral Fees</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} interval={interval} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                <Bar dataKey="referralFees" fill="#10b981" name="Referral Fees" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detail table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <h3 className="text-sm font-semibold text-gray-600 p-5 pb-3">Scorecard Detail</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-3 py-2 font-semibold text-gray-600">Week</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Leads</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Referrals</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Sched</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Comp</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Matched</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Days</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Connected</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Escrow</th>
                <th className="text-right px-3 py-2 font-semibold text-gray-600">Fees</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map(w => (
                <tr key={w.week} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">{formatDate(w.week)}</td>
                  <td className="text-right px-3 py-2 text-gray-600">{w.newLeads}</td>
                  <td className="text-right px-3 py-2 text-gray-600">{w.referrals ?? '-'}</td>
                  <td className="text-right px-3 py-2 text-gray-600">{w.consultsScheduled}</td>
                  <td className="text-right px-3 py-2 text-gray-600">{w.consultsCompleted ?? '-'}</td>
                  <td className="text-right px-3 py-2 text-gray-600">{w.matchedConsumers ?? '-'}</td>
                  <td className="text-right px-3 py-2 text-gray-600">{w.timeToMatch ?? '-'}</td>
                  <td className="text-right px-3 py-2 text-gray-600">{w.connectedConsumers ?? '-'}</td>
                  <td className="text-right px-3 py-2 text-gray-600">{w.newInEscrow}</td>
                  <td className="text-right px-3 py-2 text-gray-600">{formatCurrency(w.referralFees)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
