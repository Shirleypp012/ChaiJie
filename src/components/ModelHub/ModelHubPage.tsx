import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, ShieldCheck, Sparkles, Filter, Star, 
  Image as ImageIcon, Video as VideoIcon, Bookmark, 
  Clock, CheckCircle2, Layers, Zap, Lightbulb, RefreshCw 
} from 'lucide-react';
import { ModelItem, ModelProvider, ProviderCategory } from '../../types';
import { initialModelData } from './modelData';
import ModelCard from './ModelCard';
import ModelDetailDrawer from './ModelDetailDrawer';

interface ModelHubPageProps {
  providers?: ModelProvider[];
  onUpdateProvider?: (id: string, updated: Partial<ModelProvider>) => void;
  onSetDefault?: (id: string, category: ProviderCategory) => void;
}

type TabCategory = 'image' | 'video' | 'default' | 'recent' | 'favorite';

export default function ModelHubPage({ 
  providers, 
  onUpdateProvider, 
  onSetDefault 
}: ModelHubPageProps) {
  const [models, setModels] = useState<ModelItem[]>(initialModelData);
  const [activeTab, setActiveTab] = useState<TabCategory>('image');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(null);

  // Statistics calculation
  const stats = useMemo(() => {
    const imageCount = models.filter(m => m.category === 'image').length;
    const videoCount = models.filter(m => m.category === 'video').length;
    const defaultCount = models.filter(m => m.isDefault).length;
    const connectedCount = models.filter(m => m.status === 'connected').length;
    return { imageCount, videoCount, defaultCount, connectedCount, total: models.length };
  }, [models]);

  // Sidebar Category Navigation Options
  const categories: { id: TabCategory; label: string; icon: any; count?: number; desc: string }[] = [
    { 
      id: 'image', 
      label: '图片生成', 
      icon: ImageIcon, 
      count: stats.imageCount,
      desc: '电商主图、小红书海报、全景爆款KV生成引擎' 
    },
    { 
      id: 'video', 
      label: '视频生成', 
      icon: VideoIcon, 
      count: stats.videoCount,
      desc: '电影级分镜、短视频卡点与微距升格渲染' 
    },
    { 
      id: 'default', 
      label: '默认模型', 
      icon: Star, 
      count: stats.defaultCount,
      desc: '全平台自动化流水线默认优先调用的核心模型' 
    },
    { 
      id: 'recent', 
      label: '最近使用', 
      icon: Clock, 
      desc: '工作流分析复刻中近期活跃调用的AI模型' 
    },
    { 
      id: 'favorite', 
      label: '收藏模型', 
      icon: Bookmark, 
      count: models.filter(m => m.isFavorite).length,
      desc: '团队已设为高频精选推荐的模型资源' 
    }
  ];

  // All available tags for quick filter chips
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    models.forEach(m => m.tags.forEach(t => tagsSet.add(t)));
    return Array.from(tagsSet);
  }, [models]);

  // Filter models based on activeTab, searchQuery, and selectedTagFilter
  const filteredModels = useMemo(() => {
    return models.filter(m => {
      // Category Tab filter
      if (activeTab === 'image' && m.category !== 'image') return false;
      if (activeTab === 'video' && m.category !== 'video') return false;
      if (activeTab === 'default' && !m.isDefault) return false;
      if (activeTab === 'recent' && (!m.lastUsedTime || m.lastUsedTime === '未配置')) return false;
      if (activeTab === 'favorite' && !m.isFavorite) return false;

      // Search Query filter (matches name, vendor, description, capabilities, scenarios)
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = m.name.toLowerCase().includes(q);
        const matchesVendor = m.vendor.toLowerCase().includes(q);
        const matchesDesc = m.description.toLowerCase().includes(q);
        const matchesCap = m.capabilities.some(c => c.toLowerCase().includes(q));
        const matchesScen = m.scenarios.some(s => s.toLowerCase().includes(q));
        const matchesTag = m.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesName && !matchesVendor && !matchesDesc && !matchesCap && !matchesScen && !matchesTag) {
          return false;
        }
      }

      // Selected Tag Filter
      if (selectedTagFilter && !m.tags.includes(selectedTagFilter)) {
        return false;
      }

      return true;
    });
  }, [models, activeTab, searchQuery, selectedTagFilter]);

  // Handler for setting a model as default
  const handleSetDefault = (id: string, category: 'image' | 'video' | 'llm' | 'editor') => {
    setModels(prev => prev.map(m => {
      if (m.category === category) {
        return { ...m, isDefault: m.id === id };
      }
      return m;
    }));

    // If external default handler provided, call it
    if (onSetDefault) {
      onSetDefault(id, category as ProviderCategory);
    }
  };

  // Handler for toggling favorite status
  const handleToggleFavorite = (id: string) => {
    setModels(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, isFavorite: !m.isFavorite };
      }
      return m;
    }));
  };

  // Handler for retesting connection status
  const handleRetestStatus = (id: string) => {
    setTimeout(() => {
      const isSuccess = Math.random() > 0.1;
      setModels(prev => prev.map(m => {
        if (m.id === id) {
          return { ...m, status: isSuccess ? 'connected' : 'failed' };
        }
        return m;
      }));
    }, 800);
  };

  // Handler for updating model properties from drawer
  const handleUpdateModel = (id: string, updated: Partial<ModelItem>) => {
    setModels(prev => prev.map(m => {
      if (m.id === id) {
        const newModel = { ...m, ...updated };
        if (selectedModel && selectedModel.id === id) {
          setSelectedModel(newModel);
        }
        return newModel;
      }
      return m;
    }));
  };

  return (
    <div className="space-y-8 pb-12" id="model-hub-management-container">
      
      {/* Intro Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-6" id="hub-management-header">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest bg-neutral-900 dark:bg-violet-600 text-white px-2.5 py-0.5 rounded-full">
              ENTERPRISE AI MODEL HUB
            </span>
          </div>
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-violet-600 dark:text-violet-400" />
            AI 模型管理中心
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            全方位的视觉与音视频 AI 引擎中心，运营人员可清晰掌控全套模型的场景契合度、速度、成本与画质表现。
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 px-3.5 py-2 rounded-2xl font-mono shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>沙盒引擎运行正常 • 全部模型可即时调用</span>
        </div>
      </div>

      {/* Top Search & Statistics Cards Bar */}
      <div className="space-y-4" id="hub-top-bar">
        {/* Search Input Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-950/60 p-4 rounded-3xl border border-neutral-200/80 dark:border-white/10 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索模型名称、厂商、能力（如：商品一致性、海报、Imagen）..."
              className="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-violet-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
              >
                清除
              </button>
            )}
          </div>

          {/* Quick Stats Counter Chips (4 required metrics) */}
          <div className="flex items-center gap-2 md:gap-4 overflow-x-auto w-full md:w-auto pb-1 md:pb-0" id="top-stats-counters">
            <div className="flex items-center gap-2 bg-neutral-50 dark:bg-white/5 px-3.5 py-2 rounded-2xl border border-neutral-200/60 dark:border-white/5 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">图片模型:</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">{stats.imageCount}</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-50 dark:bg-white/5 px-3.5 py-2 rounded-2xl border border-neutral-200/60 dark:border-white/5 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">视频模型:</span>
              <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">{stats.videoCount}</span>
            </div>
            <div className="flex items-center gap-2 bg-neutral-50 dark:bg-white/5 px-3.5 py-2 rounded-2xl border border-neutral-200/60 dark:border-white/5 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">默认模型:</span>
              <span className="font-mono font-bold text-violet-600 dark:text-violet-400 text-sm">{stats.defaultCount}</span>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50/80 dark:bg-emerald-950/30 px-3.5 py-2 rounded-2xl border border-emerald-200/80 dark:border-emerald-500/30 text-xs">
              <span className="text-emerald-700 dark:text-emerald-300 text-[11px]">在线模型:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-sm">{stats.connectedCount}</span>
            </div>
          </div>
        </div>

        {/* Quick Tag Filters Scroll Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none" id="tag-filter-chips">
          <span className="text-neutral-400 text-[11px] font-mono mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3 h-3" /> 常用标签:
          </span>
          <button
            onClick={() => setSelectedTagFilter(null)}
            className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
              selectedTagFilter === null
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-sm'
                : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10'
            }`}
          >
            全部标签
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTagFilter(selectedTagFilter === tag ? null : tag)}
              className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all shrink-0 cursor-pointer ${
                selectedTagFilter === tag
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 font-semibold shadow-sm'
                  : 'bg-neutral-100 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout Grid: Left Categories, Right Model Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8" id="hub-main-grid">
        
        {/* Left Categories Menu Sidebar */}
        <div className="space-y-2 lg:col-span-1" id="hub-left-sidebar">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = activeTab === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveTab(cat.id);
                  setSelectedTagFilter(null);
                }}
                className={`w-full text-left p-4 rounded-3xl border transition-all flex flex-col gap-1.5 relative overflow-hidden group cursor-pointer ${
                  isActive
                    ? 'bg-neutral-950 dark:bg-violet-600/90 text-white border-neutral-950 dark:border-violet-500 shadow-lg'
                    : 'bg-white dark:bg-slate-950/40 hover:bg-neutral-50 dark:hover:bg-white/[0.04] text-neutral-800 dark:text-neutral-200 border-neutral-200/80 dark:border-white/5'
                }`}
                id={`sidebar-cat-${cat.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-neutral-500 dark:text-neutral-400'}`} />
                    <span className="text-sm font-bold tracking-tight">{cat.label}</span>
                  </div>
                  {cat.count !== undefined && (
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-neutral-100 dark:bg-white/10 text-neutral-600 dark:text-neutral-400'
                    }`}>
                      {cat.count} 个
                    </span>
                  )}
                </div>

                <p className={`text-[11px] leading-relaxed ${
                  isActive ? 'text-neutral-300' : 'text-neutral-500 dark:text-neutral-400'
                }`}>
                  {cat.desc}
                </p>
              </button>
            );
          })}

          {/* Operational Recommendation Box */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-indigo-500/10 border border-violet-200 dark:border-violet-500/20 space-y-2 mt-6">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
              <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400 shrink-0" />
              <span>AI 运营选型指南</span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
              根据您的美妆爆款流转需求，建议主用 <span className="font-semibold text-neutral-900 dark:text-white">Imagen 4 Ultra</span>（图）与 <span className="font-semibold text-neutral-900 dark:text-white">Seedance 2.0</span>（视）作为标准高保真渲染默认引擎。
            </p>
          </div>
        </div>

        {/* Right Area: Model Cards Grid */}
        <div className="lg:col-span-3 space-y-6" id="hub-cards-area">
          
          {/* Contextual Active Category Title & Count */}
          <div className="flex items-center justify-between border-b border-neutral-200/80 dark:border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                {categories.find(c => c.id === activeTab)?.label} 资源库
              </h3>
              <span className="text-xs text-neutral-400 font-mono">
                (共 {filteredModels.length} 个模型)
              </span>
            </div>

            {selectedTagFilter && (
              <span className="text-xs bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30 px-2.5 py-1 rounded-full flex items-center gap-1">
                已筛选: {selectedTagFilter}
                <button onClick={() => setSelectedTagFilter(null)} className="hover:text-rose-500 ml-1">×</button>
              </span>
            )}
          </div>

          {/* Grid View */}
          {filteredModels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="models-grid">
              {filteredModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onSelect={(m) => setSelectedModel(m)}
                  onSetDefault={handleSetDefault}
                  onToggleFavorite={handleToggleFavorite}
                  onRetestStatus={handleRetestStatus}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-slate-950/30 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-white/5 flex items-center justify-center mx-auto text-neutral-400">
                <Search className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">未找到符合条件的模型</p>
              <p className="text-xs text-neutral-400">尝试修改搜索关键字或清除筛选条件</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTagFilter(null);
                  setActiveTab('image');
                }}
                className="mt-2 text-xs bg-neutral-900 text-white px-4 py-2 rounded-xl font-medium"
              >
                重置所有筛选
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Model Detail Drawer Slide-Over */}
      <AnimatePresence>
        {selectedModel && (
          <ModelDetailDrawer
            model={selectedModel}
            onClose={() => setSelectedModel(null)}
            onUpdateModel={handleUpdateModel}
            onSetDefault={handleSetDefault}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
