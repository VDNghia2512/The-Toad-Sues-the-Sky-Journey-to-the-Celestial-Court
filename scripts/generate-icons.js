import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Design a vibrant 512x512 SVG of "Cóc Kiện Trời"
function getToadSvg(isMaskable = false) {
  const padding = isMaskable ? 40 : 10;
  const innerSize = 512 - padding * 2;
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d" />
      <stop offset="50%" stop-color="#064e3b" />
      <stop offset="100%" stop-color="#022c22" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <linearGradient id="toadBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4ade80" />
      <stop offset="60%" stop-color="#16a34a" />
      <stop offset="100%" stop-color="#15803d" />
    </linearGradient>
    <linearGradient id="toadBelly" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fef08a" />
      <stop offset="100%" stop-color="#fde047" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#064e3b" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="${isMaskable ? 0 : 96}" fill="url(#bgGrad)" />

  <!-- Dong Son Sun Glow -->
  <circle cx="256" cy="256" r="220" fill="url(#sunGlow)" />

  <!-- Dong Son Bronze Drum Decorative Concentric Circles -->
  <circle cx="256" cy="256" r="210" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,4" opacity="0.4" />
  <circle cx="256" cy="256" r="185" fill="none" stroke="#fbbf24" stroke-width="3" opacity="0.5" />
  <circle cx="256" cy="256" r="160" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,6" opacity="0.35" />

  <!-- Centered Scaled Content -->
  <g transform="translate(${padding}, ${padding}) scale(${innerSize / 512})">
    <!-- Lightning & Cloud Accents -->
    <path d="M 120 100 Q 150 70 190 90 Q 220 70 256 85 Q 290 70 322 90 Q 362 70 392 100 Q 400 130 380 150 Q 130 150 120 100 Z" fill="#ffffff" opacity="0.12" />

    <!-- Rain Drops -->
    <path d="M 140 180 Q 135 195 140 205 A 7 7 0 1 0 148 198 Q 142 190 140 180 Z" fill="#38bdf8" opacity="0.85" />
    <path d="M 372 180 Q 367 195 372 205 A 7 7 0 1 0 380 198 Q 374 190 372 180 Z" fill="#38bdf8" opacity="0.85" />
    <path d="M 110 270 Q 105 285 110 295 A 6 6 0 1 0 117 289 Q 112 280 110 270 Z" fill="#38bdf8" opacity="0.75" />
    <path d="M 402 270 Q 397 285 402 295 A 6 6 0 1 0 409 289 Q 404 280 402 270 Z" fill="#38bdf8" opacity="0.75" />

    <!-- Heroic Toad Feet (Base) -->
    <ellipse cx="160" cy="390" rx="42" ry="22" fill="#15803d" />
    <ellipse cx="352" cy="390" rx="42" ry="22" fill="#15803d" />

    <!-- Toad Body -->
    <ellipse cx="256" cy="305" rx="120" ry="110" fill="url(#toadBody)" stroke="#14532d" stroke-width="4" />

    <!-- Toad Soft Belly -->
    <ellipse cx="256" cy="325" rx="80" ry="75" fill="url(#toadBelly)" opacity="0.95" />

    <!-- Warts / Spots -->
    <circle cx="185" cy="275" r="9" fill="#15803d" opacity="0.6" />
    <circle cx="170" cy="315" r="12" fill="#15803d" opacity="0.5" />
    <circle cx="327" cy="275" r="9" fill="#15803d" opacity="0.6" />
    <circle cx="342" cy="315" r="12" fill="#15803d" opacity="0.5" />

    <!-- Toad Head -->
    <ellipse cx="256" cy="225" rx="95" ry="70" fill="url(#toadBody)" />

    <!-- Eye Sockets (Bulging) -->
    <circle cx="195" cy="180" r="38" fill="#15803d" />
    <circle cx="317" cy="180" r="38" fill="#15803d" />
    <circle cx="195" cy="180" r="34" fill="#16a34a" />
    <circle cx="317" cy="180" r="34" fill="#16a34a" />

    <!-- Eyeballs -->
    <circle cx="195" cy="180" r="28" fill="#fef08a" />
    <circle cx="317" cy="180" r="28" fill="#fef08a" />

    <!-- Pupils (Determined Horizontal Oval / Slit) -->
    <ellipse cx="198" cy="180" rx="16" ry="10" fill="#1c1917" />
    <ellipse cx="314" cy="180" rx="16" ry="10" fill="#1c1917" />

    <!-- Eye Highlights -->
    <circle cx="204" cy="174" r="5" fill="#ffffff" />
    <circle cx="320" cy="174" r="5" fill="#ffffff" />

    <!-- Red Heroic Headband (Khăn Rằn / Băng Đỏ Khởi Nghĩa) -->
    <path d="M 160 215 Q 256 195 352 215 L 350 230 Q 256 210 162 230 Z" fill="#dc2626" />
    <!-- Headband trailing ties -->
    <path d="M 350 220 Q 380 235 395 220 Q 375 245 350 230 Z" fill="#b91c1c" />

    <!-- Confident Smile / Mouth -->
    <path d="M 205 250 Q 256 270 307 250" fill="none" stroke="#14532d" stroke-width="5" stroke-linecap="round" />

    <!-- Royal Golden Crown / Bronze Drum Crown -->
    <path d="M 226 145 L 236 125 L 246 140 L 256 115 L 266 140 L 276 125 L 286 145 Z" fill="url(#goldGrad)" stroke="#b45309" stroke-width="2" />

    <!-- Title Badge Ribbon at Bottom -->
    <g transform="translate(0, 420)">
      <rect x="106" y="0" width="300" height="48" rx="24" fill="#1c1917" stroke="url(#goldGrad)" stroke-width="3" />
      <text x="256" y="31" font-family="Cinzel, Arial, sans-serif" font-weight="bold" font-size="20" fill="#fbbf24" text-anchor="middle" letter-spacing="2">CÓC KIỆN TRỜI</text>
    </g>
  </g>
</svg>`;
}

async function run() {
  const standardSvg = getToadSvg(false);
  const maskableSvg = getToadSvg(true);

  // Write SVG
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);

  // Generate PNGs using Sharp
  await sharp(Buffer.from(standardSvg)).resize(192, 192).png().toFile(path.join(publicDir, 'pwa-192x192.png'));
  await sharp(Buffer.from(standardSvg)).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-512x512.png'));
  await sharp(Buffer.from(maskableSvg)).resize(512, 512).png().toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  await sharp(Buffer.from(standardSvg)).resize(180, 180).png().toFile(path.join(publicDir, 'apple-touch-icon.png'));
  await sharp(Buffer.from(standardSvg)).resize(64, 64).png().toFile(path.join(publicDir, 'favicon.png'));

  // Generate screenshots for PWA manifest & PWABuilder compliance
  const screenshotMobileSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 960" width="540" height="960">
    <rect width="540" height="960" fill="#022c22" />
    <circle cx="270" cy="400" r="180" fill="#064e3b" opacity="0.6" />
    <g transform="translate(14, 180)">
      ${standardSvg}
    </g>
    <text x="270" y="760" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#fbbf24" text-anchor="middle">CÓC KIỆN TRỜI - PARKOUR 2D</text>
    <text x="270" y="800" font-family="Arial, sans-serif" font-size="18" fill="#a7f3d0" text-anchor="middle">Nhảy Lên Thiên Đình Gọi Mưa Cứu Trần Gian</text>
  </svg>`;

  const screenshotDesktopSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
    <rect width="1280" height="720" fill="#022c22" />
    <circle cx="640" cy="360" r="260" fill="#064e3b" opacity="0.6" />
    <g transform="translate(434, 104)">
      ${standardSvg}
    </g>
    <text x="640" y="660" font-family="Arial, sans-serif" font-weight="bold" font-size="32" fill="#fbbf24" text-anchor="middle">CÓC KIỆN TRỜI - VƯỢT THIÊN ĐÌNH</text>
  </svg>`;

  await sharp(Buffer.from(screenshotMobileSvg)).png().toFile(path.join(publicDir, 'screenshot-mobile.png'));
  await sharp(Buffer.from(screenshotDesktopSvg)).png().toFile(path.join(publicDir, 'screenshot-desktop.png'));

  // Export native Android app icons if android directory exists
  const androidResDir = path.resolve('android/app/src/main/res');
  if (fs.existsSync(androidResDir)) {
    const densities = [
      { dir: 'mipmap-mdpi', size: 48 },
      { dir: 'mipmap-hdpi', size: 72 },
      { dir: 'mipmap-xhdpi', size: 96 },
      { dir: 'mipmap-xxhdpi', size: 144 },
      { dir: 'mipmap-xxxhdpi', size: 192 },
    ];
    for (const d of densities) {
      const targetDir = path.join(androidResDir, d.dir);
      if (fs.existsSync(targetDir)) {
        await sharp(Buffer.from(standardSvg)).resize(d.size, d.size).png().toFile(path.join(targetDir, 'ic_launcher.png'));
        await sharp(Buffer.from(standardSvg)).resize(d.size, d.size).png().toFile(path.join(targetDir, 'ic_launcher_round.png'));
        await sharp(Buffer.from(maskableSvg)).resize(d.size, d.size).png().toFile(path.join(targetDir, 'ic_launcher_foreground.png'));
      }
    }
    console.log('Successfully updated Android native mipmap app icons!');
  }

  console.log('Successfully generated all PWA icons and screenshots!');
}

run().catch(console.error);
