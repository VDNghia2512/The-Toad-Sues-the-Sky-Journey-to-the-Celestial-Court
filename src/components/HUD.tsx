import React from 'react';
import { GameStats, GameRealm } from '../types/game';
import { REALMS } from '../game/constants';
import { Volume2, VolumeX, BookOpen, Shirt, Users, RotateCcw, Trophy, Clock, Share2, Smartphone } from 'lucide-react';

interface HUDProps {
  stats: GameStats;
  onOpenStory: () => void;
  onOpenSkins: () => void;
  onOpenCompanions: () => void;
  onOpenLeaderboard: () => void;
  onOpenShare: () => void;
  onOpenAndroidInstall: () => void;
  onRestart: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isBgmOn: boolean;
  onToggleBgm: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  onOpenStory,
  onOpenSkins,
  onOpenCompanions,
  onOpenLeaderboard,
  onOpenShare,
  onOpenAndroidInstall,
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
      {/* 1. TOP BAR: Wordmark - Nav Links - Sound toggles & Restart action */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between gap-4 md:gap-8 px-4 py-2.5">
        {/* Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-lg md:text-xl font-bold tracking-wider text-amber-400 uppercase whitespace-nowrap">
            Cóc Kiện Trời
          </span>
          <span className="text-xs text-amber-300/70 hidden sm:inline font-sans">
            · Vượt Thiên Đình
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-4 lg:gap-5 text-xs lg:text-sm font-medium text-amber-200/80">
          <button
            onClick={onOpenAndroidInstall}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 hover:text-emerald-100 hover:bg-emerald-900/80 transition shadow-sm cursor-pointer text-xs font-bold"
            title="Tải game về điện thoại Android hoặc tạo file APK"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tải Android / APK</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap text-amber-300 font-semibold cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Thành Tích</span>
          </button>

          <button
            onClick={onOpenStory}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Sự Tích</span>
          </button>

          <button
            onClick={onOpenSkins}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Shirt className="w-4 h-4" />
            <span>Trang Phục</span>
          </button>

          <button
            onClick={onOpenCompanions}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer"
          >
            <Users className="w-4 h-4" />
            <span>Bạn Đồng Hành</span>
          </button>

          <button
            onClick={onOpenShare}
            className="flex items-center gap-1.5 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer text-amber-300 font-medium"
          >
            <Share2 className="w-4 h-4 text-amber-400" />
            <span>Chia Sẻ</span>
          </button>
        </nav>

        {/* Action Controls & Sound */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Android APK button */}
          <button
            onClick={onOpenAndroidInstall}
            title="Tải game về Android / APK"
            className="md:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold hover:bg-emerald-900/60 transition-colors cursor-pointer"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>APK</span>
          </button>

          {/* Share button */}
          <button
            onClick={onOpenShare}
            title="Chia sẻ game cho bạn bè"
            className="p-1.5 rounded-lg text-amber-300 hover:text-amber-200 hover:bg-amber-900/40 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Mobile leaderboard quick button */}
          <button
            onClick={onOpenLeaderboard}
            title="Xem thành tích cá nhân"
            className="md:hidden p-1.5 rounded-lg text-amber-300 hover:bg-amber-900/30 transition-colors cursor-pointer"
          >
            <Trophy className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleBgm}
            title={isBgmOn ? 'Tắt nhạc nền ngũ cung' : 'Bật nhạc nền ngũ cung'}
            className="p-1.5 rounded-lg text-amber-200/80 hover:text-amber-300 hover:bg-amber-900/30 transition-colors cursor-pointer"
          >
            <span className="text-xs font-mono font-semibold px-1">
              {isBgmOn ? '🎵' : '🔇'}
            </span>
          </button>

          <button
            onClick={onToggleMute}
            title={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
            className="p-1.5 rounded-lg text-amber-200/80 hover:text-amber-300 hover:bg-amber-900/30 transition-colors cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Primary Action Button: Restart run */}
          <button
            onClick={onRestart}
            className="px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 whitespace-nowrap shrink-0 shadow-sm bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer"
            title="Bắt đầu lại màn chơi"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chơi Lại</span>
          </button>
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

          {/* Stats: Timer, Altitude, Water drops */}
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
          </div>
        </div>
      </div>
    </header>
  );
};
