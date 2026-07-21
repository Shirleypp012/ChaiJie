export interface MetricItem {
  name: string;
  score: number;
  description: string;
  color: string;
}

export interface TimelineFrame {
  time: string;
  title: string;
  visualContent: string;
  cameraLanguage: string;
  userPsychology: string;
  viralSecret: string;
  imageUrl?: string;
  type: 'hook' | 'product' | 'painpoint' | 'proof' | 'cta'; // Frame categorization
}

export interface VisualDetail {
  aspect: string; // 景别, 运镜, 光影, 色彩, 构图
  label: string;
  value: string;
  description: string;
}

export interface MockVideoPreset {
  id: string;
  title: string;
  platform: '小红书' | '抖音' | 'B站';
  productName: string;
  duration: string;
  author: string;
  likes: string;
  shares: string;
  saves: string;
  viralScore: number;
  hookType: string;
  coverImage?: string;
  metrics: MetricItem[];
  timeline: TimelineFrame[];
  visuals: VisualDetail[];
  summary: string[];
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

// ==========================================
// New Agent Studio & Model Hub Types
// ==========================================

export type AgentStatus = 'idle' | 'running' | 'completed' | 'failed' | 'retrying';

export interface AgentNode {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: AgentStatus;
  currentModel: string;
  runtime: number; // in seconds
  tokensUsed: number;
  enabled: boolean;
  logs: string[];
  category: 'core' | 'creative' | 'multimedia' | 'distribution' | 'future';
}

export type ProviderCategory = 'llm' | 'image' | 'video' | 'editor';

export interface ModelProvider {
  id: string;
  name: string;
  category: ProviderCategory;
  logo: string;
  apiKey: string;
  endpoint: string;
  region?: string;
  selectedModel: string;
  availableModels: string[];
  timeout: number; // in seconds
  retryCount: number;
  status: 'connected' | 'unconfigured' | 'testing' | 'failed';
  isDefault: boolean;
}
