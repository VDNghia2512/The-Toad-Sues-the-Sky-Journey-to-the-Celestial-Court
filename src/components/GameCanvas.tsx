import React, { useRef, useEffect, useCallback } from 'react';
import { Player, Platform, Particle, Companion, GameStats } from '../types/game';
import { GAME_CONSTANTS, REALMS, SKINS } from '../game/constants';
import { LevelGenerator } from '../game/levelGenerator';
import { PhysicsEngine } from '../game/physics';
import { soundManager } from '../audio/soundManager';

interface GameCanvasProps {
  onStatsUpdate: (stats: GameStats) => void;
  onReachHeaven: () => void;
  onGameOver: (finalStats: GameStats) => void;
  activeSkinId: string;
  companions: Companion[];
  isPaused: boolean;
  rainSummonActive: boolean;
  onRainSummonEnd: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  onStatsUpdate,
  onReachHeaven,
  onGameOver,
  activeSkinId,
  companions,
  isPaused,
  rainSummonActive,
  onRainSummonEnd,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Gameplay state refs
  const playerRef = useRef<Player>({
    x: GAME_CONSTANTS.WORLD_WIDTH / 2,
    y: -40,
    vx: 0,
    vy: 0,
    width: 44,
    height: 38,
    isGrounded: true,
    canAirDash: true,
    airDashCount: 1,
    airDashTimer: 0,
    airDashCooldown: 0,
    maxAirDashCooldown: 30,
    squashX: 1,
    squashY: 1,
    rotation: 0,
    facing: 1,
    state: 'idle',
    chargeTime: 0,
    canDoubleJump: true,
    lastPlatformId: 'ground',
    skinId: 'classic',
  });

