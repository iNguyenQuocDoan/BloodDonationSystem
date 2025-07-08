// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import DonateMode from "./DonateMode";
// import ReceiveMode from "./ReceiveMode";

// export default function BloodCompatibilityDiagram() {
//   const [showMode, setShowMode] = useState("donate");

//   return (
//     <div className="w-full max-w-6xl mx-auto p-6">
//       {/* Header với gradient background */}
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="relative bg-gradient-to-r from-red-50 via-pink-50 to-blue-50 rounded-2xl p-8 mb-8 shadow-lg border border-gray-100"
//       >
//         {/* Decorative elements */}
//         <div className="absolute top-4 left-4 w-12 h-12 bg-red-100 rounded-full opacity-60"></div>
//         <div className="absolute bottom-4 right-4 w-8 h-8 bg-blue-100 rounded-full opacity-60"></div>
//         <div className="absolute top-1/2 left-8 w-6 h-6 bg-pink-100 rounded-full opacity-40"></div>
        
//         <div className="relative z-10 text-center">
//           <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
//             🩸 Sơ đồ tương thích nhóm máu
//           </h2>
//           <p className="text-gray-600 text-base md:text-lg mb-6 max-w-3xl mx-auto leading-relaxed">
//             Khám phá mối quan hệ tương thích giữa các nhóm máu ABO và yếu tố Rh. 
//             Chọn chế độ và nhóm máu để xem chi tiết tương thích hiến máu.
//           </p>

//           {/* Mode Toggle Buttons */}
//           <div className="flex justify-center gap-4">
//             <motion.button
//               onClick={() => setShowMode("donate")}
//               className={`group relative px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
//                 showMode === "donate"
//                   ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl scale-105"
//                   : "bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200"
//               }`}
//               whileHover={{ scale: showMode === "donate" ? 1.05 : 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <div className="flex items-center gap-3">
//                 <span className="text-xl">🩸</span>
//                 <div className="text-left">
//                   <div className="font-bold">Chế độ hiến máu</div>
//                   <div className="text-xs opacity-75">Xem ai có thể nhận</div>
//                 </div>
//               </div>
//               {showMode === "donate" && (
//                 <motion.div 
//                   className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 rounded-xl -z-10"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               )}
//             </motion.button>

//             <motion.button
//               onClick={() => setShowMode("receive")}
//               className={`group relative px-8 py-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
//                 showMode === "receive"
//                   ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-xl scale-105"
//                   : "bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200"
//               }`}
//               whileHover={{ scale: showMode === "receive" ? 1.05 : 1.02 }}
//               whileTap={{ scale: 0.98 }}
//             >
//               <div className="flex items-center gap-3">
//                 <span className="text-xl">🫴</span>
//                 <div className="text-left">
//                   <div className="font-bold">Chế độ nhận máu</div>
//                   <div className="text-xs opacity-75">Xem ai có thể cho</div>
//                 </div>
//               </div>
//               {showMode === "receive" && (
//                 <motion.div 
//                   className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl -z-10"
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ duration: 0.3 }}
//                 />
//               )}
//             </motion.button>
//           </div>
//         </div>
//       </motion.div>

//       {/* Main Diagram */}
//       <motion.div
//         key={showMode}
//         initial={{ opacity: 0, x: showMode === "donate" ? -20 : 20 }}
//         animate={{ opacity: 1, x: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
//       >
//         {showMode === "donate" ? <DonateMode /> : <ReceiveMode />}
//       </motion.div>

//       {/* Enhanced Legend */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.3 }}
//         className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200"
//       >
//         <h3 className="text-center text-lg font-semibold text-gray-800 mb-4">
//           📋 Chú giải
//         </h3>
//         <div className="flex flex-wrap justify-center gap-6 text-sm">
//           <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
//             <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-red-600 rounded-md border-2 border-red-300 shadow-sm"></div>
//             <span className="font-medium text-gray-700">Rh+ (Dương tính)</span>
//           </div>
//           <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
//             <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md border-2 border-blue-300 shadow-sm"></div>
//             <span className="font-medium text-gray-700">Rh- (Âm tính)</span>
//           </div>
//           <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg shadow-sm">
//             <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-md border-2 border-yellow-300 shadow-sm"></div>
//             <span className="font-medium text-gray-700">Tương thích</span>
//           </div>
//         </div>
        
//         {/* Quick facts */}
//         <div className="mt-6 grid md:grid-cols-2 gap-4 text-sm">
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//             <h4 className="font-semibold text-red-800 mb-2">💡 Hiến máu toàn cầu</h4>
//             <p className="text-red-700">Nhóm O- có thể hiến cho tất cả các nhóm máu khác</p>
//           </div>
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <h4 className="font-semibold text-blue-800 mb-2">💡 Nhận máu toàn cầu</h4>
//             <p className="text-blue-700">Nhóm AB+ có thể nhận máu từ tất cả các nhóm máu</p>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// }
