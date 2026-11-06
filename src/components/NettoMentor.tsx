import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

interface NettoMentorProps {
  message: string;
  mood?: 'happy' | 'thinking' | 'excited' | 'warning';
  actionPrompt?: string;
  onActionClick?: () => void;
  compact?: boolean;
}

export const NettoMentor: React.FC<NettoMentorProps> = ({
  message,
  mood = 'happy',
  actionPrompt,
  onActionClick,
  compact = false,
}) => {
  return (
    <div
      className={`relative flex items-start gap-3.5 bg-slate-900/95 border border-cyan-500/30 rounded-2xl p-4 shadow-xl shadow-cyan-950/20 backdrop-blur-md transition-all ${
        compact ? 'max-w-xl' : 'w-full'
      }`}
    >
      {/* Robot SVG Avatar with mood-based LED glow */}
      <div className="relative shrink-0 flex flex-col items-center">
        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center p-1.5 shadow-inner">
          {/* Animated Antenna */}
          <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <span
              className={`w-2 h-2 rounded-full ${
                mood === 'warning'
                  ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
                  : mood === 'excited'
                  ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                  : 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
              } animate-ping`}
            />
            <span className="w-0.5 h-1.5 bg-cyan-400/80 -mt-1" />
          </div>

          {/* Robot Face SVG */}
          <svg viewBox="0 0 40 40" className="w-full h-full text-cyan-400" fill="none">
            {/* Head contour */}
            <rect x="6" y="8" width="28" height="24" rx="6" stroke="currentColor" strokeWidth="2" fill="#0B132B" />
            {/* Eyes */}
            {mood === 'happy' && (
              <>
                <path d="M12 18 Q15 15 18 18" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M22 18 Q25 15 28 18" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
            {mood === 'excited' && (
              <>
                <circle cx="15" cy="18" r="3" fill="#34D399" />
                <circle cx="25" cy="18" r="3" fill="#34D399" />
              </>
            )}
            {mood === 'thinking' && (
              <>
                <circle cx="15" cy="17" r="2.5" fill="#38BDF8" />
                <line x1="22" y1="17" x2="28" y2="17" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />
              </>
            )}
            {mood === 'warning' && (
              <>
                <circle cx="15" cy="18" r="2.5" fill="#FBBF24" />
                <circle cx="25" cy="18" r="2.5" fill="#FBBF24" />
              </>
            )}
            {/* Smile / mouth */}
            <path
              d={
                mood === 'excited'
                  ? 'M15 25 Q20 29 25 25'
                  : mood === 'warning'
                  ? 'M16 26 L24 26'
                  : 'M16 25 Q20 28 24 25'
              }
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span className="mt-1 text-[11px] font-bold text-cyan-300 tracking-wide">نيتو Netto</span>
      </div>

      {/* Speech Bubble Content */}
      <div className="flex-1 min-w-0 text-right">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            مرشد المختبر الذكي
          </span>
          <span className="text-[10px] text-slate-400 font-mono">NET-BOT v2.4</span>
        </div>
        <p className="text-sm md:text-base text-slate-100 leading-relaxed font-medium">
          {message}
        </p>

        {actionPrompt && onActionClick && (
          <button
            onClick={onActionClick}
            className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02] cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            {actionPrompt}
          </button>
        )}
      </div>
    </div>
  );
};
