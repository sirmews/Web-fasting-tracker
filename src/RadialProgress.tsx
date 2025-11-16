import React from 'react';

interface RadialProgressProps {
  currentHours: number;
  goalHours: number;
  onStop: () => void;
  size?: number;
  strokeWidth?: number;
}

export default function RadialProgress({
  currentHours,
  goalHours,
  onStop,
  size = 280,
  strokeWidth = 16
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((currentHours / goalHours) * 100, 100);
  const offset = circumference - (progress / 100) * circumference;

  const hours = Math.floor(currentHours);
  const remainingMinutes = (currentHours % 1) * 60;
  const minutes = Math.floor(remainingMinutes);
  const seconds = Math.floor((remainingMinutes % 1) * 60);

  return (
    <div style={{
      position: 'relative',
      width: size,
      height: size
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
      </svg>

      {/* Center content */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{
          fontSize: '40px',
          fontWeight: 'bold',
          color: '#000',
          fontFamily: 'sans-serif',
          lineHeight: 1
        }}>
          {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
        <div style={{
          fontSize: '12px',
          color: '#666',
          fontFamily: 'sans-serif',
          marginBottom: '0.5rem'
        }}>
          of {goalHours}h goal
        </div>

        {/* Stop button with square icon */}
        <button
          onClick={onStop}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            border: '2px solid #000',
            background: '#000',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            padding: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#333';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#000';
          }}
        >
          {/* Square stop icon */}
          <div style={{
            width: '18px',
            height: '18px',
            background: '#fff',
            borderRadius: '2px'
          }} />
        </button>
      </div>
    </div>
  );
}
