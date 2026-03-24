import { LineChart, Line } from 'recharts'

interface KPICardProps {
  title: string
  value: string
  change?: { value: number; label: string }
  sparkData?: { v: number }[]
  color?: string
}

export default function KPICard({ title, value, change, sparkData, color = '#6366f1' }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-2">
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {change && (
            <div className={`text-sm font-medium mt-1 ${change.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
              {change.label} vs prior week
            </div>
          )}
        </div>
        {sparkData && sparkData.length > 1 && (
          <div style={{ width: 96, height: 40 }}>
            <LineChart width={96} height={40} data={sparkData}>
              <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
            </LineChart>
          </div>
        )}
      </div>
    </div>
  )
}
