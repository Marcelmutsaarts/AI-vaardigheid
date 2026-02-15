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

  // Darker text colors for WCAG AA contrast on light backgrounds
  const textColor = mod.letter === 'K' ? '#581c87'
    : mod.letter === 'I' ? '#4c1d95'
    : mod.letter === 'E' ? '#3b0764'
    : '#3b0764'

  return (
    <div
      data-testid="context-banner"
      className="rounded-lg px-4 py-3 mb-6"
      style={{ backgroundColor: letterColor.light }}
    >
      <p className="text-sm" style={{ color: textColor }}>
        <strong>Doel:</strong> {doel}
      </p>
      <p className="text-sm mt-1 opacity-90" style={{ color: textColor }}>
        <strong>Actie:</strong> {actie}
      </p>
    </div>
  )
}
