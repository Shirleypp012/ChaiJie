import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Sparkles, RefreshCw, Eye } from 'lucide-react';

interface AnalyzingStateProps {
  onComplete: () => void;
  videoName: string;
}

const mockSteps = [
  '正在初始化 BUV AI 视频深度学习引擎 v0.1-beta...',
  '检测文件源格式与视频帧速率 (1080p, 60fps)...',
  '正在读取视频全局色调分布与色卡检测...',
  '正在解码每一帧镜头并提取关键帧特征点...',
  '【镜头解构】已识别 5 个转场锚点及 120 帧升格慢动作...',
  '【人脸与皮肤识别】正在追踪博主面色红度(a*)与黄度(b*)变化...',
  '【感官通感度量】检测到“刨冰质地/化水”强解压物理视觉特征...',
  '【ASMR声频分析】捕捉碎冰爆裂音与微流白噪音，声强+12dB...',
  '【用户心理拟合】计算前3秒感官张力，跳出率预测：降低40%...',
  '【痛点匹配】提取核心词：冷感、早八、黄皮、脱妆、粘口罩...',
  '【内容复刻训练】Midjourney 图像引擎与 Sora 视频重建引擎初始化...',
  '【运营文案克隆】结合小红书爆款文案指数，生成转化驱动流...',
  '报告生成就绪，正在导出《爆款内容逆向工程分析报告》...'
];

export default function AnalyzingState({ onComplete, videoName }: AnalyzingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Increment progress bar smoothly
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 45); // 4.5 seconds total

    // Output logs sequentially
    const logInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < mockSteps.length - 1) {
          const next = prev + 1;
          setLogs((l) => [...l, mockSteps[next]]);
          return next;
        } else {
          clearInterval(logInterval);
          return prev;
        }
      });
    }, 320);

    // Initial log
    setLogs([mockSteps[0]]);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
    };
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 800); // Small delay for UX satisfaction
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-4xl mx-auto p-8 rounded-3xl bg-white border border-neutral-200 text-neutral-800 relative overflow-hidden shadow-sm" id="analyzing-container">
      {/* Laser scan lines effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-100/50 to-transparent h-full w-full animate-pulse pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent animate-bounce" style={{ animationDuration: '4s' }} />

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Glow AI Core Orb */}
        <div className="relative mb-8 mt-4" id="ai-core-orb">
          <div className="absolute -inset-4 rounded-full bg-neutral-100 opacity-50 blur-xl animate-pulse" />
          <div className="w-20 h-20 rounded-full border border-neutral-200 bg-neutral-50 flex items-center justify-center relative">
            <Cpu className="w-9 h-9 text-neutral-800 animate-spin" style={{ animationDuration: '8s' }} />
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-neutral-900 rounded-full flex items-center justify-center border border-white">
              <Sparkles className="w-3 h-3 text-white animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-medium tracking-tight text-neutral-900 mb-2" id="analyzing-title">
          BUV AI 正在逆向拆解爆款内容
        </h3>
        <p className="text-sm text-neutral-500 mb-6 font-mono text-center max-w-md truncate" id="analyzing-subtitle">
          源文件: <span className="text-neutral-900 font-semibold">{videoName}</span>
        </p>

        {/* Custom Progress Bar */}
        <div className="w-full max-w-md bg-neutral-100 h-1.5 rounded-full overflow-hidden mb-8 border border-neutral-200/50 relative" id="analyzing-progress-wrapper">
          <motion.div
            className="h-full bg-neutral-900 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'linear' }}
          />
          <div className="absolute top-2 right-0 text-xs font-mono text-neutral-800 mt-1">
            {progress}%
          </div>
        </div>

        {/* Dynamic Log Console */}
        <div className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-6 font-mono text-left max-h-[260px] overflow-y-auto shadow-inner custom-scrollbar relative" id="analyzing-console">
          <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-widest bg-white px-2 py-0.5 rounded border border-neutral-200 shadow-sm">
            <RefreshCw className="w-2.5 h-2.5 animate-spin text-neutral-800" />
            实时解算中 (Live Processing)
          </div>
          <div className="space-y-2 text-xs">
            <AnimatePresence initial={false}>
              {logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-2 ${
                    index === logs.length - 1 ? 'text-neutral-900 font-bold' : 'text-neutral-500'
                  }`}
                >
                  <span className="text-neutral-400 select-none">[{String(index + 1).padStart(2, '0')}]</span>
                  <span className="break-all">{log}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {/* Automatic scroll marker */}
          <div className="h-2" ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
        </div>

        {/* Live scanning overlay indicators */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-md mt-8 pt-6 border-t border-neutral-200 text-center" id="analyzing-indicators">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">面部神经网</div>
            <div className="text-xs font-mono text-emerald-600 font-bold mt-1">✓ 已激活 (ACTIVATED)</div>
          </div>
          <div className="border-x border-neutral-200">
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">声学特征层</div>
            <div className="text-xs font-mono text-neutral-700 font-bold mt-1">✓ 已提取 (EXTRACTED)</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-neutral-400">心智匹配器</div>
            <div className="text-xs font-mono text-amber-600 font-bold mt-1">✓ 运行中 (RUNNING)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
