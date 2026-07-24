import { useState } from 'react';
import { 
  X, Check, Star, Settings2, Key, Link2, 
  Clock, RotateCw, Layers, ShieldCheck, Sparkles, 
  Eye, EyeOff, Save, RefreshCw, Zap, Lightbulb, Activity, CheckCircle2, AlertTriangle, XCircle
} from 'lucide-react';
import { ModelItem } from '../../types';
import StarRating from './StarRating';
import CapabilityBadge from './CapabilityBadge';
import StatusBadge from './StatusBadge';

interface ModelDetailDrawerProps {
  model: ModelItem | null;
  onClose: () => void;
  onUpdateModel: (id: string, updated: Partial<ModelItem>) => void;
  onSetDefault: (id: string, category: 'image' | 'video' | 'llm' | 'editor') => void;
  onToggleFavorite: (id: string) => void;
}

export default function ModelDetailDrawer({
  model,
  onClose,
  onUpdateModel,
  onSetDefault,
  onToggleFavorite
}: ModelDetailDrawerProps) {
  if (!model) return null;

  const [showAdvancedConfig, setShowAdvancedConfig] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Editable config state
  const [apiKey, setApiKey] = useState(model.apiKey || '');
  const [baseUrl, setBaseUrl] = useState(model.baseUrl || '');
  const [modelCode, setModelCode] = useState(model.modelCode || '');
  const [timeoutSeconds, setTimeoutSeconds] = useState(model.timeoutSeconds || 30);
  const [maxRetries, setMaxRetries] = useState(model.maxRetries || 3);
  const [concurrency, setConcurrency] = useState(model.concurrency || 10);

  const isImageModel = model.category === 'image';

  const handleSaveConfig = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateModel(model.id, {
        apiKey,
        baseUrl,
        modelCode,
        timeoutSeconds,
        maxRetries,
        concurrency,
        status: apiKey ? 'connected' : 'pending'
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 600);
  };

  const handleTestConnection = () => {
    setIsTesting(true);
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15;
      onUpdateModel(model.id, {
        status: isSuccess ? 'connected' : 'failed'
      });
      setIsTesting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-neutral-950/40 backdrop-blur-sm animate-in fade-in duration-200" id="model-detail-drawer">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0C0E14] text-neutral-900 dark:text-neutral-100 shadow-2xl h-full flex flex-col justify-between border-l border-neutral-200 dark:border-white/10 z-10 overflow-y-auto" id="drawer-content-box">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-neutral-200/80 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/90 dark:bg-[#0C0E14]/90 backdrop-blur-md z-20">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-base shadow-md bg-gradient-to-tr ${model.logoGradient}`}>
              {model.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-neutral-950 dark:text-white tracking-tight">{model.name}</h3>
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                  model.badgeType === '稳定版'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/30'
                }`}>
                  {model.badgeType}
                </span>
              </div>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                {model.vendor} • {model.version} • 更新日期: {model.updateTime}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body Scroll Content */}
        <div className="p-6 space-y-6 flex-1 text-left">

          {/* Quick Action Bar & Connection Status */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-50 dark:bg-white/[0.02] rounded-2xl border border-neutral-200/80 dark:border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-mono">状态:</span>
              <StatusBadge status={model.status} onRetest={handleTestConnection} />
            </div>

            <div className="flex items-center gap-2">
              {!model.isDefault ? (
                <button
                  onClick={() => onSetDefault(model.id, model.category)}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-violet-600 dark:hover:bg-violet-500 text-white px-3 py-1.5 rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                  设为默认{isImageModel ? '图片' : '视频'}模型
                </button>
              ) : (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-xl">
                  <Check className="w-4 h-4" /> 当前系统默认引擎
                </span>
              )}
            </div>
          </div>

          {/* AI Operational Tip / Recommendation Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-200 dark:border-violet-500/30 space-y-2">
            <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-semibold text-xs">
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>AI 运营推荐提示</span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">
              {isImageModel ? (
                <>如果当前工作流需要<strong className="text-neutral-900 dark:text-white font-semibold">【爆款小红书封面】</strong>或<strong className="text-neutral-900 dark:text-white font-semibold">【美妆商业海报】</strong>，本模型凭借卓越的光影纹理与场景适配度，能大幅提升画面点击率与转粉转化率。</>
              ) : (
                <>在制作<strong className="text-neutral-900 dark:text-white font-semibold">【前3秒高倍吸引镜头】</strong>与<strong className="text-neutral-900 dark:text-white font-semibold">【质地升格慢动作】</strong>时，本模型能高保真还原流体质感与微距物理连贯性。</>
              )}
            </p>
          </div>

          {/* Section 1: Overview & Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
              模型简介与定位
            </h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-200 leading-relaxed">
              {model.description}
            </p>
          </div>

          {/* Section 2: Recommended Scenarios */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              核心适用场景与推荐用途
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {model.scenarios.map((scen) => (
                <div key={scen} className="p-3 rounded-xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0" />
                  <span className="text-xs text-neutral-800 dark:text-neutral-200 font-medium">{scen}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Supported Capabilities */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
              支持能力标签
            </h4>
            <div className="flex flex-wrap gap-2">
              {model.capabilities.map((cap) => (
                <CapabilityBadge key={cap} capability={cap} size="md" />
              ))}
            </div>
          </div>

          {/* Section 4: Specifications & Cost Breakdown */}
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
              生成规格与成本说明
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <span className="text-neutral-400 text-[10px] block font-sans">支持尺寸 / 画幅</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{model.outputSizes.join(', ')}</span>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] block font-sans">输出格式</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{model.outputFormats.join(', ')}</span>
              </div>
              <div>
                <span className="text-neutral-400 text-[10px] block font-sans">估算成本</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{model.costDesc}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200/60 dark:border-white/5 text-xs">
              <span className="text-neutral-400 text-[10px] block font-sans">推荐搭配工作流</span>
              <p className="text-neutral-800 dark:text-neutral-200 font-medium mt-0.5">{model.recommendedWorkflow}</p>
            </div>
          </div>

          {/* Section 5: Ratings Breakdown */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
              运营多维评分
            </h4>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              <StarRating label={isImageModel ? "图片质量" : "视频质量"} rating={model.ratings.quality} highlight={true} />
              <StarRating label="生成速度" rating={model.ratings.speed} />
              <StarRating label="成本控制" rating={model.ratings.cost} />
              <StarRating label="运营推荐" rating={model.ratings.recommendation} highlight={true} />
            </div>
          </div>

          {/* Section 6: Advanced Config (DEFAULT COLLAPSED) */}
          <div className="pt-4 border-t border-neutral-200/80 dark:border-white/10 space-y-4">
            <button
              onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-100/80 dark:bg-white/5 hover:bg-neutral-200/60 dark:hover:bg-white/10 transition-all text-xs font-semibold cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Settings2 className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="text-neutral-900 dark:text-white">高级参数配置 (开发者 / API 部署)</span>
              </div>
              <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                {showAdvancedConfig ? '点击折叠 ▲' : '点击展开 ▼'}
              </span>
            </button>

            {/* Collapsible Config Form */}
            {showAdvancedConfig && (
              <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-[#07090F] border border-neutral-200 dark:border-white/10 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pb-2 border-b border-neutral-200 dark:border-white/5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>所有密钥均经本地安全加密，仅在您的专属沙盒运行</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  {/* API Key */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-neutral-400" /> API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-................................"
                        className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-violet-500 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Base URL */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-neutral-400" /> Base URL / Service Endpoint
                    </label>
                    <input
                      type="text"
                      value={baseUrl}
                      onChange={(e) => setBaseUrl(e.target.value)}
                      placeholder="https://api.example.com/v1"
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-violet-500"
                    />
                  </div>

                  {/* Model Code */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-neutral-400" /> 模型标识 (Model Code)
                    </label>
                    <input
                      type="text"
                      value={modelCode}
                      onChange={(e) => setModelCode(e.target.value)}
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-violet-500"
                    />
                  </div>

                  {/* Timeout */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" /> 超时时间 (秒)
                    </label>
                    <input
                      type="number"
                      value={timeoutSeconds}
                      onChange={(e) => setTimeoutSeconds(parseInt(e.target.value) || 30)}
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-violet-500"
                    />
                  </div>

                  {/* Max Retries */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-1">
                      <RotateCw className="w-3.5 h-3.5 text-neutral-400" /> 最大重试次数
                    </label>
                    <input
                      type="number"
                      value={maxRetries}
                      onChange={(e) => setMaxRetries(parseInt(e.target.value) || 3)}
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-violet-500"
                    />
                  </div>

                  {/* Concurrency */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-700 dark:text-neutral-300 font-semibold flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-neutral-400" /> 最大并发线程数量
                    </label>
                    <input
                      type="number"
                      value={concurrency}
                      onChange={(e) => setConcurrency(parseInt(e.target.value) || 10)}
                      className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-neutral-950 dark:text-white focus:outline-none focus:border-neutral-900 dark:focus:border-violet-500"
                    />
                  </div>
                </div>

                {/* Advanced Config Buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-white/5">
                  <button
                    type="button"
                    disabled={isTesting}
                    onClick={handleTestConnection}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium font-mono border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-violet-500' : ''}`} />
                    <span>{isTesting ? '测试中...' : '测试接口连通性'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={handleSaveConfig}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-violet-600 dark:hover:bg-violet-500 text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {isSaving ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : saveSuccess ? (
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>{isSaving ? '保存中...' : saveSuccess ? '配置已保存!' : '保存配置'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
