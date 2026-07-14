// import React from "react";
// import {
//   ClockIcon,
//   MapPinIcon,
//   CalendarDaysIcon,
// } from "@heroicons/react/24/outline";

// interface Registration {
//   activityName: string;
//   startTime: string;
//   endTime: string;
//   location: string;
//   registerDate: string;
// }

// interface Props {
//   registrations: Registration[];
// }

// export default function RegistrationDropdown({ registrations }: Props) {
//   return (
//     <div className="absolute right-0 mt-2 w-96 max-h-80 overflow-auto rounded-lg bg-gray-900 shadow-lg border border-gray-700 z-50">
//       <div className="p-4 text-white font-bold text-lg border-b border-gray-700">
//         กิจกรรมที่ลงทะเบียน
//       </div>
//       {registrations.length === 0 ? (
//         <div className="p-6 text-gray-400 text-center italic">
//           ไม่มีการลงทะเบียน
//         </div>
//       ) : (
//         <ul>
//           {registrations.map((reg, idx) => (
//             <li
//               key={idx}
//               className="px-4 py-3 hover:bg-gray-800 border-b border-gray-700 last:border-none cursor-default transition-colors duration-200"
//             >
//               <div className="font-semibold text-white text-lg mb-1">
//                 {reg.activityName}
//               </div>
//               <div className="flex flex-col gap-1 text-gray-300 text-sm">
//                 <div className="flex items-center gap-2">
//                   <ClockIcon className="h-5 w-5 text-orange-400" />
//                   <span>
//                     เวลา: {reg.startTime} - {reg.endTime}
//                   </span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <MapPinIcon className="h-5 w-5 text-green-400" />
//                   <span>สถานที่: {reg.location}</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <CalendarDaysIcon className="h-5 w-5 text-blue-400" />
//                   <span>วันที่ลงทะเบียน: {reg.registerDate}</span>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ClockIcon, MapPinIcon, CalendarIcon } from "@heroicons/react/24/outline";

interface Registration {
  activityId: string;
  activityName: string;
  startTime: string;
  endTime: string;
  location: string;
  registerDate: string;
}

interface Props {
  registrations: Registration[];
  onClose: () => void;
}

export default function RegistrationDropdown({ registrations, onClose }: Props) {
  const router = useRouter();

  const handleClick = (activityId: string) => {
    onClose();
    router.push(`/register?activityId=${activityId}`);
  };

  return (
    <div className="absolute right-0 top-full mt-3 w-80 max-h-80 overflow-auto rounded-xl bg-black/90 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/[0.05] backdrop-blur-xl z-50">
      <div className="p-4 text-[#d4af37] font-light text-xs tracking-wider uppercase border-b border-white/[0.05] select-none">
        กิจกรรมที่ลงทะเบียน
      </div>
      {registrations.length === 0 ? (
        <div className="p-6 text-gray-500 text-xs font-light text-center select-none">ไม่มีการลงทะเบียน</div>
      ) : (
        <ul>
          {registrations.map((reg, idx) => (
            <li
              key={idx}
              onClick={() => handleClick(reg.activityId)}
              className="px-4 py-4 hover:bg-white/[0.03] border-b border-white/[0.03] last:border-none cursor-pointer transition-colors duration-200"
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleClick(reg.activityId);
                }
              }}
            >
              <div className="font-light text-sm text-gray-200 mb-2">{reg.activityName}</div>
              <div className="text-xs text-gray-400 space-y-1.5 select-text">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-3.5 w-3.5 text-[#d4af37]/70" />
                  <span className="font-light truncate">{reg.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-3.5 w-3.5 text-gray-500" />
                  <span className="font-light text-[10px] text-gray-500">ลงทะเบียนเมื่อ: {reg.registerDate}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
