import React, { useEffect, useState } from 'react';
import { saveFast, getFasts, FastingLog, exportCSV } from './storage';

export default function App() {
  const [fasts, setFasts] = useState<FastingLog[]>([]);
  const [fasting, setFasting] = useState<boolean>(false);
  const [fastStart, setFastStart] = useState<Date | null>(null);

  useEffect(() => {
    getFasts().then(setFasts);
  }, []);

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

  return (
    <div style={{maxWidth: 500, margin: "2rem auto", fontFamily:"sans-serif"}}>
      <h1>Fasting Tracker</h1>
      {fasting ?
        <div>
          <p>Fasting since: {fastStart?.toLocaleString()}</p>
          <button onClick={endFast}>End Fast</button>
        </div>
        :
        <button onClick={startFast}>Start Fast</button>
      }
      <hr />
      <h2>History</h2>
      <button onClick={handleExport} style={{marginBottom:8}}>Export as CSV</button>
      <ul>
        {fasts.map((log, idx) => (
          <li key={idx}>
            {new Date(log.start).toLocaleString()} — {new Date(log.end).toLocaleString()}
            ({log.duration} hrs)
          </li>
        ))}
      </ul>
    </div>
  );
}
