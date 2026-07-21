import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, Save, Copy, 
  Download, Settings, ArrowLeft, ArrowRight, ToggleLeft, 
  ToggleRight, Check, Sparkles, AlertCircle, ChevronRight, X
} from 'lucide-react';
import { AgentNode, ModelProvider } from '../types';

interface WorkflowBuilderProps {
  nodes: AgentNode[];
  providers: ModelProvider[];
  onToggleNode: (id: string) => void;
  onMoveNode: (index: number, direction: 'left' | 'right') => void;
  onRemoveNode: (id: string) => void;
  onUpdateNodeModel: (id: string, modelName: string) => void;
  onRunWorkflow: () => void;
  onPauseWorkflow: () => void;
  onResetWorkflow: () => void;
  workflowState: 'idle' | 'running' | 'paused' | 'completed';
}

export default function WorkflowBuilder({
  nodes,
  providers,
  onToggleNode,
  onMoveNode,
  onRemoveNode,
  onUpdateNodeModel,
  onRunWorkflow,
  onPauseWorkflow,
  onResetWorkflow,
  workflowState
}: WorkflowBuilderProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [exported, setExported] = useState(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // Get matching providers for a node type
  const getProvidersForNode = (nodeId: string): ModelProvider[] => {
    if (nodeId === 'image-generator') {
      return providers.filter(p => p.category === 'image');
    }
    if (nodeId === 'video-generator') {
      return providers.filter(p => p.category === 'video');
    }
    if (nodeId === 'video-editor') {
      return providers.filter(p => p.category === 'editor');
    }
    return providers.filter(p => p.category === 'llm'); // video analyst, creative strategist, prompt designer, publisher
  };

  const handleCopyWorkflow = () => {
    const serialization = JSON.stringify(nodes.map(n => ({ id: n.id, enabled: n.enabled, model: n.currentModel })), null, 2);
    navigator.clipboard.writeText(serialization);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveWorkflow = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExportWorkflow = () => {
    const serialization = JSON.stringify(nodes, null, 2);
    const blob = new Blob([serialization], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `buv-ai-workflow-export.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-950/40 dark:backdrop-blur-[24px] rounded-3xl border border-neutral-200/80 dark:border-white/5 p-6 shadow-sm dark:shadow-[0_0_30px_rgba(139,92,246,0.1)] space-y-6 relative" id="workflow-builder-root">
      
      {/* Workflow Controls Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-white/5 pb-5" id="workflow-toolbar">
        <div>
          <h3 className="text-sm font-semibold tracking-wide text-neutral-900 dark:text-white uppercase flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-neutral-900 dark:text-violet-400" />
            AI 智能体工作流编排器
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">横向多节点串联机制 · 拖拽平移排序 · 独立参数精细控制</p>
        </div>

        {/* Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-2" id="workflow-action-group">
          {/* Main Execution Controls */}
          <div className="flex items-center bg-neutral-100 dark:bg-white/5 p-1 rounded-xl border border-neutral-200 dark:border-white/5" id="execution-btns">
            {workflowState === 'running' ? (
              <button
                onClick={onPauseWorkflow}
                className="flex items-center gap-1.5 bg-white dark:bg-white/10 text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-white/15 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                title="暂停 Workflow"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>暂停</span>
              </button>
            ) : (
              <button
                onClick={onRunWorkflow}
                className="flex items-center gap-1.5 bg-neutral-950 dark:bg-gradient-to-r dark:from-violet-600 dark:to-indigo-600 dark:hover:from-violet-500 dark:hover:to-indigo-500 dark:shadow-[0_4px_12px_rgba(139,92,246,0.25)] text-white hover:bg-neutral-900 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-all"
                title="一键运行"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>一键运行</span>
              </button>
            )}

            <button
              onClick={onResetWorkflow}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-lg ml-1"
              title="重新运行 / 重置"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="w-px h-5 bg-neutral-200 dark:bg-white/5 hidden sm:inline" />

          {/* Backup Management Actions */}
          <button
            onClick={handleSaveWorkflow}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-neutral-200 dark:border-white/5 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 transition-all shadow-sm"
          >
            {saved ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saved ? '已保存' : '保存'}</span>
          </button>

          <button
            onClick={handleCopyWorkflow}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-neutral-200 dark:border-white/5 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 transition-all shadow-sm"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '已复制' : '复制'}</span>
          </button>

          <button
            onClick={handleExportWorkflow}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border border-neutral-200 dark:border-white/5 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-white/5 hover:bg-neutral-50 dark:hover:bg-white/10 transition-all shadow-sm"
          >
            {exported ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
            <span>{exported ? '已导出' : '导出'}</span>
          </button>
        </div>
      </div>

      {/* Horizontal Workflow nodes list wrapper */}
      <div className="overflow-x-auto pb-4 custom-scrollbar" id="workflow-horizontal-track">
        <div className="flex items-center gap-2 min-w-max px-4 py-2" id="nodes-row">
          {nodes.map((node, index) => {
            const isEnabled = node.enabled;
            const isSelected = selectedNodeId === node.id;
            const nodeProviders = getProvidersForNode(node.id);

            return (
              <div key={node.id} className="flex items-center" id={`node-wrapper-${node.id}`}>
                {/* Visual Glow Connection Wire between nodes */}
                {index > 0 && (
                  <div className="w-10 h-1 relative flex items-center justify-center">
                    <div className={`absolute inset-0 h-[2px] transition-all duration-500 ${
                      workflowState === 'running' && isEnabled
                        ? 'bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.6)]'
                        : 'bg-neutral-200 dark:bg-neutral-800'
                    }`} />
                    <ChevronRight className={`w-3.5 h-3.5 absolute text-neutral-400 dark:text-neutral-650 ${
                      workflowState === 'running' && isEnabled
                        ? 'text-violet-400 animate-bounce'
                        : ''
                    }`} />
                  </div>
                )}

                {/* Node Box */}
                <motion.div
                  layoutId={`node-card-${node.id}`}
                  className={`w-52 p-4 rounded-2xl border transition-all relative group flex flex-col justify-between ${
                    isSelected
                      ? 'border-neutral-950 dark:border-violet-500 bg-neutral-50 dark:bg-violet-950/20 shadow-md dark:shadow-[0_0_20px_rgba(139,92,246,0.3)] ring-1 ring-neutral-950 dark:ring-violet-500/50'
                      : isEnabled
                      ? 'border-neutral-200 dark:border-white/8 bg-white dark:bg-white/[0.05] dark:backdrop-blur-[24px] shadow-sm hover:border-neutral-300 dark:hover:border-violet-500/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] hover:-translate-y-0.5'
                      : 'border-neutral-100 dark:border-white/5 bg-neutral-50/50 dark:bg-white/[0.02] opacity-50 dark:opacity-40'
                  }`}
                  id={`node-card-${node.id}`}
                >
                  {/* Top Header of Node card */}
                  <div className="flex items-start justify-between gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-100 dark:bg-white/5 px-1.5 py-0.5 rounded">
                        0{index + 1}
                      </span>
                      <h4 className="text-xs font-bold text-neutral-950 dark:text-white truncate max-w-[100px]" title={node.name}>
                        {node.name}
                      </h4>
                    </div>

                    {/* Enable/Disable Toggle Switch */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleNode(node.id);
                      }}
                      className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      title={isEnabled ? '禁用节点' : '启用节点'}
                    >
                      {isEnabled ? (
                        <ToggleRight className="w-5 h-5 text-neutral-950 dark:text-violet-400" />
                      ) : (
                        <ToggleLeft className="w-5 h-5 text-neutral-300 dark:text-neutral-700" />
                      )}
                    </button>
                  </div>

                  {/* Body Info */}
                  <div className="my-3 space-y-1 text-left">
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium font-sans truncate">
                      {node.name}
                    </div>
                    {/* Model badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">模型引擎:</span>
                      <span className="text-[9px] font-mono bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/5 text-neutral-800 dark:text-neutral-300 px-1.5 py-0.5 rounded font-semibold truncate max-w-[90px]">
                        {node.currentModel}
                      </span>
                    </div>
                  </div>

                  {/* Move left/right and Config Triggers */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-white/5 mt-1">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {index > 0 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onMoveNode(index, 'left'); }}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                          title="前移"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                      )}
                      {index < nodes.length - 1 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); onMoveNode(index, 'right'); }}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-white/5 rounded text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                          title="后移"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Delete node option if customized */}
                      <button
                        onClick={(e) => { e.stopPropagation(); onRemoveNode(node.id); }}
                        className="text-[9px] text-rose-500 hover:text-rose-700 dark:text-rose-450 font-mono font-medium opacity-0 group-hover:opacity-100 transition-opacity px-1"
                        title="删除节点"
                      >
                        Rem
                      </button>

                      <button
                        onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                        className={`p-1 rounded-md border transition-all ${
                          isSelected ? 'bg-neutral-950 dark:bg-violet-600 text-white border-neutral-950 dark:border-violet-600' : 'bg-white dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-white/5'
                        }`}
                        title="节点配置"
                      >
                        <Settings className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Live execution indicator dot */}
                  {isEnabled && node.status !== 'idle' && (
                    <div className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        node.status === 'running' ? 'bg-amber-400' : node.status === 'completed' ? 'bg-emerald-400' : 'bg-rose-400'
                      }`}></span>
                      <span className={`relative inline-flex rounded-full h-3 w-3 ${
                        node.status === 'running' ? 'bg-amber-500' : node.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}></span>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide-out Node Parameter configuration drawer on the right side of Workflow */}
      <AnimatePresence>
        {selectedNodeId && selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="rounded-2xl border border-neutral-200 dark:border-white/5 bg-neutral-50 dark:bg-slate-950/60 dark:backdrop-blur-xl p-5 mt-4 space-y-4 shadow-inner"
            id="node-config-drawer"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-neutral-900" />
                <h4 className="text-xs font-bold text-neutral-900">
                  节点属性参数配置 - {selectedNode.name}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedNodeId(null)}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-250"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-left">
              {/* Left col: Model choice */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono font-bold">
                  切换模型 / 引擎 (Model Engine)
                </label>
                <div className="space-y-1.5">
                  {getProvidersForNode(selectedNode.id).map(prov => (
                    <button
                      key={prov.id}
                      onClick={() => onUpdateNodeModel(selectedNode.id, prov.selectedModel)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedNode.currentModel === prov.selectedModel
                          ? 'bg-neutral-950 dark:bg-violet-600 text-white border-neutral-950 dark:border-violet-600 shadow-[0_0_12px_rgba(139,92,246,0.2)]'
                          : 'bg-white dark:bg-slate-900/60 hover:bg-neutral-100 dark:hover:bg-slate-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-white/5'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{prov.name}</div>
                        <div className="text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">{prov.selectedModel}</div>
                      </div>
                      {selectedNode.currentModel === prov.selectedModel && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Middle col: Hyperparameters */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono font-bold">
                  AI 生成倾向控制
                </label>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-500 dark:text-neutral-400 mb-1">
                      <span>Temperature (创新发散度)</span>
                      <span className="font-mono text-neutral-900 dark:text-violet-400">0.75</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.05" defaultValue="0.75" className="w-full h-1 bg-neutral-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-violet-500" />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] text-neutral-500 dark:text-neutral-400 mb-1">
                      <span>Max Tokens (最大吐字数)</span>
                      <span className="font-mono text-neutral-900 dark:text-violet-400">2,048</span>
                    </div>
                    <input type="range" min="256" max="4096" step="256" defaultValue="2048" className="w-full h-1 bg-neutral-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-neutral-900 dark:accent-violet-500" />
                  </div>
                </div>

                <div className="space-y-1.5 p-3 bg-white dark:bg-slate-900/40 rounded-xl border border-neutral-200 dark:border-white/5">
                  <div className="font-semibold text-neutral-800 dark:text-neutral-300 text-[10px]">API 连接状态:</div>
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold font-mono text-[9px] mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span>系统已连接且授权已通过 (AUTHENTICATED)</span>
                  </div>
                </div>
              </div>

              {/* Right col: Agent System Prompts */}
              <div className="space-y-2 flex flex-col justify-between">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-mono font-bold block mb-1">
                    智能体系统提示词 (System Prompt)
                  </label>
                  <textarea
                    defaultValue={`你是由 BUV 驱动的“${selectedNode.name}”智能体，专注于高端美妆 analysis 与运营方案生成。请生成排版精美的 Markdown 结构给专业团队。`}
                    className="w-full h-24 bg-white dark:bg-slate-900/60 border border-neutral-200 dark:border-white/5 rounded-xl p-2.5 text-[10px] font-mono text-neutral-700 dark:text-neutral-200 focus:outline-none focus:border-neutral-900 dark:focus:border-violet-500 resize-none leading-relaxed"
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-100 dark:bg-white/5 p-2 rounded-xl border border-neutral-200 dark:border-white/5">
                  <AlertCircle className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>修改系统提示词将即时覆写该 Agent 的默认行为模型。</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
