import { useState, useEffect, useRef } from 'react';
import { Brain } from 'lucide-react';
import { useT } from '../hooks/useLocale';

/**
 * Animated reasoning/thinking indicator shown during streaming
 * when no text content has appeared yet (thinking=low mode).
 * Displays elapsed time and a pulsing animation.
 */
export function ThinkingIndicator() {
  const t = useT();
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatElapsed = (s: number) => {
    if (s < 60) return `${s}s`;
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}m ${rem.toString().padStart(2, '0')}s`;
  };

  return (
    <div className="flex items-center gap-2 mt-2 animate-fade-in">
      <div className="inline-flex items-center gap-2 rounded-2xl border border-violet-500/15 bg-violet-500/5 px-3 py-1.5">
        <Brain size={14} className="text-violet-300 animate-pulse" />
        <span className="text-xs font-medium text-violet-300">
          {t('thinking.reasoning')}
        </span>
        <span className="text-xs tabular-nums text-violet-300/50">
          {formatElapsed(elapsed)}
        </span>
      </div>
    </div>
  );
}
