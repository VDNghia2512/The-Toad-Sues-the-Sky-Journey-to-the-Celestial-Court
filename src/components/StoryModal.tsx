import React from 'react';
import { X, Award, Shield, CloudRain } from 'lucide-react';

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryModal: React.FC<StoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-amber-900/60 rounded-2xl text-amber-100 shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-amber-400 hover:text-amber-200 hover:bg-amber-950/40 transition-colors"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <span className="text-xs uppercase tracking-widest text-amber-500 font-semibold">
            Truyền Thuyết Dân Gian Việt Nam
          </span>
          <h2 className="text-2xl font-serif font-bold text-amber-300 mt-1">
            Sự Tích Cóc Kiện Trời
          </h2>
          <p className="text-xs text-amber-200/70 mt-1 italic">
            "Con cóc là cậu ông Trời · Hễ ai đánh nó thì Trời đánh cho"
          </p>
        </div>

        {/* Artwork Banner with resilient fallback */}
        <div className="relative w-full h-56 rounded-xl overflow-hidden mb-5 border border-amber-900/50 bg-stone-950 flex items-center justify-center">
          <img
            src="/src/assets/images/coc_kien_troi_hero_1792210818051.jpg"
            alt="Tranh dân gian Cóc Kiện Trời"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 text-xs font-medium text-amber-300 drop-shadow">
            Hạ giới khát cháy — Cóc dẫn đàn thú vượt ngàn trùng mây lên Thiên Đình
          </div>
        </div>

        {/* Folkloric Story Content */}
        <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
          <p>
            Thuở xưa, trần gian gặp nạn đại hạn kéo dài nhiều năm. Ruộng đồng nứt nẻ chân chim, cỏ cây khô héo rũ rượi, muôn loài khát cháy cổ họng mà không thấy một hạt mưa rơi.
          </p>
          <p>
            Thấy muôn loài lâm vào cảnh diệt vong, một chú Cóc nhỏ bé nhưng giàu lòng dũng cảm quyết chí một mình lên tận Thiên Đình để gõ trống kiện Ngọc Hoàng đòi mưa cứu thế gian.
          </p>
          <p>
            Trên hành trình trèo đèo lội suối, vượt qua các vách núi dựng đứng và ngút ngàn tầng mây, Cóc đã kết nghĩa với Cua đồng, Ong vò vẽ, Cọp dữ và Gấu đen cùng chung chí hướng. Nhờ tài trí mưu lược và cú nhảy chuẩn xác, Cóc đã qua mặt tướng nhà Trời, gõ vang chiếc trống sấm Thiên Đình buộc Ngọc Hoàng phải truyền lệnh cho Long Vương làm mưa phủ khắp nhân gian.
          </p>
        </div>

        {/* Gameplay Mechanic Tie-ins */}
        <div className="mt-6 pt-5 border-t border-amber-900/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-stone-950/60 border border-amber-900/30">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs mb-1">
              <span className="text-sm">🦘</span>
              <span>Búng Nhảy & Đổi Hướng</span>
            </div>
            <p className="text-xs text-stone-400">
              Phím Space / W / Mũi tên Lên để nhảy; phím A / D hoặc Mũi tên Trái / Phải để lượn hướng chính xác vào bệ đứng.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-stone-950/60 border border-amber-900/30">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs mb-1">
              <Award className="w-4 h-4 text-pink-400" />
              <span>Lá Sen & Trống Sấm</span>
            </div>
            <p className="text-xs text-stone-400">
              Tiếp đất lên lá sen để phóng bổng lên cao; chạm Trống Sấm Đông Sơn kích hoạt siêu nhảy vút mây qua hiểm cảnh.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-stone-950/60 border border-amber-900/30">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-xs mb-1">
              <CloudRain className="w-4 h-4 text-sky-400" />
              <span>Gom Sương Mở Khóa</span>
            </div>
            <p className="text-xs text-stone-400">
              Thu thập các giọt sương lành và sen vàng trên đường leo để tích lũy mở khóa trang phục thần thoại và kết nạp bạn đồng hành.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-sm transition-colors"
          >
            Vào Cuộc Leo Núi
          </button>
        </div>
      </div>
    </div>
  );
};
