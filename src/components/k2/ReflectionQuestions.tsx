'use client'

export interface ReflectionValues {
  learning: number | null   // -1 | 0 | 1
  quality: number | null    // -1 | 0 | 1
  speed: number | null      // -1 | 0 | 1
}

interface ReflectionQuestionsProps {
  values: ReflectionValues
  onChange: (values: ReflectionValues) => void
}

interface RowConfig {
  key: keyof ReflectionValues
  prefix: string
  bold: string
  suffix: string
  options: { val: number; label: string }[]
}

const rows: RowConfig[] = [
  {
    key: 'learning',
    prefix: '...je ',
    bold: 'leren',
    suffix: '?',
    options: [
      { val: -1, label: 'Minder' },
      { val: 0, label: 'Evenveel' },
      { val: 1, label: 'Meer' },
    ],
  },
  {
    key: 'quality',
    prefix: '...de ',
    bold: 'kwaliteit',
    suffix: '?',
    options: [
      { val: -1, label: 'Lager' },
      { val: 0, label: 'Hetzelfde' },
      { val: 1, label: 'Hoger' },
    ],
  },
  {
    key: 'speed',
    prefix: '...de ',
    bold: 'snelheid',
    suffix: '?',
    options: [
      { val: -1, label: 'Langzamer' },
      { val: 0, label: 'Hetzelfde' },
      { val: 1, label: 'Sneller' },
    ],
  },
]

export function ReflectionQuestions({ values, onChange }: ReflectionQuestionsProps) {
  const handleSelect = (key: keyof ReflectionValues, val: number) => {
    onChange({ ...values, [key]: val })
  }

  return (
    <div>
      <p className="text-gray-600 font-medium mb-3">Wat doet deze aanpak met...</p>

      <div className="bg-white rounded-xl border border-gray-200 p-4">
        {rows.map((row, index) => (
          <div
            key={row.key}
            className={`flex items-center justify-between py-4${
              index < rows.length - 1 ? ' border-b border-gray-100' : ''
            }`}
          >
            <span className="text-gray-700">
              {row.prefix}<strong>{row.bold}</strong>{row.suffix}
            </span>

            <div className="flex gap-2">
              {row.options.map((opt) => {
                const isSelected = values[row.key] === opt.val
                return (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => handleSelect(row.key, opt.val)}
                    className={
                      isSelected
                        ? 'bg-purple-500 text-white rounded-full px-4 py-2 text-sm border border-purple-500 cursor-pointer transition-colors'
                        : 'bg-gray-100 text-gray-600 rounded-full px-4 py-2 text-sm border border-gray-200 hover:bg-gray-200 cursor-pointer transition-colors'
                    }
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReflectionQuestions
