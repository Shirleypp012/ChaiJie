import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, RotateCcw, Share2, Compass, Cpu, 
  Flame, FileVideo, Eye, Heart, Bookmark, User, 
  LayoutDashboard, Star, Smartphone, Activity, 
  Moon, Sun, Settings2, Workflow, Database, Globe
} from 'lucide-react';
import { mockPresets } from './mockData';
import { MockVideoPreset, ModelProvider, ProviderCategory } from './types';
import UploadZone from './components/UploadZone';
import AnalyzingState from './components/AnalyzingState';
import ScoreCards from './components/ScoreCards';
import TimelineSect from './components/TimelineSect';
import VisualAnalysis from './components/VisualAnalysis';
import ReplicationSuite from './components/ReplicationSuite';
import ViralSummary from './components/ViralSummary';
import FeatureCarousel from './components/FeatureCarousel';

// New Modular Sub-Pages Imports
import AgentStudioPage from './components/AgentStudioPage';
import ModelHubPage from './components/ModelHub/ModelHubPage';

type AppState = 'home' | 'analyzing' | 'report';
type RoleType = 'xhs_op' | 'douyin_op' | 'brand_planner' | 'ecommerce_op';
type ActiveTab = 'reverse' | 'studio' | 'hub';

export default function App() {
  const [state, setState] = useState<AppState>('home');
  const [selectedPreset, setSelectedPreset] = useState<MockVideoPreset>(mockPresets[0]);
  const [videoSource, setVideoSource] = useState('');
  const [activeRole, setActiveRole] = useState<RoleType>('xhs_op');
  
  // Navigation Routing States
  const [activeTab, setActiveTab] = useState<ActiveTab>('reverse');
  
  // Premium Theme State: Defaults to Elegant Light Mode as requested by the Chinese customer!
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Initialize centralized Model Providers
  const [providers, setProviders] = useState<ModelProvider[]>([
    {
      id: 'gemini',
      name: 'Google Gemini',
      category: 'llm',
      logo: 'from-blue-600 via-indigo-500 to-cyan-500',
      apiKey: 'GEMINI_API_KEY_PRESET_CONNECTED',
      endpoint: 'https://generativelanguage.googleapis.com',
      selectedModel: 'gemini-2.5-pro',
      availableModels: ['gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.0-flash-exp'],
      timeout: 30,
      retryCount: 3,
      status: 'connected',
      isDefault: true
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      category: 'llm',
      logo: 'from-emerald-600 to-zinc-900',
      apiKey: '',
      endpoint: 'https://api.openai.com/v1',
      selectedModel: 'gpt-4o',
      availableModels: ['gpt-4o', 'gpt-4o-mini', 'o1-pro'],
      timeout: 30,
      retryCount: 3,
      status: 'unconfigured',
      isDefault: false
    },
    {
      id: 'claude',
      name: 'Anthropic Claude',
      category: 'llm',
      logo: 'from-orange-600 to-amber-500',
      apiKey: '',
      endpoint: 'https://api.anthropic.com/v1',
      selectedModel: 'claude-3-5-sonnet',
      availableModels: ['claude-3-5-sonnet', 'claude-3-opus', 'claude-3-5-haiku'],
      timeout: 30,
      retryCount: 3,
      status: 'unconfigured',
      isDefault: false
    },
    {
      id: 'deepseek',
      name: 'DeepSeek',
      category: 'llm',
      logo: 'from-blue-700 to-blue-950',
      apiKey: '',
      endpoint: 'https://api.deepseek.com/v1',
      selectedModel: 'deepseek-chat',
      availableModels: ['deepseek-chat', 'deepseek-coder'],
      timeout: 30,
      retryCount: 3,
      status: 'unconfigured',
      isDefault: false
    },
    {
      id: 'flux',
      name: 'FLUX.1 Pro',
      category: 'image',
      logo: 'from-amber-500 via-red-500 to-pink-500',
      apiKey: 'FLUX_PRO_SANDBOX_ACTIVE',
      endpoint: 'https://api.replicate.com/v1',
      selectedModel: 'flux-dev',
      availableModels: ['flux-dev', 'flux-schnell', 'flux-pro'],
      timeout: 45,
      retryCount: 3,
      status: 'connected',
      isDefault: true
    },
    {
      id: 'midjourney',
      name: 'Midjourney v6',
      category: 'image',
      logo: 'from-blue-600 to-cyan-500',
      apiKey: '',
      endpoint: 'https://api.midjourney.com/v1',
      selectedModel: 'v6.0',
      availableModels: ['v6.0', 'v5.2', 'niji 6'],
      timeout: 60,
      retryCount: 2,
      status: 'unconfigured',
      isDefault: false
    },
    {
      id: 'runway',
      name: 'Runway Gen-3',
      category: 'video',
      logo: 'from-purple-800 to-purple-600',
      apiKey: 'RUNWAY_GEN3_PRE_PROVISIONED',
      endpoint: 'https://api.runwayml.com/v1',
      selectedModel: 'gen3-alpha',
      availableModels: ['gen3-alpha', 'gen3-turbo'],
      timeout: 90,
      retryCount: 2,
      status: 'connected',
      isDefault: true
    },
    {
      id: 'sora',
      name: 'OpenAI Sora',
      category: 'video',
      logo: 'from-zinc-950 to-zinc-700',
      apiKey: '',
      endpoint: 'https://api.openai.com/v1/videos',
      selectedModel: 'sora-v1',
      availableModels: ['sora-v1'],
      timeout: 120,
      retryCount: 1,
      status: 'unconfigured',
      isDefault: false
    },
    {
      id: 'capcut',
      name: 'CapCut Cloud API',
      category: 'editor',
      logo: 'from-neutral-900 to-neutral-700',
      apiKey: 'CAPCUT_WORKFLOW_ACTIVE_TOKEN',
      endpoint: 'https://open-api.capcut.com/v1',
      selectedModel: 'capcut-v4.0',
      availableModels: ['capcut-v4.0', 'capcut-lite'],
      timeout: 60,
      retryCount: 3,
      status: 'connected',
      isDefault: true
    }
  ]);

  const roleMeta = {
    xhs_op: { label: '小红书运营', desc: '关注情绪氛围、图文排版和美学种草' },
    douyin_op: { label: '抖音运营', desc: '关注前3秒钩子、节奏卡点和高倍转化' },
    brand_planner: { label: '品牌策划', desc: '关注视觉定位、心智塑造与高奢格调' },
    ecommerce_op: { label: '电商运营', desc: '关注硬核证言、痛点拆解和流量转化率' }
  };

  const handleStartAnalysis = (source: string, preset: MockVideoPreset) => {
    setVideoSource(source);
    setSelectedPreset(preset);
    setState('analyzing');
  };

  const handleAnalysisComplete = () => {
    setState('report');
  };

  const handleReset = () => {
    setState('home');
    setVideoSource('');
  };

  const handleUpdateProvider = (id: string, updated: Partial<ModelProvider>) => {
    setProviders(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  const handleSetDefaultProvider = (id: string, category: ProviderCategory) => {
    setProviders(prev => prev.map(p => {
      if (p.category === category) {
        return { ...p, isDefault: p.id === id };
      }
      return p;
    }));
  };

  // Sync isDarkMode class onto html body for seamless theme styling
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-neutral-500 selection:text-white relative overflow-x-hidden font-sans pb-20 motionsites-grid ${
      isDarkMode 
        ? 'bg-[#09090B] text-neutral-100' 
        : 'bg-[#FBFBFD] text-neutral-800'
    }`} id="app-wrapper">
      
      {/* Absolute Decorative ambient backlights */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-opacity ${
        isDarkMode ? 'bg-neutral-800/10' : 'bg-neutral-200/30'
      }`} />
      <div className={`absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl pointer-events-none transition-opacity ${
        isDarkMode ? 'bg-neutral-900/20' : 'bg-neutral-100/50'
      }`} />
      <div className={`absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-opacity ${
        isDarkMode ? 'bg-neutral-800/10' : 'bg-neutral-200/20'
      }`} />

      {/* Global Header */}
      <header className={`border-b sticky top-0 z-50 px-6 py-4 transition-all backdrop-blur-md ${
        isDarkMode 
          ? 'border-neutral-900 bg-neutral-950/80' 
          : 'border-neutral-200 bg-white/80'
      }`} id="global-header">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo Brand Block */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset} id="logo-trigger">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
              isDarkMode ? 'bg-white text-neutral-950' : 'bg-neutral-950 text-white'
            }`}>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="text-left">
              <h1 className={`text-sm font-semibold tracking-wide font-mono uppercase ${
                isDarkMode ? 'text-white' : 'text-neutral-950'
              }`}>
                BUV AI 爆款内容逆向实验室
              </h1>
              <p className="text-[10px] text-neutral-500 tracking-widest uppercase font-sans">
                美妆爆款内容智能逆向及分发链路
              </p>
            </div>
          </div>

          {/* Navigation Primary Tabs */}
          <div className={`flex items-center gap-1 p-1 rounded-2xl border ${
            isDarkMode ? 'bg-neutral-900/60 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
          }`} id="nav-tabs-bar">
            {[
              { id: 'reverse', label: '逆向实验室', icon: Compass },
              { id: 'studio', label: '智能分发工坊', icon: Workflow },
              { id: 'hub', label: '模型配置中心', icon: Database }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? isDarkMode
                        ? 'bg-neutral-800 text-white shadow-sm ring-1 ring-neutral-700/50'
                        : 'bg-white text-neutral-950 shadow-sm border border-neutral-200/50'
                      : isDarkMode
                      ? 'text-neutral-400 hover:text-white hover:bg-neutral-800/30'
                      : 'text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                  id={`tab-btn-${tab.id}`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Header Controls (Theme, Role Profile) */}
          <div className="flex items-center justify-end gap-3" id="header-controls">
            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border transition-all ${
                isDarkMode 
                  ? 'bg-neutral-900 border-neutral-800 text-amber-400 hover:bg-neutral-800' 
                  : 'bg-white border-neutral-200 text-neutral-500 hover:bg-neutral-50'
              }`}
              title={isDarkMode ? '切换到极简白模式' : '切换到曜石黑模式'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Dropdown */}
            <div className={`hidden lg:flex items-center gap-2 border px-3.5 py-1.5 rounded-xl text-xs ${
              isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
            }`}>
              <span className="text-neutral-500 font-mono">PROFILE:</span>
              <select
                value={activeRole}
                onChange={(e) => setActiveRole(e.target.value as RoleType)}
                className={`bg-transparent font-medium outline-none cursor-pointer border-none p-0 focus:ring-0 text-xs ${
                  isDarkMode ? 'text-white' : 'text-neutral-950'
                }`}
                id="role-select"
              >
                {Object.entries(roleMeta).map(([key, val]) => (
                  <option key={key} value={key} className={isDarkMode ? 'bg-neutral-950 text-neutral-300' : 'bg-white text-neutral-850'}>
                    {val.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 mt-12 relative z-10" id="main-content">
        
        <AnimatePresence mode="wait">
          
          {/* ======================================================== */}
          {/* TAB 1: REVERSE LAB FLOW (ORIGINAL FLOW) */}
          {/* ======================================================== */}
          {activeTab === 'reverse' && (
            <motion.div
              key="reverse-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {state === 'home' && (
                  <motion.div
                    key="home-state"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-12"
                  >
                    {/* Product Hero */}
                    <div className="text-center max-w-3xl mx-auto space-y-4" id="hero-banner">
                      <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs mb-2 font-mono ${
                        isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-800'
                      }`}>
                        <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                        <span>美妆视频内容逆向工程学实验室</span>
                      </div>
                      
                      <h2 className={`text-4xl md:text-5xl font-bold tracking-tight leading-tight ${
                        isDarkMode ? 'text-white' : 'text-neutral-950'
                      }`} id="hero-headline">
                        拆解爆款视频背后的秘密
                      </h2>
                      <p className={`text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed ${
                        isDarkMode ? 'text-neutral-400' : 'text-neutral-650'
                      }`} id="hero-subtext">
                        针对中国高端美妆品牌运营团队打造。AI深度重构每一个镜头和声轨，将无形的情绪引流公式工程化，帮助团队快速复刻高转化、高投流爆款内容。
                      </p>

                      {/* Sub info about roles */}
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-4 text-xs text-neutral-500" id="hero-roles-display">
                        <span>已适配专业线:</span>
                        {Object.values(roleMeta).map((role) => (
                          <span key={role.label} className={`border px-2.5 py-1 rounded-full ${
                            isDarkMode ? 'bg-neutral-900/50 border-neutral-800 text-neutral-400' : 'bg-neutral-100 border-neutral-200 text-neutral-600'
                          }`}>
                            {role.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Step Carousel Work Flow Pipeline */}
                    <FeatureCarousel />

                    {/* Upload Zone Component */}
                    <div className={isDarkMode ? 'theme-dark' : 'theme-light'}>
                      <UploadZone onStartAnalysis={handleStartAnalysis} />
                    </div>
                  </motion.div>
                )}

                {state === 'analyzing' && (
                  <motion.div
                    key="analyzing-state"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AnalyzingState videoName={videoSource} onComplete={handleAnalysisComplete} />
                  </motion.div>
                )}

                {state === 'report' && (
                  <motion.div
                    key="report-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    {/* Report Header Block */}
                    <div className={`rounded-3xl p-6 md:p-8 border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                      isDarkMode ? 'bg-neutral-900/80 border-neutral-800' : 'bg-white border-neutral-200'
                    }`} id="report-header-panel">
                      <div className="space-y-3 text-left">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[10px] font-mono tracking-widest bg-neutral-900 border border-neutral-850 px-3 py-1 rounded text-white uppercase font-semibold">
                            REVERSE REPORT
                          </span>
                          <span className="text-xs text-neutral-500 font-mono">
                            任务 ID: BUV-REV-{selectedPreset.id.toUpperCase()}
                          </span>
                          <span className={`text-xs font-mono px-2.5 py-0.5 rounded border ${
                            isDarkMode ? 'bg-neutral-800 border-neutral-700 text-neutral-300' : 'bg-neutral-100 border-neutral-200 text-neutral-700'
                          }`}>
                            当前视角: {roleMeta[activeRole].label}
                          </span>
                        </div>
                        <h2 className={`text-xl md:text-2xl font-semibold tracking-tight ${
                          isDarkMode ? 'text-white' : 'text-neutral-900'
                        }`}>
                          {selectedPreset.title}
                        </h2>
                        
                        {/* Metadata statistics tags */}
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-500 font-mono pt-1" id="report-metadata-row">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4 text-neutral-400" />
                            <span>博主: <span className={isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}>{selectedPreset.author}</span></span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Smartphone className="w-4 h-4 text-neutral-400" />
                            <span>渠道: <span className={isDarkMode ? 'text-neutral-200' : 'text-neutral-800'}>{selectedPreset.platform}</span></span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-rose-500" />
                            <span>{selectedPreset.likes} 赞</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Share2 className="w-3.5 h-3.5 text-neutral-600" />
                            <span>{selectedPreset.shares} 分享</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                            <span>{selectedPreset.saves} 收藏</span>
                          </div>
                        </div>
                      </div>

                      {/* Back / Restart Actions */}
                      <div className="flex items-center gap-3 shrink-0" id="report-actions">
                        {/* Preset Quick History Swapper */}
                        <div className={`flex items-center gap-2 border px-3 py-1.5 rounded-xl ${
                          isDarkMode ? 'bg-neutral-800/50 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
                        }`}>
                          <span className="text-[10px] text-neutral-400 font-mono uppercase">载入历史:</span>
                          <select
                            value={selectedPreset.id}
                            onChange={(e) => {
                              const nextPreset = mockPresets.find(p => p.id === e.target.value);
                              if (nextPreset) setSelectedPreset(nextPreset);
                            }}
                            className={`bg-transparent text-xs font-medium border-none outline-none focus:ring-0 p-0 cursor-pointer ${
                              isDarkMode ? 'text-white' : 'text-neutral-900'
                            }`}
                            id="history-select"
                          >
                            {mockPresets.map(p => (
                              <option key={p.id} value={p.id} className={isDarkMode ? 'bg-neutral-950 text-neutral-300' : 'bg-white text-neutral-800'}>
                                {p.productName} ({p.platform})
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          onClick={handleReset}
                          className="flex items-center gap-2 bg-neutral-950 hover:bg-neutral-900 text-white font-medium text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm shrink-0"
                          id="new-analysis-btn"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>逆向新视频</span>
                        </button>
                      </div>
                    </div>

                    {/* Score Cards Grid */}
                    <div className={isDarkMode ? 'text-white [&_div]:bg-neutral-900/60 [&_div]:border-neutral-800' : ''}>
                      <ScoreCards 
                        score={selectedPreset.viralScore} 
                        metrics={selectedPreset.metrics} 
                        platform={selectedPreset.platform}
                      />
                    </div>

                    {/* Executive Summary */}
                    <div className={isDarkMode ? '[&_div]:bg-neutral-900/60 [&_div]:border-neutral-800 text-white' : ''}>
                      <ViralSummary summary={selectedPreset.summary} />
                    </div>

                    {/* Timeline Breakdown */}
                    <div className={isDarkMode ? '[&_.bg-white]:bg-neutral-900/40 [&_.border-neutral-200]:border-neutral-800 [&_span]:text-white [&_p]:text-neutral-400 [&_h4]:text-white text-white' : ''}>
                      <TimelineSect timeline={selectedPreset.timeline} />
                    </div>

                    {/* Aesthetics Analysis */}
                    <div className={isDarkMode ? '[&_.bg-white]:bg-neutral-900/40 [&_.border-neutral-200]:border-neutral-800 [&_div]:text-white text-white' : ''}>
                      <VisualAnalysis visuals={selectedPreset.visuals} />
                    </div>

                    {/* Content Replication Suite */}
                    <div className={isDarkMode ? '[&_.bg-white]:bg-neutral-900/40 [&_.border-neutral-200]:border-neutral-800 [&_div]:text-white text-white' : ''}>
                      <ReplicationSuite reparation={selectedPreset.reparation} />
                    </div>

                    {/* Disclaimer block */}
                    <div className={`rounded-2xl p-6 border text-center text-xs text-neutral-500 max-w-2xl mx-auto ${
                      isDarkMode ? 'bg-neutral-900/40 border-neutral-800' : 'bg-neutral-100 border-neutral-200'
                    }`} id="report-disclaimer">
                      <p>《BUV AI 爆款内容逆向实验室》专为美妆团队提供创意灵感与工业化分析决策。</p>
                      <p className="mt-1 font-mono text-[10px]">
                        BUV CONTENT INSIGHT SYSTEM. ALL ANALYSIS DATA GENERATED FOR INNOVATION DEMO.
                      </p>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: AI AGENT STUDIO (NEW PLATFORM CORE) */}
          {/* ======================================================== */}
          {activeTab === 'studio' && (
            <motion.div
              key="studio-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={isDarkMode ? 'dark [&_.bg-white]:bg-neutral-900/80 [&_.border-neutral-200\\/80]:border-neutral-800 [&_.border-neutral-200]:border-neutral-800 [&_.bg-neutral-100]:bg-neutral-800 [&_.bg-neutral-50]:bg-neutral-950 [&_.border-neutral-100]:border-neutral-800 [&_.text-neutral-900]:text-white [&_.text-neutral-950]:text-white [&_.text-neutral-850]:text-neutral-200 [&_.text-neutral-800]:text-neutral-100 [&_.text-neutral-700]:text-neutral-300 [&_.text-neutral-600]:text-neutral-400 [&_.text-neutral-500]:text-neutral-400' : ''}
            >
              <AgentStudioPage
                preset={selectedPreset}
                providers={providers}
                onUpdateProvider={handleUpdateProvider}
                onSetDefaultProvider={handleSetDefaultProvider}
              />
            </motion.div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: MODEL CONFIGURATION HUB */}
          {/* ======================================================== */}
          {activeTab === 'hub' && (
            <motion.div
              key="hub-tab-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className={isDarkMode ? 'dark [&_.bg-white]:bg-neutral-900/80 [&_.border-neutral-200\\/80]:border-neutral-800 [&_.border-neutral-200]:border-neutral-800 [&_.bg-neutral-100]:bg-neutral-800 [&_.bg-neutral-50]:bg-neutral-950 [&_.border-neutral-100]:border-neutral-800 [&_.text-neutral-900]:text-white [&_.text-neutral-950]:text-white [&_.text-neutral-800]:text-neutral-200 [&_.text-neutral-700]:text-neutral-300 [&_.text-neutral-500]:text-neutral-400' : ''}
            >
              <ModelHubPage
                providers={providers}
                onUpdateProvider={handleUpdateProvider}
                onSetDefault={handleSetDefaultProvider}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}
