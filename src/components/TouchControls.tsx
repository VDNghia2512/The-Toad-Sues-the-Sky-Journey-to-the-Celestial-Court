import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, Wind, Sparkles } from 'lucide-react';

interface TouchControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
  onJumpPress: () => void;
  onDashPress: () => void;
  onRainPress: () => void;
  rainCharge: number;
  airDashCooldown?: number;
  rainCooldown?: number;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJumpPress,
  onDashPress,
  onRainPress,
  rainCharge,
  airDashCooldown = 0,
  rainCooldown = 0,
}) => {
  const isDashReady = airDashCooldown <= 0;
  const isRainReady = rainCooldown <= 0;

  return (
    <div className="md:hidden absolute bottom-4 left-0 right-0 px-4 flex items-end justify-between pointer-events-none z-10">
      {/* Left / Right directional pad */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onTouchStart={onLeftStart}
          onTouchEnd={onLeftEnd}
          onMouseDown={onLeftStart}
          onMouseUp={onLeftEnd}
          className="w-13 h-13 rounded-2xl bg-stone-900/80 border border-amber-900/60 active:bg-amber-600/30 text-amber-200 flex items-center justify-center backdrop-blur-sm shadow-lg active:scale-95 transition-transform"
          aria-label="Qua trái"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onTouchStart={onRightStart}
          onTouchEnd={onRightEnd}
          onMouseDown={onRightStart}
          onMouseUp={onRightEnd}
          className="w-13 h-13 rounded-2xl bg-stone-900/80 border border-amber-900/60 active:bg-amber-600/30 text-amber-200 flex items-center justify-center backdrop-blur-sm shadow-lg active:scale-95 transition-transform"
          aria-label="Qua phải"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Action buttons: Jump + Air Dash + Rain Summon */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Rain Summon Button */}
        <button
          onClick={onRainPress}
          disabled={!isRainReady}
          className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-bold shadow-lg transition-transform ${
            isRainReady
              ? 'bg-amber-500 text-stone-950 animate-bounce active:scale-95 cursor-pointer'
              : 'bg-stone-900/80 border border-amber-900/50 text-amber-400/50 cursor-not-allowed'
          }`}
          aria-label="Nghiến răng gọi mưa"
        >
          {isRainReady ? (
            <Sparkles className="w-6 h-6" />
          ) : (
            <span className="text-[10px] font-mono font-bold text-amber-400">
              {Math.ceil(rainCooldown)}s
            </span>
          )}
        </button>

        {/* Air Dash Button with Cooldown Display */}
        <button
          onClick={onDashPress}
          disabled={!isDashReady}
          className={`w-13 h-13 rounded-2xl border flex items-center justify-center shadow-lg transition-transform ${
            isDashReady
              ? 'bg-sky-700/80 border-sky-400 text-sky-100 active:scale-90 active:bg-sky-600'
              : 'bg-stone-900/80 border-stone-800 text-stone-500 cursor-not-allowed opacity-60'
          }`}
          aria-label="Đạp gió lướt mây"
        >
          <div className="flex flex-col items-center">
            {isDashReady ? (
              <>
                <Wind className="w-5 h-5 text-sky-300" />
                <span className="text-[8px] font-bold tracking-tight text-sky-100">LƯỚT GIÓ</span>
              </>
            ) : (
              <>
                <span className="font-mono font-bold text-xs text-amber-400 leading-none">
                  {Math.ceil(airDashCooldown)}s
                </span>
                <span className="text-[7px] text-stone-400 mt-0.5">CHỜ</span>
              </>
            )}
          </div>
        </button>

        {/* Jump Button */}
        <button
          onClick={onJumpPress}
          className="w-14 h-14 rounded-2xl bg-amber-600 border-2 border-amber-400 text-amber-50 flex items-center justify-center shadow-xl active:scale-90 transition-transform active:bg-amber-500"
          aria-label="Nhảy"
        >
          <div className="flex flex-col items-center">
            <ArrowUp className="w-6 h-6 stroke-[2.5]" />
            <span className="text-[9px] font-bold tracking-tight">NHẢY</span>
          </div>
        </button>
      </div>
    </div>
  );
};
