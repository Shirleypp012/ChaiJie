import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, ChevronRight, Upload, Play, CheckCircle, 
  Sparkles, Image, Video, Scissors, Send, Cpu, Sliders, Check
} from 'lucide-react';

export interface CarouselStep {
  id: number;
  title: string;
  description: string;
  visualType: 'upload' | 'analysis' | 'creative' | 'image' | 'video' | 'edit' | 'export';
  badgeColor: string;
}

export default function FeatureCarousel() {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const steps: CarouselStep[] = [
    {
      id: 1,
      title: '上传爆款视频',
      description: '上传 MP4、MOV、WEBM 视频，或者直接粘贴抖音、小红书、B站链接。',
      visualType: 'upload',
      badgeColor: 'from-violet-500 to-indigo-500'
    },
    {
      id: 2,
      title: 'AI分析视频',
      description: '自动识别镜头、人物、产品、场景、节奏、爆款原因。',
      visualType: 'analysis',
      badgeColor: 'from-blue-500 to-cyan-500'
    },
    {
      id: 3,
      title: '生成创意方案',
      description: 'AI 自动生成图片提示词、视频提示词、营销策略。',
      visualType: 'creative',
      badgeColor: 'from-cyan-500 to-emerald-500'
    },
    {
      id: 4,
      title: '生成营销图片',
      description: '调用图片模型，自动生成营销素材。',
      visualType: 'image',
      badgeColor: 'from-violet-500 to-fuchsia-500'
    },
    {
      id: 5,
      title: '生成营销视频',
      description: '调用视频模型，自动生成广告视频。',
      visualType: 'video',
      badgeColor: 'from-fuchsia-500 to-pink-500'
    },
    {
      id: 6,
      title: '内容优化',
      description: '自动添加字幕、自动卡点、自动配乐、优化内容细节。',
      visualType: 'edit',
      badgeColor: 'from-pink-500 to-rose-500'
    },
    {
      id: 7,
      title: '导出运营素材',
      description: '自动生成：小红书、抖音、视频号运营内容。',
      visualType: 'export',
      badgeColor: 'from-rose-500 to-amber-500'
    }
  ];

  // Auto-play interval
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setCurrentStepIdx(idx => (idx + 1) % steps.length);
            return 0;
          }
          return prev + 1.25; // Speed for progress bar (approx 8 seconds per slide)
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleStepClick = (idx: number) => {
    setCurrentStepIdx(idx);
    setProgress(0);
    setIsPlaying(false); // Pause auto-play when user manually interacts
  };

  const handlePrev = () => {
    setCurrentStepIdx(idx => (idx === 0 ? steps.length - 1 : idx - 1));
    setProgress(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentStepIdx(idx => (idx === steps.length - 1 ? 0 : idx + 1));
    setProgress(0);
    setIsPlaying(false);
  };

  const currentStep = steps[currentStepIdx];

  return (
    <div className="w-full bg-white/65 dark:bg-neutral-900/60 backdrop-blur-[20px] rounded-[32px] border border-neutral-200/80 dark:border-neutral-800 p-6 sm:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_0_rgba(139,92,246,0.08)] hover:border-violet-300 dark:hover:border-violet-900/50 transition-all duration-500 relative overflow-hidden group" id="feature-carousel-root">
      
      {/* Decorative background glow behind the active card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-violet-500/5 via-blue-500/5 to-cyan-500/5 dark:from-violet-500/10 dark:via-cyan-500/10 dark:to-transparent rounded-full blur-3xl pointer-events-none transition-all duration-700" />

      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-4" id="carousel-header">
        <div className="text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-widest bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 border border-violet-100 dark:border-violet-900/50">
            <Sparkles className="w-3 h-3 animate-pulse" />
            AI 智能工作流流水线 (AI PIPELINE)
          </div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-50 mt-1.5 tracking-tight">
            极速爆款复刻 · 自动工业化链路
          </h3>
        </div>

        {/* Play/Pause controls and step fraction */}
        <div className="flex items-center gap-3 self-end md:self-auto" id="carousel-controls">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-[10px] uppercase font-mono px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-950/30 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all flex items-center gap-1"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-emerald-500 animate-ping' : 'bg-neutral-400'}`} />
            <span>{isPlaying ? '自动轮播中' : '已暂停轮播'}</span>
          </button>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={handlePrev}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono font-semibold px-2 text-neutral-500 dark:text-neutral-400">
              {currentStepIdx + 1} / {steps.length}
            </span>
            <button 
              onClick={handleNext}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Steps Indicator Dots / Labels Line */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-8" id="carousel-indicator-bar">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIdx;
          const isCompleted = idx < currentStepIdx;
          
          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(idx)}
              className="flex flex-col items-center gap-2 group/btn relative cursor-pointer outline-none focus:outline-none"
              id={`carousel-dot-btn-${step.id}`}
            >
              {/* Step label on top */}
              <span className={`hidden md:block text-[10px] font-mono tracking-tight transition-all duration-300 ${
                isActive 
                  ? 'text-violet-600 dark:text-violet-400 font-bold' 
                  : isCompleted 
                  ? 'text-emerald-600 dark:text-emerald-500' 
                  : 'text-neutral-400 group-hover/btn:text-neutral-600 dark:group-hover/btn:text-neutral-300'
              }`}>
                Step {step.id}
              </span>

              {/* Horizontal line progress pill / ring */}
              <div className="w-full h-2 rounded-full relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-700/50">
                {/* Active progress color bar */}
                {isActive && (
                  <motion.div 
                    layoutId="carousel-indicator-active"
                    className="absolute inset-0 bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500"
                    style={{
                      boxShadow: '0 0 10px rgba(139,92,246,0.6)'
                    }}
                  />
                )}
                
                {/* Completed step background is solid green */}
                {isCompleted && (
                  <div className="absolute inset-0 bg-emerald-500 dark:bg-emerald-600" />
                )}

                {/* Shimmer Breathing Animation for running steps if playing */}
                {isActive && isPlaying && (
                  <div className="absolute inset-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shimmer_1.5s_infinite] -translate-x-full" />
                )}
              </div>

              {/* Step name under progress pill */}
              <span className={`text-[9px] sm:text-[11px] font-medium leading-none text-center truncate max-w-full transition-all duration-300 ${
                isActive 
                  ? 'text-neutral-900 dark:text-white font-bold' 
                  : isCompleted 
                  ? 'text-emerald-600 dark:text-emerald-500' 
                  : 'text-neutral-400 group-hover/btn:text-neutral-600 dark:group-hover/btn:text-neutral-300'
              }`}>
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Feature Display Card with sliding and fade animations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="carousel-body-grid">
        
        {/* Left Side: Step Info Text */}
        <div className="lg:col-span-5 flex flex-col justify-between text-left space-y-4" id="carousel-info-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIdx}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <span className={`inline-block text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-md text-white bg-gradient-to-r ${currentStep.badgeColor} uppercase tracking-wider`}>
                  Step {currentStep.id} · {currentStep.title}
                </span>
                
                <h4 className="text-xl sm:text-2xl font-bold text-neutral-950 dark:text-neutral-50 tracking-tight leading-snug">
                  {currentStep.title}
                </h4>
                
                <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Step Highlights list to increase depth */}
              <div className="space-y-2 pt-2" id="step-highlights-list">
                {currentStep.visualType === 'upload' && (
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      <span>完美兼容 1080P/4K 高清 MP4 拍摄成片。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      <span>内置跨端解析，抖音/小红书链接极速秒解。</span>
                    </div>
                  </div>
                )}
                {currentStep.visualType === 'analysis' && (
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>美学解算：智能重构莫兰迪/奢美级滤镜色彩。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span>分镜追踪：全镜头景别、运镜、白噪音音效抓取。</span>
                    </div>
                  </div>
                )}
                {currentStep.visualType === 'creative' && (
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span>爆款逆向：自动提炼黄金3s前置吸睛钩子公式。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                      <span>营销分析：一键输出符合小红书审美的种草心智。</span>
                    </div>
                  </div>
                )}
                {currentStep.visualType === 'image' && (
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                      <span>高级材质：FLUX/Midjourney 生成媲美商业摄影主图。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500" />
                      <span>一键换肤：快速测试多种磨砂玻璃、水滴微距配景。</span>
                    </div>
                  </div>
                )}
                {currentStep.visualType === 'video' && (
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      <span>120帧升格：Sora/Runway 动力学渲染极细腻乳液特写。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                      <span>视觉一致：完美保留前序海报材质色调一致性。</span>
                    </div>
                  </div>
                )}
                {currentStep.visualType === 'edit' && (
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>ASMR 增强：自动剔除原片杂音并贴合高级背景音乐。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>智能字幕：自动完成中英双语对齐及情绪字幕效果。</span>
                    </div>
                  </div>
                )}
                {currentStep.visualType === 'export' && (
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>一键矩阵：自适应小红书表情排版与抖音文案。</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>高转化词：匹配当季美妆品类热点关键词及热评。</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Flowing Indicator Bar */}
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1 rounded-full overflow-hidden" id="carousel-progress-track">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-100 ease-linear shadow-[0_0_8px_#8b5cf6]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Right Side: Step Interactive Live Visual Mock Simulator */}
        <div className="lg:col-span-7 flex flex-col justify-center min-h-[300px]" id="carousel-visual-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStepIdx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full bg-neutral-50/50 dark:bg-neutral-950/40 border border-neutral-200/50 dark:border-neutral-800/80 rounded-2xl p-6 relative flex flex-col items-center justify-center text-center overflow-hidden"
              id={`carousel-visual-display-${currentStep.id}`}
            >
              
              {/* Step 1: Upload */}
              {currentStep.visualType === 'upload' && (
                <div className="space-y-4 w-full max-w-sm">
                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-violet-400 dark:hover:border-violet-600 p-8 rounded-2xl flex flex-col items-center justify-center transition-all bg-white dark:bg-neutral-900 group shadow-inner">
                    <div className="w-12 h-12 rounded-full bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-3 shadow">
                      <Upload className="w-6 h-6 animate-bounce" />
                    </div>
                    <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">正在拖拽视频文件...</span>
                    <span className="text-[10px] text-neutral-400 mt-1">支持 MP4, MOV, WEBM</span>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 p-2.5 rounded-xl shadow-sm">
                    <div className="w-14 h-10 rounded bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/20 to-indigo-500/10" />
                      <Play className="w-3.5 h-3.5 text-violet-600 fill-current" />
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-xs font-bold text-neutral-900 dark:text-white truncate">冰川爆水面霜_夏日降温.mp4</div>
                      <div className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Check className="w-2.5 h-2.5" /> 已成功解析视频链接 (94% 爆款指数)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Analysis */}
              {currentStep.visualType === 'analysis' && (
                <div className="w-full space-y-4">
                  {/* Miniature keyframes */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(k => (
                      <div key={k} className="aspect-video bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden relative shadow-sm group">
                        <div className="absolute inset-0 bg-neutral-200/50 dark:bg-neutral-800/80 animate-pulse" />
                        <span className="absolute bottom-1 left-1.5 text-[8px] font-mono font-bold text-white bg-black/60 px-1 rounded">00:0{k}</span>
                      </div>
                    ))}
                  </div>

                  {/* Shimmer analysis progress */}
                  <div className="space-y-2 p-4 bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-xl shadow-sm text-left">
                    <div className="flex items-center justify-between text-[10px] text-neutral-500">
                      <span className="font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-ping" />
                        实时解算中
                      </span>
                      <span className="font-mono">82% 已完成</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 w-[82%] animate-pulse" />
                    </div>
                    <div className="text-[9px] font-mono text-neutral-400 space-y-0.5">
                      <div>▶ [镜头构图检测] 75% 极细致局部微距景别检测完成</div>
                      <div>▶ [色彩比色测定] 肤色及莫兰迪色表(Morandi LUT)检测完毕</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Creative */}
              {currentStep.visualType === 'creative' && (
                <div className="w-full space-y-3 text-left">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 p-4 rounded-xl shadow-sm space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
                      <Cpu className="w-4 h-4 text-cyan-500" />
                      <span>爆款逆向文案及策略模型</span>
                    </div>
                    
                    <div className="space-y-1.5 text-[11px] text-neutral-600 dark:text-neutral-300">
                      <div className="p-2 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-150 dark:border-neutral-900">
                        <span className="font-bold text-rose-500 dark:text-rose-400 mr-1">【黄金3s吸睛钩子】</span> 
                        冰勺铲起晶莹啫喱面霜微距 + 刨冰破冰ASMR白噪音，激发燥热解压共鸣。
                      </div>
                      <div className="p-2 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-150 dark:border-neutral-900">
                        <span className="font-bold text-violet-500 dark:text-violet-400 mr-1">【商业摄影提示词】</span> 
                        A beautiful translucent ice-blue cosmetic jar placed on a sleek cracked glacier, morning sunlight...
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Image */}
              {currentStep.visualType === 'image' && (
                <div className="w-full space-y-4">
                  <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
                    {[1, 2, 3, 4].map(idx => (
                      <div key={idx} className="aspect-square bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden relative shadow-sm group">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-cyan-500/5 to-white/0 dark:to-neutral-900" />
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[8px] bg-black/50 text-white p-1 rounded backdrop-blur">
                          <span>渲染变体 {idx}</span>
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between gap-4 max-w-xs mx-auto">
                    <div className="flex-1 text-left">
                      <div className="text-[10px] text-neutral-400 font-mono">图片渲染引擎</div>
                      <div className="text-xs font-bold text-neutral-800 dark:text-white">FLUX.1 Pro (已启用)</div>
                    </div>
                    <button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg shadow-md hover:shadow-indigo-500/20 active:scale-95 transition-all">
                      重新生成图片
                    </button>
                  </div>
                </div>
              )}

              {/* Step 5: Video */}
              {currentStep.visualType === 'video' && (
                <div className="w-full max-w-xs mx-auto space-y-3">
                  <div className="aspect-video bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden relative flex flex-col items-center justify-center group shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-tr from-violet-950/20 via-neutral-900/40 to-transparent pointer-events-none" />
                    
                    {/* Simulated pulse light */}
                    <div className="absolute inset-0 border border-violet-500/30 animate-pulse rounded-2xl" />

                    <div className="w-12 h-12 rounded-full bg-violet-600/85 hover:scale-110 active:scale-90 text-white flex items-center justify-center cursor-pointer shadow-lg transition-all z-10">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] text-neutral-300 z-10 bg-black/60 px-2 py-1 rounded backdrop-blur">
                      <span className="truncate">Sora / 120fps 微距材质升格慢动作.mp4</span>
                      <span className="font-mono">00:05</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono px-1">
                    <span>大模型: OpenAI Sora</span>
                    <span className="text-emerald-500 dark:text-emerald-400 font-semibold">✓ 1080P Full HD 导出就绪</span>
                  </div>
                </div>
              )}

              {/* Step 6: Edit */}
              {currentStep.visualType === 'edit' && (
                <div className="w-full space-y-3 text-left">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 p-4 rounded-xl shadow-sm space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white">
                      <span className="flex items-center gap-1.5">
                        <Scissors className="w-4 h-4 text-rose-500" />
                        <span>自动字幕与卡点音轨</span>
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">CapCut Core</span>
                    </div>

                    {/* Timeline visualization */}
                    <div className="space-y-1.5" id="mini-timeline-track">
                      <div className="h-6 bg-neutral-50 dark:bg-neutral-950 rounded border border-neutral-150 dark:border-neutral-900 p-1 flex items-center justify-between text-[9px] font-mono text-neutral-600 dark:text-neutral-400">
                        <span>[音轨] bg_ambient_luxury.mp3</span>
                        <span className="text-rose-500 font-bold">120 BPM</span>
                      </div>
                      <div className="h-6 bg-violet-50 dark:bg-violet-950/30 rounded border border-violet-100 dark:border-violet-900/50 p-1 flex items-center gap-2 text-[9px] text-violet-700 dark:text-violet-400">
                        <span className="font-semibold">[字幕]</span>
                        <span className="truncate">"这不就是夏天吹空调起皮的我吗？"</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-[9px] text-neutral-400">
                      <span>✓ 自动ASMR白噪音消噪</span>
                      <span>✓ 智能Lut色彩映射</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 7: Export */}
              {currentStep.visualType === 'export' && (
                <div className="w-full space-y-3 text-left">
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 p-4 rounded-xl shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Send className="w-4 h-4 text-emerald-500" />
                        <span>小红书多段式爆款种草文案</span>
                      </span>
                      <span className="text-[9px] bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded">小红书调性</span>
                    </div>
                    
                    <div className="text-[10px] text-neutral-600 dark:text-neutral-300 space-y-1 line-clamp-3 leading-relaxed">
                      <div className="font-bold">【🧊降温8°C！天仙本仙的“空调霜”我能用一辈子！】</div>
                      <p>救命！三十几度的大夏天，是谁在空调房里干成干巴老太太？😭😭 BUV新出的这个【冰川爆水霜】简直是降温抗燥的神！仙女级刨冰质地...</p>
                    </div>
                  </div>

                  <button className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 hover:from-violet-500 hover:via-blue-500 hover:to-cyan-400 shadow-md hover:shadow-violet-500/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                    <span>下载视频与全套运营文案包</span>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
              
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
