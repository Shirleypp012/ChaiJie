import { useState } from 'react';
import { 
  FileVideo, Cpu, Image, Film, Video, Scissors, 
  Send, Mic, UserSquare2, Globe, Music, BarChart3, Plus, Sparkles 
} from 'lucide-react';

interface AgentLibraryProps {
  onAddAgent: (agentId: string) => void;
  activeWorkflowIds: string[];
}

interface LibraryAgent {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'core' | 'creative' | 'multimedia' | 'distribution' | 'future';
  status: 'available' | 'future';
}

export default function AgentLibrary({ onAddAgent, activeWorkflowIds }: AgentLibraryProps) {
  const [filter, setFilter] = useState<'all' | 'available' | 'future'>('all');

  const libraryAgents: LibraryAgent[] = [
    // Available Agents
    {
      id: 'video-analyst',
      name: '🎬 视频分析',
      description: '深入分析镜头语言、景别、运镜、视觉、场景、情绪及色彩美学',
      icon: FileVideo,
      category: 'core',
      status: 'available'
    },
    {
      id: 'creative-strategist',
      name: '🧠 爆款内容策划',
      description: '逆向爆款引流机制、黄金3秒冲击、痛点触达与行动号召策略',
      icon: Cpu,
      category: 'creative',
      status: 'available'
    },
    {
      id: 'prompt-designer',
      name: '🖼 创意方案生成',
      description: '生成电影级高保真 Midjourney 静态与 Sora 视频的工程提示词',
      icon: Image,
      category: 'creative',
      status: 'available'
    },
    {
      id: 'image-generator',
      name: '🎨 图片生成',
      description: '调用 FLUX/Stable Diffusion 生成品牌高拟真宣传海报与电商主图',
      icon: Sparkles,
      category: 'multimedia',
      status: 'available'
    },
    {
      id: 'video-generator',
      name: '🎥 视频生成',
      description: '使用 Sora/Runway Gen-3 渲染 120fps 微距材质升格慢动作视频',
      icon: Video,
      category: 'multimedia',
      status: 'available'
    },
    {
      id: 'video-editor',
      name: '✂ 智能剪辑',
      description: 'AI自动卡点剪辑、音频匹配、字幕对齐、智能去噪、双通道导出',
      icon: Scissors,
      category: 'multimedia',
      status: 'available'
    },
    {
      id: 'publisher',
      name: '📦 导出素材',
      description: '生成适配小红书、抖音、视频号等多渠道精美文案及标题',
      icon: Send,
      category: 'distribution',
      status: 'available'
    },
    // Future / Under development Agents
    {
      id: 'ai-dubbing',
      name: '🎙 AI 配音专家',
      description: '多语种、声纹克隆高保真博主音色，完美匹配镜头动作（开发中）',
      icon: Mic,
      category: 'future',
      status: 'future'
    },
    {
      id: 'ai-avatar',
      name: '👤 AI 数字代言人',
      description: '一键生成完美口型、生动肢体语言的高定美妆数字代言人（开发中）',
      icon: UserSquare2,
      category: 'future',
      status: 'future'
    },
    {
      id: 'ai-translate',
      name: '🌐 AI 声画同步翻译员',
      description: '自动对视频进行声画同步翻译，助力品牌出海欧美、东南亚（开发中）',
      icon: Globe,
      category: 'future',
      status: 'future'
    },
    {
      id: 'ai-music',
      name: '🎵 AI 氛围声景配乐师',
      description: '根据视频节奏和色彩色调，原创生成极简科技感氛围背景音乐（开发中）',
      icon: Music,
      category: 'future',
      status: 'future'
    },
    {
      id: 'ai-data-analysis',
      name: '📊 AI 流量转化精算师',
      description: '多维度监测发布后流量与转化指标，自动纠偏后续内容创意（开发中）',
      icon: BarChart3,
      category: 'future',
      status: 'future'
    }
  ];

  const filtered = libraryAgents.filter(agent => {
    if (filter === 'all') return true;
    return agent.status === filter;
  });

  return (
    <div className="bg-white dark:bg-slate-950/40 dark:backdrop-blur-[24px] rounded-3xl border border-neutral-200/80 dark:border-white/5 p-5 shadow-sm space-y-6 text-left" id="agent-library-container">
      {/* Title & Stats */}
      <div className="border-b border-neutral-100 dark:border-white/5 pb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-white uppercase">
            智能体资源库
          </h3>
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">实验室全栈智能体资源库</p>
        </div>
        <span className="text-[10px] font-mono bg-neutral-100 dark:bg-white/5 border border-neutral-200/80 dark:border-white/5 text-neutral-800 dark:text-neutral-300 px-2 py-0.5 rounded shrink-0">
          {libraryAgents.filter(a => a.status === 'available').length} 就绪 / {libraryAgents.filter(a => a.status === 'future').length} 规划
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 p-1 bg-neutral-100 dark:bg-white/5 rounded-xl" id="library-filters">
        {(['all', 'available', 'future'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => setFilter(opt)}
            className={`flex-1 text-center py-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${
              filter === opt
                ? 'bg-white dark:bg-white/10 text-neutral-900 dark:text-white font-semibold shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
            }`}
          >
            {opt === 'all' ? '全部' : opt === 'available' ? '已就绪' : '开发中'}
          </button>
        ))}
      </div>

      {/* Agents Scroll Container */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin" id="library-list">
        {filtered.map((agent) => {
          const IconComponent = agent.icon;
          const isAdded = activeWorkflowIds.includes(agent.id);
          const isFuture = agent.status === 'future';

          return (
            <div
              key={agent.id}
              className={`p-3.5 rounded-2xl border transition-all relative group flex flex-col justify-between ${
                isFuture
                  ? 'bg-neutral-50/50 dark:bg-white/[0.01] border-neutral-100 dark:border-white/5 opacity-60 dark:opacity-50'
                  : 'bg-white dark:bg-white/[0.03] hover:bg-neutral-50/80 dark:hover:bg-white/[0.06] border-neutral-200 dark:border-white/5'
              }`}
              id={`library-agent-${agent.id}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl shrink-0 ${
                  isFuture 
                    ? 'bg-neutral-100 dark:bg-white/5 text-neutral-400 dark:text-neutral-500' 
                    : 'bg-neutral-900 dark:bg-violet-600 text-white shadow-sm'
                }`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    {agent.name}
                  </h4>
                  <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mt-1">
                    {agent.description}
                  </p>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between text-[10px]">
                <span className={`font-mono text-[9px] uppercase ${
                  isFuture ? 'text-amber-600 dark:text-amber-400/80 font-medium' : 'text-emerald-600 dark:text-emerald-400 font-semibold'
                }`}>
                  {isFuture ? '研发中 / Coming Soon' : '就绪 / Ready'}
                </span>

                {!isFuture && (
                  <button
                    onClick={() => !isAdded && onAddAgent(agent.id)}
                    disabled={isAdded}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-medium transition-all ${
                      isAdded
                        ? 'bg-neutral-50 dark:bg-white/5 text-neutral-400 dark:text-neutral-600 border-neutral-200 dark:border-white/5 cursor-not-allowed'
                        : 'bg-neutral-900 hover:bg-neutral-800 dark:bg-violet-600 dark:hover:bg-violet-500 text-white border-neutral-950 dark:border-violet-600 shadow-sm'
                    }`}
                  >
                    {isAdded ? (
                      '已在工作流'
                    ) : (
                      <>
                        <Plus className="w-3 h-3" />
                        添加节点
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
