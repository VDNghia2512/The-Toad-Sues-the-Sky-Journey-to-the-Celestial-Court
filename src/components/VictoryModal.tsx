import React from 'react';
import { GameStats } from '../types/game';
import { Trophy, CloudRain, RotateCcw, ArrowUpRight, Clock, Award } from 'lucide-react';

interface VictoryModalProps {
  isOpen: boolean;
  stats: GameStats;
  isNewBestTime?: boolean;
  onContinueEndless: () => void;
  onRestart: () => void;
  onOpenLeaderboard: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  isOpen,
  stats,
  isNewBestTime = false,
  onContinueEndless,
  onRestart,
  onOpenLeaderboard,
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
      <div className="relative w-full max-w-lg bg-stone-900 border-2 border-amber-400 rounded-2xl text-amber-100 shadow-2xl p-6 text-center">
        {/* Divine halo icon */}
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-300 shadow-lg shadow-amber-500/30 animate-pulse">
          <Trophy className="w-8 h-8" />
        </div>

        <span className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
          Khải Hoàn Thiên Cung
        </span>
        <h2 className="text-2xl font-serif font-extrabold text-amber-300 mt-1">
          Chạm Tới Cổng Trời!
        </h2>
        <p className="text-xs text-amber-200/90 mt-1.5 italic px-4">
          "Cóc đã gõ vang Trống Thiên Đình! Ngọc Hoàng thấu tỏ nỗi khát của muôn loài, truyền chỉ ban mưa rào cứu rỗi khắp cõi nhân gian!"
        </p>

        {/* Completion Time & New Record Announcement */}
        <div className="my-4 p-3 rounded-xl bg-amber-950/50 border border-amber-500/60 flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <div className="text-left">
              <div className="text-[11px] text-stone-300">Thời gian hoàn thành</div>
              <div className="text-xl font-bold font-mono text-amber-300">
                {formatTime(stats.timeElapsed || 0)}
              </div>
            </div>
          </div>

          {isNewBestTime && (
            <div className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1 shadow-sm animate-pulse">
              <span>🏆 Kỷ Lục Mới!</span>
            </div>
          )}
        </div>

        {/* Rain Summoned celebration banner */}
        <div className="mb-4 p-2.5 rounded-xl bg-sky-950/40 border border-sky-500/40 flex items-center justify-center gap-2 text-sky-300 text-xs font-semibold">
          <CloudRain className="w-4 h-4 text-sky-400 animate-bounce" />
          <span>Mưa Lớn Đã Trút Xuống Xanh Tươi Đồng Ruộng!</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-5 text-left">
          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-amber-900/40">
            <span className="text-[11px] text-stone-400">Độ cao đạt được</span>
            <div className="text-base font-bold font-mono text-amber-300">{stats.altitude}m</div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-amber-900/40">
            <span className="text-[11px] text-stone-400">Giọt sương cứu hạn</span>
            <div className="text-base font-bold font-mono text-sky-300">💧 {stats.waterDrops}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-amber-900/40">
            <span className="text-[11px] text-stone-400">Tổng số cú nhảy</span>
            <div className="text-base font-bold font-mono text-stone-200">{stats.totalJumps}</div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-950/60 border border-amber-900/40">
            <span className="text-[11px] text-stone-400">Đạp gió lướt mây</span>
            <div className="text-base font-bold font-mono text-emerald-300">{stats.airDashes || 0} lần</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            onClick={onOpenLeaderboard}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-600/30 border border-amber-500 text-amber-200 font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-amber-600/50 transition-colors"
          >
            <Award className="w-4 h-4" />
            <span>Xem Bảng Thành Tích</span>
          </button>

          <button
            onClick={onContinueEndless}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Leo Tiếp Vô Tận</span>
          </button>

          <button
            onClick={onRestart}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại</span>
          </button>
        </div>
      </div>
    </div>
  );
};
