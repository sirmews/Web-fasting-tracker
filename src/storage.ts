export type FastingLog = {
  start: string;
  end: string;
  duration: string;
};

export type FastingGoal = {
  hours: number;
};

const DB_KEY = 'fasting_logs';
const GOAL_KEY = 'fasting_goal';

async function saveFast(log: FastingLog): Promise<void> {
  let logs = await getFasts();
  logs.push(log);
  localStorage.setItem(DB_KEY, JSON.stringify(logs));
}

async function getFasts(): Promise<FastingLog[]> {
  return JSON.parse(localStorage.getItem(DB_KEY) ?? '[]');
}

function exportCSV(logs: FastingLog[]) {
  const header = "Start,End,Duration(hours)\n";
  const body = logs.map(l => `${l.start},${l.end},${l.duration}`).join('\n');
  const blob = new Blob([header+body], {type:'text/csv'});
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "fasting_history.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

async function getGoal(): Promise<number> {
  const stored = localStorage.getItem(GOAL_KEY);
  return stored ? JSON.parse(stored).hours : 16; // Default to 16 hours
}

async function setGoal(hours: number): Promise<void> {
  localStorage.setItem(GOAL_KEY, JSON.stringify({ hours }));
}

export { saveFast, getFasts, exportCSV, getGoal, setGoal };
