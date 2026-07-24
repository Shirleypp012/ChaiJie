import { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'connected' | 'pending' | 'failed';
  onRetest?: () => void;
  showRetestButton?: boolean;
}

export default function StatusBadge({ status, onRetest, showRetestButton = true }: StatusBadgeProps) {
  const [isRetesting, setIsRetesting] = useState(false);

  const handleRetestClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRetesting(true);
    if (onRetest) {
      onRetest();
    }
    setTimeout(() => {
      setIsRetesting(false);
    }, 1200);
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          bg: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/80 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300',
          dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse',
          icon: CheckCircle2,
          text: '已连接'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/80 dark:border-amber-500/30 text-amber-700 dark:text-amber-300',
          dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]',
          icon: AlertTriangle,
          text: '待配置'
        };
      case 'failed':
      default:
        return {
          bg: 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200/80 dark:border-rose-500/30 text-rose-700 dark:text-rose-300',
          dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]',
          icon: XCircle,
          text: '连接失败'
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <div className="flex items-center gap-1.5 shrink-0" id="status-badge-wrapper">
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-sm transition-all ${config.bg}`}>
        <span className={`w-2 h-2 rounded-full ${config.dot}`} />
        <IconComponent className="w-3 h-3" />
        <span>{config.text}</span>
      </span>

      {showRetestButton && (
        <button
          onClick={handleRetestClick}
          disabled={isRetesting}
          title="重新检测接口连通性"
          className="p-1 rounded-lg border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetesting ? 'animate-spin text-violet-500' : ''}`} />
        </button>
      )}
    </div>
  );
}
