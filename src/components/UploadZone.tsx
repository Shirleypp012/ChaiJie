import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Link, AlertCircle, FileVideo, ChevronRight, Sparkles } from 'lucide-react';
import { mockPresets } from '../mockData';
import { MockVideoPreset } from '../types';

interface UploadZoneProps {
  onStartAnalysis: (videoName: string, selectedPreset: MockVideoPreset) => void;
}

export default function UploadZone({ onStartAnalysis }: UploadZoneProps) {
  const [url, setUrl] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov') || file.name.endsWith('.webm')) {
        // Successfully got a video file! Choose a fitting mock preset
        // If file contains "lip" or "唇", choose Lip Suede, if "素颜" or "toneup", choose ToneUp, otherwise Glacier Cream
        let preset = mockPresets[0];
        const lowerName = file.name.toLowerCase();
        if (lowerName.includes('lip') || lowerName.includes('唇') || lowerName.includes('釉')) {
          preset = mockPresets[2];
        } else if (lowerName.includes('素颜') || lowerName.includes('tone') || lowerName.includes('通勤')) {
          preset = mockPresets[1];
        }
        onStartAnalysis(file.name, preset);
      } else {
        setErrorMessage('仅支持上传 MP4, MOV, WEBM 等视频格式文件');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      let preset = mockPresets[0];
      const lowerName = file.name.toLowerCase();
      if (lowerName.includes('lip') || lowerName.includes('唇') || lowerName.includes('釉')) {
        preset = mockPresets[2];
      } else if (lowerName.includes('素颜') || lowerName.includes('tone') || lowerName.includes('通勤')) {
        preset = mockPresets[1];
      }
      onStartAnalysis(file.name, preset);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Detect if the url looks like Xiaohongshu, Douyin or general link
    let matchedPreset = mockPresets[0]; // Default is glacier cream
    let titleStr = url;

    if (url.includes('xiaohongshu') || url.includes('xhs') || url.includes('小红书')) {
      matchedPreset = mockPresets[0];
      titleStr = '小红书爆款分享链接';
    } else if (url.includes('douyin') || url.includes('dy') || url.includes('抖音')) {
      // Choose between ToneUp and Lip Suede
      if (url.includes('素颜') || url.includes('懒人') || Math.random() > 0.5) {
        matchedPreset = mockPresets[1];
        titleStr = '抖音早八素颜霜爆款链接';
      } else {
        matchedPreset = mockPresets[2];
        titleStr = '抖音冷感唇釉断货王链接';
      }
    } else {
      titleStr = '外部流媒体链接: ' + url.substring(0, 30) + '...';
    }

    onStartAnalysis(titleStr, matchedPreset);
  };

  const selectPreset = (preset: MockVideoPreset) => {
    onStartAnalysis(`【深度拆解】${preset.productName} 爆款参考案例`, preset);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12" id="upload-zone-container">
      {/* Upload area with elegant thin border */}
      <div
        className={`relative rounded-3xl p-1 transition-all duration-500 bg-gradient-to-b ${
          isDragOver 
            ? 'from-neutral-400 via-neutral-300 to-neutral-400 shadow-[0_0_30px_rgba(0,0,0,0.05)] scale-[1.01]' 
            : 'from-neutral-200 to-neutral-200/50 border border-neutral-200/80 shadow-sm'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        id="drag-drop-panel"
      >
        <div className="bg-white rounded-[22px] px-8 py-14 flex flex-col items-center justify-center text-center transition-colors duration-300">
          <input
            type="file"
            id="video-upload"
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: isDragOver ? 1.1 : 1 }}
            className="w-20 h-20 rounded-full bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-6 shadow-inner text-neutral-500 cursor-pointer hover:text-neutral-900 hover:border-neutral-400 transition-all group"
            onClick={() => document.getElementById('video-upload')?.click()}
            id="upload-button-trigger"
          >
            <Upload className="w-8 h-8 group-hover:-translate-y-1 transition-transform" />
          </motion.div>

          <h3 className="text-xl font-medium text-neutral-900 tracking-tight mb-2" id="upload-headline">
            将爆款视频拖拽到此处，或点击上传
          </h3>
          <p className="text-sm text-neutral-500 max-w-md mb-8" id="upload-subtext">
            支持 MP4, MOV, WEBM 格式视频。系统将通过 AI 模型逆向全镜头、音频、情绪与文案方案。
          </p>

          {/* URL Input Form */}
          <form onSubmit={handleUrlSubmit} className="w-full max-w-lg relative mb-2" id="url-input-form">
            <div className="flex items-center bg-neutral-50 border border-neutral-200 focus-within:border-neutral-400 rounded-full px-5 py-3 shadow-inner transition-all">
              <Link className="w-5 h-5 text-neutral-400 mr-3 shrink-0" />
              <input
                type="text"
                placeholder="粘贴 抖音 / 小红书 / B站 的分享链接进行深度解析..."
                className="bg-transparent border-none outline-none text-sm text-neutral-800 placeholder-neutral-400 w-full focus:ring-0 mr-4"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                id="url-input"
              />
              <button
                type="submit"
                disabled={!url.trim()}
                className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-35 disabled:bg-none disabled:bg-neutral-300 shadow-[0_4px_12px_rgba(139,92,246,0.25)] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] active:scale-95 duration-300"
                id="analyze-submit-btn"
              >
                <span>智能分析</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {errorMessage && (
            <div className="flex items-center gap-2 text-rose-600 text-xs mt-3 bg-rose-50 px-4 py-2 rounded-full border border-rose-200 animate-pulse" id="upload-error">
              <AlertCircle className="w-4 h-4" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Recommended Presets Shortcuts */}
      <div className="space-y-5" id="presets-section">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
          <h4 className="text-sm font-semibold tracking-wider text-neutral-500 uppercase flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-neutral-800 animate-pulse" />
            品牌运营推荐爆款模板（一键测试）
          </h4>
          <span className="text-xs text-neutral-400 font-mono">3 个高转化标杆案例已载入</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="presets-grid">
          {mockPresets.map((preset) => (
            <motion.div
              key={preset.id}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              onClick={() => selectPreset(preset)}
              className="group cursor-pointer rounded-2xl bg-white border border-neutral-200 hover:border-neutral-400 p-5 flex flex-col justify-between h-[280px] relative overflow-hidden transition-all shadow-sm"
              id={`preset-card-${preset.id}`}
            >
              {/* Card background hover feedback */}
              <div className="absolute inset-0 bg-neutral-50/20 opacity-0 group-hover:opacity-100 transition-all duration-350 pointer-events-none" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    preset.platform === '小红书' 
                      ? 'bg-rose-50 text-rose-600 border-rose-200' 
                      : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                  }`}>
                    {preset.platform}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-neutral-400">爆款指数</span>
                    <span className="text-sm font-bold text-neutral-900 font-mono">{preset.viralScore}</span>
                  </div>
                </div>

                <h5 className="text-sm font-medium text-neutral-900 line-clamp-2 leading-relaxed mb-3 group-hover:text-neutral-950 transition-colors">
                  {preset.title}
                </h5>
                <p className="text-xs text-neutral-500 line-clamp-2 font-light">
                  核心公式：{preset.hookType}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-150 flex items-center justify-between text-xs text-neutral-500">
                <span className="font-mono text-neutral-600">{preset.productName}</span>
                <span className="flex items-center gap-1 text-neutral-900 font-semibold group-hover:translate-x-1 transition-transform">
                  逆向工程
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
