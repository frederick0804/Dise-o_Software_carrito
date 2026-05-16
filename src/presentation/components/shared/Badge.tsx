interface BadgeProps {
  label: string;
  color?: 'green' | 'red' | 'yellow' | 'blue' | 'gray' | 'violet' | 'teal';
}

const styles: Record<NonNullable<BadgeProps['color']>, string> = {
  green:  'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200',
  red:    'bg-rose-100 text-rose-700 ring-1 ring-rose-200',
  yellow: 'bg-amber-100 text-amber-700 ring-1 ring-amber-200',
  blue:   'bg-sky-100 text-sky-700 ring-1 ring-sky-200',
  violet: 'bg-violet-100 text-violet-700 ring-1 ring-violet-200',
  teal:   'bg-teal-100 text-teal-700 ring-1 ring-teal-200',
  gray:   'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

export function Badge({ label, color = 'gray' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[color]}`}>
      {label}
    </span>
  );
}
