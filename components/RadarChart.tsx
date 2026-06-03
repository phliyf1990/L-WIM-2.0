
import React from 'react';
import { 
  Radar, RadarChart as ReRadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend
} from 'recharts';
import { StyleVector } from '../types';

interface RadarChartProps {
  targetData: StyleVector;
  woodData?: StyleVector;
  anchorData?: StyleVector;
}

export const RadarChart: React.FC<RadarChartProps> = ({ targetData, woodData, anchorData }) => {
  const chartData = [
    { subject: 'Variety', target: targetData.variety * 100, current: (woodData?.variety || 0) * 100, anchor: (anchorData?.variety || 0) * 100 },
    { subject: 'Splendor', target: targetData.gorgeousness * 100, current: (woodData?.gorgeousness || 0) * 100, anchor: (anchorData?.gorgeousness || 0) * 100 },
    { subject: 'Dynamism', target: targetData.dynamism * 100, current: (woodData?.dynamism || 0) * 100, anchor: (anchorData?.dynamism || 0) * 100 },
    { subject: 'Intensity', target: targetData.intensity * 100, current: (woodData?.intensity || 0) * 100, anchor: (anchorData?.intensity || 0) * 100 },
    { subject: 'Playfulness', target: targetData.interest * 100, current: (woodData?.interest || 0) * 100, anchor: (anchorData?.interest || 0) * 100 },
  ];

  return (
    <div className="w-full h-80 bg-stone-900/50 rounded-2xl p-6 border border-stone-800 shadow-inner flex flex-col">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 mb-4 flex justify-between">
        <span>Semantic Space Alignment</span>
        <span className="text-amber-500/80">ΔV Visualization</span>
      </h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <ReRadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="#292524" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#78716c', fontSize: 11, fontWeight: 700 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar
              name="Target F'"
              dataKey="target"
              stroke="#fbbf24"
              strokeWidth={2}
              fill="#fbbf24"
              fillOpacity={0.2}
            />
            {anchorData && (
              <Radar
                name="Anchor Ref"
                dataKey="anchor"
                stroke="#6366f1"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="none"
              />
            )}
            {woodData && (
              <Radar
                name="Current θ"
                dataKey="current"
                stroke="#10b981"
                strokeWidth={2}
                fill="#10b981"
                fillOpacity={0.2}
              />
            )}
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '9px', fontWeight: 600, textTransform: 'uppercase' }} />
          </ReRadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
