import { Player, Platform, Particle, Companion } from '../types/game';
import { GAME_CONSTANTS } from './constants';
import { soundManager } from '../audio/soundManager';

export interface TrajectoryPoint {
  x: number;
  y: number;
}

export class PhysicsEngine {
  /**
   * Try activating the Toad's Air Dash (Đạp Gió Lướt Mây) Skill
   */
  public static tryAirDash(
    player: Player,
    particles: Particle[],
    companions: Companion[],
    preferredDirectionX?: number
  ): boolean {
    const hasWarriorSkin = player.skinId === 'warrior';
    const hasCrabCompanion = companions.find(c => c.id === 'crab')?.active;

    let dropsNeeded = GAME_CONSTANTS.AIR_DASH_DROPS_NEEDED; // 30 raindrops base
    if (hasCrabCompanion) dropsNeeded = 20; // 20 drops with Crab companion
    if (hasWarriorSkin) dropsNeeded = 22; // 22 drops with Warrior skin
    player.airDashDropsNeeded = dropsNeeded;

    // Check if skill is on cooldown (needs 30 raindrop pickups) or player is grounded/already dashing
    if (
      player.isGrounded ||
      player.airDashTimer > 0 ||
      (player.airDashCount <= 0 && player.airDashDropsCollected < player.airDashDropsNeeded)
    ) {
      return false;
    }

    const dashSpeed = hasWarriorSkin
      ? GAME_CONSTANTS.AIR_DASH_SPEED * 1.3
      : GAME_CONSTANTS.AIR_DASH_SPEED;

    let dirX = preferredDirectionX !== undefined && preferredDirectionX !== 0
      ? Math.sign(preferredDirectionX)
      : player.facing;

    if (dirX === 0) dirX = 1;

    // Apply rapid wind burst
    player.vx = dirX * dashSpeed;
    player.vy = GAME_CONSTANTS.AIR_DASH_LIFT;
    player.airDashTimer = GAME_CONSTANTS.AIR_DASH_DURATION;
    player.airDashCount--;
    player.facing = dirX as -1 | 1;
    player.state = 'air_dash';
    player.squashX = 1.45;
    player.squashY = 0.65;

    // When dash charges are used, start raindrop collection count (0 to 30)
    if (player.airDashCount <= 0) {
      player.airDashDropsCollected = 0;
      player.canAirDash = false;
      player.airDashCooldown = 1; // legacy flag
    }

    soundManager.playAirDash();

    // Auspicious cloud poof & wind sparkles underfoot
    const colors = ['#fde047', '#38bdf8', '#f472b6', '#4ade80', '#ffffff'];
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      particles.push({
        x: player.x - dirX * 12,
        y: player.y + 14,
        vx: -dirX * (2 + Math.random() * 4) + Math.cos(angle) * 2,
        vy: (Math.random() - 0.5) * 3 + 1,
        color: colors[i % colors.length],
        size: 3.5 + Math.random() * 3,
        alpha: 1,
        life: 0,
        maxLife: 24,
        shape: 'cloud',
      });
    }

