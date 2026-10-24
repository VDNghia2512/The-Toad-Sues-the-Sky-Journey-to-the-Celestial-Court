import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Check,
  Copy,
  ExternalLink,
  X,
  Sparkles,
  HelpCircle,
  ShieldCheck,
  Zap,
  AlertTriangle,
  FolderArchive,
  ShieldAlert,
  ChevronRight,
  Info
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface AndroidInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'pwa' | 'troubleshoot' | 'apk'>('pwa');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use current window location or the shared URL
  const shareUrl = typeof window !== 'undefined' && window.location.href.startsWith('http')
    ? window.location.href.split('?')[0]
    : 'https://ais-pre-5u62ceutjx6td44bt4noe6-652258248200.asia-northeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {});
  };

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}&color=16-78-59&bgcolor=254-240-138`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-stone-900 border border-emerald-600/50 rounded-2xl shadow-2xl p-4 sm:p-6 text-stone-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition"
          aria-label="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-4 pb-4 border-b border-stone-800">
          <img
            src="/pwa-192x192.png"
            alt="Cóc Kiện Trời Icon"
            className="w-14 h-14 rounded-2xl shadow-lg border-2 border-amber-500/70 object-cover shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-amber-300 font-cinzel">
                Cài Đặt Game Trên Android / APK
              </h2>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700">
                Chuẩn Google WebAPK
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Chơi toàn màn hình, mượt mà 60 FPS, lưu kỷ lục và hỗ trợ cảm ứng cực nhạy
            </p>
          </div>
        </div>

        {/* Tab Switcher - 3 Tabs */}
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-stone-950 p-1 mb-4 border border-stone-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`py-2 px-1 text-center rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Cài 1 Chạm (Khuyên dùng)</span>
          </button>
          <button
            onClick={() => setActiveTab('troubleshoot')}
            className={`py-2 px-1 text-center rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'troubleshoot'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Sửa Lỗi File APK</span>
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`py-2 px-1 text-center rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeTab === 'apk'
                ? 'bg-stone-700 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Tạo File APK</span>
          </button>
        </div>

        {/* Tab 1: PWA Direct Install (Recommended - WebAPK) */}
        {activeTab === 'pwa' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-600/60 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-200 leading-relaxed">
                <span className="font-bold text-emerald-300">Vì sao nên dùng Cài Đặt 1 Chạm (WebAPK)? </span>
                Google Android tích hợp sẵn công nghệ WebAPK: Khi bạn mở link trên Chrome và chọn <strong>"Cài đặt ứng dụng"</strong>, máy sẽ tự động tạo một ứng dụng Android chính chủ cài lên màn hình điện thoại mà <strong>100% không bị báo lỗi cú pháp</strong>, <strong>không bị Play Protect chặn</strong> và <strong>không cần cấp quyền nguồn không xác định</strong>!
              </div>
            </div>

            {/* Direct Trigger Button if browser supports BeforeInstallPrompt */}
            {isInstallable && !isInstalled && (
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2 transform active:scale-98 transition"
              >
                <Smartphone className="w-5 h-5" />
                <span>BẤM VÀO ĐÂY ĐỂ CÀI ĐẶT LÊN ĐIỆN THOẠI NGAY</span>
              </button>
            )}

            {isInstalled && (
              <div className="p-3 rounded-xl bg-green-950/70 border border-green-600 text-green-300 text-xs font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Game đã được cài đặt thành công! Bạn có thể mở biểu tượng Cóc Kiện Trời từ màn hình chính để chơi.</span>
              </div>
            )}

            {/* Step by step manual guide */}
            <div className="space-y-2.5 bg-stone-950/70 p-4 rounded-xl border border-stone-800">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>3 Bước cài đặt siêu nhanh bằng trình duyệt Chrome trên Android:</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center mb-1.5 border border-amber-500/40">
                    1
                  </div>
                  <p className="text-xs text-stone-200 font-semibold">Mở link trên Chrome</p>
                  <p className="text-[11px] text-stone-400 mt-1">Dùng trình duyệt Google Chrome hoặc Cốc Cốc trên điện thoại Android</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center mb-1.5 border border-amber-500/40">
                    2
                  </div>
                  <p className="text-xs text-stone-200 font-semibold">Chạm vào Menu ⋮</p>
                  <p className="text-[11px] text-stone-400 mt-1">Nhấn biểu tượng 3 dấu chấm ở góc trên cùng bên phải trình duyệt</p>
                </div>

                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex flex-col items-center text-center">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center mb-1.5 border border-emerald-500/40">
                    3
                  </div>
                  <p className="text-xs text-emerald-300 font-semibold">"Cài đặt ứng dụng"</p>
                  <p className="text-[11px] text-stone-400 mt-1">Bấm chọn "Cài đặt ứng dụng" (hoặc "Thêm vào Màn hình chính")</p>
                </div>
              </div>
            </div>

            {/* QR Code and Quick Share */}
            <div className="p-3.5 rounded-xl bg-stone-950/70 border border-stone-800 flex flex-col sm:flex-row items-center gap-4">
              <div className="shrink-0 p-1.5 bg-yellow-100 rounded-xl shadow-md border border-amber-500/40">
                <img
                  src={qrCodeUrl}
                  alt="QR Code Quét Chơi Trên Android"
                  className="w-24 h-24 rounded-lg"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-bold text-amber-300 mb-1 flex items-center justify-center sm:justify-start gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dùng Camera điện thoại quét mã QR</span>
                </p>
                <p className="text-[11px] text-stone-400 mb-2 leading-relaxed">
                  Mở ứng dụng Máy ảnh trên điện thoại Android đưa vào mã QR này để mở link trực tiếp và bấm Cài đặt ngay.
                </p>
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold border border-stone-700 transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-green-400" />
                      <span className="text-green-400 font-bold">Đã sao chép link game!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép link gửi qua Zalo / Facebook</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Troubleshooting APK Errors (Direct Answer to User's Question) */}
        {activeTab === 'troubleshoot' && (
          <div className="space-y-3.5">
            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/50 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200 leading-relaxed">
                <span className="font-bold text-amber-300">Tại sao file APK tải về không cài được?</span>
                <p className="mt-1 text-stone-300">
                  Đây là các nguyên nhân phổ biến nhất trên Android kèm hướng dẫn xử lý ngay lập tức:
                </p>
              </div>
            </div>

            {/* Error 1: File is actually a .ZIP from PWABuilder */}
            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-red-400">
                <FolderArchive className="w-4 h-4 shrink-0" />
                <span>1. Lỗi: File tải về là file .ZIP hoặc báo "Lỗi cú pháp gói" (Parse Error)</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed pl-6">
                <strong>Nguyên nhân:</strong> Khi đóng gói từ PWABuilder, file tải về thực chất là <code>Android.zip</code>. Nếu bấm cài trực tiếp file zip thì máy sẽ báo lỗi không mở được tệp hoặc lỗi phân tích cú pháp.
              </p>
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-emerald-300 pl-3 flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Cách khắc phục:</strong> Mở ứng dụng <strong>Quản lý tệp (Files / Tệp của bạn)</strong> trên điện thoại &rarr; Tìm mục <strong>Tải về (Download)</strong> &rarr; Chạm vào file <code>Android.zip</code> và chọn <strong>"Giải nén" (Extract)</strong> &rarr; Sau đó bấm vào file <code>app-release.apk</code> bên trong thư mục vừa giải nén để cài đặt.
                </div>
              </div>
            </div>

            {/* Error 2: Blocked by Google Play Protect */}
            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>2. Lỗi: "Bị chặn bởi Play Protect" / "Ứng dụng không an toàn"</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed pl-6">
                <strong>Nguyên nhân:</strong> File APK tự tạo chưa được đăng ký chứng chỉ thương mại trên Google Play Store nên tính năng Play Protect của Android sẽ cảnh báo.
              </p>
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-amber-300 pl-3 flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Cách khắc phục:</strong> Khi màn hình Play Protect hiện lên, <strong>KHÔNG</strong> bấm "Hủy" hoặc "OK". Hãy chạm vào dòng chữ nhỏ <strong>"Chi tiết" (More details)</strong> ở góc dưới &rarr; rồi bấm chọn <strong>"Vẫn cài đặt" (Install anyway)</strong>.
                </div>
              </div>
            </div>

            {/* Error 3: Unknown Sources Blocked */}
            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>3. Lỗi: "Chưa cho phép cài đặt ứng dụng từ nguồn không xác định"</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed pl-6">
                <strong>Nguyên nhân:</strong> Hệ điều hành Android mặc định chặn cài đặt các file APK tải từ bên ngoài ứng dụng Google Play.
              </p>
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] text-sky-300 pl-3 flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Cách khắc phục:</strong> Khi bảng thông báo hiện ra, bấm vào nút <strong>"Cài đặt" (Settings)</strong> &rarr; Gạt bật công tắc <strong>"Cho phép từ nguồn này" (Allow from this source)</strong> cho ứng dụng Chrome hoặc Quản lý tệp &rarr; Bấm phím quay lại và bấm <strong>"Cài đặt"</strong>.
                </div>
              </div>
            </div>

            {/* Recommended Tip */}
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/50 flex items-center justify-between gap-3">
              <div className="text-xs text-emerald-200">
                💡 <strong>Mẹo hay:</strong> Chuyển sang tab <strong>"Cài 1 Chạm"</strong> để cài đặt ngay dạng WebAPK, hoàn toàn không gặp bất kỳ lỗi nào ở trên!
              </div>
              <button
                onClick={() => setActiveTab('pwa')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 transition"
              >
                Cài Ngay
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Export APK File (Capacitor Native Project + PWABuilder) */}
        {activeTab === 'apk' && (
          <div className="space-y-4">
            {/* Native Android Project Option */}
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-600/50 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Smartphone className="w-4 h-4 shrink-0" />
                <span>Cách 1: Build Trực Tiếp Từ Mã Nguồn Android Native (Đã Cấu Hình Sẵn)</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed">
                Dự án đã được tích hợp sẵn 100% mã nguồn Android Studio trong thư mục <code>/android</code> cùng <strong>Capacitor</strong>, icon launcher Đông Sơn, và hỗ trợ nút Back phần cứng:
              </p>
              <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800 text-[11px] space-y-1.5 font-mono text-stone-200">
                <div className="text-amber-400 font-semibold font-sans">Mở bằng Android Studio:</div>
                <p className="text-stone-300 font-sans">
                  Mở thư mục <code>android/</code> &rarr; Chọn menu <strong>Build &rarr; Build Bundle(s) / APK(s) &rarr; Build APK(s)</strong>.
                </p>
                <div className="text-amber-400 font-semibold font-sans pt-1">Hoặc chạy lệnh Terminal:</div>
                <div className="bg-black/60 p-1.5 rounded text-emerald-400 text-[10px]">
                  npm run build:android<br />
                  cd android &amp;&amp; ./gradlew assembleDebug
                </div>
                <p className="text-[10px] text-stone-400 font-sans">
                  File APK xuất ra tại: <code>android/app/build/outputs/apk/debug/app-debug.apk</code>
                </p>
              </div>
            </div>

            {/* Online PWABuilder Option */}
            <div className="p-3.5 rounded-xl bg-stone-950/80 border border-stone-800 space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                <Download className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Cách 2: Đóng Gói Online Miễn Phí Qua PWABuilder (Không Cần Android Studio)</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                Code đã được cập nhật đầy đủ chuẩn Web Manifest, Service Worker và ảnh chụp Screenshots để đạt 100% điểm kiểm duyệt của Google/Microsoft PWABuilder:
              </p>

              <ol className="space-y-2 text-xs text-stone-300 list-decimal list-inside pl-1">
                <li className="leading-relaxed">
                  <span className="font-semibold text-amber-400">Sao chép link game:</span>
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={shareUrl}
                      className="flex-1 px-2.5 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-[11px] text-stone-300 font-mono select-all"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shrink-0 transition"
                    >
                      {copied ? 'Đã chép' : 'Sao chép'}
                    </button>
                  </div>
                </li>

                <li className="leading-relaxed">
                  <span className="font-semibold text-amber-400">Dán link vào PWABuilder:</span>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Mở <a href="https://www.pwabuilder.com" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline font-semibold inline-flex items-center gap-1">PWABuilder.com <ExternalLink className="w-3 h-3" /></a> &rarr; Nhấn <strong>"Start"</strong> &rarr; Chọn <strong>"Package for Android"</strong> &rarr; Tải gói về.
                  </p>
                </li>

                <li className="leading-relaxed">
                  <span className="font-semibold text-emerald-400">Giải nén lấy file APK:</span>
                  <p className="text-[11px] text-stone-400 mt-0.5">
                    Gói tải về là <code>Android.zip</code>. Dùng app Quản lý tệp trên điện thoại <strong>Giải nén</strong> để lấy file <code>app-release.apk</code> bên trong cài đặt.
                  </p>
                </li>
              </ol>

              <a
                href={`https://www.pwabuilder.com/?site=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-stone-950 font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition"
              >
                <span>MỞ PWABUILDER ĐÓNG GÓI ONLINE NGAY</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-4 pt-3.5 border-t border-stone-800 flex justify-between items-center text-[11px] text-stone-500">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tương thích mọi thiết bị Android (Samsung, Xiaomi, Oppo, Realme, v.v.)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