  const platformsRef = useRef<Platform[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cameraYRef = useRef<number>(0);
  const maxClimbedYRef = useRef<number>(0);
  const levelGenRef = useRef<LevelGenerator>(new LevelGenerator());

  // Input states (Keyboard only, mouse slingshot removed)
  const keysRef = useRef({ left: false, right: false, jump: false, down: false });

  const rainTimerRef = useRef<number>(0);
  const rainCooldownRef = useRef<number>(0);
  const rainOrbsRef = useRef<number>(0);
  const totalJumpsRef = useRef<number>(0);
  const perfectLandingsRef = useRef<number>(0);
  const teethGrindsRef = useRef<number>(0);
  const airDashesRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const reachedHeavenRef = useRef<boolean>(false);

  // Background image ref
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new Image();
    img.src = '/src/assets/images/thien_dinh_sky_bg_1792210834302.jpg';
    img.onload = () => {
      bgImgRef.current = img;
    };
  }, []);

  useEffect(() => {
    playerRef.current.skinId = (activeSkinId as any) || 'classic';
  }, [activeSkinId]);

  useEffect(() => {
    if (rainSummonActive) {
      teethGrindsRef.current++;
      rainTimerRef.current = 180;
      const hasRainSpirit = activeSkinId === 'rain_spirit';
      rainCooldownRef.current = hasRainSpirit ? 20 : GAME_CONSTANTS.RAIN_SUMMON_COOLDOWN;
      soundManager.playRainSummon();
      playerRef.current.vy = -12;
      playerRef.current.isGrounded = false;
      playerRef.current.airDashTimer = 0;
    }
  }, [rainSummonActive, activeSkinId]);

  const resetGame = useCallback(() => {
    const levelGen = levelGenRef.current;
    const initialPlatforms = levelGen.generateInitialChunk(-3000);
    platformsRef.current = initialPlatforms;
    particlesRef.current = [];

    const hasCrab = companions.find(c => c.id === 'crab')?.active;

    playerRef.current = {
      x: GAME_CONSTANTS.WORLD_WIDTH / 2,
      y: -35,
      vx: 0,
      vy: 0,
      width: 44,
      height: 38,
      isGrounded: true,
      canAirDash: true,
      airDashCount: hasCrab ? 2 : 1,
      airDashTimer: 0,
      airDashCooldown: 0,
      maxAirDashCooldown: 30,
      squashX: 1,
      squashY: 1,
      rotation: 0,
      facing: 1,
      state: 'idle',
      chargeTime: 0,
      canDoubleJump: true,
      lastPlatformId: 'ground',
      skinId: (activeSkinId as any) || 'classic',
    };

    cameraYRef.current = 0;
    maxClimbedYRef.current = 0;
    rainTimerRef.current = 0;
    rainCooldownRef.current = 0;
    totalJumpsRef.current = 0;
    perfectLandingsRef.current = 0;
    airDashesRef.current = 0;
    startTimeRef.current = Date.now();
    reachedHeavenRef.current = false;
  }, [activeSkinId, companions]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const performJump = useCallback((forceX: number, forceY: number) => {
    const player = playerRef.current;
    player.vx = forceX;
    player.vy = forceY;
    player.isGrounded = false;
    player.airDashTimer = 0;
    player.squashX = 0.65;
    player.squashY = 1.45;
    totalJumpsRef.current++;

    const powerRatio = Math.min(1, Math.abs(forceY) / 16);
    soundManager.playJump(powerRatio);

    for (let i = 0; i < 7; i++) {
      particlesRef.current.push({
        x: player.x + (Math.random() - 0.5) * 16,
        y: player.y + player.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 2 + 1,
        color: '#fef08a',
        size: 3,
        alpha: 0.8,
        life: 0,
        maxLife: 20,
      });
    }
  }, []);

  // Keyboard controls listener (pure keyboard controls, no mouse jump)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused) return;

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = true;
      }

      // Jump / Air Dash keys: Space, ArrowUp, KeyW, ShiftLeft, KeyJ
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight' || e.code === 'KeyJ') {
        // Dedicated Dash key
        const player = playerRef.current;
        if (!player.isGrounded) {
          const dashed = PhysicsEngine.tryAirDash(
            player,
            particlesRef.current,
            companions,
            keysRef.current.left ? -1 : keysRef.current.right ? 1 : player.facing
          );
          if (dashed) airDashesRef.current++;
        }
      }

      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        keysRef.current.jump = true;

        const player = playerRef.current;
        if (player.isGrounded) {
          // Jump from platform
          performJump(player.vx * 0.8, GAME_CONSTANTS.MAX_JUMP_FORCE_Y);
        } else {
          // Mid-air: Trigger Air Dash (Đạp Gió Lướt Mây)!
          const dashed = PhysicsEngine.tryAirDash(
            player,
            particlesRef.current,
            companions,
            keysRef.current.left ? -1 : keysRef.current.right ? 1 : player.facing
          );

          if (dashed) {
            airDashesRef.current++;
          } else if (player.canDoubleJump) {
            // Secondary double jump hop if dashes used
            player.canDoubleJump = false;
            performJump(player.vx * 0.9, GAME_CONSTANTS.MIN_JUMP_FORCE_Y * 1.3);
            soundManager.playCroak();
          }
        }
      }

      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keysRef.current.down = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        keysRef.current.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        keysRef.current.right = false;
      }
      if (e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space') {
        keysRef.current.jump = false;
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        keysRef.current.down = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPaused, performJump, companions]);

  // Main 60FPS Game Loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(2, (currentTime - lastTime) / 16.666);
      lastTime = currentTime;

      if (!isPaused) {
        const player = playerRef.current;
        const platforms = platformsRef.current;
        const particles = particlesRef.current;

        // 1. Rain torrent powerup
        if (rainTimerRef.current > 0) {
          rainTimerRef.current--;
          player.vy = Math.min(player.vy, -8.5);
          player.squashY = 1.3;

          particles.push({
            x: player.x + (Math.random() - 0.5) * 30,
            y: player.y + 25,
            vx: (Math.random() - 0.5) * 3,
            vy: 6 + Math.random() * 4,
            color: '#38bdf8',
            size: 4 + Math.random() * 2,
            alpha: 0.9,
            life: 0,
            maxLife: 25,
            shape: 'drop',
          });

          if (rainTimerRef.current === 0) {
            onRainSummonEnd();
          }
        }

        // 2. Physics update
        const physicsResult = PhysicsEngine.updatePlayer(
          player,
          platforms,
          particles,
          companions,
          keysRef.current,
          dt
        );

        if (physicsResult.landedOn) {
          perfectLandingsRef.current++;
        }

        if (physicsResult.triggeredRainOrb && !reachedHeavenRef.current) {
          reachedHeavenRef.current = true;
          onReachHeaven();
        }

        // 3. Collectibles check & Cooldown recovery
        const dropsEarned = PhysicsEngine.checkCollectibles(player, platforms, particles, companions);
        if (dropsEarned > 0) {
          rainOrbsRef.current += dropsEarned;
          // Water drops also speed up rain summon cooldown
          if (rainCooldownRef.current > 0) {
            rainCooldownRef.current = Math.max(0, rainCooldownRef.current - dropsEarned * 0.6);
          }
        }

        // Tick rain cooldown timer (~30s base)
        if (rainCooldownRef.current > 0) {
          rainCooldownRef.current = Math.max(0, rainCooldownRef.current - dt / 60);
        }

        // 4. Update particles
        PhysicsEngine.updateParticles(particles);

        // 5. Camera follow
        const targetCamY = player.y - GAME_CONSTANTS.VIEWPORT_HEIGHT * 0.6;
        if (targetCamY < cameraYRef.current) {
          cameraYRef.current += (targetCamY - cameraYRef.current) * 0.12;
        } else {
          cameraYRef.current += (targetCamY - cameraYRef.current) * 0.03;
        }

        const currentAltitude = Math.max(0, Math.floor(-player.y * GAME_CONSTANTS.ALTITUDE_SCALE));
        if (player.y < maxClimbedYRef.current) {
          maxClimbedYRef.current = player.y;
        }
        const maxAltitude = Math.floor(-maxClimbedYRef.current * GAME_CONSTANTS.ALTITUDE_SCALE);
        const timeElapsed = Math.max(0, (Date.now() - startTimeRef.current) / 1000);

        const hasWarrior = activeSkinId === 'warrior';
        const hasCrab = companions.find(c => c.id === 'crab')?.active;
        let maxDashCd = GAME_CONSTANTS.AIR_DASH_COOLDOWN;
        if (hasWarrior) maxDashCd -= 6;
        if (hasCrab) maxDashCd -= 6;
        const maxRainCd = activeSkinId === 'rain_spirit' ? 20 : GAME_CONSTANTS.RAIN_SUMMON_COOLDOWN;

        onStatsUpdate({
          altitude: currentAltitude,
          maxAltitude,
          timeElapsed,
          waterDrops: rainOrbsRef.current,
          totalJumps: totalJumpsRef.current,
          perfectLandings: perfectLandingsRef.current,
          teethGrinds: teethGrindsRef.current,
          airDashes: airDashesRef.current,
          highScore: maxAltitude,
          airDashCooldown: player.airDashCooldown || 0,
          maxAirDashCooldown: player.maxAirDashCooldown || maxDashCd,
          rainCooldown: rainCooldownRef.current || 0,
          maxRainCooldown: maxRainCd,
        });

        // 6. Death threshold check
        const bottomDeathThreshold = cameraYRef.current + GAME_CONSTANTS.VIEWPORT_HEIGHT + 150;
        if (player.y > bottomDeathThreshold && player.y > 0) {
          const tigerCompanion = companions.find(c => c.id === 'tiger');
          if (tigerCompanion && tigerCompanion.active && tigerCompanion.unlocked) {
            tigerCompanion.active = false;
            soundManager.playThunderDrum();
            player.y = cameraYRef.current + GAME_CONSTANTS.VIEWPORT_HEIGHT * 0.4;
            player.vy = -18;
            player.isGrounded = false;
          } else {
            onGameOver({
              altitude: currentAltitude,
              maxAltitude,
              timeElapsed,
              waterDrops: rainOrbsRef.current,
              totalJumps: totalJumpsRef.current,
              perfectLandings: perfectLandingsRef.current,
              teethGrinds: teethGrindsRef.current,
              airDashes: airDashesRef.current,
              highScore: maxAltitude,
              airDashCooldown: player.airDashCooldown || 0,
              maxAirDashCooldown: player.maxAirDashCooldown || 30,
              rainCooldown: rainCooldownRef.current || 0,
              maxRainCooldown: activeSkinId === 'rain_spirit' ? 20 : GAME_CONSTANTS.RAIN_SUMMON_COOLDOWN,
            });
          }
        }

        // 7. Dynamic Level generation
        if (player.y - 2500 < levelGenRef.current['highestGeneratedY']) {
          levelGenRef.current.generateMore(player.y - 3000, platforms);
        }
      }

      // --- RENDERING PHASE ---
      ctx.clearRect(0, 0, GAME_CONSTANTS.WORLD_WIDTH, GAME_CONSTANTS.VIEWPORT_HEIGHT);
      ctx.save();

      const altMeters = Math.max(0, -cameraYRef.current * GAME_CONSTANTS.ALTITUDE_SCALE);

      // 1. Folkloric Sky Background
      drawFolkSkyBackground(ctx, altMeters, cameraYRef.current, bgImgRef.current);

      // Camera transform
      ctx.translate(0, -cameraYRef.current);

      // 2. Draw Side Pillars
      drawSidePillars(ctx, cameraYRef.current);

      // 3. Draw Platforms (3 balanced lanes)
      for (const plat of platformsRef.current) {
        if (
          plat.y + plat.height < cameraYRef.current - 50 ||
          plat.y > cameraYRef.current + GAME_CONSTANTS.VIEWPORT_HEIGHT + 50
        ) {
          continue;
        }
        drawPlatform(ctx, plat);
      }

      // 4. Draw Particles
      drawParticles(ctx, particlesRef.current);

      // 5. Draw Player Toad & Air Dash visuals
      drawToadPlayer(ctx, playerRef.current, activeSkinId);

      // 6. Rain VFX Overlay
      if (rainTimerRef.current > 0) {
        drawRainTorrent(ctx, cameraYRef.current);
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused, activeSkinId, companions, onGameOver, onReachHeaven, onStatsUpdate, onRainSummonEnd]);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden touch-none">
      <canvas
        ref={canvasRef}
        width={GAME_CONSTANTS.WORLD_WIDTH}
        height={GAME_CONSTANTS.VIEWPORT_HEIGHT}
        onMouseDown={(e) => e.preventDefault()}
        onPointerDown={(e) => e.preventDefault()}
        className="max-h-[92vh] max-w-[98vw] aspect-[600/850] object-contain shadow-2xl rounded-2xl border-4 border-amber-900/60 bg-stone-900 cursor-default select-none touch-none"
      />
    </div>
  );
};

