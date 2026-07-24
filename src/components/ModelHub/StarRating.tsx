import { Star } from 'lucide-react';

interface StarRatingProps {
  label: string;
  rating: number; // 1.0 to 5.0
  maxStars?: number;
  showValue?: boolean;
  highlight?: boolean;
}

export default function StarRating({ 
  label, 
  rating, 
  maxStars = 5, 
  showValue = true,
  highlight = false
}: StarRatingProps) {
  const stars = Array.from({ length: maxStars }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between text-xs py-1" id={`rating-${label.toLowerCase()}`}>
      <span className={`text-[11px] ${highlight ? 'font-semibold text-neutral-900 dark:text-neutral-100' : 'text-neutral-500 dark:text-neutral-400'}`}>
        {label}
      </span>
      <div className="flex items-center gap-1.5">
        <div className="flex items-center gap-0.5">
          {stars.map((starIndex) => {
            const fillAmount = Math.max(0, Math.min(1, rating - (starIndex - 1)));
            const isFull = fillAmount >= 0.8;
            const isHalf = fillAmount >= 0.3 && fillAmount < 0.8;

            return (
              <span key={starIndex} className="relative inline-block w-3 h-3">
                {isHalf ? (
                  <span className="text-amber-400 dark:text-amber-400">★</span>
                ) : isFull ? (
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                ) : (
                  <Star className="w-3 h-3 text-neutral-300 dark:text-neutral-700" />
                )}
              </span>
            );
          })}
        </div>
        {showValue && (
          <span className="text-[10px] font-mono font-semibold text-neutral-700 dark:text-neutral-300 min-w-[24px] text-right">
            {rating.toFixed(1)}
          </span>
        )}
      </div>
    </div>
  );
}
