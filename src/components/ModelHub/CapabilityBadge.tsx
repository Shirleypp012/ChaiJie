import { 
  Languages, Image, Layers, Sparkles, UserCheck, 
  PackageCheck, Film, Wand2, Maximize2 
} from 'lucide-react';

interface CapabilityBadgeProps {
  capability: string;
  size?: 'sm' | 'md';
}

export default function CapabilityBadge({ capability, size = 'md' }: CapabilityBadgeProps) {
  const getIcon = (cap: string) => {
    if (cap.includes('中文') || cap.includes('英文')) return Languages;
    if (cap.includes('编辑') || cap.includes('重绘')) return Wand2;
    if (cap.includes('背景') || cap.includes('替换')) return Layers;
    if (cap.includes('人物')) return UserCheck;
    if (cap.includes('商品')) return PackageCheck;
    if (cap.includes('视频') || cap.includes('长')) return Film;
    if (cap.includes('超清') || cap.includes('4K')) return Maximize2;
    return Sparkles;
  };

  const IconComp = getIcon(capability);

  const paddingClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-[11px]';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all bg-neutral-50/80 dark:bg-white/[0.04] border-neutral-200/80 dark:border-white/10 text-neutral-700 dark:text-neutral-300 ${paddingClass}`}>
      <IconComp className="w-3 h-3 text-neutral-500 dark:text-violet-400 shrink-0" />
      <span>{capability}</span>
    </span>
  );
}
