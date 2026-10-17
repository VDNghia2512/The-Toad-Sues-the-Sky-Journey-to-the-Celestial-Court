import { Platform, PlatformType, Collectible } from '../types/game';
import { GAME_CONSTANTS } from './constants';

export class LevelGenerator {
  private highestGeneratedY: number = 0;
  private platformCounter: number = 0;
  private collectibleCounter: number = 0;
  // Track balanced counts across 3 lanes
  private laneCounts = { left: 0, center: 0, right: 0 };
  private laneSequence: ('left' | 'center' | 'right')[] = ['center', 'left', 'right', 'center', 'right', 'left'];
  private sequenceIndex: number = 0;

  constructor() {
    this.reset();
  }

  public reset() {
    this.highestGeneratedY = 0;
    this.platformCounter = 0;
    this.collectibleCounter = 0;
    this.laneCounts = { left: 0, center: 0, right: 0 };
    this.sequenceIndex = 0;
  }

  /**
   * Generates initial platforms starting from the ground up to a target world height
   */
  public generateInitialChunk(targetHeightWorld: number): Platform[] {
    this.reset();
    const platforms: Platform[] = [];

    // Ground platform
    platforms.push({
      id: 'ground',
      x: 0,
      y: 0,
      width: GAME_CONSTANTS.WORLD_WIDTH,
      height: 48,
      type: 'bamboo',
      lane: 'center',
    });

    // Generate up to targetHeightWorld
    this.generateMore(targetHeightWorld, platforms);
    return platforms;
  }

  /**
   * Pick next lane to maintain strict 33.3% balance among Left, Center, Right
   */
  private getNextBalancedLane(): 'left' | 'center' | 'right' {
    // Pick the lane with the minimum platforms, or follow smooth traversal sequence
    const lanes: ('left' | 'center' | 'right')[] = ['left', 'center', 'right'];
    const minCount = Math.min(this.laneCounts.left, this.laneCounts.center, this.laneCounts.right);

    // Candidates that need platforms to stay balanced
    const candidateLanes = lanes.filter(l => this.laneCounts[l] <= minCount + 1);

    const nextSeq = this.laneSequence[this.sequenceIndex % this.laneSequence.length];
    this.sequenceIndex++;

    if (candidateLanes.includes(nextSeq)) {
      this.laneCounts[nextSeq]++;
      return nextSeq;
    }

    const chosen = candidateLanes[Math.floor(Math.random() * candidateLanes.length)];
    this.laneCounts[chosen]++;
    return chosen;
  }

