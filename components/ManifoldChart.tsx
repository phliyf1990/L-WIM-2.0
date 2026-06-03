
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ReferenceLine 
} from 'recharts';

interface ManifoldChartProps {
  data: { angle: number; loss: number }[];
  currentAngle: number;
  optimalAngle: number;
}

export const ManifoldChart: React.FC<ManifoldChartProps> = ({ data, currentAngle, optimalAngle }) => {
  return (
    <div className="w-full h-40 bg-stone-900/30 rounded-2xl p-4 border border-stone-800/50">
      <h3 className="text-[9px] font-black uppercase tracking-widest text-stone-500 mb-2 flex justify-between">
        <span>Manifold Trajectory (ΔV Curve)</span>
        <span className="text-emerald-500/80">Search Path</span>
      </h3>
      <div className="w-full h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#292524" vertical={false} />
            <XAxis dataKey="angle" hide />
            <YAxis hide domain={[0, 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1c1917', border: '1px solid #444', fontSize: '10px' }}
              itemStyle={{ color: '#fbbf24' }}
              labelStyle={{ color: '#78716c' }}
            />
            <ReferenceLine x={optimalAngle} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'top', value: 'θ*', fill: '#10b981', fontSize: 10 }} />
            <ReferenceLine x={currentAngle} stroke="#fbbf24" strokeWidth={2} />
            <Line 
              type="monotone" 
              dataKey="loss" 
              stroke="#444" 
              dot={false} 
              strokeWidth={1.5}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
