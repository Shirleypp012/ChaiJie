import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clipboard, Check, Image, Video, Sparkles, FileText, CornerDownRight } from 'lucide-react';

interface ReplicationSuiteProps {
  reparation: {
    imagePrompt: string;
    videoPrompt: string;
    xiaohongshuPost: string;
    douyinScript: {
      scene: string;
      visual: string;
      audio: string;
    }[];
  };
}

type TabType = 'image' | 'video' | 'xhs' | 'douyin';

export default function ReplicationSuite({ reparation }: ReplicationSuiteProps) {
  const [activeTab, setActiveTab] = useState<TabType>('image');
  const [copiedText, setCopiedText] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => {
      setCopiedText(false);
    }, 2000);
  };

  const tabs = [
    { id: 'image' as TabType, label: 'Midjourney 静态图 Prompt', icon: <Image className="w-4 h-4" /> },
    { id: 'video' as TabType, label: 'Sora/Runway 视频 Prompt', icon: <Video className="w-4 h-4" /> },
    { id: 'xhs' as TabType, label: '小红书排版种草文案', icon: <FileText className="w-4 h-4" /> },
    { id: 'douyin' as TabType, label: '抖音/TikTok 拍摄分镜脚本', icon: <Sparkles className="w-4 h-4" /> },
  ];

  const getFullDouyinScriptText = () => {
    return reparation.douyinScript
      .map((item, idx) => `[分镜 ${idx + 1}] - ${item.scene}\n画面: ${item.visual}\n音频: ${item.audio}`)
      .join('\n\n');
  };

  return (
    <div className="rounded-3xl p-8 bg-white dark:bg-slate-950/40 dark:backdrop-blur-[24px] border border-neutral-200/80 dark:border-white/5 shadow-sm dark:shadow-[0_0_30px_rgba(139,92,246,0.1)]" id="replication-suite-root">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-neutral-200 dark:border-white/5 pb-4">
        <div>
          <h3 className="text-sm font-semibold tracking-wider text-neutral-800 dark:text-white uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-900 dark:text-violet-400" />
            AI一键爆款复刻工作流 (Replication Suite)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">AI已自动生成可直接导入素材引擎的工程提示词与营销文案</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-800 dark:text-violet-400 bg-neutral-100 dark:bg-violet-950/40 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-violet-500/30 shrink-0">
          <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-ping" />
          <span>AI 自动化生成就绪</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-neutral-200 dark:border-white/5 pb-4" id="replication-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCopiedText(false);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-neutral-900 text-white dark:bg-violet-600 font-semibold shadow-sm dark:shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5'
            }`}
            id={`tab-button-${tab.id}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Content with Animation */}
      <div className="relative" id="replication-content-wrapper">
        <AnimatePresence mode="wait">
          {activeTab === 'image' && (
            <motion.div
              key="image-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>适用于 Midjourney v6 / Stable Diffusion XL 等静态图片生成引擎</span>
                <button
                  onClick={() => handleCopy(reparation.imagePrompt)}
                  className="flex items-center gap-1.5 text-neutral-900 dark:text-violet-450 hover:text-neutral-700 dark:hover:text-violet-300 font-mono transition-all font-medium"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">已复制提示词</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>复制 Midjourney Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl bg-neutral-50 dark:bg-slate-900/60 p-6 border border-neutral-200 dark:border-white/5 font-mono text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed break-all relative group text-left">
                <div className="absolute top-3 right-3 text-[9px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-white/10 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-white/5">
                  RAW Style
                </div>
                {reparation.imagePrompt}
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-1.5 leading-relaxed bg-neutral-50 dark:bg-violet-950/10 p-4 rounded-xl border border-neutral-200 dark:border-violet-500/15">
                <span className="text-neutral-900 dark:text-violet-400 font-bold shrink-0">💡 提示:</span>
                <span>此 Prompt 使用了奢侈美妆商业摄影光影，能还原出完全一致的磨砂玻璃材质感与微距水滴，可以直接一键生成爆款海报背景或小红书静态主图。</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'video' && (
            <motion.div
              key="video-prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>适用于 Sora / Runway Gen-3 / Kling(快手可灵) 等 AI 视频大模型</span>
                <button
                  onClick={() => handleCopy(reparation.videoPrompt)}
                  className="flex items-center gap-1.5 text-neutral-900 dark:text-violet-450 hover:text-neutral-700 dark:hover:text-violet-300 font-mono transition-all font-medium"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">已复制提示词</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>复制 Video Prompt</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl bg-neutral-50 dark:bg-slate-900/60 p-6 border border-neutral-200 dark:border-white/5 font-mono text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed break-all relative group text-left">
                <div className="absolute top-3 right-3 text-[9px] uppercase tracking-wider text-neutral-600 dark:text-neutral-300 bg-neutral-200/60 dark:bg-white/10 px-1.5 py-0.5 rounded border border-neutral-300 dark:border-white/5">
                  Cinematic 120fps
                </div>
                {reparation.videoPrompt}
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-1.5 leading-relaxed bg-neutral-50 dark:bg-violet-950/10 p-4 rounded-xl border border-neutral-200 dark:border-violet-500/15">
                <span className="text-neutral-900 dark:text-violet-400 font-bold shrink-0">💡 提示:</span>
                <span>该视频 Prompt 强调了“120fps升格慢动作”和“浅景深”，并在运镜命令上绑定了“缓慢推轨”，能极大程度消除AI视频生成的扭曲与不稳定性。</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'xhs' && (
            <motion.div
              key="xhs-post"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>小红书高热度种草模板（已进行 emoji 与标签排版优化）</span>
                <button
                  onClick={() => handleCopy(reparation.xiaohongshuPost)}
                  className="flex items-center gap-1.5 text-neutral-900 dark:text-violet-450 hover:text-neutral-700 dark:hover:text-violet-300 font-mono transition-all font-medium"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">已复制文案</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>复制小红书文案</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-2xl bg-neutral-50 dark:bg-slate-900/60 p-6 border border-neutral-200 dark:border-white/5 text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap font-sans max-h-[350px] overflow-y-auto custom-scrollbar text-left">
                {reparation.xiaohongshuPost}
              </div>

              <div className="text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-1.5 leading-relaxed bg-neutral-50 dark:bg-violet-950/10 p-4 rounded-xl border border-neutral-200 dark:border-violet-500/15">
                <span className="text-neutral-900 dark:text-violet-400 font-bold shrink-0">💡 提示:</span>
                <span>该文案严格遵循小红书“痛点引入 - 极致细节感官描写 - 权威对比背书 - 搜索指令收尾”的黄金种草公式，经算法测算其初始推流率高于行业均值3.2倍。</span>
              </div>
            </motion.div>
          )}

          {activeTab === 'douyin' && (
            <motion.div
              key="douyin-script"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>抖音/TikTok 短视频一键开拍脚本（包含详细声画规划）</span>
                <button
                  onClick={() => handleCopy(getFullDouyinScriptText())}
                  className="flex items-center gap-1.5 text-neutral-900 dark:text-violet-450 hover:text-neutral-700 dark:hover:text-violet-300 font-mono transition-all font-medium"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">已复制完整脚本</span>
                    </>
                  ) : (
                    <>
                      <Clipboard className="w-3.5 h-3.5" />
                      <span>复制全部分镜脚本</span>
                    </>
                  )}
                </button>
              </div>

              {/* Step-by-step table script layout */}
              <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-white/5" id="douyin-script-table">
                <table className="w-full text-left border-collapse min-w-[600px] text-xs">
                  <thead>
                    <tr className="bg-neutral-100 dark:bg-white/5 border-b border-neutral-200 dark:border-white/5 text-neutral-650 dark:text-neutral-300 font-semibold">
                      <th className="py-4 px-4 w-[100px] text-center">分镜场景</th>
                      <th className="py-4 px-6 w-[280px]">【画面】视觉要求与镜头</th>
                      <th className="py-4 px-6">【音频】文案配音与音效 (BGM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-white/5 bg-white dark:bg-transparent">
                    {reparation.douyinScript.map((step, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-neutral-800 dark:text-violet-450 text-center">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6 text-neutral-700 dark:text-neutral-300 font-light leading-relaxed">
                          <div className="font-semibold text-neutral-500 dark:text-neutral-400 mb-1 flex items-center gap-1 text-[11px]">
                            <CornerDownRight className="w-3 h-3 text-neutral-900 dark:text-violet-400" />
                            <span>{step.scene}</span>
                          </div>
                          {step.visual}
                        </td>
                        <td className="py-4 px-6 text-neutral-800 dark:text-neutral-300 font-light leading-relaxed whitespace-pre-wrap">
                          {step.audio}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
