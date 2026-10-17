import React from 'react';
import { X, Check, Lock, Sparkles } from 'lucide-react';
import { SKINS } from '../game/constants';
import { Skin } from '../types/game';

interface SkinSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSkinId: string;
  onSelectSkin: (skinId: string) => void;
  waterDrops: number;
  unlockedSkinIds: string[];
  onUnlockSkin: (skin: Skin) => void;
}

export const SkinSelectorModal: React.FC<SkinSelectorModalProps> = ({
  isOpen,
  onClose,
  activeSkinId,
  onSelectSkin,
  waterDrops,
  unlockedSkinIds,
  onUnlockSkin,
}) => {
  if (!isOpen) return null;

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
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/src/assets/images/coc_avatar_1792210849784.jpg"
            alt="Cóc Anh Hùng"
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-xl border-2 border-amber-500/70 object-cover"
          />
          <div>
            <h2 className="text-xl font-serif font-bold text-amber-300">
              Trang Phục Cóc Dân Gian
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-300 mt-1">
              <span>Kho báu:</span>
              <span className="font-mono font-bold text-sky-400 flex items-center gap-1">
                💧 {waterDrops} giọt sương cứu hạn
              </span>
            </div>
          </div>
        </div>

        {/* Skin Cards */}
        <div className="space-y-3">
          {SKINS.map((skin) => {
            const isUnlocked = unlockedSkinIds.includes(skin.id);
            const isSelected = activeSkinId === skin.id;
            const canAfford = waterDrops >= skin.cost;

            return (
              <div
                key={skin.id}
                className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                  isSelected
                    ? 'border-amber-400 bg-amber-950/40 shadow-md'
                    : 'border-amber-900/30 bg-stone-950/50 hover:border-amber-700/50'
                }`}
              >
                {/* Skin Preview Icon */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center border-2 shadow-inner shrink-0"
                    style={{
                      backgroundColor: skin.bodyColor,
                      borderColor: skin.spotColor,
                    }}
                  >
                    {/* Toad eyes preview */}
                    <div className="flex items-center gap-1.5 -mt-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: skin.eyeColor }}
                        />
                      </div>
                      <div className="w-2.5 h-2.5 rounded-full bg-white flex items-center justify-center">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: skin.eyeColor }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm text-amber-200">{skin.name}</h3>
                      {isSelected && (
                        <span className="text-[10px] text-amber-400 font-mono">· ĐANG DÙNG</span>
                      )}
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">{skin.desc}</p>
                    <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{skin.perk}</span>
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <div className="shrink-0">
                  {isUnlocked ? (
                    <button
                      onClick={() => onSelectSkin(skin.id)}
                      disabled={isSelected}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 cursor-default'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-100 cursor-pointer'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã Chọn</span>
                        </>
                      ) : (
                        <span>Chọn</span>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => onUnlockSkin(skin)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                        canAfford
                          ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer'
                          : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>{skin.cost} 💧</span>
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
