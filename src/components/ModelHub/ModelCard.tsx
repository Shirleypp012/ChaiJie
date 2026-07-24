import { Star, ChevronRight, Zap, Check, Bookmark, Clock, Sparkles } from 'lucide-react';
import { ModelItem } from '../../types';
import StarRating from './StarRating';
import StatusBadge from './StatusBadge';

interface ModelCardProps {
  model: ModelItem;
  onSelect: (model: ModelItem) => void;
  onSetDefault: (id: string, category: 'image' | 'video' | 'llm' | 'editor') => void;
  onToggleFavorite: (id: string) => void;
  onRetestStatus: (id: string) => void;
}

export default function ModelCard({
  model,
  onSelect,
  onSetDefault,
  onToggleFavorite,
  onRetestStatus
}: ModelCardProps) {
  const isImageModel = model.category === 'image';

  return (
    <div
      onClick={() => onSelect(model)}
      className={`group relative rounded-3xl border transition-all duration-300 p-5 cursor-pointer flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 ${
        model.isDefault
          ? 'bg-white dark:bg-slate-900/70 border-violet-500/50 dark:border-violet-500/60 ring-2 ring-violet-500/20 dark:ring-violet-500/30'
          : 'bg-white dark:bg-slate-950/40 border-neutral-200/80 dark:border-white/10 hover:border-violet-400 dark:hover:border-violet-500/50'
      }`}
      id={`model-card-${model.id}`}
    >
      {/* Top Banner Accent for Default Models */}
      {model.isDefault && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500" />
      )}

      {/* Card Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Logo & Info */}
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md bg-gradient-to-tr ${model.logoGradient} shrink-0 group-hover:scale-105 transition-transform`}>
              {model.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-neutral-900 dark:text-white text-base tracking-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {model.name}
                </h3>
                {/* Version & Badge Type */}
                <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                  model.badgeType === '稳定版'
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-500/30'
                    : model.badgeType === '预览版'
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-500/30'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/80 dark:border-amber-500/30'
                }`}>
                  {model.badgeType}
                </span>
                {model.isDefault && (
                  <span className="flex items-center gap-1 text-[10px] font-bold bg-neutral-900 dark:bg-violet-600 text-white px-2 py-0.5 rounded-full shadow-sm font-mono">
                    <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                    默认{isImageModel ? '图片' : '视频'}模型
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono mt-0.5">
                {model.vendor} • {model.version}
              </p>
            </div>
          </div>

          {/* Connection Status Badge */}
          <div onClick={(e) => e.stopPropagation()}>
            <StatusBadge 
              status={model.status} 
              onRetest={() => onRetestStatus(model.id)} 
            />
          </div>
        </div>

        {/* Model Brief Description */}
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2 mt-1">
          {model.description}
        </p>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {model.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                tag === '运营推荐'
                  ? 'bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 font-semibold'
                  : 'bg-neutral-100 dark:bg-white/5 border-neutral-200/60 dark:border-white/5 text-neutral-600 dark:text-neutral-400'
              }`}
            >
              {tag === '运营推荐' && <Sparkles className="w-2.5 h-2.5 inline mr-1 text-amber-500" />}
              {tag}
            </span>
          ))}
        </div>

        {/* Recommended Scenarios List */}
        <div className="mt-3.5 pt-3 border-t border-neutral-100 dark:border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" />
              推荐场景:
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {model.scenarios.map((scen) => (
              <span 
                key={scen} 
                className="text-[10px] bg-neutral-50 dark:bg-white/[0.03] border border-neutral-200/70 dark:border-white/5 text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded-md"
              >
                {scen}
              </span>
            ))}
          </div>
        </div>

        {/* Ratings Breakdown Grid */}
        <div className="mt-3.5 p-2.5 bg-neutral-50/80 dark:bg-white/[0.02] rounded-2xl border border-neutral-100 dark:border-white/5 space-y-0.5">
          <StarRating 
            label={isImageModel ? "图片质量" : "视频质量"} 
            rating={model.ratings.quality} 
            highlight={true}
          />
          <StarRating 
            label="生成速度" 
            rating={model.ratings.speed} 
          />
          <StarRating 
            label="成本控制" 
            rating={model.ratings.cost} 
          />
          <StarRating 
            label="运营推荐" 
            rating={model.ratings.recommendation} 
            highlight={true}
          />
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-white/5 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Set Default Button */}
          {!model.isDefault ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSetDefault(model.id, model.category);
              }}
              className="flex items-center gap-1 text-[11px] font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-white/5 dark:hover:bg-white/10 text-neutral-700 dark:text-neutral-300 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <Star className="w-3 h-3 text-amber-500" />
              设为默认
            </button>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="w-3.5 h-3.5" /> 已是默认模型
            </span>
          )}

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(model.id);
            }}
            className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
              model.isFavorite
                ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-500/40 text-amber-600 dark:text-amber-400'
                : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/5 text-neutral-400 hover:text-neutral-800 dark:hover:text-white'
            }`}
            title={model.isFavorite ? '取消收藏' : '收藏模型'}
          >
            <Bookmark className={`w-3.5 h-3.5 ${model.isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* View Details Link */}
        <button className="flex items-center gap-1 text-xs font-semibold text-neutral-900 dark:text-violet-300 hover:text-violet-600 dark:hover:text-violet-200 group-hover:translate-x-0.5 transition-all">
          <span>查看详情</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
