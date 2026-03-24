import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area,
} from 'recharts'
import { formatCurrency, formatDate } from '../utils'
import type { FinancialWeek } from '../types'

interface Props {
  data: FinancialWeek[]
}

export default function FinancialKPIs({ data }: Props) {
  const chartData = data.map(w => ({
    week: formatDate(w.week),
    referralFees: w.referralFees,
    cumFees: w.cumReferralFees,
    revenue: w.weeklyRevenue,
    adSpend: w.weeklyAdSpend,
  }))

  const latestCum = data.length > 0 ? data[data.length - 1].cumReferralFees : 0
  const totalFees = data.reduce((s, w) => s + w.referralFees, 0)
  const avgWeeklyFees = data.length > 0 ? totalFees / data.length : 0

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Revenue & Financial</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-500">Cumulative Referral Fees</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(latestCum, true)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-500">Total Period Fees</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalFees, true)}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm font-medium text-gray-500">Avg Weekly Fees</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(avgWeeklyFees)}</div>
        </div>
      </div>

      {/* Cumulative referral fees */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-600 mb-4">Cumulative Referral Fees</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} interval={Math.max(Math.floor(data.length / 10) - 1, 0)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="cumFees" fill="#d1fae5" stroke="#10b981" strokeWidth={2} name="Cumulative" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly referral fees + revenue vs ad spend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Weekly Referral Fees</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} interval={Math.max(Math.floor(data.length / 8) - 1, 0)} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Bar dataKey="referralFees" fill="#10b981" name="Referral Fees" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-600 mb-4">Revenue vs Ad Spend</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" tick={{ fontSize: 10 }} interval={Math.max(Math.floor(data.length / 8) - 1, 0)} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} dot={false} name="Revenue" />
                <Line type="monotone" dataKey="adSpend" stroke="#ef4444" strokeWidth={2} dot={false} name="Ad Spend" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
