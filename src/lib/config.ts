export const PAGE_SIZE = 21
export const MAX_WATCH_COMPARE = 2

export function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    '001': 'bg-red-500/30 text-foreground/80',
    '002': 'bg-blue-500/30 text-foreground/80',
    '003': 'bg-green-500/30 text-foreground/80',
    '004': 'bg-yellow-500/30 text-foreground/80',
    '005': 'bg-purple-500/30 text-foreground/80',
    '006': 'bg-pink-500/30 text-foreground/80',
    '007': 'bg-indigo-500/30 text-foreground/80',
    '008': 'bg-orange-500/30 text-foreground/80',
    '009': 'bg-teal-500/30 text-foreground/80',
    '010': 'bg-cyan-500/30 text-foreground/80',
    '011': 'bg-lime-500/30 text-foreground/80',
    '012': 'bg-rose-500/30 text-foreground/80',
    '013': 'bg-fuchsia-500/30 text-foreground/80',
    '014': 'bg-violet-500/30 text-foreground/80',
    '015': 'bg-amber-500/30 text-foreground/80',
    '016': 'bg-gray-500/30 text-foreground/80',
  }

  return colors[type] || 'bg-gray-200 text-foreground/80'
}
