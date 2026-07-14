import React from 'react';

const VersionBadge: React.FC = () => {
  return (
    <div className="fixed bottom-4 right-4 bg-black/40 backdrop-blur-md border border-[#d4af37]/20 text-[#d4af37] px-3.5 py-1 rounded-full text-[10px] tracking-wider font-light uppercase shadow-[0_5px_15px_rgba(0,0,0,0.3)] z-50">
      ActivityHub 0.1 Beta
    </div>
  );
};

export default VersionBadge;