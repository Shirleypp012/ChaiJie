import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, ChevronRight, CheckCircle2, AlertCircle, 
  Clock, Cpu, RefreshCw, Layers, ShieldQuestion, HelpCircle 
} from 'lucide-react';
import { AgentNode, AgentStatus } from '../types';

interface AgentCardProps {
  key?: string;
  agent: AgentNode;
  onViewDetails: (agentId: string) => void;
  onRetryAgent: (agentId: string) => void;
  workflowState: 'idle' | 'running' | 'paused' | 'completed';
}

export default function AgentCard({
  agent,
  onViewDetails,
  onRetryAgent,
  workflowState
}: AgentCardProps) {
  const [showLogs, setShowLogs] = useState(false);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  // Auto scroll logs simulation when running
  useEffect(() => {
    if (agent.status === 'running') {
      const interval = setInterval(() => {
        setCurrentLogIndex(prev => {
          if (prev < agent.logs.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2200);
      return () => clearInterval(interval);
    } else if (agent.status === 'idle') {
      setCurrentLogIndex(0);
    } else if (agent.status === 'completed') {
      setCurrentLogIndex(agent.logs.length - 1);
    }
  }, [agent.status, agent.logs.length]);

  const statusMeta: Record<AgentStatus, { label: string; bg: string; icon: any }> = {
    idle: { label: '等待中', bg: 'bg-neutral-100 dark:bg-white/5 border-neutral-200 dark:border-white/5 text-neutral-500 dark:text-neutral-400', icon: HelpCircle },
    running: { label: '执行中', bg: 'bg-amber-50 dark:bg-violet-950/30 border-amber-200 dark:border-violet-500/50 text-amber-800 dark:text-violet-300 shadow-[0_0_12px_rgba(139,92,246,0.2)]', icon: RefreshCw },
    completed: { label: '已完成', bg: 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300', icon: CheckCircle2 },
    failed: { label: '执行失败', bg: 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-500/50 text-rose-800 dark:text-rose-300', icon: AlertCircle },
    retrying: { label: '重试中', bg: 'bg-indigo-50 dark:bg-blue-950/30 border-indigo-200 dark:border-blue-500/50 text-indigo-800 dark:text-blue-300', icon: RefreshCw }
  };

  const currentStatus = statusMeta[agent.status];
  const IconComponent = currentStatus.icon;

  return (
    <div 
      className={`bg-white dark:bg-white/[0.05] dark:backdrop-blur-[24px] rounded-3xl border border-neutral-200 dark:border-white/8 p-6 shadow-sm dark:shadow-[0_0_30px_rgba(139,92,246,0.05)] transition-all flex flex-col justify-between overflow-hidden relative group hover:-translate-y-1 hover:shadow-md dark:hover:shadow-[0_0_25px_rgba(139,92,246,0.2)] dark:hover:border-violet-500/50 ${
        agent.status === 'running' 
          ? 'ring-1 ring-amber-400 dark:ring-violet-500 shadow-md dark:shadow-[0_0_20px_rgba(139,92,246,0.35)]' 
          : agent.status === 'completed'
          ? 'border-neutral-300 dark:border-emerald-500/30'
          : 'opacity-90 hover:opacity-100'
      }`}
      id={`agent-card-box-${agent.id}`}
    >
      {/* Background glow when running */}
      {agent.status === 'running' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/5 dark:bg-violet-500/10 rounded-full blur-2xl pointer-events-none animate-pulse" />
      )}
      {agent.status === 'completed' && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/5 dark:bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      )}

      <div>
        {/* Header Block */}
        <div className="flex items-start justify-between gap-3 border-b border-neutral-100 dark:border-white/5 pb-3">
          <div>
            <h3 className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              {agent.name}
              {agent.status === 'running' && (
                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-ping" />
              )}
            </h3>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-sans tracking-wide mt-0.5">模型: {agent.currentModel}</p>
          </div>

          <span className={`text-[10px] font-medium font-sans px-2.5 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${currentStatus.bg}`}>
            <IconComponent className={`w-3 h-3 shrink-0 ${agent.status === 'running' || agent.status === 'retrying' ? 'animate-spin' : ''}`} />
            {currentStatus.label}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mt-3">
          {agent.description}
        </p>

        {/* Live Streaming Thought Logger */}
        {agent.status === 'running' && agent.logs.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-neutral-900 dark:bg-black/40 text-neutral-200 dark:text-neutral-300 font-mono text-[10px] leading-relaxed border border-neutral-800 dark:border-white/5 shadow-inner">
            <div className="flex items-center gap-1.5 text-neutral-400 dark:text-neutral-500 mb-1.5 border-b border-neutral-800 dark:border-white/5 pb-1">
              <Terminal className="w-3 h-3 text-amber-400 dark:text-violet-400" />
              <span className="uppercase tracking-widest font-semibold text-[8px]">智能体实时思维流 (Agent Thought Flow)</span>
            </div>
            <div className="animate-pulse flex items-center gap-1">
              <span className="text-amber-400 dark:text-violet-400 shrink-0">➜</span>
              <span className="truncate">{agent.logs[currentLogIndex]}</span>
            </div>
          </div>
        )}

        {/* Stats Section: Runtime / Tokens */}
        <div className="grid grid-cols-2 gap-4 mt-5 bg-neutral-50 dark:bg-white/5 rounded-2xl p-3 border border-neutral-100/50 dark:border-white/5 text-left">
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-mono tracking-wide text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-neutral-400 dark:text-violet-400" /> 运行耗时
            </span>
            <div className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
              {agent.status === 'running' ? '计秒中...' : `${agent.runtime}秒`}
            </div>
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] uppercase font-mono tracking-wide text-neutral-400 dark:text-neutral-500 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-neutral-400 dark:text-violet-400" /> Token 消耗
            </span>
            <div className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
              {agent.tokensUsed === 0 ? '--' : `${agent.tokensUsed.toLocaleString()} 词`}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Controls: Logs / Retry / Details */}
      <div className="flex items-center justify-between mt-5 pt-3.5 border-t border-neutral-100 dark:border-white/5">
        <button
          onClick={() => setShowLogs(!showLogs)}
          className={`flex items-center gap-1 text-[11px] font-mono transition-all px-2 py-1 rounded-lg ${
            showLogs 
              ? 'bg-neutral-950 dark:bg-violet-600 text-white' 
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5'
          }`}
          title="查看日志"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>控制台日志 (CONSOLE LOG)</span>
        </button>

        <div className="flex items-center gap-1.5">
          {agent.status === 'failed' && (
            <button
              onClick={() => onRetryAgent(agent.id)}
              className="px-2.5 py-1 text-[11px] text-white bg-rose-500 hover:bg-rose-600 font-medium rounded-lg font-mono transition-all"
            >
              重试
            </button>
          )}

          <button
            disabled={agent.status === 'idle'}
            onClick={() => onViewDetails(agent.id)}
            className={`flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all ${
              agent.status === 'idle'
                ? 'bg-neutral-50 dark:bg-white/2 border-neutral-100 dark:border-white/2 text-neutral-300 dark:text-neutral-700 cursor-not-allowed'
                : 'bg-neutral-900 dark:bg-violet-600 hover:bg-neutral-800 dark:hover:bg-violet-500 text-white border-neutral-950 dark:border-violet-600 shadow-sm'
            }`}
          >
            <span>查看结果</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expanded Logs Drawer */}
      <AnimatePresence>
        {showLogs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mt-4 border-t border-neutral-100 dark:border-white/5 pt-3"
            id={`logs-panel-${agent.id}`}
          >
            <div className="bg-neutral-950 dark:bg-black/60 rounded-xl p-3 text-[10px] font-mono text-neutral-400 space-y-1.5 max-h-[150px] overflow-y-auto custom-scrollbar text-left border dark:border-white/5">
              <div className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest border-b border-neutral-800 dark:border-white/5 pb-1 flex justify-between">
                <span>控制台标准输出流 (Console stdout stream)</span>
                <span>系统安全授权盾已就绪</span>
              </div>
              {agent.logs.map((log, lIdx) => (
                <div key={lIdx} className="flex gap-1.5 leading-relaxed">
                  <span className="text-neutral-600">[{lIdx + 1}]</span>
                  <span className={lIdx === currentLogIndex && agent.status === 'running' ? 'text-amber-300 dark:text-violet-400 animate-pulse' : 'text-neutral-300 dark:text-neutral-300'}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
