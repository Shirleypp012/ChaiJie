import { motion } from 'motion/react';
import { MetricItem } from '../types';
import { Flame, Gauge, Star, BarChart2 } from 'lucide-react';

interface ScoreCardsProps {
  score: number;
  metrics: MetricItem[];
  platform: string;
}

export default function ScoreCards({ score, metrics, platform }: ScoreCardsProps) {
  // Determine score label based on score value
  const getScoreLabel = (s: number) => {
    if (s >= 95) return '殿堂级内容（超级爆款预测）';
    if (s >= 90) return '高转化爆款（高转化与完播）';
    return '标准优选内容';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" id="scoreboard-root">
      {/* 1. Giant Score Circle (Left) */}
      <div className="lg:col-span-1 rounded-3xl p-8 bg-white dark:bg-slate-950/40 dark:backdrop-blur-[24px] border border-neutral-200/80 dark:border-white/5 shadow-sm dark:shadow-[0_0_30px_rgba(139,92,246,0.1)] flex flex-col items-center justify-center text-center relative overflow-hidden group" id="viral-score-card">
        {/* Subtle ambient blur light behind inside the card */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 dark:opacity-100 pointer-events-none transition-all duration-500" />
        
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 dark:text-neutral-400 font-mono mb-6 bg-neutral-50 dark:bg-white/5 px-3.5 py-1.5 rounded-full border border-neutral-200 dark:border-white/5">
          <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <span>逆向爆款指数</span>
        </div>

        {/* Circular Ring Score */}
        <div className="relative w-44 h-44 flex items-center justify-center mb-6" id="circle-score-wrapper">
          {/* Background circle track */}
          <svg className="w-full h-full transform -rotate-90">
            <defs>
              <linearGradient id="score-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <circle
              cx="88"
              cy="88"
              r="76"
              className="stroke-neutral-100 dark:stroke-white/5 fill-none"
              strokeWidth="8"
            />
            {/* Animated foreground circle */}
            <motion.circle
              cx="88"
              cy="88"
              r="76"
              className="stroke-neutral-900 dark:stroke-[url(#score-grad)] fill-none"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 76}
              initial={{ strokeDashoffset: 2 * Math.PI * 76 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 76 * (1 - score / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>

          {/* Score Text with Glow */}
          <div className="absolute flex flex-col items-center">
            <motion.span 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-5xl font-bold font-mono tracking-tighter text-neutral-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-violet-400 dark:to-blue-400 dark:drop-shadow-[0_0_15px_rgba(139,92,246,0.35)]"
            >
              {score}
            </motion.span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">/ 100 分</span>
          </div>
        </div>

        <div className="space-y-1 z-10">
          <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{getScoreLabel(score)}</h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">
            通过 5 大核心维度评估，该视频在{platform}渠道的转化效率超过 95% 的同品类内容。
          </p>
        </div>
      </div>

      {/* 2. Detailed Dimension Bars (Right 2-columns) */}
      <div className="lg:col-span-2 rounded-3xl p-8 bg-white dark:bg-slate-950/40 dark:backdrop-blur-[24px] border border-neutral-200/80 dark:border-white/5 shadow-sm dark:shadow-[0_0_30px_rgba(139,92,246,0.1)] flex flex-col justify-between" id="metrics-bars-card">
        <div>
          <div className="flex items-center justify-between mb-6 border-b border-neutral-200 dark:border-white/5 pb-4">
            <h3 className="text-sm font-semibold tracking-wider text-neutral-800 dark:text-neutral-100 uppercase flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-neutral-900 dark:text-violet-400" />
              爆款转化多维评估指标
            </h3>
            <span className="text-xs text-neutral-400 font-mono">维度评分与核心推力</span>
          </div>

          <div className="space-y-6" id="metrics-progress-container">
            {metrics.map((metric, idx) => (
              <div key={metric.name} className="space-y-2" id={`metric-row-${idx}`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-violet-500" />
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">{metric.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-neutral-900 dark:text-violet-400 font-mono">{metric.score}</span>
                    <span className="text-neutral-400 dark:text-neutral-500 text-[10px]">/100</span>
                  </div>
                </div>

                {/* Progress bar container */}
                <div className="h-2 w-full bg-neutral-100 dark:bg-white/5 rounded-full overflow-hidden border border-neutral-200/50 dark:border-white/5 relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-neutral-600 to-neutral-900 dark:from-violet-500 dark:to-cyan-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ duration: 1.2, delay: idx * 0.1, ease: 'easeOut' }}
                  />
                </div>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed pl-3.5">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic system check info at the bottom */}
        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-white/5 flex items-center justify-between text-[10px] text-neutral-400 dark:text-neutral-500 font-mono" id="metrics-footer">
          <div className="flex items-center gap-1">
            <Gauge className="w-3 h-3 text-neutral-800 dark:text-neutral-400" />
            <span>BUV 逆向推理引擎 (BUV REVERSE-ENGINE v0.1)</span>
          </div>
          <span>算法置信度 (ALGORITHM CONFIDENCE): 98.4%</span>
        </div>
      </div>
    </div>
  );
}
