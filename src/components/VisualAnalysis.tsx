import { motion } from 'motion/react';
import { VisualDetail } from '../types';
import { Layers, Eye, Sun, Palette, Grid } from 'lucide-react';

interface VisualAnalysisProps {
  visuals: VisualDetail[];
}

export default function VisualAnalysis({ visuals }: VisualAnalysisProps) {
  // Map icons to visual aspects
  const getAspectIcon = (aspect: string) => {
    switch (aspect) {
      case '景别':
        return <Layers className="w-4 h-4 text-neutral-800 dark:text-violet-400" />;
      case '运镜':
        return <Eye className="w-4 h-4 text-neutral-800 dark:text-violet-400" />;
      case '光影':
        return <Sun className="w-4 h-4 text-neutral-800 dark:text-violet-400" />;
      case '色彩':
        return <Palette className="w-4 h-4 text-neutral-800 dark:text-violet-400" />;
      case '构图':
        return <Grid className="w-4 h-4 text-neutral-800 dark:text-violet-400" />;
      default:
        return <Layers className="w-4 h-4 text-neutral-800 dark:text-violet-400" />;
    }
  };

  return (
    <div className="rounded-3xl p-8 bg-white dark:bg-slate-950/40 dark:backdrop-blur-[24px] border border-neutral-200/80 dark:border-white/5 shadow-sm dark:shadow-[0_0_30px_rgba(139,92,246,0.1)]" id="visuals-analysis-root">
      <div className="flex items-center justify-between mb-8 border-b border-neutral-200 dark:border-white/5 pb-4">
        <h3 className="text-sm font-semibold tracking-wider text-neutral-800 dark:text-white uppercase flex items-center gap-2">
          <Layers className="w-4 h-4 text-neutral-900 dark:text-violet-400" />
          电影级视觉美学参数解析 (Visual Aesthetics)
        </h3>
        <span className="text-xs text-neutral-400 font-mono">美感工程化特征解码</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6" id="visuals-bento-grid">
        {visuals.map((detail, index) => (
          <motion.div
            key={detail.aspect}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            className="rounded-2xl bg-neutral-50 hover:bg-neutral-100/50 dark:bg-white/[0.04] dark:backdrop-blur-[12px] border border-neutral-200 dark:border-white/5 p-5 flex flex-col justify-between group transition-all relative overflow-hidden shadow-sm hover:shadow-md dark:hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:-translate-y-0.5"
            id={`visual-aspect-${index}`}
          >
            <div>
              {/* Aspect Header */}
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-4 border-b border-neutral-200 dark:border-white/5 pb-2">
                {getAspectIcon(detail.aspect)}
                <span>{detail.aspect}</span>
              </div>

              {/* Sub-label */}
              <span className="text-[10px] text-neutral-800 dark:text-neutral-300 font-mono uppercase bg-neutral-200/60 dark:bg-white/5 border border-neutral-300 dark:border-white/5 px-2 py-0.5 rounded">
                {detail.label}
              </span>

              {/* Value Title */}
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mt-3 mb-2 leading-tight">
                {detail.value}
              </h4>
            </div>

            {/* Paragraph explanation */}
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mt-4">
              {detail.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
