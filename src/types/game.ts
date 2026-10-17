export type PlatformType =
  | 'bamboo'       // standard solid bamboo platform
  | 'lotus'        // bouncy spring / trampoline
  | 'cracked'      // collapses after standing on it for a brief time
  | 'moving'       // moves left & right
  | 'thunder_drum' // super launch upwards with thunder strike
  | 'cloud'        // soft cloud, disappears after 1 jump
  | 'wind_ring';   // updraft ring that propels the toad upward

export interface Platform {
  id: string;
  x: number;
  y: number; // in world space, where y=0 is ground, and climbing goes negative (or positive height)
  width: number;
  height: number;
  type: PlatformType;
  lane?: 'left' | 'center' | 'right'; // 3 balanced lanes
  color?: string;
  // State for interactive platforms
  state?: 'idle' | 'triggered' | 'breaking' | 'broken';
  breakTimer?: number;
  moveSpeed?: number;
  moveDirection?: number;
  minX?: number;
  maxX?: number;
  bounceMultiplier?: number;
  hasCollectible?: Collectible;
}

export interface Collectible {
  id: string;
  x: number;
  y: number;
  type: 'water_drop' | 'golden_lotus' | 'companion_token' | 'rain_orb';
  collected: boolean;
  value: number;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
  shape?: 'circle' | 'leaf' | 'drop' | 'sparkle' | 'lightning' | 'cloud';
}

export type SkinId = 'classic' | 'golden' | 'lotus' | 'warrior' | 'rain_spirit';

export interface Skin {
  id: SkinId;
  name: string;
  desc: string;
  cost: number;
  unlocked: boolean;
  bodyColor: string;
  bellyColor: string;
  spotColor: string;
  eyeColor: string;
  headbandColor: string;
  perk: string;
}

export interface Companion {
  id: 'crab' | 'bee' | 'tiger' | 'bear';
  name: string;
  vietnameseName: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  active: boolean;
}

export interface Player {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  // Air Dash (Đạp Gió Lướt Mây) Skill - Recharges every 30 raindrop pickups
  canAirDash: boolean;
  airDashCount: number; // remaining dashes
  airDashTimer: number; // active dash frames
  airDashDropsCollected: number; // raindrops collected toward recharge (0 to airDashDropsNeeded)
  airDashDropsNeeded: number; // 30 raindrops base (reduced by companion/skin)
  airDashCooldown: number; // legacy backwards compat
  maxAirDashCooldown: number;
  squashX: number; // 1.0 is normal, >1 is stretch, <1 is squash
  squashY: number;
  rotation: number;
  facing: -1 | 1;
  state: 'idle' | 'charging' | 'jumping' | 'falling' | 'air_dash' | 'celebrating';
  chargeTime: number; // 0 to 1
  canDoubleJump: boolean;
  lastPlatformId: string | null;
  skinId: SkinId;
}

export interface GameStats {
  altitude: number; // in meters (1 unit = 0.1m or similar)
  maxAltitude: number;
  timeElapsed: number; // in seconds
  waterDrops: number;
  totalJumps: number;
  perfectLandings: number;
  teethGrinds: number; // Rain summon count
  airDashes: number; // Count of Air Dashes executed
  highScore: number;
  // Raindrop-based Skill Recharge (~30 raindrops)
  airDashDropsCollected: number;
  airDashDropsNeeded: number;
  rainDropsCollected: number;
  rainDropsNeeded: number;
  airDashCooldown?: number; // legacy in seconds
  maxAirDashCooldown?: number;
  rainCooldown?: number;
  maxRainCooldown?: number;
}

export interface RunRecord {
  id: string;
  timestamp: number;
  dateFormatted: string;
  altitude: number;
  timeElapsed: number;
  timeFormatted: string;
  reachedHeaven: boolean;
  waterDrops: number;
  totalJumps: number;
  perfectLandings: number;
  skinName: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export type GameRealm = {
  id: string;
  name: string;
  vietnameseName: string;
  minAlt: number;
  maxAlt: number;
  bgGradient: [string, string];
  quote: string;
};
