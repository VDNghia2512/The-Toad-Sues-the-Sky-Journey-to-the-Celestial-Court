import React from 'react';
import { GameStats, GameRealm } from '../types/game';
import { REALMS } from '../game/constants';
import { Volume2, VolumeX, Sparkles, BookOpen, Shirt, Users, RotateCcw, Trophy, Clock } from 'lucide-react';

interface HUDProps {
  stats: GameStats;
  rainCharge: number; // 0 to 100
  onTriggerRain: () => void;
  onOpenStory: () => void;
  onOpenSkins: () => void;
  onOpenCompanions: () => void;
  onOpenLeaderboard: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isBgmOn: boolean;
  onToggleBgm: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  rainCharge,
  onTriggerRain,
  onOpenStory,
  onOpenSkins,
  onOpenCompanions,
  onOpenLeaderboard,
  onRestart,
  isMuted,
  onToggleMute,
  isBgmOn,
  onToggleBgm,
}) => {
  // Current realm
  const currentRealm: GameRealm =
    REALMS.slice().reverse().find(r => stats.altitude >= r.minAlt) || REALMS[0];

  const progressPercent = Math.min(100, Math.floor((stats.altitude / 1000) * 100));

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;
  };

  return (
    <header className="w-full flex flex-col shrink-0 border-b border-amber-900/30 bg-stone-950/90 backdrop-blur-md text-amber-50 z-20">
      {/* 1. TOP BAR CONTRACT: Zone 1 (Wordmark) - Zone 2 (4-5 Nav Links) - Zone 3 (Primary Action) */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4 md:gap-8 px-4 py-2.5">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-lg md:text-xl font-bold tracking-wider text-amber-400 uppercase whitespace-nowrap">
            Cóc Kiện Trời
          </span>
          <span className="text-xs text-amber-300/70 hidden sm:inline font-sans">
            · Vượt Thiên Đình
          </span>
        </div>

        {/* Zone 2: Nav links, single-line text with hover underlines */}
        <nav className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-medium text-amber-200/80">
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap text-amber-300 font-semibold"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Thành Tích</span>
          </button>

          <button
            onClick={onOpenStory}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4" />
            <span>Sự Tích</span>
          </button>

          <button
            onClick={onOpenSkins}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            <Shirt className="w-4 h-4" />
            <span>Trang Phục</span>
          </button>

          <button
            onClick={onOpenCompanions}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            <Users className="w-4 h-4" />
            <span>Bạn Đồng Hành</span>
          </button>

          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Chơi Lại</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Sound toggles */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile leaderboard quick button */}
          <button
            onClick={onOpenLeaderboard}
            title="Xem thành tích cá nhân"
            className="md:hidden p-1.5 rounded-lg text-amber-300 hover:bg-amber-900/30 transition-colors"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleBgm}
            title={isBgmOn ? 'Tắt nhạc nền ngũ cung' : 'Bật nhạc nền ngũ cung'}
            className="p-1.5 rounded-lg text-amber-200/80 hover:text-amber-300 hover:bg-amber-900/30 transition-colors"
          >
            <span className="text-xs font-mono font-semibold px-1">
              {isBgmOn ? '🎵' : '🔇'}
            </span>
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-1.5 rounded-lg text-amber-200/80 hover:text-amber-300 hover:bg-amber-900/30 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Primary Action Button: Rain Summon with Cooldown indicator */}
          {(() => {
            const rainCd = stats.rainCooldown || 0;
            const isReady = rainCd <= 0 || rainCharge >= 100;
            return (
              <button
                onClick={onTriggerRain}
                disabled={!isReady}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 whitespace-nowrap shrink-0 shadow-sm ${
                  isReady
                    ? 'bg-amber-500 hover:bg-amber-400 text-stone-950 animate-pulse shadow-amber-500/40 cursor-pointer'
                    : 'bg-stone-900 text-amber-400/50 border border-amber-900/40 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {!isReady ? `Gọi Mưa (${Math.ceil(rainCd)}s)` : 'Nghiến Răng Gọi Mưa [R]'}
                </span>
                <span className="sm:hidden">
                  {!isReady ? `${Math.ceil(rainCd)}s` : 'Gọi Mưa [R]'}
                </span>
              </button>
            );
          })()}
        </div>
      </div>

      {/* 2. IN-GAME PROGRESS & METRICS STRIP */}
      <div className="w-full bg-stone-900/70 border-t border-amber-950/40 px-4 py-1.5 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 flex-wrap">
          {/* Realm indicator */}
          <div className="flex items-center gap-2 text-amber-200/90 font-medium">
            <span>{currentRealm.vietnameseName}</span>
            <span aria-hidden="true" className="text-amber-500/40">·</span>
            <span className="text-amber-300/70 hidden sm:inline">{currentRealm.quote}</span>
          </div>

          {/* Stats: Timer, Altitude, Water drops, Rain charge */}
          <div className="flex items-center gap-3 sm:gap-4 font-mono tabular-nums text-xs">
            {/* Live Run Timer */}
            <div className="flex items-center gap-1 text-amber-300 font-semibold">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{formatTime(stats.timeElapsed || 0)}</span>
            </div>

            <span aria-hidden="true" className="text-amber-700/60">·</span>

            {/* Altitude */}
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400/70 font-sans">Độ cao:</span>
              <span className="font-bold text-amber-300 text-sm">{stats.altitude}m</span>
              <span className="text-stone-400 font-sans">({progressPercent}%)</span>
            </div>

            <span aria-hidden="true" className="text-amber-700/60">·</span>

            {/* Water Drops */}
            <div className="flex items-center gap-1">
              <span className="text-sky-400">💧</span>
              <span className="font-bold text-sky-200">{stats.waterDrops}</span>
            </div>

            <span aria-hidden="true" className="text-amber-700/60 hidden sm:inline">·</span>

            {/* Rain Meter */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="text-amber-300/80 font-sans">Sấm giông:</span>
              <div className="w-14 h-2 bg-stone-800 rounded-full overflow-hidden border border-amber-900/50">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 via-amber-400 to-amber-300 transition-all duration-200"
                  style={{ width: `${rainCharge}%` }}
                />
              </div>
              <span className="text-amber-300 font-semibold">{Math.floor(rainCharge)}%</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
