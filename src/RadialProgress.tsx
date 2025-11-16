import React from 'react';
import { colors } from './colors';

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

  // Calculate remaining time (countdown)
  const remainingHours = Math.max(0, goalHours - currentHours);
  const hours = Math.floor(remainingHours);
  const remainingMinutes = (remainingHours % 1) * 60;
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
          stroke={colors.progressBackground}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle (only show when fasting) */}
        {isFasting && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={colors.progressActive}
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
              color: colors.textPrimary,
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
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  color: colors.iconSecondary,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '32px', height: '32px', transform: 'rotate(180deg)' }}>
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                </svg>
              </button>

              <div style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: colors.textPrimary,
                fontFamily: 'sans-serif',
                minWidth: '60px',
                textAlign: 'center'
              }}>
                {goalHours}h
              </div>

              <button
                onClick={handleNextGoal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  color: colors.iconSecondary,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '32px', height: '32px' }}>
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Stop button */}
            <button
              onClick={onStop}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                marginTop: '0.25rem',
                color: colors.iconPrimary,
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {/* Stop icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '64px', height: '64px' }}>
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm6-2.438c0-.724.588-1.312 1.313-1.312h4.874c.725 0 1.313.588 1.313 1.313v4.874c0 .725-.588 1.313-1.313 1.313H9.564a1.312 1.312 0 0 1-1.313-1.313V9.564Z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        ) : (
          <>
            {/* Ready state */}
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <div style={{ fontSize: '20px', color: colors.textSecondary, fontWeight: '500' }}>Ready to start</div>
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
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  color: colors.iconSecondary,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '36px', height: '36px', transform: 'rotate(180deg)' }}>
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                </svg>
              </button>

              <div style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: colors.textPrimary,
                fontFamily: 'sans-serif',
                minWidth: '80px',
                textAlign: 'center'
              }}>
                {goalHours}h
              </div>

              <button
                onClick={handleNextGoal}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 0,
                  color: colors.iconSecondary,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '36px', height: '36px' }}>
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Start button with play icon */}
            <button
              onClick={onStart}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
                color: colors.iconPrimary,
                transition: 'opacity 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.7';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              {/* Play icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" style={{ width: '72px', height: '72px' }}>
                <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clipRule="evenodd" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
