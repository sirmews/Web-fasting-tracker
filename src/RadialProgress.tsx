import React from 'react';

interface RadialProgressProps {
  currentHours: number;
  goalHours: number;
  goalOptions: number[];
  onGoalChange: (hours: number) => void;
  onStart: () => void;
  onStop: () => void;
  isFasting: boolean;
  size?: number;
  strokeWidth?: number;
}

export default function RadialProgress({
  currentHours,
  goalHours,
  goalOptions,
  onGoalChange,
  onStart,
  onStop,
  isFasting,
  size = 360,
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

  const handlePreviousGoal = () => {
    const currentIndex = goalOptions.indexOf(goalHours);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : goalOptions.length - 1;
    onGoalChange(goalOptions[previousIndex]);
  };

  const handleNextGoal = () => {
    const currentIndex = goalOptions.indexOf(goalHours);
    const nextIndex = currentIndex < goalOptions.length - 1 ? currentIndex + 1 : 0;
    onGoalChange(goalOptions[nextIndex]);
  };

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
        {/* Progress circle (only show when fasting) */}
        {isFasting && (
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
        )}
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
        gap: '0.75rem',
        width: '100%'
      }}>
        {isFasting ? (
          <>
            {/* Time display when fasting */}
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#000',
              fontFamily: 'monospace',
              lineHeight: 1,
              letterSpacing: '-2px'
            }}>
              {hours}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>

            {/* Goal selector with left/right buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.25rem'
            }}>
              <button
                onClick={handlePreviousGoal}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #666',
                  background: '#fff',
                  color: '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#666';
                }}
              >
                ‹
              </button>

              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#000',
                fontFamily: 'sans-serif',
                minWidth: '60px',
                textAlign: 'center'
              }}>
                {goalHours}h
              </div>

              <button
                onClick={handleNextGoal}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: '2px solid #666',
                  background: '#fff',
                  color: '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#666';
                }}
              >
                ›
              </button>
            </div>

            {/* Stop button */}
            <button
              onClick={onStop}
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '2px solid #000',
                background: '#000',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                padding: 0,
                marginTop: '0.25rem'
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
                width: '20px',
                height: '20px',
                background: '#fff',
                borderRadius: '2px'
              }} />
            </button>
          </>
        ) : (
          <>
            {/* Ready state */}
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '20px', color: '#666', fontWeight: '500' }}>Ready to start</div>
            </div>

            {/* Goal selector with left/right buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '0.75rem'
            }}>
              <button
                onClick={handlePreviousGoal}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid #666',
                  background: '#fff',
                  color: '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#666';
                }}
              >
                ‹
              </button>

              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#000',
                fontFamily: 'sans-serif',
                minWidth: '80px',
                textAlign: 'center'
              }}>
                {goalHours}h
              </div>

              <button
                onClick={handleNextGoal}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: '2px solid #666',
                  background: '#fff',
                  color: '#666',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                  padding: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.borderColor = '#000';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff';
                  e.currentTarget.style.borderColor = '#666';
                }}
              >
                ›
              </button>
            </div>

            {/* Start button with play triangle icon */}
            <button
              onClick={onStart}
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                border: '2px solid #000',
                background: '#000',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                padding: 0,
                paddingLeft: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#000';
              }}
            >
              {/* Play triangle icon */}
              <div style={{
                width: 0,
                height: 0,
                borderLeft: '20px solid #fff',
                borderTop: '12px solid transparent',
                borderBottom: '12px solid transparent'
              }} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
