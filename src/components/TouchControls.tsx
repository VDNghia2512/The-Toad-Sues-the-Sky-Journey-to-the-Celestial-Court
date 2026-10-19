import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onLeftStart: () => void;
  onLeftEnd: () => void;
  onRightStart: () => void;
  onRightEnd: () => void;
  onJumpPress: () => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onLeftStart,
  onLeftEnd,
  onRightStart,
  onRightEnd,
  onJumpPress,
}) => {
  return (
    <div className="absolute bottom-3 left-0 right-0 px-3 sm:px-6 flex items-end justify-between pointer-events-none z-10">
      {/* Left / Right directional pad */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onTouchStart={onLeftStart}
          onTouchEnd={onLeftEnd}
          onMouseDown={onLeftStart}
          onMouseUp={onLeftEnd}
          className="w-13 h-13 rounded-2xl bg-stone-900/85 border border-amber-900/60 active:bg-amber-600/30 text-amber-200 flex items-center justify-center backdrop-blur-sm shadow-lg active:scale-95 transition-transform"
          aria-label="Qua trái"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <button
          onTouchStart={onRightStart}
          onTouchEnd={onRightEnd}
          onMouseDown={onRightStart}
          onMouseUp={onRightEnd}
          className="w-13 h-13 rounded-2xl bg-stone-900/85 border border-amber-900/60 active:bg-amber-600/30 text-amber-200 flex items-center justify-center backdrop-blur-sm shadow-lg active:scale-95 transition-transform"
          aria-label="Qua phải"
        >
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Jump Button */}
      <div className="flex items-center pointer-events-auto">
        <button
          onClick={onJumpPress}
          className="w-16 h-16 rounded-2xl bg-amber-600 border-2 border-amber-400 text-amber-50 flex items-center justify-center shadow-2xl active:scale-90 transition-transform active:bg-amber-500"
          aria-label="Nhảy"
        >
          <div className="flex flex-col items-center">
            <ArrowUp className="w-7 h-7 stroke-[2.5]" />
            <span className="text-[10px] font-bold tracking-tight">NHẢY</span>
          </div>
        </button>
      </div>
    </div>
  );
};