// ==================== DRAWING HELPERS ====================

function drawFolkSkyBackground(
  ctx: CanvasRenderingContext2D,
  alt: number,
  camY: number,
  bgImg: HTMLImageElement | null
) {
  const w = GAME_CONSTANTS.WORLD_WIDTH;
  const h = GAME_CONSTANTS.VIEWPORT_HEIGHT;

  let topCol = '#1e1b4b';
  let botCol = '#78350f';

  if (alt < 250) {
    topCol = '#78350f';
    botCol = '#451a03';
  } else if (alt < 550) {
    topCol = '#134e4a';
    botCol = '#78350f';
  } else if (alt < 850) {
    topCol = '#0f172a';
    botCol = '#1e1b4b';
  } else {
    topCol = '#78350f';
    botCol = '#ca8a04';
  }

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, topCol);
  grad.addColorStop(1, botCol);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  if (bgImg && bgImg.complete) {
    ctx.save();
    ctx.globalAlpha = 0.38;
    const parallaxY = -(camY * 0.15) % h;
    ctx.drawImage(bgImg, 0, parallaxY - h, w, h);
    ctx.drawImage(bgImg, 0, parallaxY, w, h);
    ctx.restore();
  }

  ctx.save();
  ctx.fillStyle = 'rgba(251, 191, 36, 0.08)';
  const sunY = ((camY * 0.05) % 1200) + 200;
  ctx.beginPath();
  ctx.arc(w / 2, sunY, 140, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 4; i++) {
    const cloudY = ((camY * 0.2 + i * 260) % (h + 200)) - 100;
    const cloudX = (i * 180 + Date.now() * 0.01) % (w + 160) - 80;
    drawCurledCloud(ctx, cloudX, cloudY, 90);
  }
  ctx.restore();
}

function drawCurledCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.beginPath();
  ctx.arc(x, y, size * 0.35, 0, Math.PI * 2);
  ctx.arc(x + size * 0.3, y - size * 0.1, size * 0.3, 0, Math.PI * 2);
  ctx.arc(x + size * 0.6, y, size * 0.25, 0, Math.PI * 2);
  ctx.fill();
}

function drawSidePillars(ctx: CanvasRenderingContext2D, camY: number) {
  const w = GAME_CONSTANTS.WORLD_WIDTH;
  const h = GAME_CONSTANTS.VIEWPORT_HEIGHT;
  const pillarWidth = 14;

  ctx.fillStyle = '#451a03';
  ctx.fillRect(0, camY - 50, pillarWidth, h + 100);
  ctx.fillRect(w - pillarWidth, camY - 50, pillarWidth, h + 100);

  ctx.fillStyle = '#b45309';
  const patternSpacing = 40;
  const startY = Math.floor(camY / patternSpacing) * patternSpacing;

  for (let y = startY - 40; y < camY + h + 40; y += patternSpacing) {
    ctx.beginPath();
    ctx.moveTo(2, y);
    ctx.lineTo(pillarWidth - 2, y + 10);
    ctx.lineTo(2, y + 20);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w - 2, y);
    ctx.lineTo(w - pillarWidth + 2, y + 10);
    ctx.lineTo(w - 2, y + 20);
    ctx.fill();
  }
}

