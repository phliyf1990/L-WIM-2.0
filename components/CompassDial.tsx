
import React from 'react';
import { Compass } from 'lucide-react';

interface CompassDialProps {
  value: number;
  onChange: (val: number) => void;
  optimalValue: number;
}

export const CompassDial: React.FC<CompassDialProps> = ({ value, onChange, optimalValue }) => {
  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      {/* Outer Dial */}
      <div className="absolute inset-0 rounded-full border-4 border-stone-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]"></div>
      
      {/* Tick Marks */}
      {[...Array(36)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-1 h-2 bg-stone-700" 
          style={{ 
            transform: `rotate(${i * 10}deg) translateY(-88px)` 
          }}
        ></div>
      ))}

      {/* Optimal Indicator */}
      <div 
        className="absolute w-2 h-4 bg-emerald-500 rounded-full blur-[2px]"
        style={{ 
          transform: `rotate(${optimalValue}deg) translateY(-88px)`,
          transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      ></div>

      {/* Dial Input */}
      <input
        type="range"
        min="0"
        max="180"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />

      {/* Current Pointer */}
      <div 
        className="absolute w-1 h-24 bg-gradient-to-t from-transparent to-amber-500 origin-bottom"
        style={{ 
          transform: `rotate(${value}deg) translateY(-50%)`,
          bottom: '50%',
          transition: 'transform 0.1s linear'
        }}
      ></div>

      <div className="text-center z-0">
        <Compass className="w-8 h-8 text-stone-600 mx-auto mb-1" />
        <span className="text-xl font-mono text-amber-500">{value}°</span>
        <div className="text-[10px] uppercase text-stone-500 mt-1">Goniometric Angle</div>
      </div>
    </div>
  );
};
