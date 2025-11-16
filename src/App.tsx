import React, { useEffect, useState } from 'react';
import { saveFast, getFasts, FastingLog, exportCSV, getGoal, setGoal, saveActiveFast, getActiveFast, clearActiveFast } from './storage';
import RadialProgress from './RadialProgress';

const GOAL_OPTIONS = [16, 18, 20, 24, 32, 48];

export default function App() {
  const [fasts, setFasts] = useState<FastingLog[]>([]);
  const [fasting, setFasting] = useState<boolean>(false);
  const [fastStart, setFastStart] = useState<Date | null>(null);
  const [currentHours, setCurrentHours] = useState<number>(0);
  const [goalHours, setGoalHours] = useState<number>(16);

  useEffect(() => {
    // Load initial data
    const loadData = async () => {
      const [fastsData, goalData, activeFastData] = await Promise.all([
        getFasts(),
        getGoal(),
        getActiveFast()
      ]);

      setFasts(fastsData);
      setGoalHours(goalData);

      // Restore active fast if it exists
      if (activeFastData) {
        const startTime = new Date(activeFastData.startTime);
        setFastStart(startTime);
        setFasting(true);
        setGoalHours(activeFastData.goalHours);
      }
    };

    loadData();
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

  const startFast = async () => {
    const startTime = new Date();
    setFasting(true);
    setFastStart(startTime);
    await saveActiveFast(startTime, goalHours);
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
      await clearActiveFast();
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

    // Update active fast if currently fasting
    if (fasting && fastStart) {
      await saveActiveFast(fastStart, hours);
    }
  };

  return (
    <div style={{
      maxWidth: 500,
      margin: "2rem auto",
      fontFamily: "sans-serif",
      padding: "1rem"
    }}>
      <h1 style={{ margin: '0 0 2rem 0', textAlign: 'center' }}>Fasting Tracker</h1>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <RadialProgress
          currentHours={currentHours}
          goalHours={goalHours}
          goalOptions={GOAL_OPTIONS}
          onGoalChange={handleGoalChange}
          onStart={startFast}
          onStop={endFast}
          isFasting={fasting}
        />
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