function drawPlatform(ctx: CanvasRenderingContext2D, plat: Platform) {
  ctx.save();

  if (plat.id === 'heaven_gate') {
    drawNamThienMonGate(ctx, plat);
    ctx.restore();
    return;
  }

  if (plat.state === 'broken') {
    ctx.restore();
    return;
  }

  if (plat.type === 'bamboo') {
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 8);
    ctx.fill();

    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 3;
    const nodeCount = Math.floor(plat.width / 32);
    for (let i = 1; i <= nodeCount; i++) {
      const nx = plat.x + i * 32;
      ctx.beginPath();
      ctx.moveTo(nx, plat.y);
      ctx.lineTo(nx, plat.y + plat.height);
      ctx.stroke();
    }

    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.ellipse(plat.x + plat.width + 4, plat.y + 4, 8, 3, -0.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (plat.type === 'lotus') {
    ctx.fillStyle = '#059669';
    ctx.beginPath();
    ctx.ellipse(plat.x + plat.width / 2, plat.y + 10, plat.width / 2, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.5;
    const cx = plat.x + plat.width / 2;
    const cy = plat.y + 10;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * (plat.width * 0.42), cy + Math.sin(a) * 10);
      ctx.stroke();
    }

    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(plat.x + 8, plat.y + 2, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.arc(plat.x + 10, plat.y + 3, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (plat.type === 'cracked') {
    ctx.fillStyle = plat.state === 'breaking' ? '#b45309' : '#78350f';
    ctx.beginPath();
    ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 4);
    ctx.fill();

    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plat.x + 10, plat.y + 2);
    ctx.lineTo(plat.x + 30, plat.y + 12);
    ctx.lineTo(plat.x + 50, plat.y + 4);
    ctx.lineTo(plat.x + 80, plat.y + 16);
    ctx.stroke();

    if (plat.state === 'breaking') {
      ctx.strokeStyle = '#ef4444';
      ctx.strokeRect(plat.x - 1, plat.y - 1, plat.width + 2, plat.height + 2);
    }
  } else if (plat.type === 'thunder_drum') {
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 6);
    ctx.fill();

    const cx = plat.x + plat.width / 2;
    const cy = plat.y + plat.height / 2;
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * 12, cy + Math.sin(a) * 8);
      ctx.stroke();
    }
  } else if (plat.type === 'moving') {
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 8);
    ctx.fill();

    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(plat.x + 8, plat.y + plat.height / 2);
    ctx.lineTo(plat.x + plat.width - 8, plat.y + plat.height / 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.beginPath();
    ctx.roundRect(plat.x, plat.y, plat.width, plat.height, 12);
    ctx.fill();
  }

  if (plat.hasCollectible && !plat.hasCollectible.collected) {
    drawCollectible(ctx, plat.hasCollectible);
  }

  ctx.restore();
}

