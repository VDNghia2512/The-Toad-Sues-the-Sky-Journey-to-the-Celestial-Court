import { GameRealm, Skin, Companion, Achievement } from '../types/game';

export const GAME_CONSTANTS = {
  WORLD_WIDTH: 600, // standard vertical game width in game coordinates
  VIEWPORT_HEIGHT: 850,
  GRAVITY: 0.42,
  TERMINAL_VELOCITY: 14,
  AIR_DRAG: 0.985,
  GROUND_FRICTION: 0.85,
  MAX_JUMP_FORCE_Y: -14.5,
  MIN_JUMP_FORCE_Y: -6.5,
  // Skill Recharge (~30 raindrops base per skill)
  AIR_DASH_DROPS_NEEDED: 30, // 30 raindrops collected to recharge Air Dash
  RAIN_SUMMON_DROPS_NEEDED: 30, // 30 raindrops collected to recharge Rain Summon
  AIR_DASH_COOLDOWN: 30, // legacy fallback
  RAIN_SUMMON_COOLDOWN: 30,
  AIR_DASH_SPEED: 13,
  AIR_DASH_LIFT: -8,
  AIR_DASH_DURATION: 11, // frames
  LOTUS_BOUNCE_FORCE: -17.5,
  THUNDER_DRUM_FORCE: -23,
  WIND_RING_BOOST: -19,
  ALTITUDE_SCALE: 0.1, // 10 world units = 1 meter
  VICTORY_ALTITUDE: 1000, // 1000 meters = Heaven Reached!
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_climb',
    title: 'Bước Chân Đầu Tiên',
    desc: 'Vượt qua mốc độ cao 100m đầu tiên.',
    icon: '🌱',
    unlocked: false,
  },
  {
    id: 'dash_master',
    title: 'Phong Vân Đạp Gió',
    desc: 'Thực hiện cú đạp gió lướt mây trên không để chuyển làn và leo cao.',
    icon: '💨',
    unlocked: false,
  },
  {
    id: 'rain_summoner',
    title: 'Cậu Ông Trời',
    desc: 'Nghiến răng kích hoạt thành công luồng nước sấm giông cứu hạn.',
    icon: '🌧️',
    unlocked: false,
  },
  {
    id: 'water_collector',
    title: 'Sương Đêm Đại Ngàn',
    desc: 'Thu thập được từ 30 giọt sương cứu hạn trở lên.',
    icon: '💧',
    unlocked: false,
  },
  {
    id: 'reach_heaven',
    title: 'Chạm Tới Cổng Trời',
    desc: 'Đến Nam Thiên Môn và gõ vang Trống Thiên Đình ở độ cao 1000m.',
    icon: '⛩️',
    unlocked: false,
  },
  {
    id: 'speed_demon',
    title: 'Thần Tốc Vượt Mây',
    desc: 'Chinh phục 1000m Thiên Đình trong thời gian dưới 2 phút 30 giây.',
    icon: '⚡',
    unlocked: false,
  },
];

export const REALMS: GameRealm[] = [
  {
    id: 'realm_earth',
    name: 'Hạ Giới Nắng Hạn',
    vietnameseName: 'Tầng 1: Hạ Giới Nắng Hạn (0m - 250m)',
    minAlt: 0,
    maxAlt: 250,
    bgGradient: ['#3b1e08', '#854d0e'],
    quote: 'Nắng hạn ngút trời, muôn loài khát cháy. Cóc quyết chí lên trời kiện Ngọc Hoàng!',
  },
  {
    id: 'realm_forest',
    name: 'Rừng Cổ Thụ & Chóp Tháp Cổ',
    vietnameseName: 'Tầng 2: Rừng Cổ Thụ & Tháp Cổ (250m - 550m)',
    minAlt: 250,
    maxAlt: 550,
    bgGradient: ['#14532d', '#1e293b'],
    quote: 'Hội ngộ bạn bè: Cua, Gấu, Cọp, Ong cùng chung lòng vượt mây cao.',
  },
  {
    id: 'realm_thunder',
    name: 'Tầng Mây & Trống Thiên Lôi',
    vietnameseName: 'Tầng 3: Tầng Mây & Trống Thiên Lôi (550m - 850m)',
    minAlt: 550,
    maxAlt: 850,
    bgGradient: ['#1e1b4b', '#431407'],
    quote: 'Gió giông vần vũ, Thiên Lôi canh giữ sấm sét. Nhảy né luồng sét!',
  },
  {
    id: 'realm_heaven',
    name: 'Cổng Nam Thiên Môn & Điện Ngọc Hoàng',
    vietnameseName: 'Tầng 4: Nam Thiên Môn & Thiên Đình (850m - 1000m+)',
    minAlt: 850,
    maxAlt: 99999,
    bgGradient: ['#78350f', '#fbbf24'],
    quote: 'Cóc nghiến răng một tiếng mây kéo về, gõ vang trống trời đòi mưa cứu thế gian!',
  },
];

