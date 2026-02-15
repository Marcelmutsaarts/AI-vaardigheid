import { getModuleById, getLetterColor } from '@/lib/learning-path'

interface ContextBannerProps {
  moduleId: string;
  customDoel?: string;
  customActie?: string;
}

export function ContextBanner({ moduleId, customDoel, customActie }: ContextBannerProps) {
  const mod = getModuleById(moduleId)
  if (!mod) return null

  const letterColor = getLetterColor(mod.letter)
  const doel = customDoel ?? mod.doel
  const actie = customActie ?? mod.actie

  // Derive a darker text color from the letter color for readability
  // We use the bg color at reduced opacity via a darker shade approach
  const textColor = mod.letter === 'K' ? '#6b21a8'
    : mod.letter === 'I' ? '#5b21b6'
    : mod.letter === 'E' ? '#4c1d95'
    : '#4c1d95'

  return (
    <div
      data-testid="context-banner"
      className="rounded-lg px-4 py-3 mb-4"
      style={{ backgroundColor: letterColor.light }}
    >
      <p className="text-sm" style={{ color: textColor }}>
        <strong>Doel:</strong> {doel}
      </p>
      <p className="text-sm mt-1" style={{ color: textColor }}>
        <strong>Actie:</strong> {actie}
      </p>
    </div>
  )
}
