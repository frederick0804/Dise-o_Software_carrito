interface AlertProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose?: () => void;
}

const styles = {
  error:   'bg-rose-50 border-rose-200 text-rose-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  info:    'bg-sky-50 border-sky-200 text-sky-800',
};

const icons = { error: '⚠', success: '✓', info: 'ℹ' };

export function Alert({ message, type = 'error', onClose }: AlertProps) {
  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles[type]}`}>
      <span className="mt-0.5 shrink-0 font-semibold">{icons[type]}</span>
      <span className="flex-1">{message}</span>
      {onClose && (
        <button onClick={onClose} className="shrink-0 text-lg opacity-50 hover:opacity-100 transition leading-none font-bold">
          ×
        </button>
      )}
    </div>
  );
}