  /**
   * Extends the level as the toad climbs higher with balanced 3-lane vertical layout
   */
  public generateMore(upToNegativeY: number, existingPlatforms: Platform[]): Platform[] {
    const newPlatforms: Platform[] = [];
    const minStepY = 95;
    const maxStepY = 135;

    let currentY = this.highestGeneratedY;

    if (existingPlatforms.length > 0) {
      const topPlatform = existingPlatforms.reduce((prev, curr) => (curr.y < prev.y ? curr : prev));
      currentY = topPlatform.y;
    }

    while (currentY > upToNegativeY) {
      this.platformCounter++;
      const altitude = Math.abs(currentY) * GAME_CONSTANTS.ALTITUDE_SCALE;

      // Vertical spacing (smooth, reachable steps)
      const stepY = minStepY + Math.random() * (maxStepY - minStepY);
      currentY -= stepY;

      // Milestone check: every 250m is a Grand Altar / Realm Gate
      const isMilestone = Math.floor(altitude / 250) !== Math.floor((altitude - stepY * GAME_CONSTANTS.ALTITUDE_SCALE) / 250);
      const isHeavenArrival = altitude >= GAME_CONSTANTS.VICTORY_ALTITUDE && !existingPlatforms.some(p => p.id === 'heaven_gate');

      if (isHeavenArrival) {
        // Place the Grand Nam Thiên Môn platform spanning across all 3 lanes
        const heavenPlatform: Platform = {
          id: 'heaven_gate',
          x: 50,
          y: currentY,
          width: GAME_CONSTANTS.WORLD_WIDTH - 100,
          height: 38,
          type: 'thunder_drum',
          lane: 'center',
          hasCollectible: {
            id: 'orb_rain_supreme',
            x: GAME_CONSTANTS.WORLD_WIDTH / 2,
            y: currentY - 50,
            type: 'rain_orb',
            collected: false,
            value: 100,
          },
        };
        newPlatforms.push(heavenPlatform);
        existingPlatforms.push(heavenPlatform);
        currentY -= 150;
        continue;
      }

      // Check if this step is a double-lane choice (providing 2 platforms at same altitude)
      const isDoubleLane = Math.random() < 0.22 && !isMilestone;
      const lanesToCreate: ('left' | 'center' | 'right')[] = [];

      const primaryLane = this.getNextBalancedLane();
      lanesToCreate.push(primaryLane);

      if (isDoubleLane) {
        // Add a secondary non-overlapping lane for route freedom
        const otherLanes = (['left', 'center', 'right'] as const).filter(l => l !== primaryLane);
        const secondLane = otherLanes[Math.floor(Math.random() * otherLanes.length)];
        this.laneCounts[secondLane]++;
        lanesToCreate.push(secondLane);
      }

      for (const lane of lanesToCreate) {
        // Determine platform width & type based on altitude
        let width = 110 - Math.min(25, (altitude / 1000) * 25);
        if (isMilestone) {
          width = 180;
        }

        // X placement strictly adhering to the 3 lanes:
        // Left: 50 - 150 (Center ~100)
        // Center: 230 - 330 (Center ~280)
        // Right: 410 - 510 (Center ~460)
        let targetX = 0;
        if (lane === 'left') {
          targetX = 50 + Math.random() * 50; // 50px to 100px
        } else if (lane === 'center') {
          targetX = 230 + Math.random() * 40; // 230px to 270px
        } else {
          targetX = 410 + Math.random() * 50; // 410px to 460px
        }

        // Platform type determination (keeping lotus rare 6-8% as requested)
        let type: PlatformType = 'bamboo';
        const rand = Math.random();

        if (altitude < 250) {
          // Realm 1
          if (rand < 0.20) {
            type = 'cracked';
          } else if (rand < 0.26) {
            type = 'lotus'; // 6%
          } else {
            type = 'bamboo';
          }
        } else if (altitude < 550) {
          // Realm 2
          if (rand < 0.08) {
            type = 'lotus'; // 8%
          } else if (rand < 0.36) {
            type = 'moving';
          } else if (rand < 0.58) {
            type = 'cracked';
          } else {
            type = 'bamboo';
          }
        } else if (altitude < 850) {
          // Realm 3
          if (rand < 0.25) {
            type = 'thunder_drum';
          } else if (rand < 0.55) {
            type = 'moving';
          } else if (rand < 0.77) {
            type = 'cloud';
          } else if (rand < 0.83) {
            type = 'lotus'; // 6%
          } else {
            type = 'bamboo';
          }
        } else {
          // Realm 4
          if (rand < 0.30) {
            type = 'thunder_drum';
          } else if (rand < 0.38) {
            type = 'lotus'; // 8%
          } else if (rand < 0.72) {
            type = 'moving';
          } else {
            type = 'bamboo';
          }
        }

        const platform: Platform = {
          id: `plat_${this.platformCounter}_${lane}`,
          x: targetX,
          y: currentY,
          width,
          height: type === 'lotus' ? 24 : type === 'thunder_drum' ? 32 : 22,
          type,
          lane,
          state: 'idle',
        };

        if (type === 'moving') {
          platform.moveSpeed = 1.1 + Math.random() * 1.3;
          platform.moveDirection = Math.random() > 0.5 ? 1 : -1;
          // Bounds stay within reasonable bounds around its lane
          if (lane === 'left') {
            platform.minX = 40;
            platform.maxX = 220;
          } else if (lane === 'center') {
            platform.minX = 170;
            platform.maxX = 380;
          } else {
            platform.minX = 330;
            platform.maxX = GAME_CONSTANTS.WORLD_WIDTH - width - 40;
          }
        }

        // Add collectible reward
        if (Math.random() < 0.45) {
          this.collectibleCounter++;
          const isGolden = Math.random() < 0.18;
          const collectible: Collectible = {
            id: `drop_${this.collectibleCounter}`,
            x: platform.x + platform.width / 2,
            y: platform.y - 28,
            type: isGolden ? 'golden_lotus' : 'water_drop',
            collected: false,
            value: isGolden ? 5 : 1,
          };
          platform.hasCollectible = collectible;
        }

        newPlatforms.push(platform);
        existingPlatforms.push(platform);
      }
    }

    this.highestGeneratedY = currentY;
    return newPlatforms;
  }
}