export const SKINS: Skin[] = [
  {
    id: 'classic',
    name: 'Cóc Dân Gian',
    desc: 'Chú cóc thân quen của đồng quê xứ Việt, kiên cường bất khuất.',
    cost: 0,
    unlocked: true,
    bodyColor: '#4d7c0f',
    bellyColor: '#fef08a',
    spotColor: '#365314',
    eyeColor: '#1e293b',
    headbandColor: '#dc2626',
    perk: 'Cân bằng, tốc độ chuẩn mực',
  },
  {
    id: 'golden',
    name: 'Cóc Vàng May Mắn',
    desc: 'Lấp lánh ánh kim hoàng cung, tăng 15% lực nảy từ lá sen thần.',
    cost: 50,
    unlocked: false,
    bodyColor: '#eab308',
    bellyColor: '#fef9c3',
    spotColor: '#ca8a04',
    eyeColor: '#78350f',
    headbandColor: '#b91c1c',
    perk: '+15% lực nảy trên Lá Sen',
  },
  {
    id: 'lotus',
    name: 'Cóc Hoa Sen',
    desc: 'Mang hương sắc quốc hoa, rơi chậm hơn 15% lơ lửng giữa tầng không.',
    cost: 90,
    unlocked: false,
    bodyColor: '#f472b6',
    bellyColor: '#fdf2f8',
    spotColor: '#db2777',
    eyeColor: '#831843',
    headbandColor: '#059669',
    perk: 'Rơi êm dịu, dễ căn điểm hạ cánh',
  },
  {
    id: 'warrior',
    name: 'Cóc Giáp Đồng Đông Sơn',
    desc: 'Khắc hoa văn trống đồng Lạc Việt, tăng 30% tốc độ lướt gió và giảm số hạt mưa hồi Đạp Gió (chỉ cần 22 hạt mưa thay vì 30).',
    cost: 140,
    unlocked: false,
    bodyColor: '#b45309',
    bellyColor: '#fef3c7',
    spotColor: '#78350f',
    eyeColor: '#000000',
    headbandColor: '#15803d',
    perk: '+30% tốc độ lướt gió, chỉ cần 22 hạt mưa hồi Đạp Gió',
  },
  {
    id: 'rain_spirit',
    name: 'Cóc Thần Mưa',
    desc: 'Hiện thân của giông bão, chỉ cần 20 hạt mưa để kích hoạt Nghiến Răng Gọi Mưa và mỗi giọt sương vàng tính thành 3 hạt mưa.',
    cost: 200,
    unlocked: false,
    bodyColor: '#0284c7',
    bellyColor: '#e0f2fe',
    spotColor: '#0369a1',
    eyeColor: '#0c4a6e',
    headbandColor: '#f59e0b',
    perk: 'Chỉ cần 20 hạt mưa gọi giông & sương vàng tính x3',
  },
];

export const COMPANIONS: Companion[] = [
  {
    id: 'crab',
    name: 'Cua Đồng',
    vietnameseName: 'Cua Giữ Thăng Bằng',
    desc: 'Đôi càng kẹp chắc giúp giảm số hạt mưa hồi chiêu Đạp Gió (chỉ cần 20 hạt thay vì 30) và ban tặng 2 lần lướt gió liên tiếp.',
    icon: '🦀',
    unlocked: true,
    active: true,
  },
  {
    id: 'bee',
    name: 'Ong Vò Vẽ',
    vietnameseName: 'Ong Lượn Mây',
    desc: 'Giúp lượn nhẹ khi rơi bằng cách giữ phím Nhảy trong không trung; cộng thêm +1 hạt mưa thưởng vào tiến trình hồi chiêu khi nhặt sương.',
    icon: '🐝',
    unlocked: false,
    active: false,
  },
  {
    id: 'tiger',
    name: 'Cọp Rừng',
    vietnameseName: 'Cọp Hộ Thể',
    desc: 'Bảo hộ 1 lần sảy chân rơi tự do bằng cơn lốc hất ngược lên bệ an toàn, đồng thời hồi ngay +10 hạt mưa tích lũy kỹ năng.',
    icon: '🐅',
    unlocked: false,
    active: false,
  },
  {
    id: 'bear',
    name: 'Gấu Núi',
    vietnameseName: 'Gấu Hút Sương',
    desc: 'Bán kính hút hạt mưa cứu hạn rộng gấp 3 lần bình thường, giúp gom đủ 30 hạt mưa hồi chiêu siêu tốc.',
    icon: '🐻',
    unlocked: false,
    active: false,
  },
];
