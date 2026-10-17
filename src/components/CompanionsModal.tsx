import React from 'react';
import { X, Check } from 'lucide-react';
import { Companion } from '../types/game';

interface CompanionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  companions: Companion[];
  onToggleCompanion: (companionId: string) => void;
  waterDrops: number;
  onUnlockCompanion: (companionId: string, cost: number) => void;
}

export const CompanionsModal: React.FC<CompanionsModalProps> = ({
  isOpen,
  onClose,
  companions,
  onToggleCompanion,
  waterDrops,
  onUnlockCompanion,
}) => {
  if (!isOpen) return null;

  const costs: Record<string, number> = {
    crab: 0,
    bee: 40,
    tiger: 80,
    bear: 120,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-amber-900/60 rounded-2xl text-amber-100 shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-amber-400 hover:text-amber-200 hover:bg-amber-950/40 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
            Liên Minh Động Vật
          </span>
          <h2 className="text-xl font-serif font-bold text-amber-300 mt-0.5">
            Bạn Đồng Hành Cùng Đi Kiện Trời
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Mỗi người bạn kết nghĩa mang lại một năng lực parkour đặc biệt hỗ trợ Cóc leo lên Thiên Đình.
          </p>
        </div>

        {/* Companions list */}
        <div className="space-y-3">
          {companions.map((comp) => {
            const cost = costs[comp.id] || 0;
            const canAfford = waterDrops >= cost;

            return (
              <div
                key={comp.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  comp.active
                    ? 'border-emerald-500/60 bg-emerald-950/30 shadow-md'
                    : 'border-amber-900/30 bg-stone-950/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl w-12 h-12 rounded-xl bg-stone-800/80 flex items-center justify-center border border-amber-900/40 shrink-0">
                    {comp.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-amber-200">
                        {comp.name} · {comp.vietnameseName}
                      </h3>
                      {comp.active && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          · ĐANG HỖ TRỢ
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-300 mt-0.5">{comp.desc}</p>
                  </div>
                </div>

                {/* Toggle / Unlock */}
                <div className="shrink-0">
                  {comp.unlocked ? (
                    <button
                      onClick={() => onToggleCompanion(comp.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                        comp.active
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-stone-950'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                      }`}
                    >
                      {comp.active ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Bật</span>
                        </>
                      ) : (
                        <span>Tắt</span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => onUnlockCompanion(comp.id, cost)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                          : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      Kết nghĩa {cost} 💧
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
