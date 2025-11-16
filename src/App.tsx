import React, { useEffect, useState } from 'react';
import { saveFast, getFasts, FastingLog, exportCSV, getGoal, setGoal } from './storage';
import RadialProgress from './RadialProgress';

const GOAL_OPTIONS = [16, 18, 20, 24, 32, 48];

export default function App() {
  const [fasts, setFasts] = useState<FastingLog[]>([]);
  const [fasting, setFasting] = useState<boolean>(false);
  const [fastStart, setFastStart] = useState<Date | null>(null);
  const [currentHours, setCurrentHours] = useState<number>(0);
  const [goalHours, setGoalHours] = useState<number>(16);

  useEffect(() => {
    getFasts().then(setFasts);
    getGoal().then(goal => {
      setGoalHours(goal);
    });
  }, []);

  // Update current hours every second when fasting
  useEffect(() => {
    if (!fasting || !fastStart) return;

    const updateElapsed = () => {
      const now = new Date();
      const elapsed = (now.getTime() - fastStart.getTime()) / 3600000; // Convert to hours
      setCurrentHours(elapsed);
    };

    updateElapsed(); // Update immediately
    const interval = setInterval(updateElapsed, 1000); // Update every second

    return () => clearInterval(interval);
  }, [fasting, fastStart]);

  const startFast = () => {
    setFasting(true);
    setFastStart(new Date());
  };

  const endFast = async () => {
    if (fastStart) {
      const endDate = new Date();
      const newLog: FastingLog = {
        start: fastStart.toISOString(),
        end: endDate.toISOString(),
        duration: ((endDate.getTime() - fastStart.getTime()) / 3600000).toFixed(2)
      };
      await saveFast(newLog);
      setFasts(await getFasts());
      setFasting(false);
      setFastStart(null);
    }
  };

  const handleExport = () => {
    exportCSV(fasts);
  };

  const handleGoalChange = async (hours: number) => {
    await setGoal(hours);
    setGoalHours(hours);
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "2rem auto",
      fontFamily: "sans-serif",
      padding: "1rem"
    }}>
      <h1 style={{ margin: '0 0 1rem 0', textAlign: 'center' }}>Fasting Tracker</h1>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.75rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {GOAL_OPTIONS.map(hours => (
          <button
            key={hours}
            onClick={() => handleGoalChange(hours)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              border: goalHours === hours ? '3px solid #000' : '2px solid #ccc',
              background: goalHours === hours ? '#000' : '#fff',
              color: goalHours === hours ? '#fff' : '#000',
              fontSize: '14px',
              fontWeight: goalHours === hours ? 'bold' : 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'sans-serif'
            }}
          >
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{hours}</div>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>hrs</div>
          </button>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        {fasting ? (
          <>
            <RadialProgress currentHours={currentHours} goalHours={goalHours} />
            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <p style={{ color: '#666', fontSize: '14px', margin: '0 0 1rem 0' }}>
                Started: {fastStart?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
              <button
                onClick={endFast}
                style={{
                  padding: '1rem 2rem',
                  background: '#000',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                End Fast
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              border: '16px solid #e0e0e0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <div style={{ fontSize: '18px', color: '#666' }}>Ready to start</div>
              <div style={{ fontSize: '14px', color: '#999', marginTop: '0.5rem' }}>
                Goal: {goalHours}h
              </div>
            </div>
            <button
              onClick={startFast}
              style={{
                padding: '1rem 2rem',
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Start Fast
            </button>
          </div>
        )}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '2rem 0' }} />

      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem'
        }}>
          <h2 style={{ margin: 0 }}>History</h2>
          <button
            onClick={handleExport}
            style={{
              padding: '0.5rem 1rem',
              background: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Export CSV
          </button>
        </div>
        {fasts.length === 0 ? (
          <p style={{ color: '#999', fontStyle: 'italic' }}>No fasting history yet</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {fasts.map((log, idx) => (
              <li
                key={idx}
                style={{
                  padding: '0.75rem',
                  marginBottom: '0.5rem',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  borderLeft: '4px solid #000'
                }}
              >
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {new Date(log.start).toLocaleDateString()} • {new Date(log.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(log.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 'bold', marginTop: '0.25rem' }}>
                  {log.duration} hours
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
