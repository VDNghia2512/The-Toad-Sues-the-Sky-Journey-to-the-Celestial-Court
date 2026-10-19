import { Player, Platform, Particle, Companion } from '../types/game';
import { GAME_CONSTANTS } from './constants';
import { soundManager } from '../audio/soundManager';

export interface TrajectoryPoint {
  x: number;
  y: number;
}

export class PhysicsEngine {
  /**
   * Update toad physics, collisions, squashing, and movement
   */
  public static updatePlayer(
    player: Player,
    platforms: Platform[],
    particles: Particle[],
    companions: Companion[],
    keys: { left: boolean; right: boolean; jump: boolean; down: boolean },
    _deltaTime: number = 1
  ): { landedOn: Platform | null; triggeredRainOrb: boolean; fellPastBottom: boolean } {
    let landedOn: Platform | null = null;
    let triggeredRainOrb = false;
    let fellPastBottom = false;

    const hasBeeGlide = companions.find(c => c.id === 'bee')?.active;
    const hasCrabCompanion = companions.find(c => c.id === 'crab')?.active;
    const hasWarriorSkin = player.skinId === 'warrior';

    const halfW = player.width / 2;
    const minX = halfW + 12;
    const maxX = GAME_CONSTANTS.WORLD_WIDTH - halfW - 12;

    // Horizontal steering
    if (player.isGrounded) {
      player.canDoubleJump = true;
      const moveSpeed = 4.8 * (hasWarriorSkin ? 1.25 : 1.0);

      if (keys.left) {
        player.vx = -moveSpeed;
        player.facing = -1;
      } else if (keys.right) {
        player.vx = moveSpeed;
        player.facing = 1;
      } else {
        const friction = hasCrabCompanion ? 0.75 : GAME_CONSTANTS.GROUND_FRICTION;
        player.vx *= friction;
      }
    } else {
      // In air steering
      const maxAirSpeed = 6.5 * (hasWarriorSkin ? 1.2 : 1.0);
      if (keys.left) {
        player.vx = Math.max(player.vx - 0.45, -maxAirSpeed);
        player.facing = -1;
      } else if (keys.right) {
        player.vx = Math.min(player.vx + 0.45, maxAirSpeed);
        player.facing = 1;
      } else {
        player.vx *= GAME_CONSTANTS.AIR_DRAG;
      }
    }

    // Gravity
    let effectiveGravity = GAME_CONSTANTS.GRAVITY;
    if (hasBeeGlide && keys.jump && player.vy > 0) {
      effectiveGravity *= 0.35; // Bee glide slow-fall
    }
    player.vy += effectiveGravity;
    player.vy = Math.min(player.vy, GAME_CONSTANTS.TERMINAL_VELOCITY);

    // Apply movement
    const prevY = player.y;
    player.x += player.vx;
    player.y += player.vy;

    // Side boundaries (Gentle non-stick soft bounce)
    if (player.x <= minX) {
      player.x = minX;
      player.vx = Math.max(0, -player.vx * 0.35);
    } else if (player.x >= maxX) {
      player.x = maxX;
      player.vx = Math.min(0, -player.vx * 0.35);
    }

    // Platform Collisions (One-way top collision)
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

    // Moving platforms update & carrying player
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

    // Ease squash / stretch back to normal
    player.squashX += (1 - player.squashX) * 0.15;
    player.squashY += (1 - player.squashY) * 0.15;

    // Dynamic rotation tilt based on horizontal velocity
    const targetRot = (player.vx / 10) * 0.25;
    player.rotation += (targetRot - player.rotation) * 0.2;

    // Animation state update
    if (player.isGrounded) {
      player.state = 'idle';
    } else if (player.vy < -2) {
      player.state = 'jumping';
    } else {
      player.state = 'falling';
    }

    return { landedOn, triggeredRainOrb, fellPastBottom };
  }

  /**
   * Check collectibles pickup (water drops and golden lotuses)
   */
  public static checkCollectibles(
    player: Player,
    platforms: Platform[],
    particles: Particle[],
    companions: Companion[]
  ): number {
    let earnedDrops = 0;
    const hasBearMagnet = companions.find(c => c.id === 'bear')?.active;
    const hasBeeCompanion = companions.find(c => c.id === 'bee')?.active;
    const isRainSpirit = player.skinId === 'rain_spirit';
    const pickupRadius = hasBearMagnet ? 72 : 36;

    for (const plat of platforms) {
      if (!plat.hasCollectible || plat.hasCollectible.collected) continue;

      const coll = plat.hasCollectible;
      const targetX = plat.x + plat.width / 2;
      coll.x = targetX;

      const dx = player.x - coll.x;
      const dy = player.y - coll.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (hasBearMagnet && dist < 130 && dist > pickupRadius) {
        coll.x += (player.x - coll.x) * 0.15;
        coll.y += (player.y - coll.y) * 0.15;
      }

      if (dist < pickupRadius) {
        coll.collected = true;

        let multiplier = 1;
        if (coll.type === 'golden_lotus') multiplier = isRainSpirit ? 3 : 2;
        if (hasBeeCompanion) multiplier += 1;

        const gain = coll.value * multiplier;
        earnedDrops += gain;
        soundManager.playWaterCollect();

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