    return true;
  }

  /**
   * Update toad physics, collisions, squashing, and movement
   */
  public static updatePlayer(
    player: Player,
    platforms: Platform[],
    particles: Particle[],
    companions: Companion[],
    keys: { left: boolean; right: boolean; jump: boolean; down: boolean },
    deltaTime: number = 1
  ): { landedOn: Platform | null; triggeredRainOrb: boolean; fellPastBottom: boolean; usedDash: boolean } {
    let landedOn: Platform | null = null;
    let triggeredRainOrb = false;
    let fellPastBottom = false;
    let usedDash = false;

    const hasBeeGlide = companions.find(c => c.id === 'bee')?.active;
    const hasCrabCompanion = companions.find(c => c.id === 'crab')?.active;

    const halfW = player.width / 2;
    const minX = halfW + 12;
    const maxX = GAME_CONSTANTS.WORLD_WIDTH - halfW - 12;

    // Update Air Dash cooldown timer (~30s)
    if (player.airDashCooldown > 0) {
      player.airDashCooldown = Math.max(0, player.airDashCooldown - (deltaTime / 60));
      if (player.airDashCooldown <= 0) {
        player.canAirDash = true;
        player.airDashCount = hasCrabCompanion ? 2 : 1;
        soundManager.playWaterCollect();
      }
    }

    // 1. Air Dash active phase
    if (player.airDashTimer > 0) {
      usedDash = true;
      player.airDashTimer--;
      // Slightly reduce friction during dash for crisp zip feeling
      player.vx *= 0.95;
      player.vy += 0.2; // very low gravity during dash

      // Wind stream trail particles
      if (Math.random() < 0.6) {
        particles.push({
          x: player.x - player.facing * 16,
          y: player.y + (Math.random() - 0.5) * 10,
          vx: -player.vx * 0.15,
          vy: (Math.random() - 0.5) * 1.5,
          color: Math.random() > 0.4 ? '#fde047' : '#ffffff',
          size: 3,
          alpha: 0.8,
          life: 0,
          maxLife: 16,
          shape: 'cloud',
        });
      }
    } else {
      // 2. Normal Horizontal steering
      if (player.isGrounded) {
        // Reset air dash only if cooldown is complete
        if (player.airDashCooldown <= 0) {
          player.airDashCount = hasCrabCompanion ? 2 : 1;
          player.canAirDash = true;
        }

        if (keys.left) {
          player.vx = -4.8;
          player.facing = -1;
        } else if (keys.right) {
          player.vx = 4.8;
          player.facing = 1;
        } else {
          player.vx *= GAME_CONSTANTS.GROUND_FRICTION;
        }
      } else {
        // In air steering
        if (keys.left) {
          player.vx = Math.max(player.vx - 0.45, -6.5);
          player.facing = -1;
        } else if (keys.right) {
          player.vx = Math.min(player.vx + 0.45, 6.5);
          player.facing = 1;
        } else {
          player.vx *= GAME_CONSTANTS.AIR_DRAG;
        }
      }

      // 3. Gravity
      let effectiveGravity = GAME_CONSTANTS.GRAVITY;
      if (hasBeeGlide && keys.jump && player.vy > 0) {
        effectiveGravity *= 0.35; // Bee glide slow-fall
      }
      player.vy += effectiveGravity;
      player.vy = Math.min(player.vy, GAME_CONSTANTS.TERMINAL_VELOCITY);
    }

    // Apply movement
    const prevY = player.y;
    player.x += player.vx;
    player.y += player.vy;

    // 4. Side boundaries (Gentle non-stick soft bounce)
    if (player.x <= minX) {
      player.x = minX;
      player.vx = Math.max(0, -player.vx * 0.35);
    } else if (player.x >= maxX) {
      player.x = maxX;
      player.vx = Math.min(0, -player.vx * 0.35);
    }

    // 5. Platform Collisions (One-way top collision)
    player.isGrounded = false;

    if (player.vy >= 0) {
      const feetY = player.y + player.height / 2;
      const prevFeetY = prevY + player.height / 2;

      for (const plat of platforms) {
        if (plat.state === 'broken') continue;

        if (player.x + halfW * 0.7 >= plat.x && player.x - halfW * 0.7 <= plat.x + plat.width) {
          if (prevFeetY <= plat.y + 8 && feetY >= plat.y - 4) {
            // Landed!
            player.y = plat.y - player.height / 2;
            player.vy = 0;
            player.isGrounded = true;
            player.canDoubleJump = true;
            player.airDashCount = hasCrabCompanion ? 2 : 1;
            player.canAirDash = true;
            player.airDashTimer = 0;
            player.lastPlatformId = plat.id;
            landedOn = plat;

            // Landing squash
            player.squashX = 1.35;
            player.squashY = 0.7;

            // Trigger platform special effects
            if (plat.type === 'lotus') {
              player.vy = GAME_CONSTANTS.LOTUS_BOUNCE_FORCE;
              player.isGrounded = false;
              player.squashX = 0.7;
              player.squashY = 1.45;
              soundManager.playLotusBounce();

              for (let i = 0; i < 12; i++) {
                const angle = (Math.PI / 6) * i;
                particles.push({
                  x: player.x,
                  y: plat.y,
                  vx: Math.cos(angle) * (2 + Math.random() * 3),
                  vy: Math.sin(angle) * (1.5 + Math.random() * 2) - 2,
                  color: i % 2 === 0 ? '#f472b6' : '#86efac',
                  size: 3.5 + Math.random() * 2,
                  alpha: 1,
                  life: 0,
                  maxLife: 35,
                  shape: 'leaf',
                });
              }
            } else if (plat.type === 'thunder_drum') {
              player.vy = GAME_CONSTANTS.THUNDER_DRUM_FORCE;
              player.isGrounded = false;
              player.squashX = 0.6;
              player.squashY = 1.6;
              soundManager.playThunderDrum();

              for (let i = 0; i < 20; i++) {
                particles.push({
                  x: player.x + (Math.random() - 0.5) * 40,
                  y: plat.y,
                  vx: (Math.random() - 0.5) * 8,
                  vy: -Math.random() * 8 - 4,
                  color: Math.random() > 0.4 ? '#fde047' : '#38bdf8',
                  size: 3 + Math.random() * 4,
                  alpha: 1,
                  life: 0,
                  maxLife: 30,
                  shape: 'lightning',
                });
              }

              if (plat.id === 'heaven_gate') {
                triggeredRainOrb = true;
              }
            } else if (plat.type === 'cracked') {
              if (plat.state === 'idle') {
                plat.state = 'breaking';
                plat.breakTimer = 45;
                soundManager.playPlatformBreak();
              }
            } else if (plat.type === 'cloud') {
              plat.state = 'broken';
              for (let i = 0; i < 8; i++) {
                particles.push({
                  x: plat.x + Math.random() * plat.width,
                  y: plat.y + Math.random() * plat.height,
                  vx: (Math.random() - 0.5) * 3,
                  vy: -Math.random() * 2,
                  color: '#e2e8f0',
                  size: 4 + Math.random() * 3,
                  alpha: 0.8,
                  life: 0,
                  maxLife: 25,
                });
              }
            }

            // Normal landing dust
            if (plat.type === 'bamboo' || plat.type === 'moving' || plat.type === 'cracked') {
              for (let i = 0; i < 6; i++) {
                particles.push({
                  x: player.x + (Math.random() - 0.5) * 20,
                  y: plat.y,
                  vx: (Math.random() - 0.5) * 3,
                  vy: -Math.random() * 1.5,
                  color: '#d4d4d8',
                  size: 2.5,
                  alpha: 0.7,
                  life: 0,
                  maxLife: 20,
                });
              }
            }

            break;
          }
        }
      }
    }

    // 6. Moving platforms update & carrying player
    for (const plat of platforms) {
      if (plat.type === 'moving' && plat.moveSpeed && plat.minX !== undefined && plat.maxX !== undefined) {
        plat.x += (plat.moveDirection || 1) * plat.moveSpeed;
        if (plat.x <= plat.minX) {
          plat.x = plat.minX;
          plat.moveDirection = 1;
        } else if (plat.x >= plat.maxX) {
          plat.x = plat.maxX;
          plat.moveDirection = -1;
        }

        if (player.isGrounded && player.lastPlatformId === plat.id) {
          player.x += (plat.moveDirection || 1) * plat.moveSpeed;
        }
      }

      // Cracked platform countdown
      if (plat.state === 'breaking' && plat.breakTimer !== undefined) {
        plat.breakTimer--;
        if (plat.breakTimer <= 0) {
          plat.state = 'broken';
          for (let i = 0; i < 14; i++) {
            particles.push({
              x: plat.x + Math.random() * plat.width,
              y: plat.y + Math.random() * plat.height,
              vx: (Math.random() - 0.5) * 4,
              vy: Math.random() * 3,
              color: '#92400e',
              size: 3 + Math.random() * 3,
              alpha: 0.9,
              life: 0,
              maxLife: 30,
            });
          }
        }
      }
    }

    // 7. Squash & stretch recovery
    player.squashX += (1.0 - player.squashX) * 0.15;
    player.squashY += (1.0 - player.squashY) * 0.15;

    if (!player.isGrounded && player.airDashTimer <= 0) {
      const speed = Math.sqrt(player.vx * player.vx + player.vy * player.vy);
      if (speed > 4) {
        player.squashY = Math.min(1.4, 1.0 + speed * 0.025);
        player.squashX = Math.max(0.75, 1.0 - speed * 0.02);
      }
    }

    // 8. Animation state
    if (player.isGrounded) {
      player.state = 'idle';
      player.rotation = 0;
    } else if (player.airDashTimer > 0) {
      player.state = 'air_dash';
      player.rotation = player.facing * 0.25;
    } else if (player.vy < 0) {
      player.state = 'jumping';
      player.rotation = (player.vx / 10) * 0.35;
    } else {
      player.state = 'falling';
      player.rotation = (player.vx / 10) * 0.2;
    }

    return { landedOn, triggeredRainOrb, fellPastBottom, usedDash };
  }

  /**
   * Handle collecting items
   */
  public static checkCollectibles(
    player: Player,
    platforms: Platform[],
    particles: Particle[],
    companions: Companion[]
  ): number {
    let earnedDrops = 0;
    const hasBearMagnet = companions.find(c => c.id === 'bear')?.active;
    const hasCrabCompanion = companions.find(c => c.id === 'crab')?.active;
    const pickupRadius = hasBearMagnet ? 68 : 34;

    for (const plat of platforms) {
      if (!plat.hasCollectible || plat.hasCollectible.collected) continue;

      const coll = plat.hasCollectible;
      const targetX = plat.x + plat.width / 2;
      coll.x = targetX;

      const dx = player.x - coll.x;
      const dy = player.y - coll.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (hasBearMagnet && dist < 120 && dist > pickupRadius) {
        coll.x += (player.x - coll.x) * 0.12;
        coll.y += (player.y - coll.y) * 0.12;
      }

      if (dist < pickupRadius) {
        coll.collected = true;
        earnedDrops += coll.value;
        soundManager.playWaterCollect();

        // Collecting drops speeds up skill cooldowns (~30s timer)
        if (player.airDashCooldown > 0) {
          const reduction = coll.type === 'golden_lotus' ? 2.5 : 0.6;
          player.airDashCooldown = Math.max(0, player.airDashCooldown - reduction);
          if (player.airDashCooldown <= 0) {
            player.canAirDash = true;
            player.airDashCount = hasCrabCompanion ? 2 : 1;
          }
        }

        for (let i = 0; i < 8; i++) {
          particles.push({
            x: coll.x,
            y: coll.y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4 - 2,
            color: coll.type === 'golden_lotus' ? '#fbbf24' : '#38bdf8',
            size: 3 + Math.random() * 2,
            alpha: 1,
            life: 0,
            maxLife: 25,
            shape: 'drop',
          });
        }
      }
    }

    return earnedDrops;
  }

  /**
   * Update particle lifetimes and positions
   */
  public static updateParticles(particles: Particle[]): void {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      p.alpha = Math.max(0, 1 - p.life / p.maxLife);

      if (p.life >= p.maxLife) {
        particles.splice(i, 1);
      }
    }
  }
}
