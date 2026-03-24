export interface FunnelStage {
  buy: number
  buyValue: number
  sell: number
  sellValue: number
}

export interface FunnelWeek {
  week: string
  newLeads: { total: number; totalValue: number } & FunnelStage
  apptScheduled: FunnelStage
  matching: FunnelStage
  connecting: FunnelStage
  connected: FunnelStage
  inEscrow: FunnelStage
  paymentReceived: FunnelStage
}

export interface ScorecardWeek {
  week: string
  newLeads: number
  referrals: number | null
  reValueAdded: number
  consultsScheduled: number
  consultsCompleted: number | null
  matchedConsumers: number | null
  timeToMatch: number | null
  connectedConsumers: number | null
  agentsConvertedPct: number | null
  newInEscrow: number
  referralFees: number
  customerSatisfaction: number | null
}

export interface FinancialWeek {
  week: string
  referralFees: number
  cumReferralFees: number
  weeklyRevenue: number
  weeklyAdSpend: number
}
