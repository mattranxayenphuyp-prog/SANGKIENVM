import React from 'react';

export const OfficialEmblem: React.FC<{ size?: number; className?: string }> = ({ size = 42, className = '' }) => {
  return (
    <div 
      className={`relative rounded-full flex items-center justify-center shrink-0 shadow-sm border border-amber-300/40 ${className}`}
      style={{ width: size, height: size, background: 'radial-gradient(circle, #b91c1c 0%, #991b1b 70%, #7f1d1d 100%)' }}
      title="Cộng hòa Xã hội Chủ nghĩa Việt Nam - UBND Xã Văn Môn"
    >
      <svg 
        viewBox="0 0 100 100" 
        className="w-full h-full p-1"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vành lúa vàng */}
        <circle cx="50" cy="50" r="44" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="3 2" opacity="0.85" />
        <circle cx="50" cy="50" r="39" stroke="#f59e0b" strokeWidth="1.5" />
        
        {/* Bánh răng công nghiệp */}
        <path 
          d="M44 68 L56 68 L58 73 L63 72 L64 67 L68 64 L73 66 L75 62 L71 59 L73 54 L78 53 L78 47 L73 46 L71 41 L75 38 L73 34 L68 36 L64 33 L63 28 L58 27 L56 32 L44 32 L42 27 L37 28 L36 33 L32 36 L27 34 L25 38 L29 41 L27 46 L22 47 L22 53 L27 54 L29 59 L25 62 L27 66 L32 64 L36 67 L37 72 L42 73 Z" 
          fill="#d97706" 
          opacity="0.3"
        />

        {/* Ngôi sao vàng 5 cánh trung tâm */}
        <polygon 
          points="50,22 58.5,39.5 78,41.5 63.5,55 67.5,74.5 50,64.5 32.5,74.5 36.5,55 22,41.5 41.5,39.5" 
          fill="#fef08a" 
          stroke="#f59e0b" 
          strokeWidth="1.2"
        />
        
        {/* Dải băng đỏ chữ vàng */}
        <path d="M26 80 Q50 86 74 80 L72 87 Q50 93 28 87 Z" fill="#b91c1c" stroke="#fbbf24" strokeWidth="1" />
      </svg>
    </div>
  );
};
