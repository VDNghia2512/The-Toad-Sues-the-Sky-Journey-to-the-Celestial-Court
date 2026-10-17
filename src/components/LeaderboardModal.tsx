import React, { useState } from 'react';
import { X, Trophy, Clock, Flame, Award, Trash2 } from 'lucide-react';
import { RunRecord, Achievement } from '../types/game';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  runHistory: RunRecord[];
  achievements: Achievement[];
  bestTime: number | null; // best time to reach 1000m in seconds
  maxAltitude: number;
  totalGames: number;
  totalDrops: number;
  onClearHistory: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  runHistory,
  achievements,
  bestTime,
  maxAltitude,
  totalGames,
  totalDrops,
  onClearHistory,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'achievements'>('history');
  const [confirmClear, setConfirmClear] = useState<boolean>(false);

  if (!isOpen) return null;

  const formatTime = (sec: number | null) => {
    if (sec === null || sec === undefined || sec === 0) return '--:--';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-stone-900 border border-amber-900/60 rounded-2xl text-amber-100 shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-amber-400 hover:text-amber-200 hover:bg-amber-950/40 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
            Bảng Vàng Dân Gian
          </span>
          <h2 className="text-2xl font-serif font-bold text-amber-300 mt-0.5 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-400" />
            <span>Thành Tích Cá Nhân</span>
          </h2>
          <p className="text-xs text-amber-200/70 mt-1">
            Ghi nhận tiến trình leo Thiên Đình, thời gian hoàn thành bàn chơi và các danh hiệu đã mở khóa.
          </p>
        </div>

        {/* 4 Summary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          <div className="p-3 rounded-xl bg-stone-950/60 border border-amber-900/30">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Thời Gian Kỷ Lục</span>
            </div>
            <div className="text-lg font-bold font-mono text-amber-300">
              {bestTime ? formatTime(bestTime) : 'Chưa chạm Trời'}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/60 border border-amber-900/30">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Độ Cao Kỷ Lục</span>
            </div>
            <div className="text-lg font-bold font-mono text-amber-400">
              {maxAltitude}m
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/60 border border-amber-900/30">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
              <span>💧</span>
              <span>Sương Cứu Hạn</span>
            </div>
            <div className="text-lg font-bold font-mono text-sky-300">
              {totalDrops}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-stone-950/60 border border-amber-900/30">
            <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
              <span>🦘</span>
              <span>Lượt Đã Chơi</span>
            </div>
            <div className="text-lg font-bold font-mono text-stone-200">
              {totalGames}
            </div>
          </div>
        </div>

        {/* Segmented Control Filter Tabs */}
        <div className="flex items-center justify-between gap-2 border-b border-amber-900/40 pb-2 mb-4">
          <div className="flex items-center gap-1 p-1 bg-stone-950/60 rounded-lg border border-amber-900/30">
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-amber-600 text-stone-950 shadow-sm'
                  : 'text-amber-200/80 hover:text-amber-200'
              }`}
            >
              Lịch Sử Lượt Chơi ({runHistory.length})
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeTab === 'achievements'
                  ? 'bg-amber-600 text-stone-950 shadow-sm'
                  : 'text-amber-200/80 hover:text-amber-200'
              }`}
            >
              Huy Hiệu ({achievements.filter(a => a.unlocked).length}/{achievements.length})
            </button>
          </div>

          {runHistory.length > 0 && (
            <div>
              {confirmClear ? (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-rose-400 text-[11px]">Xóa tất cả?</span>
                  <button
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="px-2 py-0.5 rounded bg-rose-600 text-white text-[11px] font-semibold"
                  >
                    Có
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 text-[11px]"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="flex items-center gap-1 text-xs text-stone-400 hover:text-rose-400 transition-colors py-1 px-2 rounded"
                  title="Xóa lịch sử lượt chơi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span className="text-[11px]">Xóa lịch sử</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab 1: Run History Table */}
        {activeTab === 'history' && (
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {runHistory.length === 0 ? (
              <div className="py-12 text-center text-xs text-stone-400">
                Chưa có lượt chơi nào được ghi nhận. Hãy bắt đầu leo để lưu thành tích!
              </div>
            ) : (
              <div className="space-y-2">
                {runHistory.map((run, idx) => {
                  const isTopTime = bestTime && run.timeElapsed === bestTime && run.reachedHeaven;

                  return (
                    <div
                      key={run.id || idx}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                        run.reachedHeaven
                          ? 'border-amber-500/50 bg-amber-950/20'
                          : 'border-amber-900/30 bg-stone-950/40'
                      }`}
                    >
                      {/* Left info: rank & time */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                            idx === 0
                              ? 'bg-amber-500 text-stone-950'
                              : 'bg-stone-800 text-stone-300'
                          }`}
                        >
                          #{idx + 1}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-amber-200">
                              {run.reachedHeaven ? '⛩️ Chạm Thiên Đình (1000m)' : `🧗 Đạt ${run.altitude}m`}
                            </span>
                            {isTopTime && (
                              <span className="text-[10px] text-amber-400 font-mono font-bold">
                                · KỶ LỤC TỐC ĐỘ ⚡
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                            <span>{run.dateFormatted}</span>
                            <span aria-hidden="true">·</span>
                            <span>Trang phục: {run.skinName}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right stats: Time + Drops */}
                      <div className="flex items-center gap-4 text-right shrink-0 font-mono tabular-nums">
                        <div>
                          <div className="text-amber-300 font-bold">
                            ⏱️ {run.timeFormatted || formatTime(run.timeElapsed)}
                          </div>
                          <div className="text-[11px] text-stone-400 font-sans">
                            {run.totalJumps} lần nhảy
                          </div>
                        </div>

                        <div className="text-sky-300 font-semibold text-right">
                          💧 +{run.waterDrops}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Achievements Badges */}
        {activeTab === 'achievements' && (
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
                  ach.unlocked
                    ? 'border-amber-500/60 bg-amber-950/30'
                    : 'border-stone-800 bg-stone-950/40 opacity-60'
                }`}
              >
                <div className="text-2xl w-10 h-10 rounded-lg bg-stone-800 flex items-center justify-center shrink-0 border border-amber-900/30">
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-amber-200">{ach.title}</h3>
                    {ach.unlocked ? (
                      <span className="text-[10px] text-emerald-400 font-mono">· ĐÃ MỞ KHÓA</span>
                    ) : (
                      <span className="text-[10px] text-stone-500 font-mono">· CHƯA ĐẠT</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-300 mt-0.5">{ach.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-amber-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
