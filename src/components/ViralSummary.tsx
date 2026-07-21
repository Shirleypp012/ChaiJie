import { motion } from 'motion/react';
import { Compass, Lightbulb, UserCheck } from 'lucide-react';

interface ViralSummaryProps {
  summary: string[];
}

export default function ViralSummary({ summary }: ViralSummaryProps) {
  const icons = [
    <Lightbulb className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />,
    <Compass className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />,
    <UserCheck className="w-5 h-5 text-neutral-800 shrink-0 mt-0.5" />
  ];

  return (
    <div className="rounded-3xl p-8 bg-white border border-neutral-200/80 shadow-sm" id="viral-summary-root">
      <div className="flex items-center justify-between mb-8 border-b border-neutral-200 pb-4">
        <h3 className="text-sm font-semibold tracking-wider text-neutral-800 uppercase flex items-center gap-2">
          <Compass className="w-4 h-4 text-neutral-800" />
          爆款视频逻辑逆向总结 (Executive Strategy Summary)
        </h3>
        <span className="text-xs text-neutral-400 font-mono">AI 核心见解归纳</span>
      </div>

      <div className="space-y-6" id="viral-summary-list">
        {summary.map((para, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-start gap-4 p-5 rounded-2xl bg-neutral-50 border border-neutral-200 hover:bg-neutral-100/50 transition-colors"
            id={`summary-para-${index}`}
          >
            {icons[index % icons.length]}
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-wider font-mono text-neutral-400">
                爆款核心推力 {index + 1} (Strategy Insight)
              </span>
              <p className="text-sm text-neutral-700 leading-relaxed font-light">
                {para}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
