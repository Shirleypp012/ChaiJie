import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Workflow, Sparkles, Terminal, Activity, 
  Layers, Settings, Play, Pause, RotateCcw 
} from 'lucide-react';
import AgentLibrary from './AgentLibrary';
import WorkflowBuilder from './WorkflowBuilder';
import AgentCard from './AgentCard';
import AgentOutputDetails from './AgentOutputDetails';
import { AgentNode, ModelProvider, MockVideoPreset } from '../types';

interface AgentStudioPageProps {
  preset: MockVideoPreset;
  providers: ModelProvider[];
  onUpdateProvider: (id: string, updated: Partial<ModelProvider>) => void;
  onSetDefaultProvider: (id: string, category: any) => void;
}

export default function AgentStudioPage({
  preset,
  providers,
  onUpdateProvider,
  onSetDefaultProvider
}: AgentStudioPageProps) {
  // Workflow nodes sequence
  const [nodes, setNodes] = useState<AgentNode[]>([
    {
      id: 'video-analyst',
      name: '🎬 视频分析',
      description: '深入分析镜头语言、景别、运镜、视觉、场景、情绪及色彩美学',
      icon: 'FileVideo',
      status: 'idle',
      currentModel: 'gemini-2.5-pro',
      runtime: 0,
      tokensUsed: 0,
      enabled: true,
      category: 'core',
      logs: [
        '正在初始化视频美学分析容器...',
        '正在提取音频波形与高保真视觉关键帧 (1080P 60fps)...',
        '正在自动检测镜头转场、构图美学与景别变化...',
        '正在针对莫兰迪色表进行专业色彩及肤色比色评估...',
        '正在合成电影镜头语言标签，并生成关键帧渲染时间线...',
        '视频分析运行完毕。已成功合成视频视觉美学DNA报告。'
      ]
    },
    {
      id: 'creative-strategist',
      name: '🧠 爆款内容策划',
      description: '逆向爆款引流机制、黄金3秒冲击、痛点触达与行动转化策略',
      icon: 'Cpu',
      status: 'idle',
      currentModel: 'gemini-2.5-pro',
      runtime: 0,
      tokensUsed: 0,
      enabled: true,
      category: 'creative',
      logs: [
        '正在启动爆款内容策划节点...',
        '正在分析社媒平台爆款传播公式与高受众留存曲线矩阵...',
        '正在识别“痛点发现-场景代入-方案呈现”的黄金3秒钩子序列...',
        '正在从口播脚本中精准提取、优化行动号召转化机制...',
        '爆款内容策划运行完毕。已成功构建核心消费心理学营销框架。'
      ]
    },
    {
      id: 'prompt-designer',
      name: '🖼 创意方案生成',
      description: '生成电影级高保真 Midjourney 静态与 Sora 视频的工程提示词',
      icon: 'Image',
      status: 'idle',
      currentModel: 'gemini-2.5-pro',
      runtime: 0,
      tokensUsed: 0,
      enabled: true,
      category: 'creative',
      logs: [
        '正在初始化高定提示词模版引擎解析器...',
        '正在将前序美学色彩风格映射关联至 Midjourney v6 专属描述词...',
        '正在构建 Sora 物理动力学及镜头运动轨迹描述指令...',
        '正在编译负向排斥词与电影级照片逼真度写实关键词...',
        '创意方案生成运行完毕。已成功导出高精度结构化多模态生成提示词。'
      ]
    },
    {
      id: 'image-generator',
      name: '🎨 图片生成',
      description: '调用 FLUX/Stable Diffusion 生成品牌高拟真宣传海报与电商主图',
      icon: 'Sparkles',
      status: 'idle',
      currentModel: 'flux-dev',
      runtime: 0,
      tokensUsed: 0,
      enabled: true,
      category: 'multimedia',
      logs: [
        '正在向云端 FLUX / Stable Diffusion 高阶节点发起渲染调用请求...',
        '正在发送高拟真品牌主图提示词与控制种子 (宽高比: 3:4)...',
        '正在进行潜空间噪声表征消噪迭代...',
        '正在对画面中的品牌、外包装微观质感进行精细化超分微调...',
        '图片生成运行完毕。已成功导出高保真宣传主图。'
      ]
    },
    {
      id: 'video-generator',
      name: '🎥 视频生成',
      description: '使用 Sora/Runway Gen-3 渲染 120fps 微距材质升格慢动作视频',
      icon: 'Video',
      status: 'idle',
      currentModel: 'gen3-alpha',
      runtime: 0,
      tokensUsed: 0,
      enabled: true,
      category: 'multimedia',
      logs: [
        '正在安全验证 Runway Gen-3 接口凭证与算力资源队列...',
        '正在传输流体动力学提示词与微观瓶身材质偏振光渲染指令...',
        '正在编译并生成高动态时空连续视频帧 (1080P 120fps 超慢动作)...',
        '正在实时渲染微观乳液液滴的表面张力及光线折射透镜层...',
        '视频生成运行完毕。已渲染出高定级护肤品动态物理材质。'
      ]
    },
    {
      id: 'video-editor',
      name: '✂ 智能剪辑',
      description: '自动卡点剪辑、音频匹配、字幕对齐、智能去噪、双通道导出',
      icon: 'Scissors',
      status: 'idle',
      currentModel: 'capcut-v4.0',
      runtime: 0,
      tokensUsed: 0,
      enabled: true,
      category: 'multimedia',
      logs: [
        '正在云端初始化 FFmpeg & 剪映底层工作流合成容器...',
        '正在载入视频素材并精准对齐背景音乐的强弱节奏点...',
        '正在运行智能人声语音识别及字幕双语对齐矫正脚本...',
        '正在应用高级环境降噪，并智能套用色彩 Lut...',
        '正在执行 1080P 高保真多路复用视频流合成与导出...',
        '智能剪辑运行完毕。终剪成片项目及主轨工程已合并。'
      ]
    },
    {
      id: 'publisher',
      name: '📦 导出素材',
      description: '生成适配小红书、抖音、视频号等多渠道精美文案及标题',
      icon: 'Send',
      status: 'idle',
      currentModel: 'gemini-2.5-pro',
      runtime: 0,
      tokensUsed: 0,
      enabled: true,
      category: 'distribution',
      logs: [
        '正在载入全渠道内容文案分发排版引擎...',
        '正在根据小红书调性自动设计多段式文案，穿插种草 Emoji 表情...',
        '正在撰写适合抖音平台的爆款口播金句、字幕标签及热度标签...',
        '正在云端匹配检索社媒实时爆款话题排行榜并进行高匹配标签索引...',
        '导出素材运行完毕。多平台个性化营销文案内容包均已就绪。'
      ]
    }
  ]);

  // Overall workflow state
  const [workflowState, setWorkflowState] = useState<'idle' | 'running' | 'paused' | 'completed'>('idle');
  const [currentNodeIdx, setCurrentNodeIdx] = useState<number>(-1);
  const [selectedDetailsAgentId, setSelectedDetailsAgentId] = useState<string | null>(null);

  // Simulation parameters
  const [activeRuntime, setActiveRuntime] = useState(0);

  // Handle run/pause state ticking
  useEffect(() => {
    let interval: any;
    if (workflowState === 'running') {
      interval = setInterval(() => {
        setActiveRuntime(prev => prev + 1);
        
        // Update current running node runtime
        if (currentNodeIdx >= 0 && currentNodeIdx < nodes.length) {
          setNodes(prevNodes => prevNodes.map((n, i) => {
            if (i === currentNodeIdx && n.status === 'running') {
              return { 
                ...n, 
                runtime: n.runtime + 1,
                tokensUsed: n.tokensUsed === 0 ? Math.floor(Math.random() * 800) + 400 : n.tokensUsed + Math.floor(Math.random() * 80) + 20
              };
            }
            return n;
          }));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [workflowState, currentNodeIdx]);

  // Sequential multi-agent processor simulation
  useEffect(() => {
    if (workflowState !== 'running') return;

    // Check if we need to launch the first enabled node
    if (currentNodeIdx === -1) {
      const firstEnabledIdx = nodes.findIndex(n => n.enabled);
      if (firstEnabledIdx !== -1) {
        setCurrentNodeIdx(firstEnabledIdx);
        updateNodeStatus(firstEnabledIdx, 'running');
      } else {
        setWorkflowState('completed');
      }
      return;
    }

    // Monitor current node's completion trigger
    const currentNode = nodes[currentNodeIdx];
    if (currentNode && currentNode.status === 'running') {
      // Simulate completion after its logs are read or after a set duration (e.g., 5 seconds)
      const duration = 5; // 5 seconds of work per agent
      if (currentNode.runtime >= duration) {
        updateNodeStatus(currentNodeIdx, 'completed');
        
        // Find next enabled node
        let nextIdx = -1;
        for (let i = currentNodeIdx + 1; i < nodes.length; i++) {
          if (nodes[i].enabled) {
            nextIdx = i;
            break;
          }
        }

        if (nextIdx !== -1) {
          setCurrentNodeIdx(nextIdx);
          updateNodeStatus(nextIdx, 'running');
        } else {
          setWorkflowState('completed');
          setCurrentNodeIdx(-1);
        }
      }
    }
  }, [workflowState, currentNodeIdx, nodes]);

  const updateNodeStatus = (index: number, status: 'idle' | 'running' | 'completed' | 'failed' | 'retrying') => {
    setNodes(prev => prev.map((node, i) => {
      if (i === index) {
        return { ...node, status };
      }
      return node;
    }));
  };

  const handleToggleNode = (id: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === id) {
        return { ...node, enabled: !node.enabled };
      }
      return node;
    }));
  };

  const handleMoveNode = (index: number, direction: 'left' | 'right') => {
    if (direction === 'left' && index === 0) return;
    if (direction === 'right' && index === nodes.length - 1) return;

    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    const updated = [...nodes];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setNodes(updated);
  };

  const handleRemoveNode = (id: string) => {
    setNodes(prev => prev.filter(node => node.id !== id));
  };

  const handleAddNodeFromLibrary = (agentId: string) => {
    // Check if it already exists
    if (nodes.some(n => n.id === agentId)) return;

    // Create a default instance based on the library templates
    const templates: Record<string, Partial<AgentNode>> = {
      'ai-dubbing': {
        name: '🎙 AI 配音专家',
        description: '多语种、声纹克隆高保真博主音色，完美匹配镜头动作（已整合）',
        icon: 'Mic',
        currentModel: 'elevenlabs-v2',
        logs: ['正在初始化 ElevenLabs 配音算法模型...', '正在高保真合成目标声线音频并生成对齐数据...']
      },
      'ai-avatar': {
        name: '👤 AI 数字人代言人',
        description: '一键生成完美口型、生动肢体语言的高定美妆数字代言人（已整合）',
        icon: 'UserSquare2',
        currentModel: 'heygen-v2',
        logs: ['正在调取 HeyGen 高清写实 3D 品牌数字代言人资产库...', '正在合成音色口型与眼轮匝肌、面部微表情动力学数据...']
      }
    };

    const template = templates[agentId] || {
      name: `🎨 AI ${agentId}`,
      description: '自定义智能体节点',
      icon: 'Layers',
      currentModel: 'gemini-2.5-flash',
      logs: ['正在拉起自定义智能体计算沙箱...']
    };

    const newNode: AgentNode = {
      id: agentId,
      name: template.name || '自定义智能体',
      description: template.description || '',
      icon: template.icon || 'Cpu',
      status: 'idle',
      currentModel: template.currentModel || 'gemini-2.5-flash',
      runtime: 0,
      tokensUsed: 0,
      enabled: true,
      category: 'future',
      logs: template.logs || ['正在拉起自定义智能体计算沙箱...']
    };

    setNodes([...nodes, newNode]);
  };

  const handleUpdateNodeModel = (id: string, modelName: string) => {
    setNodes(prev => prev.map(node => {
      if (node.id === id) {
        return { ...node, currentModel: modelName };
      }
      return node;
    }));
  };

  const handleRunWorkflow = () => {
    setWorkflowState('running');
    // If we were completed or idle, reset all statuses before running
    const anyRunning = nodes.some(n => n.status === 'running');
    if (!anyRunning) {
      setNodes(prev => prev.map(n => n.enabled ? { ...n, status: 'idle', runtime: 0, tokensUsed: 0 } : n));
      setCurrentNodeIdx(-1);
    }
  };

  const handlePauseWorkflow = () => {
    setWorkflowState('paused');
  };

  const handleResetWorkflow = () => {
    setWorkflowState('idle');
    setCurrentNodeIdx(-1);
    setActiveRuntime(0);
    setNodes(prev => prev.map(n => ({
      ...n,
      status: 'idle',
      runtime: 0,
      tokensUsed: 0
    })));
  };

  const handleRetryAgent = (id: string) => {
    setNodes(prev => prev.map(n => {
      if (n.id === id) {
        return { ...n, status: 'retrying', runtime: 0 };
      }
      return n;
    }));

    // Simulating retry completion
    setTimeout(() => {
      setNodes(prev => prev.map(n => {
        if (n.id === id) {
          return { ...n, status: 'completed' };
        }
        return n;
      }));
    }, 2000);
  };

  const selectedDetailsAgent = nodes.find(n => n.id === selectedDetailsAgentId);

  return (
    <div className="space-y-8" id="studio-workspace">
      
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/5 pb-6" id="studio-header">
        <div>
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
            <Workflow className="w-6 h-6 text-neutral-900 dark:text-violet-400" />
            AI 智能分发工坊
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            原生多智能体协同生产线，一键自动实现分析、生图、合成、剪辑与多平台排版。
          </p>
        </div>

        {/* Global Pipeline Metrics */}
        <div className="flex items-center gap-6 text-xs bg-neutral-50 dark:bg-slate-900/40 border border-neutral-200 dark:border-white/5 px-4 py-2.5 rounded-2xl" id="global-studio-metrics">
          <div className="text-left">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-sans">流水线状态</span>
            <span className={`font-semibold uppercase ${
              workflowState === 'running' 
                ? 'text-amber-600 dark:text-violet-400 font-bold' 
                : workflowState === 'completed' 
                ? 'text-emerald-600 dark:text-emerald-400 font-bold' 
                : 'text-neutral-500 dark:text-neutral-400'
            }`}>
              {workflowState === 'idle' ? '等待启动' : workflowState === 'running' ? '高效分析中' : workflowState === 'paused' ? '暂停中' : '全线分析完毕'}
            </span>
          </div>
          <span className="w-px h-6 bg-neutral-200 dark:bg-white/10" />
          <div className="text-left">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-sans">总运行耗时</span>
            <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">{activeRuntime}秒</span>
          </div>
          <span className="w-px h-6 bg-neutral-200 dark:bg-white/10" />
          <div className="text-left">
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-sans">已就绪智能体</span>
            <span className="font-mono font-semibold text-neutral-800 dark:text-neutral-200">
              {nodes.filter(n => n.enabled).length} / {nodes.length} 个智能体
            </span>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {selectedDetailsAgentId && selectedDetailsAgent ? (
          /* Render high-fidelity outputs viewer in-place with animation */
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full"
          >
            <AgentOutputDetails
              agent={selectedDetailsAgent}
              preset={preset}
              providers={providers}
              onUpdateProvider={onUpdateProvider}
              onClose={() => setSelectedDetailsAgentId(null)}
            />
          </motion.div>
        ) : (
          /* Main Studio Grid */
          <motion.div
            key="studio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
            id="studio-grid-view"
          >
            {/* Top Area: Horizontal node builder */}
            <WorkflowBuilder
              nodes={nodes}
              providers={providers}
              onToggleNode={handleToggleNode}
              onMoveNode={handleMoveNode}
              onRemoveNode={handleRemoveNode}
              onUpdateNodeModel={handleUpdateNodeModel}
              onRunWorkflow={handleRunWorkflow}
              onPauseWorkflow={handlePauseWorkflow}
              onResetWorkflow={handleResetWorkflow}
              workflowState={workflowState}
            />

            {/* Grid Layout: Left sidebar (toolbox), Right active grids */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="studio-bento-split">
              {/* Left Toolbox */}
              <div className="lg:col-span-1" id="left-toolbox-rail">
                <AgentLibrary 
                  onAddAgent={handleAddNodeFromLibrary} 
                  activeWorkflowIds={nodes.map(n => n.id)}
                />
              </div>

              {/* Right: Active grid list of agents cards */}
              <div className="lg:col-span-3 space-y-6" id="right-workspace-track">
                <div className="flex items-center justify-between border-b border-neutral-100 dark:border-white/5 pb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-400 font-mono">
                    已激活智能体协同控制台
                  </h3>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-400 dark:text-neutral-500">
                    <Activity className="w-3.5 h-3.5 animate-pulse text-neutral-500 dark:text-violet-500" />
                    <span>智能体集群实时数据同步中</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="cards-grid-list">
                  {nodes.map((node) => (
                    <AgentCard
                      key={node.id}
                      agent={node}
                      onViewDetails={(agentId) => setSelectedDetailsAgentId(agentId)}
                      onRetryAgent={handleRetryAgent}
                      workflowState={workflowState}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
