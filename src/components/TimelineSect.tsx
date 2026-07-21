import { motion } from 'motion/react';
import { TimelineFrame } from '../types';
import { Eye, Clock, User, Sparkles, Video } from 'lucide-react';

interface TimelineSectProps {
  timeline: TimelineFrame[];
}

export default function TimelineSect({ timeline }: TimelineSectProps) {
  // Label style dictionary for timeline types
  const typeStyles = {
    hook: { label: '感官钩子 (Hook)', bg: 'bg-rose-50 border-rose-200 text-rose-700' },
    painpoint: { label: '痛点触达 (Painpoint)', bg: 'bg-amber-50 border-amber-200 text-amber-700' },
    product: { label: '核心卖点 (Product)', bg: 'bg-blue-50 border-blue-200 text-blue-700' },
    proof: { label: '公信力验证 (Proof)', bg: 'bg-purple-50 border-purple-200 text-purple-700' },
    cta: { label: '行动诱导 (CTA)', bg: 'bg-emerald-50 border-emerald-200 text-emerald-700' }
  };

  return (
    <div className="rounded-3xl p-8 bg-white border border-neutral-200/80 shadow-sm" id="timeline-sect-root">
      <div className="flex items-center justify-between mb-8 border-b border-neutral-200 pb-4">
        <h3 className="text-sm font-semibold tracking-wider text-neutral-800 uppercase flex items-center gap-2">
          <Clock className="w-4 h-4 text-neutral-900 animate-pulse" />
          全视频镜头深度拆解时间线 (Timeline Breakdown)
        </h3>
        <span className="text-xs text-neutral-400 font-mono">帧对齐精细粒度解析</span>
      </div>

      <div className="relative border-l border-neutral-200 pl-6 ml-4 md:ml-6 space-y-12" id="vertical-timeline-rail">
        {timeline.map((frame, index) => {
          const typeStyle = typeStyles[frame.type];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
              id={`timeline-node-${index}`}
            >
              {/* Timeline dot */}
              <div className="absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center shadow-sm" id={`dot-${index}`}>
                <div className="w-2 h-2 rounded-full bg-neutral-900 animate-pulse" />
              </div>

              {/* Box container */}
              <div className="p-6 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-all duration-300 shadow-sm">
                {/* Frame Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold font-mono text-neutral-900 bg-neutral-100 px-3 py-1 rounded-lg border border-neutral-200">
                      {frame.time}
                    </span>
                    <span className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${typeStyle.bg}`}>
                      {typeStyle.label}
                    </span>
                  </div>
                  <h4 className="text-sm font-medium text-neutral-900">{frame.title}</h4>
                </div>

                {/* Grid Content Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id={`grid-content-${index}`}>
                  {/* Left Column: Visuals & Camera */}
                  <div className="space-y-4">
                    {/* Visual Description */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-800 font-medium">
                        <Eye className="w-3.5 h-3.5 text-neutral-800" />
                        <span>画面内容与分镜</span>
                      </div>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed pl-5 border-l border-neutral-200">
                        {frame.visualContent}
                      </p>
                    </div>

                    {/* Camera language */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-800 font-medium">
                        <Video className="w-3.5 h-3.5 text-neutral-800" />
                        <span>镜头语言与运镜</span>
                      </div>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed pl-5 border-l border-neutral-200">
                        {frame.cameraLanguage}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: User Psychology & Viral Secret */}
                  <div className="space-y-4">
                    {/* User Psychology */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-800 font-medium">
                        <User className="w-3.5 h-3.5 text-neutral-800" />
                        <span>用户心智与接收心理</span>
                      </div>
                      <p className="text-xs text-neutral-600 font-light leading-relaxed pl-5 border-l border-neutral-200">
                        {frame.userPsychology}
                      </p>
                    </div>

                    {/* Viral Secret */}
                    <div className="space-y-1 bg-neutral-50 border border-neutral-200 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-900 font-semibold mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
                        <span>爆款逆向密码 (AI Analysis)</span>
                      </div>
                      <p className="text-xs text-neutral-700 font-light leading-relaxed">
                        {frame.viralSecret}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
