import KPICard from './KPICard'
import { formatCurrency, weekOverWeekChange } from '../utils'
import type { FunnelWeek } from '../types'
import type { FinancialWeek } from '../types'

interface Props {
  funnelData: FunnelWeek[]
  financialData: FinancialWeek[]
}

export default function ExecutiveSummary({ funnelData, financialData }: Props) {
  const recent = funnelData.slice(-13)
  const latest = recent[recent.length - 1]
  const prev = recent[recent.length - 2]

  const latestFinancial = financialData[financialData.length - 1]

  const totalPipelineValue = latest?.newLeads.totalValue ?? 0
  const prevPipelineValue = prev?.newLeads.totalValue ?? 0

  const totalLeads = latest?.newLeads.total ?? 0
  const prevLeads = prev?.newLeads.total ?? 0

  const inEscrowCount = latest ? latest.inEscrow.buy + latest.inEscrow.sell : 0
  const prevEscrowCount = prev ? prev.inEscrow.buy + prev.inEscrow.sell : 0

  const latestFees = latestFinancial?.referralFees ?? 0
  const prevFees = financialData.length >= 2 ? financialData[financialData.length - 2]?.referralFees ?? 0 : 0

  const cumFees = latestFinancial?.cumReferralFees ?? 0

  // Compute YTD referral fees from financial data
  const currentYear = latest ? new Date(latest.week + 'T00:00:00').getFullYear() : new Date().getFullYear()
  const ytdReferralFees = financialData
    .filter(w => new Date(w.week + 'T00:00:00').getFullYear() === currentYear)
    .reduce((sum, w) => sum + w.referralFees, 0)

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-gray-900">Executive Summary</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="New Leads (Latest Week)"
          value={String(totalLeads)}
          change={weekOverWeekChange(totalLeads, prevLeads)}
          sparkData={recent.map(w => ({ v: w.newLeads.total }))}
          color="#6366f1"
        />
        <KPICard
          title="Pipeline Value (Latest Week)"
          value={formatCurrency(totalPipelineValue, true)}
          change={weekOverWeekChange(totalPipelineValue, prevPipelineValue)}
          sparkData={recent.map(w => ({ v: w.newLeads.totalValue }))}
          color="#8b5cf6"
        />
        <KPICard
          title="Deals in Escrow (Latest Week)"
          value={String(inEscrowCount)}
          change={weekOverWeekChange(inEscrowCount, prevEscrowCount)}
          sparkData={recent.map(w => ({ v: w.inEscrow.buy + w.inEscrow.sell }))}
          color="#f59e0b"
        />
        <KPICard
          title="Cumulative Referral Fees"
          value={formatCurrency(cumFees, true)}
          sparkData={financialData.slice(-13).map(w => ({ v: w.cumReferralFees }))}
          color="#10b981"
        />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Weekly Referral Fees"
          value={formatCurrency(latestFees)}
          change={weekOverWeekChange(latestFees, prevFees)}
          sparkData={financialData.slice(-13).map(w => ({ v: w.referralFees }))}
          color="#10b981"
        />
        <KPICard
          title="YTD Referral Fees"
          value={formatCurrency(ytdReferralFees, true)}
          color="#059669"
        />
        <KPICard
          title="Appts Scheduled (Latest)"
          value={String(latest ? latest.apptScheduled.buy + latest.apptScheduled.sell : 0)}
          sparkData={recent.map(w => ({ v: w.apptScheduled.buy + w.apptScheduled.sell }))}
          color="#3b82f6"
        />
        <KPICard
          title="Connected (Latest)"
          value={String(latest ? latest.connected.buy + latest.connected.sell : 0)}
          sparkData={recent.map(w => ({ v: w.connected.buy + w.connected.sell }))}
          color="#ec4899"
        />
      </div>
    </div>
  )
}
