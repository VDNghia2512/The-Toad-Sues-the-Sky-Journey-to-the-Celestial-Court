import React from 'react';
import { Wind, CloudRain, Clock, Sparkles } from 'lucide-react';

interface SkillCooldownOverlayProps {
  airDashCooldown: number;
  maxAirDashCooldown: number;
  rainCooldown: number;
  maxRainCooldown: number;
  onTriggerRain?: () => void;
}

export const SkillCooldownOverlay: React.FC<SkillCooldownOverlayProps> = ({
  airDashCooldown,
  maxAirDashCooldown,
  rainCooldown,
  maxRainCooldown,
  onTriggerRain,
}) => {
  const isDashReady = airDashCooldown <= 0;
  const isRainReady = rainCooldown <= 0;

  const dashProgress = Math.min(
    100,
    Math.max(0, ((maxAirDashCooldown - airDashCooldown) / maxAirDashCooldown) * 100)
  );

  const rainProgress = Math.min(
    100,
    Math.max(0, ((maxRainCooldown - rainCooldown) / maxRainCooldown) * 100)
  );

  return (
    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex flex-col gap-2 pointer-events-auto select-none max-w-[210px] sm:max-w-[230px]">
      {/* Header Badge */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-950/85 border border-amber-900/50 backdrop-blur-md shadow-md text-amber-300">
        <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
          Hồi Chiêu Kỹ Năng (~30s)
        </span>
      </div>

      {/* Skill 1: Đạp Gió Lướt Mây */}
      <div
        className={`p-2 sm:p-2.5 rounded-xl border backdrop-blur-md shadow-lg transition-all ${
          isDashReady
            ? 'bg-sky-950/75 border-sky-400/80 shadow-sky-500/15'
            : 'bg-stone-950/80 border-stone-800 text-stone-400'
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold transition-all ${
                isDashReady
                  ? 'bg-sky-500 text-stone-950 shadow-md shadow-sky-400/40 animate-pulse'
                  : 'bg-stone-800/80 text-stone-500'
              }`}
            >
              <Wind className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div
                className={`text-xs font-bold truncate leading-tight ${
                  isDashReady ? 'text-sky-200' : 'text-stone-300'
                }`}
              >
                Đạp Gió Lướt Mây
              </div>
              <div className="text-[9px] text-stone-400 font-mono truncate">
                Shift / J / Nhảy
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            {isDashReady ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono text-[9px] font-bold">
                <Sparkles className="w-2.5 h-2.5" />
                SẴN SÀNG
              </span>
            ) : (
              <div className="font-mono font-bold text-amber-400 text-xs">
                {airDashCooldown.toFixed(1)}s
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!isDashReady && (
          <div className="w-full h-1 bg-stone-800/90 rounded-full overflow-hidden mt-1.5 border border-stone-700/40">
            <div
              className="h-full bg-gradient-to-r from-sky-600 to-sky-300 transition-all duration-100"
              style={{ width: `${dashProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Skill 2: Nghiến Răng Gọi Mưa */}
      <div
        className={`p-2 sm:p-2.5 rounded-xl border backdrop-blur-md shadow-lg transition-all ${
          isRainReady
            ? 'bg-amber-950/75 border-amber-400/80 shadow-amber-500/15 cursor-pointer hover:scale-[1.02]'
            : 'bg-stone-950/80 border-stone-800 text-stone-400'
        }`}
        onClick={() => {
          if (isRainReady && onTriggerRain) onTriggerRain();
        }}
        title={isRainReady ? 'Bấm để kích hoạt Gọi Mưa (Phím R)' : `Đang hồi chiêu: ${rainCooldown.toFixed(1)}s`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-sm font-bold transition-all ${
                isRainReady
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-400/40 animate-pulse'
                  : 'bg-stone-800/80 text-stone-500'
              }`}
            >
              <CloudRain className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div
                className={`text-xs font-bold truncate leading-tight ${
                  isRainReady ? 'text-amber-200' : 'text-stone-300'
                }`}
              >
                Nghiến Răng Gọi Mưa
              </div>
              <div className="text-[9px] text-stone-400 font-mono truncate">
                Phím R / Sấm giông
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            {isRainReady ? (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 font-mono text-[9px] font-bold">
                <Sparkles className="w-2.5 h-2.5" />
                SẴN SÀNG
              </span>
            ) : (
              <div className="font-mono font-bold text-amber-400 text-xs">
                {rainCooldown.toFixed(1)}s
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {!isRainReady && (
          <div className="w-full h-1 bg-stone-800/90 rounded-full overflow-hidden mt-1.5 border border-stone-700/40">
            <div
              className="h-full bg-gradient-to-r from-amber-600 to-amber-300 transition-all duration-100"
              style={{ width: `${rainProgress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
