export default function LoadingPopup({ isVisible }: { isVisible: boolean }) {
    if (!isVisible) return null;
  
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <div className="animate-spin border-t-4 border-blue-500 border-solid rounded-full h-12 w-12 mb-4"></div>
          <p className="text-lg font-bold text-gray-700">กำลังโหลด...</p>
        </div>
      </div>
    );
  }
  