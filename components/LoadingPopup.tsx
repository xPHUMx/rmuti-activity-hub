export default function LoadingPopup({ isVisible }: { isVisible: boolean }) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black/90 border border-white/[0.05] p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center max-w-xs w-full">
        <div className="luxury-loader mb-4"></div>
        <p className="text-xs font-light tracking-[0.2em] text-[#d4af37]">กำลังโหลด...</p>
      </div>
    </div>
  );
}
  