function drawCollectible(ctx: CanvasRenderingContext2D, item: any) {
  const time = Date.now() * 0.005;
  const floatY = item.y + Math.sin(time) * 4;

  ctx.save();
  if (item.type === 'golden_lotus') {
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(item.x, floatY, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(item.x, floatY, 5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(item.x, floatY - 8);
    ctx.quadraticCurveTo(item.x + 7, floatY + 2, item.x, floatY + 7);
    ctx.quadraticCurveTo(item.x - 7, floatY + 2, item.x, floatY - 8);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(item.x - 2, floatY - 1, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawNamThienMonGate(ctx: CanvasRenderingContext2D, plat: Platform) {
  const cx = plat.x + plat.width / 2;
  const cy = plat.y;

  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(plat.x, cy, plat.width, plat.height);

  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(plat.x - 20, cy);
  ctx.quadraticCurveTo(cx, cy - 35, plat.x + plat.width + 20, cy);
  ctx.lineTo(plat.x + plat.width, cy);
  ctx.lineTo(plat.x, cy);
  ctx.fill();

  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 40, 32, 24, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.ellipse(cx, cy - 40, 26, 18, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('TRỐNG THIÊN ĐÌNH', cx, cy - 36);
  ctx.fillText('ĐIỆN NGỌC HOÀNG', cx, cy - 10);
}

function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[]) {
  ctx.save();
  for (const p of particles) {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.alpha;

    if (p.shape === 'cloud') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.arc(p.x + p.size * 0.7, p.y - p.size * 0.2, p.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'leaf') {
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.size * 1.5, p.size * 0.7, p.life * 0.2, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'drop') {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.shape === 'lightning') {
      ctx.fillRect(p.x, p.y, p.size, p.size * 2);
    } else {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawToadPlayer(ctx: CanvasRenderingContext2D, player: Player, skinId: string) {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.rotation);
  ctx.scale(player.facing * player.squashX, player.squashY);

  const skin = SKINS.find(s => s.id === skinId) || SKINS[0];

  // If Air Dashing, draw golden wind aura and swirling cloud underneath!
  if (player.airDashTimer > 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(251, 191, 36, 0.45)';
    ctx.beginPath();
    ctx.ellipse(-6, 0, 26, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Swirling cloud under feet
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(-10, 14, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 1. Toad Back / Body
  ctx.fillStyle = skin.bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, 19, 15, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Folkloric Warty Spots
  ctx.fillStyle = skin.spotColor;
  [-7, 0, 7].forEach((ox, i) => {
    ctx.beginPath();
    ctx.arc(ox, -4 + (i % 2) * 4, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // 3. Belly
  ctx.fillStyle = skin.bellyColor;
  ctx.beginPath();
  ctx.ellipse(4, 3, 11, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4. Strong Hind Legs
  ctx.fillStyle = skin.bodyColor;
  if (player.isGrounded) {
    ctx.beginPath();
    ctx.ellipse(-14, 6, 8, 5, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(14, 6, 8, 5, -0.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(-12, 12, 5, 10, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(10, 12, 5, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. Big Expressive Eyes
  const eyeX = 10;
  const eyeY = -11;

  ctx.fillStyle = skin.bodyColor;
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, 7, 0, Math.PI * 2);
  ctx.arc(eyeX - 12, eyeY, 7, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(eyeX, eyeY, 5, 0, Math.PI * 2);
  ctx.arc(eyeX - 12, eyeY, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = skin.eyeColor;
  ctx.beginPath();
  ctx.arc(eyeX + 1.5, eyeY, 2.5, 0, Math.PI * 2);
  ctx.arc(eyeX - 10.5, eyeY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(eyeX + 0.5, eyeY - 1, 1, 0, Math.PI * 2);
  ctx.arc(eyeX - 11.5, eyeY - 1, 1, 0, Math.PI * 2);
  ctx.fill();

  // 6. Traditional Red Silk Hero Headband
  ctx.fillStyle = skin.headbandColor;
  ctx.beginPath();
  ctx.rect(-16, -14, 30, 4);
  ctx.fill();

  const wave = Math.sin(Date.now() * 0.015) * 4;
  ctx.beginPath();
  ctx.moveTo(-16, -13);
  ctx.quadraticCurveTo(-26, -10 + wave, -32, -6 + wave);
  ctx.lineTo(-30, -3 + wave);
  ctx.quadraticCurveTo(-22, -8 + wave, -16, -10);
  ctx.fill();

  // 7. Sacred Lotus Medallion
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(6, 4, 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawRainTorrent(ctx: CanvasRenderingContext2D, camY: number) {
  const w = GAME_CONSTANTS.WORLD_WIDTH;
  const h = GAME_CONSTANTS.VIEWPORT_HEIGHT;

  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 2.5;

  for (let i = 0; i < 40; i++) {
    const rx = (i * 27 + (camY * 0.3) % 200) % w;
    const ry = camY + ((i * 43 + Date.now() * 1.5) % h);
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - 4, ry + 26);
    ctx.stroke();
  }

  const grad = ctx.createLinearGradient(0, camY, w, camY);
  grad.addColorStop(0, 'rgba(239, 68, 68, 0.1)');
  grad.addColorStop(0.3, 'rgba(234, 179, 8, 0.1)');
  grad.addColorStop(0.6, 'rgba(34, 197, 94, 0.1)');
  grad.addColorStop(1, 'rgba(59, 130, 246, 0.1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, camY, w, h);

  ctx.restore();
}
