import React from 'react';
import { GameStats } from '../types/game';
import { RotateCcw, Flame, Trophy, Clock, Award, Share2 } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  stats: GameStats;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
  onOpenShare?: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  stats,
  onRestart,
  onOpenLeaderboard,
  onOpenShare,
}) => {
  if (!isOpen) return null;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-900/60 rounded-2xl text-amber-100 shadow-2xl p-6 text-center">
        {/* Icon */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-500 shadow-inner">
          <Flame className="w-7 h-7" />
        </div>

        <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
          Sảy Chân Giữa Tầng Mây
        </span>
        <h2 className="text-xl font-serif font-bold text-amber-200 mt-1">
          Chưa Tới Được Thiên Đình
        </h2>
        <p className="text-xs text-stone-400 mt-1.5 px-4">
          Hạ giới vẫn đang trông ngóng hạt mưa cứu nạn. Đừng nản chí, hãy căn nhịp nhảy và nhấn Lướt Gió để đổi làn!
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2.5 my-4 text-left">
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-amber-900/40">
            <span className="text-[11px] text-stone-400">Độ cao lần này</span>
            <div className="text-base font-bold font-mono text-amber-300">{stats.altitude}m</div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-amber-900/40">
            <span className="text-[11px] text-stone-400">Thời lượng leo</span>
            <div className="text-base font-bold font-mono text-stone-200 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTime(stats.timeElapsed || 0)}</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-amber-900/40">
            <span className="text-[11px] text-stone-400">Kỷ lục cao nhất</span>
            <div className="text-base font-bold font-mono text-amber-400 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{stats.maxAltitude}m</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-amber-900/40">
            <span className="text-[11px] text-stone-400">Giọt sương giữ lại</span>
            <div className="text-base font-bold font-mono text-sky-300">💧 {stats.waterDrops}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onRestart}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tiếp Tục Leo Ngay</span>
          </button>

          {onOpenShare && (
            <button
              onClick={onOpenShare}
              className="w-full py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-500/40 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>Chia Sẻ Kỷ Lục Với Bạn Bè</span>
            </button>
          )}

          <button
            onClick={onOpenLeaderboard}
            className="w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-amber-900/40 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Xem Bảng Thành Tích Cá Nhân</span>
          </button>
        </div>
      </div>
    </div>
  );
};
