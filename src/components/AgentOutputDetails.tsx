import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, Copy, Download, Layers, ShieldAlert, Check, Play, Film,
  Sparkles, Sliders, Scissors, Image, Video, Send, RefreshCw, ZoomIn, Eye, ArrowRight, Star
} from 'lucide-react';
import { AgentNode, MockVideoPreset, ModelProvider } from '../types';

interface AgentOutputDetailsProps {
  agent: AgentNode;
  preset: MockVideoPreset;
  providers: ModelProvider[];
  onUpdateProvider: (id: string, updated: Partial<ModelProvider>) => void;
  onClose: () => void;
}

export default function AgentOutputDetails({
  agent,
  preset,
  providers,
  onUpdateProvider,
  onClose
}: AgentOutputDetailsProps) {
  // Shared States
  const [copiedText, setCopiedText] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'prompt' | 'json' | 'markdown'>('prompt');
  const [selectedPromptVersion, setSelectedPromptVersion] = useState<string>('v2.0 (Latest)');
  
  // Image Generator States
  const [selectedImgProvider, setSelectedImgProvider] = useState<string>('flux');
  const [isGeneratingImg, setIsGeneratingImg] = useState(false);
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(preset.coverImage || null);
  const [zoomedImg, setZoomedImg] = useState(false);

  // Video Generator States
  const [selectedVidProvider, setSelectedVidProvider] = useState<string>('runway');
  const [isGeneratingVid, setIsGeneratingVid] = useState(false);
  const [generatedVidUrl, setGeneratedVidUrl] = useState<string | null>(null);

  // Video Editor States
  const [selectedEditProvider, setSelectedEditProvider] = useState<string>('capcut');
  const [editorSwitches, setEditorSwitches] = useState<Record<string, boolean>>({
    subtitles: true,
    silence: true,
    filterFiller: true,
    beatSync: true,
    bgmMatch: true,
    watermark: false,
    coverGen: true,
    ctaGen: true,
    ratioConvert: true,
    smartCrop: true,
    colorCorrect: true,
    denoise: true,
    export1080p: true,
    export4k: false,
    cleanVersion: false
  });

  // Publisher States
  const [selectedPlatform, setSelectedPlatform] = useState<'xhs' | 'douyin' | 'channels' | 'bilibili' | 'gzh'>('xhs');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const simulateGenerateImg = () => {
    setIsGeneratingImg(true);
    setGeneratedImgUrl(null);
    setTimeout(() => {
      setIsGeneratingImg(false);
      // Give it a fresh cosmetic Unsplash image
      const images = [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=600&auto=format&fit=crop'
      ];
      setGeneratedImgUrl(images[Math.floor(Math.random() * images.length)]);
    }, 2000);
  };

  const simulateGenerateVid = () => {
    setIsGeneratingVid(true);
    setGeneratedVidUrl(null);
    setTimeout(() => {
      setIsGeneratingVid(false);
      // Mock video player display
      setGeneratedVidUrl('https://assets.mixkit.co/videos/preview/mixkit-skin-cream-shining-in-slow-motion-42502-large.mp4');
    }, 2500);
  };

  const toggleEditorSwitch = (key: string) => {
    setEditorSwitches(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="bg-white dark:bg-slate-950/40 dark:backdrop-blur-[24px] rounded-3xl border border-neutral-200 dark:border-white/5 p-8 shadow-md dark:shadow-[0_0_50px_rgba(139,92,246,0.05)] space-y-8 text-left animate-in fade-in duration-350" id="output-details-panel">
      {/* Detail Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-950 dark:bg-violet-600 flex items-center justify-center text-white shadow-sm">
            {agent.id === 'video-analyst' && <Layers className="w-5 h-5" />}
            {agent.id === 'creative-strategist' && <Sliders className="w-5 h-5" />}
            {agent.id === 'prompt-designer' && <FileText className="w-5 h-5" />}
            {agent.id === 'image-generator' && <Image className="w-5 h-5" />}
            {agent.id === 'video-generator' && <Video className="w-5 h-5" />}
            {agent.id === 'video-editor' && <Scissors className="w-5 h-5" />}
            {agent.id === 'publisher' && <Send className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-neutral-950 dark:text-white text-lg">{agent.name} 结果面板</h3>
              <span className="text-[10px] uppercase font-mono tracking-widest bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-450 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/30">
                AI 已完成生成
              </span>
            </div>
            <p className="text-xs text-neutral-400 dark:text-neutral-400 mt-0.5">逆推分析方案实时生产结果，可一键导入创作工具链</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5 px-3 py-1.5 rounded-xl transition-all font-medium cursor-pointer"
        >
          返回 Studio
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. VIDEO ANALYST DETAILS */}
      {/* ======================================================== */}
      {agent.id === 'video-analyst' && (
        <div className="space-y-6" id="panel-video-analyst">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* DNA Basic Stats */}
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-4">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider border-b border-neutral-200 pb-2">
                视频 DNA 分析报告
              </h4>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                  <span className="text-neutral-500">产品物理特征识别:</span>
                  <span className="font-semibold text-neutral-800">{preset.productName}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                  <span className="text-neutral-500">视频时长/帧率:</span>
                  <span className="font-mono font-semibold text-neutral-800">{preset.duration} / 60fps</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                  <span className="text-neutral-500">博主人物画像:</span>
                  <span className="font-semibold text-neutral-800">{preset.author}</span>
                </div>
                <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                  <span className="text-neutral-500">爆款综合评分:</span>
                  <span className="font-mono font-bold text-neutral-900">{preset.viralScore} / 100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">感知钩子类型:</span>
                  <span className="font-semibold text-neutral-800 text-right max-w-[150px] truncate">{preset.hookType}</span>
                </div>
              </div>
            </div>

            {/* Aesthetics Breakdown */}
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-4 md:col-span-2">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider border-b border-neutral-200 pb-2">
                电影级视觉美学指标 (视觉美学特征)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {preset.visuals.slice(0, 4).map((v, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-neutral-200">
                    <div className="flex justify-between items-center text-[10px] mb-1">
                      <span className="font-bold text-neutral-900">{v.aspect}解析</span>
                      <span className="text-neutral-500 font-mono">{v.label}</span>
                    </div>
                    <div className="text-xs font-semibold text-neutral-800 mt-1">{v.value}</div>
                    <p className="text-[10px] text-neutral-500 font-light mt-1.5 leading-relaxed">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline list replication */}
          <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80 space-y-4">
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
              分镜头深度解析时间轴 (视频时序流分析)
            </h4>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {preset.timeline.map((frame, index) => (
                <div key={index} className="bg-white p-4 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1 sm:max-w-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                        {frame.time}
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                        {frame.type.toUpperCase()}
                      </span>
                    </div>
                    <h5 className="font-bold text-neutral-900 text-xs mt-1.5">{frame.title}</h5>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed">
                    <div>
                      <span className="font-semibold text-neutral-800 block">画面内容:</span>
                      <span className="text-neutral-500 font-light">{frame.visualContent}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-800 block">镜头语言:</span>
                      <span className="text-neutral-500 font-light">{frame.cameraLanguage}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. CREATIVE STRATEGIST DETAILS */}
      {/* ======================================================== */}
      {agent.id === 'creative-strategist' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="panel-creative-strategist">
          <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-4 text-left">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-200 pb-2">
              爆款引流底层机制 (爆款底层引流逻辑)
            </h4>
            <ul className="space-y-3 text-xs leading-relaxed text-neutral-700">
              {preset.summary.map((sum, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-neutral-900 font-bold font-mono">0{index + 1}.</span>
                  <span>{sum}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                目标客群心智与接收心理 (User Psychology)
              </h4>
              <div className="space-y-3">
                {preset.timeline.slice(0, 3).map((f, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-neutral-200 text-xs">
                    <div className="font-semibold text-neutral-900 mb-1">【{f.title.split('：')[0]}】核心心理</div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed font-light">{f.userPsychology}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. PROMPT DESIGNER DETAILS */}
      {/* ======================================================== */}
      {agent.id === 'prompt-designer' && (
        <div className="space-y-6" id="panel-prompt-designer">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl border border-neutral-200" id="prompt-format-tabs">
              {(['prompt', 'json', 'markdown'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedLanguage === lang
                      ? 'bg-white text-neutral-950 font-bold shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  {lang === 'prompt' ? 'Prompt 提示词' : lang === 'json' ? 'JSON 数据结构' : 'Markdown 报告'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400 font-mono">历史版本:</span>
              <select 
                value={selectedPromptVersion}
                onChange={(e) => setSelectedPromptVersion(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-neutral-900"
              >
                <option>v2.0 (Latest)</option>
                <option>v1.5 (Stable)</option>
                <option>v1.0 (Initial)</option>
              </select>
            </div>
          </div>

          <div className="bg-neutral-950 rounded-2xl p-6 border border-neutral-800 text-left font-mono text-xs text-neutral-200 space-y-4 relative group">
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => handleCopy(selectedLanguage === 'prompt' ? preset.reparation.imagePrompt : JSON.stringify(preset.reparation, null, 2))}
                className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
                title="Copy"
              >
                {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {selectedLanguage === 'prompt' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">① 静态奢侈美妆海报生图 Prompt (Midjourney v6):</div>
                  <p className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 leading-relaxed text-neutral-300 select-all">
                    {preset.reparation.imagePrompt}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">② 视频材质升格慢动作 Prompt (Sora / Kling):</div>
                  <p className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 leading-relaxed text-neutral-300 select-all">
                    {preset.reparation.videoPrompt}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">③ Negative Prompt (消极词):</div>
                  <p className="bg-neutral-900/50 p-3 rounded-xl border border-neutral-800 leading-relaxed text-neutral-300">
                    lowres, bad quality, deformed hands, distorted bottles, blurry, text watermark, oversaturated colors, cheap lighting
                  </p>
                </div>
              </div>
            )}

            {selectedLanguage === 'json' && (
              <pre className="text-[11px] leading-relaxed text-neutral-300 select-all max-h-[300px] overflow-y-auto custom-scrollbar">
                {JSON.stringify(preset.reparation, null, 2)}
              </pre>
            )}

            {selectedLanguage === 'markdown' && (
              <div className="space-y-3 font-sans leading-relaxed text-neutral-300 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                <h4 className="text-sm font-bold text-white"># BUV 爆款复刻工程提示词方案</h4>
                <p className="text-xs text-neutral-400">以下方案由 Prompt Designer 智能生成，对齐大厂美学商业摄影特征。</p>
                <h5 className="font-bold text-white mt-4">## 1. 静态广告图提示词</h5>
                <blockquote className="border-l-2 border-neutral-700 pl-3 text-neutral-400 italic">
                  {preset.reparation.imagePrompt}
                </blockquote>
                <h5 className="font-bold text-white mt-4">## 2. 升格慢动作视频提示词</h5>
                <blockquote className="border-l-2 border-neutral-700 pl-3 text-neutral-400 italic">
                  {preset.reparation.videoPrompt}
                </blockquote>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. IMAGE GENERATOR DETAILS */}
      {/* ======================================================== */}
      {agent.id === 'image-generator' && (
        <div className="space-y-6" id="panel-image-generator">
          {/* Provider selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'midjourney', name: 'Midjourney v6', logo: 'from-blue-600 to-cyan-500', version: 'v6.0 RAW' },
              { id: 'sdxl', name: 'Stable Diffusion', logo: 'from-purple-600 to-indigo-500', version: 'SDXL 1.0' },
              { id: 'flux', name: 'FLUX.1', logo: 'from-orange-600 to-pink-500', version: 'Flux Dev' },
              { id: 'jimeng', name: '即梦 AI', logo: 'from-amber-600 to-red-500', version: 'v2.1 Pro' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedImgProvider(p.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col gap-1.5 ${
                  selectedImgProvider === p.id
                    ? 'border-neutral-950 bg-neutral-50 shadow-sm'
                    : 'bg-white hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${p.logo} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-neutral-900">{p.name}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5">{p.version}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form details & prompt block */}
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-4">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                图片生成模型配置
              </h4>
              <div className="space-y-3 text-xs text-left">
                <div className="space-y-1">
                  <span className="text-neutral-500 block">生成 Prompt Word:</span>
                  <p className="bg-white p-3 rounded-xl border border-neutral-200 font-mono text-[11px] leading-relaxed text-neutral-700">
                    {preset.reparation.imagePrompt}
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <span className="text-neutral-500 block">画布比例:</span>
                    <select className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 font-mono text-neutral-800">
                      <option>--ar 3:4 (小红书主图)</option>
                      <option>--ar 9:16 (抖音竖屏)</option>
                      <option>--ar 1:1 (正方形)</option>
                      <option>--ar 16:9 (横屏)</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-neutral-500 block">生成质量 (Steps):</span>
                    <select className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 font-mono text-neutral-800">
                      <option>50 Steps (Ultra High)</option>
                      <option>30 Steps (Standard)</option>
                      <option>20 Steps (Fast Draft)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">预计消耗积分: 0.15 点</span>
                  <button
                    onClick={simulateGenerateImg}
                    disabled={isGeneratingImg}
                    className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    {isGeneratingImg ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isGeneratingImg ? '正在画图中...' : '生成静态图 (GENERATE IMAGE)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated generation workspace container */}
            <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-100 flex flex-col justify-between relative overflow-hidden" id="image-gen-workspace">
              <div className="absolute top-3 left-3 text-[10px] uppercase font-mono tracking-widest text-neutral-400 bg-white/80 border border-neutral-200 px-2 py-0.5 rounded backdrop-blur-sm z-10">
                视觉海报生成预览 (Output Preview)
              </div>

              {/* Render Image or Loading skeleton */}
              <div className="flex-1 min-h-[220px] bg-white rounded-xl border border-neutral-200/50 flex items-center justify-center overflow-hidden relative group">
                {isGeneratingImg ? (
                  <div className="space-y-3 text-center">
                    <RefreshCw className="w-8 h-8 text-neutral-800 animate-spin mx-auto" />
                    <p className="text-xs text-neutral-500 font-mono animate-pulse">FLUX.1 渲染引擎正在解算噪点图层 (65%)...</p>
                  </div>
                ) : generatedImgUrl ? (
                  <>
                    <img 
                      src={generatedImgUrl} 
                      alt="Generated" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Hover controls */}
                    <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => setZoomedImg(true)}
                        className="p-2 bg-white rounded-full text-neutral-900 hover:scale-110 transition-transform shadow-sm"
                        title="放大"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => window.open(generatedImgUrl, '_blank')}
                        className="p-2 bg-white rounded-full text-neutral-900 hover:scale-110 transition-transform shadow-sm"
                        title="下载"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center space-y-1.5 p-4 text-neutral-400">
                    <Image className="w-10 h-10 mx-auto stroke-1" />
                    <p className="text-xs">点击左侧“生成静态图”按钮开始算图</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Zoom Overlay */}
          {zoomedImg && generatedImgUrl && (
            <div 
              className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-6"
              onClick={() => setZoomedImg(false)}
            >
              <div className="max-w-3xl max-h-[85vh] relative bg-white rounded-2xl overflow-hidden p-2 shadow-2xl">
                <img 
                  src={generatedImgUrl} 
                  alt="Zoomed" 
                  className="max-w-full max-h-[75vh] object-contain rounded-lg" 
                  referrerPolicy="no-referrer"
                />
                <div className="p-3 text-xs text-neutral-800 font-mono text-center">
                  {preset.reparation.imagePrompt}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. VIDEO GENERATOR DETAILS */}
      {/* ======================================================== */}
      {agent.id === 'video-generator' && (
        <div className="space-y-6" id="panel-video-generator">
          {/* Provider choice */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { id: 'sora', name: 'OpenAI Sora', logo: 'from-neutral-950 to-neutral-700', version: 'Sora v1.0' },
              { id: 'runway', name: 'Runway Gen-3', logo: 'from-purple-800 to-purple-600', version: 'Gen-3 Alpha' },
              { id: 'kling', name: '快手可灵 Kling', logo: 'from-amber-600 to-orange-500', version: 'Kling Pro 1.5' },
              { id: 'vidu', name: 'Vidu AI', logo: 'from-blue-700 to-indigo-600', version: 'Vidu v1.0' },
              { id: 'pika', name: 'Pika 2.0', logo: 'from-cyan-600 to-blue-500', version: 'Pika Pro' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedVidProvider(p.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative flex flex-col gap-1.5 ${
                  selectedVidProvider === p.id
                    ? 'border-neutral-950 bg-neutral-50 shadow-sm'
                    : 'bg-white hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${p.logo} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-neutral-900 truncate max-w-[80px]" title={p.name}>{p.name}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5">{p.version}</span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form details & prompt block */}
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-4">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                视频模型参数控制
              </h4>
              <div className="space-y-3 text-xs text-left">
                <div className="space-y-1">
                  <span className="text-neutral-500 block">视频渲染 Prompt Word:</span>
                  <p className="bg-white p-3 rounded-xl border border-neutral-200 font-mono text-[11px] leading-relaxed text-neutral-700">
                    {preset.reparation.videoPrompt}
                  </p>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <span className="text-neutral-500 block">渲染时长/帧率:</span>
                    <select className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 font-mono text-neutral-800">
                      <option>5 Seconds (120fps slow-motion)</option>
                      <option>10 Seconds (60fps standard)</option>
                      <option>15 Seconds (Cinematic)</option>
                    </select>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-neutral-500 block">物理运动倾向:</span>
                    <select className="w-full bg-white border border-neutral-200 rounded-lg px-2.5 py-1.5 font-mono text-neutral-800">
                      <option>Slow Orbit zoom-in (缓慢推轨)</option>
                      <option>Static focus Macro (微距对焦)</option>
                      <option>Fluid liquid simulation (液体仿真)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">预计消耗积分: 1.2 点</span>
                  <button
                    onClick={simulateGenerateVid}
                    disabled={isGeneratingVid}
                    className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
                  >
                    {isGeneratingVid ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>{isGeneratingVid ? '正在渲染视频中...' : '生成升格视频 (GENERATE VIDEO)'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Video preview board */}
            <div className="border border-neutral-200 rounded-2xl p-4 bg-neutral-100 flex flex-col justify-between relative overflow-hidden" id="video-gen-workspace">
              <div className="absolute top-3 left-3 text-[10px] uppercase font-mono tracking-widest text-neutral-400 bg-white/80 border border-neutral-200 px-2 py-0.5 rounded backdrop-blur-sm z-10">
                视频渲染输出播放器 (Output Player)
              </div>

              <div className="flex-1 min-h-[220px] bg-white rounded-xl border border-neutral-200/50 flex items-center justify-center overflow-hidden relative group">
                {isGeneratingVid ? (
                  <div className="space-y-3 text-center p-4">
                    <RefreshCw className="w-8 h-8 text-neutral-800 animate-spin mx-auto" />
                    <p className="text-xs text-neutral-500 font-mono animate-pulse">Sora 电影级调度引擎正在解算潜空间网格 (45%)...</p>
                  </div>
                ) : generatedVidUrl ? (
                  <video 
                    src={generatedVidUrl} 
                    controls 
                    autoPlay 
                    loop 
                    muted
                    className="w-full h-full object-cover rounded-lg" 
                  />
                ) : (
                  <div className="text-center space-y-1.5 p-4 text-neutral-400">
                    <Film className="w-10 h-10 mx-auto stroke-1" />
                    <p className="text-xs">点击左侧“生成升格视频”按钮开始计算视频帧</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. VIDEO EDITOR DETAILS */}
      {/* ======================================================== */}
      {agent.id === 'video-editor' && (
        <div className="space-y-8" id="panel-video-editor">
          {/* Provider choice */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'capcut', name: 'CapCut 剪映 API', logo: 'from-black to-neutral-800', type: 'SaaS Cloud Schnitt' },
              { id: 'ffmpeg', name: 'FFmpeg Wasm', logo: 'from-emerald-700 to-green-600', type: 'Local GPU Compilation' },
              { id: 'moviepy', name: 'MoviePy Script', logo: 'from-blue-700 to-indigo-600', type: 'Python Server Frame' },
              { id: 'remotion', name: 'Remotion React', logo: 'from-rose-600 to-pink-500', type: 'Programmatic Rendering' }
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedEditProvider(p.id)}
                className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col gap-1.5 ${
                  selectedEditProvider === p.id
                    ? 'border-neutral-950 bg-neutral-50 shadow-sm'
                    : 'bg-white hover:bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${p.logo} flex items-center justify-center text-[10px] font-bold text-white`}>
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-neutral-900">{p.name}</span>
                </div>
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5">{p.type}</span>
              </button>
            ))}
          </div>

          {/* Configuration Switches Panel (Apple Style) */}
          <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <Scissors className="w-4 h-4" />
                AI Video Editor 自动剪辑策略配置 (Apple-Style Editor Controls)
              </h4>
              <p className="text-[11px] text-neutral-400 mt-1">
                启用以下选项，AI 将在云端自动合成分镜，生成卡点视频并配字幕 LOGO 一键导出。
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5">
              {[
                { key: 'subtitles', label: '自动加字幕 (Auto-Caption)', desc: '识别语音，自动对齐生成双语花字字幕' },
                { key: 'silence', label: '自动识别静音 (Cut Silence)', desc: '自动裁切无声白噪区间，缩减长视频水分' },
                { key: 'filterFiller', label: '自动删除废话 (Filler Word Removal)', desc: '精确识别并切除“嗯、那个、然后”等冗余词' },
                { key: 'beatSync', label: '自动卡点 (Beat-Sync Rendering)', desc: '跟随音频波峰节拍，对齐视觉镜头切换' },
                { key: 'bgmMatch: BGM', label: '自动匹配 BGM (Auto Atmosphere Music)', desc: '基于视频主色彩，由 AI 生成原创背景电音' },
                { key: 'watermark', label: '自动品牌 Logo (Brand Overlay)', desc: '在右上角与转场区间贴合高定 BUV 标识' },
                { key: 'coverGen', label: '自动封面 (Auto Hero Frame)', desc: '捕捉人脸完播最高一帧，智能拼贴引流封面' },
                { key: 'ctaGen', label: '自动生成 CTA (Auto Endscreen)', desc: '片尾浮现搜索框，并配有领券气泡浮窗' },
                { key: 'ratioConvert', label: '自动横竖屏转换 (Ratio Remapping)', desc: '智能对齐裁剪 16:9 与 9:16 画幅比例' },
                { key: 'smartCrop', label: '自动智能裁切 (Smart Face Tracking)', desc: '智能跟踪博主面部，确保人物永远居中' },
                { key: 'colorCorrect', label: '自动颜色校正 (Color Grading Match)', desc: '自动适配电影级莫兰迪或清透美妆滤镜' },
                { key: 'denoise', label: '自动降噪 (ASMR Denoise Filter)', desc: '对博主说话降噪，保留解压化水 ASMR 细节音' },
                { key: 'export1080p', label: '自动导出 1080P (Full HD output)', desc: '平衡画质与发布流畅度，推荐标准大小' },
                { key: 'export4k', label: '自动导出 4K (Ultra HD resolution)', desc: '高比特率渲染，完美展现奢侈品级毛孔细节' },
                { key: 'cleanVersion', label: '自动导出无字幕版本 (Clean Master copy)', desc: '保存母带，供二次混剪和海外配音' }
              ].map(s => (
                <div key={s.key} className="flex items-start justify-between gap-4 p-3 bg-white rounded-xl border border-neutral-100/80 shadow-sm hover:border-neutral-200 transition-colors">
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-neutral-800 block">{s.label}</span>
                    <span className="text-[10px] text-neutral-400 font-light leading-relaxed block">{s.desc}</span>
                  </div>
                  {/* Apple Switch Toggle Button */}
                  <button
                    onClick={() => toggleEditorSwitch(s.key)}
                    className={`w-11 h-6 rounded-full p-1 transition-colors relative shrink-0 mt-0.5 ${
                      editorSwitches[s.key] ? 'bg-neutral-900' : 'bg-neutral-200'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                      editorSwitches[s.key] ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-neutral-200 flex justify-end text-xs">
              <button 
                onClick={() => alert('已成功保存当前 AI 自动剪辑工作流配置文件。下一次一键运行时将自动加载。')}
                className="bg-neutral-900 text-white font-medium px-4 py-2 rounded-xl border border-neutral-950 shadow-sm hover:bg-neutral-800 transition-all"
              >
                保存剪辑配置文件
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. PUBLISHER DETAILS */}
      {/* ======================================================== */}
      {agent.id === 'publisher' && (
        <div className="space-y-6" id="panel-publisher">
          {/* Platform selectors */}
          <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-4" id="platform-tabs">
            {[
              { id: 'xhs', name: '小红书', desc: '情绪种草排版' },
              { id: 'douyin', name: '抖音', desc: '卡点视频 BGM' },
              { id: 'channels', name: '微信视频号', desc: '社交关系链分发' },
              { id: 'bilibili', name: 'Bilibili', desc: '中视频深度测评' },
              { id: 'gzh', name: '微信公众号', desc: '品牌长图文发布' }
            ].map(plat => (
              <button
                key={plat.id}
                onClick={() => setSelectedPlatform(plat.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedPlatform === plat.id
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <span>{plat.name}</span>
                <span className="text-[9px] font-light block opacity-70">{plat.desc}</span>
              </button>
            ))}
          </div>

          {/* Copy details pack */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Copy & Body block */}
            <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/80 md:col-span-2 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                  适配文案与发布包
                </span>
                <button
                  onClick={() => handleCopy(`${preset.reparation.xiaohongshuPost}`)}
                  className="flex items-center gap-1 text-xs text-neutral-900 hover:text-neutral-700 font-semibold"
                >
                  {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>复制文案包</span>
                </button>
              </div>

              {selectedPlatform === 'xhs' ? (
                <div className="space-y-4 text-xs text-neutral-700 leading-relaxed">
                  <div className="p-3 bg-white rounded-xl border border-neutral-100">
                    <span className="font-bold text-neutral-900 block mb-1">小红书黄金吸睛标题:</span>
                    <span className="font-mono text-neutral-850 block">降温8°C！天仙本仙的“空调面霜”我能用一辈子！😭</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-100 space-y-1.5">
                    <span className="font-bold text-neutral-900 block">排版正文内容:</span>
                    <p className="whitespace-pre-wrap font-sans text-neutral-650 text-[11px]">
                      {preset.reparation.xiaohongshuPost}
                    </p>
                  </div>
                </div>
              ) : selectedPlatform === 'douyin' ? (
                <div className="space-y-4 text-xs text-neutral-700 leading-relaxed">
                  <div className="p-3 bg-white rounded-xl border border-neutral-100">
                    <span className="font-bold text-neutral-900 block mb-1">抖音热点话题与标题:</span>
                    <span className="font-mono text-neutral-850 block">#早八通勤 #伪素颜 挑战10秒极限出门，室友看呆了！@BUV官方旗舰店</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-neutral-100">
                    <span className="font-bold text-neutral-900 block mb-1.5">抖音配音ASMR台本:</span>
                    <p className="whitespace-pre-wrap font-mono text-[11px] text-neutral-650 bg-neutral-50 p-2.5 rounded border border-neutral-200">
                      {preset.reparation.douyinScript.map(step => `【${step.scene}】\n画面: ${step.visual}\n音频: ${step.audio}`).join('\n\n')}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white rounded-xl border border-neutral-150 text-center text-neutral-400 space-y-2 text-xs">
                  <Sliders className="w-8 h-8 mx-auto stroke-1" />
                  <p>该发布平台的 AI 适配文案包已成功生成，内容已针对该平台的流量推荐算法完成了关键词埋点与字数配比优化。</p>
                </div>
              )}
            </div>

            {/* Publication metadata tags */}
            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80 space-y-4 text-xs">
              <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-200 pb-2">
                发布元数据配置
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl border border-neutral-150 space-y-1">
                  <span className="text-neutral-500 font-semibold block text-[10px]">推荐话题标签 (SEO Tags):</span>
                  <p className="font-mono text-neutral-800">#BUV爆水霜 #夏日护肤 #冰川面霜 #美妆种草 #清凉不黏腻 #伪素颜神器</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-neutral-150 space-y-1">
                  <span className="text-neutral-500 font-semibold block text-[10px]">评论区置顶引导话术:</span>
                  <p className="text-neutral-800">“姐妹们！清凉大礼包活动是真的！现在搜天猫【冰川爆水霜】下单还送防晒喷雾，手慢无！”</p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-neutral-150 space-y-1">
                  <span className="text-neutral-500 font-semibold block text-[10px]">自动发布定时器:</span>
                  <p className="text-neutral-800 font-mono font-semibold text-emerald-600">
                    2026-07-20 18:30:00 (早八通勤/下班高峰最佳推荐期)
                  </p>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => alert('运营素材包导出成功。包含：4K高清视频母带、原画静态封面、TXT文案对齐稿。')}
                    className="w-full flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-900 text-white font-semibold py-2.5 rounded-xl border border-neutral-950 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    <span>导出完整发布素材包</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
