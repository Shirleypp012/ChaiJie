import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Database, ShieldCheck, RefreshCw, Star, 
  Settings2, Eye, EyeOff, Radio, Check, 
  AlertCircle, HelpCircle, HardDrive, Key, Link2, Clock, RotateCw
} from 'lucide-react';
import { ModelProvider, ProviderCategory } from '../../types';

interface ModelHubPageProps {
  providers: ModelProvider[];
  onUpdateProvider: (id: string, updated: Partial<ModelProvider>) => void;
  onSetDefault: (id: string, category: ProviderCategory) => void;
}

export default function ModelHubPage({ 
  providers, 
  onUpdateProvider, 
  onSetDefault 
}: ModelHubPageProps) {
  const [activeCategory, setActiveCategory] = useState<ProviderCategory>('llm');
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({});
  const [testingStatus, setTestingStatus] = useState<Record<string, 'idle' | 'testing' | 'success' | 'failed'>>({});

  const categories: { id: ProviderCategory; label: string; desc: string }[] = [
    { id: 'llm', label: '大语言模型 (LLM)', desc: '驱动 Video DNA、营销策略分析与智能文案生成' },
    { id: 'image', label: '图片生成模型 (Image)', desc: '驱动高保真产品海报图与镜头背景 Prompt 生成' },
    { id: 'video', label: '视频生成模型 (Video)', desc: '驱动电影级镜头视频渲染、微距动作升格生成' },
    { id: 'editor', label: '视频剪辑引擎 (Editor)', desc: '驱动分镜自动对齐、音视频卡点、字幕与素材合成' }
  ];

  const handleTestConnection = (providerId: string) => {
    setTestingStatus(prev => ({ ...prev, [providerId]: 'testing' }));
    
    // Simulate connection testing
    setTimeout(() => {
      const isSuccess = Math.random() > 0.15; // 85% success rate
      setTestingStatus(prev => ({ 
        ...prev, 
        [providerId]: isSuccess ? 'success' : 'failed' 
      }));
      onUpdateProvider(providerId, { 
        status: isSuccess ? 'connected' : 'failed' 
      });
    }, 1500);
  };

  const toggleShowApiKey = (id: string) => {
    setShowApiKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProviders = providers.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-8" id="model-hub-container">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 pb-6" id="hub-header">
        <div>
          <h2 className="text-2xl font-bold text-neutral-950 tracking-tight flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-neutral-900" />
            模型配置中心 (Model Hub)
          </h2>
          <p className="text-sm text-neutral-500 mt-1">
            统一配置和管理整个逆向实验室的工作流引擎，无缝接入全球顶级 AI 模型。
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>所有 API 密钥均储存在本地沙盒，保障品牌数据安全</span>
        </div>
      </div>

      {/* Grid Layout: Left categories, Right cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="hub-main-grid">
        {/* Left Sidebar Menu */}
        <div className="space-y-2 lg:col-span-1" id="hub-sidebar-tabs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1 ${
                activeCategory === cat.id
                  ? 'bg-neutral-900 text-white border-neutral-950 shadow-sm'
                  : 'bg-white hover:bg-neutral-50 text-neutral-700 border-neutral-200/80'
              }`}
              id={`hub-tab-${cat.id}`}
            >
              <span className="text-sm font-semibold">{cat.label}</span>
              <span className={`text-[11px] leading-relaxed font-light ${
                activeCategory === cat.id ? 'text-neutral-400' : 'text-neutral-500'
              }`}>
                {cat.desc}
              </span>
            </button>
          ))}

          {/* Quick Stats Widget */}
          <div className="rounded-2xl p-4 bg-neutral-50 border border-neutral-200 mt-6 space-y-3">
            <h4 className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-neutral-700" />
              实验室引擎统计
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-600">
                <span>集成 Provider 总数:</span>
                <span className="font-semibold text-neutral-900">{providers.length}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>已连接 API:</span>
                <span className="font-semibold text-emerald-600">
                  {providers.filter(p => p.status === 'connected').length} 个活跃 (Active)
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>默认调用模型:</span>
                <span className="font-semibold text-neutral-900">
                  {providers.filter(p => p.isDefault).length} 个启用 (Enabled)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Area: Provider Configuration Cards */}
        <div className="lg:col-span-3 space-y-6" id="hub-providers-list">
          {filteredProviders.map((provider) => {
            const isTesting = testingStatus[provider.id] === 'testing';
            const testResult = testingStatus[provider.id];

            return (
              <motion.div
                key={provider.id}
                layoutId={`provider-card-${provider.id}`}
                className="bg-white rounded-3xl border border-neutral-200/80 p-6 shadow-sm hover:shadow-md transition-all space-y-6 relative overflow-hidden"
                id={`provider-box-${provider.id}`}
              >
                {/* Glowing border for default provider */}
                {provider.isDefault && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-neutral-900" />
                )}

                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-sm bg-gradient-to-tr ${provider.logo}`}>
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-neutral-900 text-base">{provider.name}</h3>
                        {provider.isDefault && (
                          <span className="flex items-center gap-1 text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded-full font-mono">
                            <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-neutral-400 font-mono">ID: {provider.id}</span>
                    </div>
                  </div>

                  {/* Top quick state and default actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Status Pill */}
                    <span className={`text-[11px] font-mono px-3 py-1 rounded-full border flex items-center gap-1.5 ${
                      provider.status === 'connected'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : provider.status === 'failed'
                        ? 'bg-rose-50 border-rose-200 text-rose-800'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        provider.status === 'connected'
                          ? 'bg-emerald-500 animate-pulse'
                          : provider.status === 'failed'
                          ? 'bg-rose-500'
                          : 'bg-neutral-400'
                      }`} />
                      {provider.status === 'connected' ? '已连接 (Connected)' : provider.status === 'failed' ? '连接失败 (Failed)' : '未配置 (Pending)'}
                    </span>

                    {/* Set Default Button */}
                    {!provider.isDefault && (
                      <button
                        onClick={() => onSetDefault(provider.id, provider.category)}
                        className="text-xs bg-neutral-50 text-neutral-700 hover:bg-neutral-100 px-3 py-1.5 rounded-xl border border-neutral-200 font-medium flex items-center gap-1 transition-all"
                      >
                        <Star className="w-3 h-3 text-neutral-500" />
                        设为默认
                      </button>
                    )}
                  </div>
                </div>

                {/* Configuration Inputs Forms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id={`fields-${provider.id}`}>
                  {/* API Key */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-neutral-500" />
                      API Key
                    </label>
                    <div className="relative">
                      <input
                        type={showApiKeys[provider.id] ? 'text' : 'password'}
                        value={provider.apiKey}
                        onChange={(e) => onUpdateProvider(provider.id, { apiKey: e.target.value })}
                        placeholder="sk-................................"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-950 focus:outline-none focus:border-neutral-900 transition-colors pr-10"
                      />
                      <button
                        onClick={() => toggleShowApiKey(provider.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                      >
                        {showApiKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Endpoint */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                      <Link2 className="w-3.5 h-3.5 text-neutral-500" />
                      API Endpoint
                    </label>
                    <input
                      type="text"
                      value={provider.endpoint}
                      onChange={(e) => onUpdateProvider(provider.id, { endpoint: e.target.value })}
                      placeholder="https://api.example.com/v1"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-950 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  {/* Model Selector & Region */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                      <Radio className="w-3.5 h-3.5 text-neutral-500" />
                      默认模型配置
                    </label>
                    <select
                      value={provider.selectedModel}
                      onChange={(e) => onUpdateProvider(provider.id, { selectedModel: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900 transition-colors"
                    >
                      {provider.availableModels.map(model => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>

                  {/* Region or Workspace */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
                      <HardDrive className="w-3.5 h-3.5 text-neutral-500" />
                      {provider.category === 'editor' ? '云端 Workspace 文件夹' : '服务部署 Region (可选)'}
                    </label>
                    <input
                      type="text"
                      value={provider.region || ''}
                      onChange={(e) => onUpdateProvider(provider.id, { region: e.target.value })}
                      placeholder={provider.category === 'editor' ? 'capcut-project-workspace-1' : 'us-east-1 / auto'}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-950 focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  {/* Timeout / Retry Panel */}
                  <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4 bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        网络连接超时 (秒)
                      </label>
                      <input
                        type="number"
                        value={provider.timeout}
                        onChange={(e) => onUpdateProvider(provider.id, { timeout: parseInt(e.target.value) || 30 })}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-mono text-neutral-950 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 flex items-center gap-1">
                        <RotateCw className="w-3 h-3" />
                        错误自动重试次数
                      </label>
                      <input
                        type="number"
                        value={provider.retryCount}
                        onChange={(e) => onUpdateProvider(provider.id, { retryCount: parseInt(e.target.value) || 3 })}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-mono text-neutral-950 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Test connection triggering */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100 text-xs">
                  <div className="text-neutral-400 font-mono flex items-center gap-1">
                    {provider.apiKey ? (
                      <span className="text-emerald-500 flex items-center gap-1 font-sans">
                        <Check className="w-3.5 h-3.5" /> 密钥有效
                      </span>
                    ) : (
                      <span className="text-amber-500 flex items-center gap-1 font-sans">
                        <AlertCircle className="w-3.5 h-3.5" /> 未配置 API 密钥
                      </span>
                    )}
                  </div>

                  <button
                    disabled={isTesting}
                    onClick={() => handleTestConnection(provider.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                      isTesting
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                        : testResult === 'success'
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                        : testResult === 'failed'
                        ? 'bg-rose-500 hover:bg-rose-600 text-white'
                        : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                    }`}
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        正在测试中 (TESTING...)
                      </>
                    ) : testResult === 'success' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        连接成功 (CONNECTED)
                      </>
                    ) : testResult === 'failed' ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        测试失败 (FAILED)
                      </>
                    ) : (
                      '测试接口连通性'
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
