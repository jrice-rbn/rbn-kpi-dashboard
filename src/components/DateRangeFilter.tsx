interface DateRangeFilterProps {
  value: string
  onChange: (value: string) => void
}

const OPTIONS = [
  { label: '13 Weeks', value: '13' },
  { label: '26 Weeks', value: '26' },
  { label: '52 Weeks', value: '52' },
  { label: 'YTD', value: 'ytd' },
  { label: 'All', value: 'all' },
]

export default function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {OPTIONS.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            value === opt.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
