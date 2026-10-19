import React, { useState } from 'react';
import { X, Copy, Check, Share2, Smartphone, Globe } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  altitude?: number;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  altitude,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Prefer the stable production/shared app URL, falling back to window.location.href
  const shareUrl =
    typeof window !== 'undefined' && window.location.origin.includes('run.app')
      ? 'https://ais-pre-5u62ceutjx6td44bt4noe6-652258248200.asia-northeast1.run.app'
      : (typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-5u62ceutjx6td44bt4noe6-652258248200.asia-northeast1.run.app');

  const shareTitle = 'Cóc Kiện Trời - Game Dân Gian Vượt Thiên Đình Đòi Mưa';
  const shareText = altitude && altitude > 0
    ? `Tôi vừa đạt kỷ lục độ cao ${altitude}m trong game Cóc Kiện Trời! Vào thử thách cùng tôi nhé:`
    : 'Cùng chơi game Cóc Kiện Trời vượt 1000m Thiên Đình gõ Trống Sấm đòi mưa cho nhân gian nào!';

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // QR code image URL using quickchart QR API
  const qrCodeUrl = `https://quickchart.io/qr?text=${encodeURIComponent(shareUrl)}&size=160&margin=1&dark=fbbf24&light=1c1917`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-stone-900 border border-amber-900/60 rounded-2xl text-amber-100 shadow-2xl p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-amber-400 hover:text-amber-200 hover:bg-amber-950/40 transition-colors cursor-pointer"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-widest text-amber-500 font-semibold">
              Rủ Bạn Cùng Chơi
            </span>
            <h2 className="text-xl font-serif font-bold text-amber-300">
              Chia Sẻ Game Cóc Kiện Trời
            </h2>
          </div>
        </div>

        <p className="text-xs text-stone-300 mb-4 leading-relaxed">
          Gửi đường link này cho bạn bè để mở chơi ngay trên mọi thiết bị (Điện thoại, Máy tính, Máy tính bảng) mà không cần cài đặt!
        </p>

        {/* Copy Link Input Bar */}
        <div className="mb-4">
          <label className="text-[11px] font-semibold text-amber-400/90 mb-1.5 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>Liên kết chơi game trực tiếp:</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-stone-950/80 border border-amber-900/60 rounded-xl px-3 py-2 text-xs font-mono text-amber-200 select-all outline-none focus:border-amber-400"
            />
            <button
              onClick={handleCopyLink}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-stone-950'
                  : 'bg-amber-600 hover:bg-amber-500 text-stone-950 active:scale-95'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Đã chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Sao chép</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Native mobile share button */}
        <div className="mb-4">
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Gửi Qua Zalo / Messenger / Tin Nhắn</span>
          </button>
        </div>

        {/* QR Code Section for instant phone scanning */}
        <div className="p-3.5 rounded-xl bg-stone-950/70 border border-amber-900/40 flex items-center gap-3.5">
          <img
            src={qrCodeUrl}
            alt="Mã QR chơi game Cóc Kiện Trời"
            className="w-20 h-20 rounded-lg border border-amber-500/40 bg-stone-900 shrink-0 object-contain p-1"
          />
          <div className="text-left text-xs">
            <div className="flex items-center gap-1 text-amber-400 font-semibold mb-0.5">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Quét mã QR bằng điện thoại</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-snug">
              Bật camera hoặc ứng dụng Zalo trên điện thoại để quét mã và vào màn chơi lập tức!
            </p>
          </div>
        </div>

        {/* Close Button at bottom */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
