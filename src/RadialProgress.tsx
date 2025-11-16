import React from 'react';

interface RadialProgressProps {
  currentHours: number;
  goalHours: number;
  size?: number;
  strokeWidth?: number;
}

export default function RadialProgress({
  currentHours,
  goalHours,
  size = 280,
  strokeWidth = 16
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((currentHours / goalHours) * 100, 100);
  const offset = circumference - (progress / 100) * circumference;

  const hours = Math.floor(currentHours);
  const minutes = Math.floor((currentHours % 1) * 60);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#000000"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.5s ease'
          }}
        />
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: 'rotate(90deg)',
            transformOrigin: 'center',
            fontSize: '48px',
            fontWeight: 'bold',
            fill: '#000000',
            fontFamily: 'sans-serif'
          }}
        >
          {hours}:{minutes.toString().padStart(2, '0')}
        </text>
        <text
          x={size / 2}
          y={size / 2 + 35}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            transform: 'rotate(90deg)',
            transformOrigin: 'center',
            fontSize: '14px',
            fill: '#666666',
            fontFamily: 'sans-serif'
          }}
        >
          of {goalHours}h goal
        </text>
      </svg>
      <div style={{
        fontSize: '18px',
        color: '#333',
        fontFamily: 'sans-serif',
        textAlign: 'center'
      }}>
        <div style={{ fontWeight: 'bold' }}>
          {progress.toFixed(0)}% Complete
        </div>
        {progress >= 100 && (
          <div style={{ color: '#000', marginTop: '0.5rem', fontWeight: 'bold' }}>
            Goal Achieved! 🎉
          </div>
        )}
      </div>
    </div>
  );
}
