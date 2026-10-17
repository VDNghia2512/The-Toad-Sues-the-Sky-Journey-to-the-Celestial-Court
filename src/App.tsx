import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { HUD } from './components/HUD';
import { TouchControls } from './components/TouchControls';
import { SkillCooldownOverlay } from './components/SkillCooldownOverlay';
import { StoryModal } from './components/StoryModal';
import { SkinSelectorModal } from './components/SkinSelectorModal';
import { CompanionsModal } from './components/CompanionsModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { GameStats, Skin, Companion, RunRecord, Achievement } from './types/game';
import { COMPANIONS, SKINS, DEFAULT_ACHIEVEMENTS } from './game/constants';
import { soundManager } from './audio/soundManager';
import { Navigation } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState<'PLAYING' | 'VICTORY' | 'GAME_OVER'>('PLAYING');
  const [gameKey, setGameKey] = useState<number>(1); // To reset the canvas cleanly

  // Stats
  const [stats, setStats] = useState<GameStats>({
    altitude: 0,
    maxAltitude: 0,
    timeElapsed: 0,
    waterDrops: 0,
    totalJumps: 0,
    perfectLandings: 0,
    teethGrinds: 0,
    airDashes: 0,
    highScore: 0,
    airDashCooldown: 0,
    maxAirDashCooldown: 30,
    rainCooldown: 0,
    maxRainCooldown: 30,
  });

  // Rain summon power meter (0 to 100)
  const [rainCharge, setRainCharge] = useState<number>(20);
  const [isRaining, setIsRaining] = useState<boolean>(false);

  // Customization
  const [activeSkinId, setActiveSkinId] = useState<string>('classic');
  const [unlockedSkinIds, setUnlockedSkinIds] = useState<string[]>(['classic']);
  const [companions, setCompanions] = useState<Companion[]>(COMPANIONS);

  // Leaderboard & Personal Records
  const [runHistory, setRunHistory] = useState<RunRecord[]>([]);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(DEFAULT_ACHIEVEMENTS);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [isNewBestTime, setIsNewBestTime] = useState<boolean>(false);

  // Audio state
  const [isMuted, setIsMuted] = useState<boolean>(soundManager.getMuted());
  const [isBgmOn, setIsBgmOn] = useState<boolean>(false);

  // Modals
  const [isStoryOpen, setIsStoryOpen] = useState<boolean>(false);
  const [isSkinsOpen, setIsSkinsOpen] = useState<boolean>(false);
  const [isCompanionsOpen, setIsCompanionsOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Load persistence
  useEffect(() => {
    try {
      const savedDrops = localStorage.getItem('coc_water_drops');
      if (savedDrops) {
        setStats(prev => ({ ...prev, waterDrops: parseInt(savedDrops, 10) || 0 }));
      }
      const savedSkin = localStorage.getItem('coc_active_skin');
      if (savedSkin) setActiveSkinId(savedSkin);

      const savedUnlocked = localStorage.getItem('coc_unlocked_skins');
      if (savedUnlocked) setUnlockedSkinIds(JSON.parse(savedUnlocked));

      const savedCompanions = localStorage.getItem('coc_companions');
      if (savedCompanions) setCompanions(JSON.parse(savedCompanions));

      const savedHistory = localStorage.getItem('coc_run_history');
      if (savedHistory) setRunHistory(JSON.parse(savedHistory));

      const savedBestTime = localStorage.getItem('coc_best_time');
      if (savedBestTime) setBestTime(parseFloat(savedBestTime));

      const savedAchievements = localStorage.getItem('coc_achievements');
      if (savedAchievements) {
        const loaded: Achievement[] = JSON.parse(savedAchievements);
        // Merge with defaults in case new achievements were added
        setAchievements(
          DEFAULT_ACHIEVEMENTS.map(def => {
            const match = loaded.find(l => l.id === def.id);
            return match || def;
          })
        );
      }

      const savedGamesCount = localStorage.getItem('coc_total_games');
      if (savedGamesCount) setTotalGames(parseInt(savedGamesCount, 10) || 0);
    } catch {
      // fallback
    }
  }, []);

  // Update rain charge as drops or jumps accumulate
  const prevDropsRef = useRef(0);
  const prevJumpsRef = useRef(0);

  const checkAchievements = useCallback((currentStats: GameStats, reachedHeaven: boolean) => {
    setAchievements(prev => {
      let changed = false;
      const updated = prev.map(ach => {
        if (ach.unlocked) return ach;
        let shouldUnlock = false;

        if (ach.id === 'first_climb' && currentStats.altitude >= 100) shouldUnlock = true;
        if (ach.id === 'dash_master' && (currentStats.airDashes || 0) >= 1) shouldUnlock = true;
        if (ach.id === 'rain_summoner' && (currentStats.teethGrinds || 0) >= 1) shouldUnlock = true;
        if (ach.id === 'water_collector' && currentStats.waterDrops >= 30) shouldUnlock = true;
        if (ach.id === 'reach_heaven' && reachedHeaven) shouldUnlock = true;
        if (ach.id === 'speed_demon' && reachedHeaven && currentStats.timeElapsed <= 150) shouldUnlock = true;

        if (shouldUnlock) {
          changed = true;
          return {
            ...ach,
            unlocked: true,
            unlockedAt: new Date().toLocaleDateString('vi-VN'),
          };
        }
        return ach;
      });

      if (changed) {
        localStorage.setItem('coc_achievements', JSON.stringify(updated));
      }
      return changed ? updated : prev;
    });
  }, []);

  const handleStatsUpdate = useCallback((newStats: GameStats) => {
    setStats(prev => ({
      ...newStats,
      waterDrops: Math.max(prev.waterDrops, newStats.waterDrops),
      highScore: Math.max(prev.highScore, newStats.maxAltitude),
    }));

    // Save water drops
    if (newStats.waterDrops > prevDropsRef.current) {
      prevDropsRef.current = newStats.waterDrops;
      localStorage.setItem('coc_water_drops', String(newStats.waterDrops));
      // Give rain charge boost
      setRainCharge(c => Math.min(100, c + 15));
    }

    if (newStats.totalJumps > prevJumpsRef.current) {
      prevJumpsRef.current = newStats.totalJumps;
      setRainCharge(c => Math.min(100, c + 3));
    }

    checkAchievements(newStats, false);
  }, [checkAchievements]);

  // Save run record to personal leaderboard
  const saveRunRecord = useCallback((finalStats: GameStats, reachedHeaven: boolean) => {
    const sec = finalStats.timeElapsed || 0;
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 10);
    const timeFormatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms}`;

    const now = new Date();
    const dateFormatted = `${now.getDate()}/${now.getMonth() + 1} ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

    const activeSkin = SKINS.find(s => s.id === activeSkinId);

    const record: RunRecord = {
      id: `run_${Date.now()}`,
      timestamp: Date.now(),
      dateFormatted,
      altitude: finalStats.altitude,
      timeElapsed: sec,
      timeFormatted,
      reachedHeaven,
      waterDrops: finalStats.waterDrops,
      totalJumps: finalStats.totalJumps,
      perfectLandings: finalStats.perfectLandings,
      skinName: activeSkin ? activeSkin.name : 'Cóc Dân Gian',
    };

    setRunHistory(prev => {
      const updated = [record, ...prev].slice(0, 15);
      localStorage.setItem('coc_run_history', JSON.stringify(updated));
      return updated;
    });

    setTotalGames(prev => {
      const updated = prev + 1;
      localStorage.setItem('coc_total_games', String(updated));
      return updated;
    });

    if (reachedHeaven) {
      setBestTime(prevBest => {
        if (prevBest === null || sec < prevBest) {
          setIsNewBestTime(true);
          localStorage.setItem('coc_best_time', String(sec));
          return sec;
        }
        setIsNewBestTime(false);
        return prevBest;
      });
    }

    checkAchievements(finalStats, reachedHeaven);
  }, [activeSkinId, checkAchievements]);

  // Trigger Rain Summon (allowed when cooldown is 0 or charge full)
  const handleTriggerRain = useCallback(() => {
    if ((stats.rainCooldown || 0) <= 0 || rainCharge >= 100) {
      setIsRaining(true);
      setRainCharge(0);
    }
  }, [rainCharge, stats.rainCooldown]);

  useEffect(() => {
    const handleKeyR = (e: KeyboardEvent) => {
      if ((e.code === 'KeyR' || e.key === 'r' || e.key === 'R') && gameState === 'PLAYING') {
        handleTriggerRain();
      }
    };
    window.addEventListener('keydown', handleKeyR);
    return () => window.removeEventListener('keydown', handleKeyR);
  }, [gameState, handleTriggerRain]);

  const handleRainSummonEnd = () => {
    setIsRaining(false);
  };

  // Sound handlers
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleBgm = () => {
    if (isBgmOn) {
      soundManager.stopFolkBgm();
      setIsBgmOn(false);
    } else {
      soundManager.startFolkBgm();
      setIsBgmOn(true);
    }
  };

  // Restart handler
  const handleRestart = () => {
    setGameState('PLAYING');
    setGameKey(k => k + 1);
    setRainCharge(20);
    setIsRaining(false);
    setIsNewBestTime(false);
  };

  // Victory handler
  const handleReachHeaven = () => {
    setGameState('VICTORY');
    soundManager.playThunderDrum();
    saveRunRecord(stats, true);
  };

  // Game over handler
  const handleGameOver = (finalStats: GameStats) => {
    setGameState('GAME_OVER');
    saveRunRecord(finalStats, false);
  };

  // Skin unlock and select
  const handleSelectSkin = (skinId: string) => {
    setActiveSkinId(skinId);
    localStorage.setItem('coc_active_skin', skinId);
  };

  const handleUnlockSkin = (skin: Skin) => {
    if (stats.waterDrops >= skin.cost) {
      const remainingDrops = stats.waterDrops - skin.cost;
      const updatedUnlocked = [...unlockedSkinIds, skin.id];
      setStats(prev => ({ ...prev, waterDrops: remainingDrops }));
      setUnlockedSkinIds(updatedUnlocked);
      setActiveSkinId(skin.id);

      localStorage.setItem('coc_water_drops', String(remainingDrops));
      localStorage.setItem('coc_unlocked_skins', JSON.stringify(updatedUnlocked));
      localStorage.setItem('coc_active_skin', skin.id);
      soundManager.playWaterCollect();
    }
  };

  // Companions handlers
  const handleToggleCompanion = (id: string) => {
    setCompanions(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, active: !c.active } : c));
      localStorage.setItem('coc_companions', JSON.stringify(updated));
      return updated;
    });
  };

  const handleUnlockCompanion = (id: string, cost: number) => {
    if (stats.waterDrops >= cost) {
      const remainingDrops = stats.waterDrops - cost;
      setStats(prev => ({ ...prev, waterDrops: remainingDrops }));
      setCompanions(prev => {
        const updated = prev.map(c => (c.id === id ? { ...c, unlocked: true, active: true } : c));
        localStorage.setItem('coc_companions', JSON.stringify(updated));
        return updated;
      });
      localStorage.setItem('coc_water_drops', String(remainingDrops));
      soundManager.playWaterCollect();
    }
  };

  const handleClearHistory = () => {
    setRunHistory([]);
    setBestTime(null);
    localStorage.removeItem('coc_run_history');
    localStorage.removeItem('coc_best_time');
  };

  // Touch control button events
  const dispatchKey = (code: string, type: 'keydown' | 'keyup') => {
    window.dispatchEvent(new KeyboardEvent(type, { code }));
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-stone-950 font-sans select-none">
      {/* Top HUD */}
      <HUD
        stats={stats}
        rainCharge={rainCharge}
        onTriggerRain={handleTriggerRain}
        onOpenStory={() => setIsStoryOpen(true)}
        onOpenSkins={() => setIsSkinsOpen(true)}
        onOpenCompanions={() => setIsCompanionsOpen(true)}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
        onRestart={handleRestart}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isBgmOn={isBgmOn}
        onToggleBgm={handleToggleBgm}
      />

      {/* Main Game Stage Area */}
      <main className="relative flex-1 w-full h-full flex items-center justify-center p-1 sm:p-2 overflow-hidden bg-stone-950">
        <GameCanvas
          key={gameKey}
          onStatsUpdate={handleStatsUpdate}
          onReachHeaven={handleReachHeaven}
          onGameOver={handleGameOver}
          activeSkinId={activeSkinId}
          companions={companions}
          isPaused={gameState !== 'PLAYING'}
          rainSummonActive={isRaining}
          onRainSummonEnd={handleRainSummonEnd}
        />

        {/* Top-Left Skill Cooldown Indicator (~30s base) */}
        <SkillCooldownOverlay
          airDashCooldown={stats.airDashCooldown || 0}
          maxAirDashCooldown={stats.maxAirDashCooldown || 30}
          rainCooldown={stats.rainCooldown || 0}
          maxRainCooldown={stats.maxRainCooldown || 30}
          onTriggerRain={handleTriggerRain}
        />

        {/* Mobile On-screen Controls with Cooldown Badges */}
        <TouchControls
          onLeftStart={() => dispatchKey('ArrowLeft', 'keydown')}
          onLeftEnd={() => dispatchKey('ArrowLeft', 'keyup')}
          onRightStart={() => dispatchKey('ArrowRight', 'keydown')}
          onRightEnd={() => dispatchKey('ArrowRight', 'keyup')}
          onJumpPress={() => {
            dispatchKey('Space', 'keydown');
            setTimeout(() => dispatchKey('Space', 'keyup'), 100);
          }}
          onDashPress={() => {
            dispatchKey('KeyJ', 'keydown');
            setTimeout(() => dispatchKey('KeyJ', 'keyup'), 100);
          }}
          onRainPress={handleTriggerRain}
          rainCharge={rainCharge}
          airDashCooldown={stats.airDashCooldown}
          rainCooldown={stats.rainCooldown}
        />

        {/* Floating Quick Guide badge */}
        {showGuide && (
          <div className="hidden lg:flex absolute bottom-4 left-6 max-w-sm p-3.5 rounded-xl bg-stone-900/90 border border-amber-900/50 text-amber-200/90 backdrop-blur-md text-xs flex-col gap-1.5 shadow-xl">
            <div className="flex items-center justify-between text-amber-300 font-semibold border-b border-amber-900/40 pb-1.5 mb-0.5">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-amber-400" />
                <span>Hướng Dẫn Kỹ Năng & Điều Khiển</span>
              </span>
              <button
                onClick={() => setShowGuide(false)}
                className="text-[10px] text-stone-400 hover:text-stone-200 cursor-pointer"
              >
                Ẩn
              </button>
            </div>
            <div className="space-y-1.5 text-stone-300 text-[11px] leading-snug">
              <div>⌨️ <strong>Phím A / D hoặc Mũi tên:</strong> Di chuyển trái / phải và lượn hướng trên không.</div>
              <div>🦘 <strong>Phím Space / W / Mũi tên Lên:</strong> Nhảy dứt khoát từ bệ đứng (không dùng chuột).</div>
              <div>💨 <strong>Đạp Gió Lướt Mây (Shift / J / Nhảy trên không):</strong> Phóng luồng khí lướt mây đổi làn tức thì (<strong>Hồi chiêu: ~30s</strong>, ăn sương giúp hồi nhanh).</div>
              <div>⚡ <strong>Nghiến Răng Gọi Mưa (Phím R hoặc nút Sấm Giông):</strong> Hô phong hoán vũ bay vút qua hiểm cảnh (<strong>Hồi chiêu: ~30s</strong>).</div>
              <div>⏱️ <strong>Thời Gian Chờ:</strong> Luôn hiển thị trực quan ở góc trên bên trái màn hình.</div>
              <div>⚖️ <strong>3 Làn Cân Bằng (Trái - Giữa - Phải):</strong> Tỷ lệ 1:1:1 tự do chọn lộ trình tối ưu nhất!</div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        runHistory={runHistory}
        achievements={achievements}
        bestTime={bestTime}
        maxAltitude={stats.highScore}
        totalGames={totalGames}
        totalDrops={stats.waterDrops}
        onClearHistory={handleClearHistory}
      />

      <StoryModal isOpen={isStoryOpen} onClose={() => setIsStoryOpen(false)} />

      <SkinSelectorModal
        isOpen={isSkinsOpen}
        onClose={() => setIsSkinsOpen(false)}
        activeSkinId={activeSkinId}
        onSelectSkin={handleSelectSkin}
        waterDrops={stats.waterDrops}
        unlockedSkinIds={unlockedSkinIds}
        onUnlockSkin={handleUnlockSkin}
      />

      <CompanionsModal
        isOpen={isCompanionsOpen}
        onClose={() => setIsCompanionsOpen(false)}
        companions={companions}
        onToggleCompanion={handleToggleCompanion}
        waterDrops={stats.waterDrops}
        onUnlockCompanion={handleUnlockCompanion}
      />

      <VictoryModal
        isOpen={gameState === 'VICTORY'}
        stats={stats}
        isNewBestTime={isNewBestTime}
        onContinueEndless={() => setGameState('PLAYING')}
        onRestart={handleRestart}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />

      <GameOverModal
        isOpen={gameState === 'GAME_OVER'}
        stats={stats}
        onRestart={handleRestart}
        onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
      />
    </div>
  );
}
