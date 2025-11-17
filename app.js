// Storage keys
const DB_KEY = 'fasting_logs';
const GOAL_KEY = 'fasting_goal';
const ACTIVE_FAST_KEY = 'active_fast';

// Goal options
const GOAL_OPTIONS = [16, 18, 20, 24, 32, 48];

// Application state
let fasts = [];
let fasting = false;
let fastStart = null;
let currentHours = 0;
let goalHours = 16;
let updateInterval = null;

// DOM Elements
const fastingState = document.getElementById('fastingState');
const readyState = document.getElementById('readyState');
const timerDisplay = document.getElementById('timerDisplay');
const goalDisplayFasting = document.getElementById('goalDisplayFasting');
const goalDisplayReady = document.getElementById('goalDisplayReady');
const progressCircle = document.getElementById('progressCircle');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const prevGoalFasting = document.getElementById('prevGoalFasting');
const nextGoalFasting = document.getElementById('nextGoalFasting');
const prevGoalReady = document.getElementById('prevGoalReady');
const nextGoalReady = document.getElementById('nextGoalReady');
const exportBtn = document.getElementById('exportBtn');
const historyList = document.getElementById('historyList');

// Storage functions
function saveFast(log) {
  fasts.push(log);
  localStorage.setItem(DB_KEY, JSON.stringify(fasts));
}

function getFasts() {
  const stored = localStorage.getItem(DB_KEY);
  return stored ? JSON.parse(stored) : [];
}

function getGoal() {
  const stored = localStorage.getItem(GOAL_KEY);
  return stored ? JSON.parse(stored).hours : 16;
}

function setGoal(hours) {
  localStorage.setItem(GOAL_KEY, JSON.stringify({ hours }));
}

function saveActiveFast(startTime, hours) {
  const activeFast = {
    startTime: startTime.toISOString(),
    goalHours: hours
  };
  localStorage.setItem(ACTIVE_FAST_KEY, JSON.stringify(activeFast));
}

function getActiveFast() {
  const stored = localStorage.getItem(ACTIVE_FAST_KEY);
  return stored ? JSON.parse(stored) : null;
}

function clearActiveFast() {
  localStorage.removeItem(ACTIVE_FAST_KEY);
}

function exportCSV() {
  const header = "Start,End,Duration(hours)\n";
  const body = fasts.map(l => `${l.start},${l.end},${l.duration}`).join('\n');
  const blob = new Blob([header + body], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = "fasting_history.csv";
  a.click();
  window.URL.revokeObjectURL(url);
}

// UI update functions
function updateProgressCircle() {
  const size = 360;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((currentHours / goalHours) * 100, 100);
  const offset = circumference - (progress / 100) * circumference;

  progressCircle.style.strokeDasharray = circumference;
  progressCircle.style.strokeDashoffset = offset;

  // Show/hide progress circle
  if (fasting) {
    progressCircle.style.display = 'block';
  } else {
    progressCircle.style.display = 'none';
  }
}

function updateTimerDisplay() {
  const remainingHours = Math.max(0, goalHours - currentHours);
  const hours = Math.floor(remainingHours);
  const remainingMinutes = (remainingHours % 1) * 60;
  const minutes = Math.floor(remainingMinutes);
  const seconds = Math.floor((remainingMinutes % 1) * 60);

  timerDisplay.textContent =
    `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updateGoalDisplay() {
  goalDisplayFasting.textContent = `${goalHours}h`;
  goalDisplayReady.textContent = `${goalHours}h`;
}

function updateUI() {
  if (fasting) {
    fastingState.style.display = 'flex';
    readyState.style.display = 'none';
    updateTimerDisplay();
  } else {
    fastingState.style.display = 'none';
    readyState.style.display = 'flex';
  }
  updateProgressCircle();
  updateGoalDisplay();
}

function updateElapsed() {
  if (!fasting || !fastStart) return;

  const now = new Date();
  const elapsed = (now.getTime() - fastStart.getTime()) / 3600000; // Convert to hours
  currentHours = elapsed;
  updateUI();
}

function renderHistory() {
  if (fasts.length === 0) {
    historyList.innerHTML = '<li class="empty-state">No fasting history yet</li>';
    return;
  }

  historyList.innerHTML = fasts.map((log, idx) => {
    const startDate = new Date(log.start);
    const endDate = new Date(log.end);
    const dateStr = startDate.toLocaleDateString();
    const startTime = startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `
      <li class="history-item">
        <div class="history-date">
          ${dateStr} • ${startTime} — ${endTime}
        </div>
        <div class="history-duration">
          ${log.duration} hours
        </div>
      </li>
    `;
  }).join('');
}

// Event handlers
function handleStartFast() {
  const startTime = new Date();
  fasting = true;
  fastStart = startTime;
  saveActiveFast(startTime, goalHours);

  // Start update interval
  updateElapsed();
  updateInterval = setInterval(updateElapsed, 1000);
  updateUI();
}

function handleStopFast() {
  if (!fastStart) return;

  const endDate = new Date();
  const duration = ((endDate.getTime() - fastStart.getTime()) / 3600000).toFixed(2);
  const newLog = {
    start: fastStart.toISOString(),
    end: endDate.toISOString(),
    duration: duration
  };

  saveFast(newLog);
  clearActiveFast();
  fasts = getFasts();
  fasting = false;
  fastStart = null;
  currentHours = 0;

  // Clear update interval
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = null;
  }

  updateUI();
  renderHistory();
}

function handleGoalChange(hours) {
  goalHours = hours;
  setGoal(hours);

  // Update active fast if currently fasting
  if (fasting && fastStart) {
    saveActiveFast(fastStart, hours);
  }

  updateUI();
}

function handlePreviousGoal() {
  const currentIndex = GOAL_OPTIONS.indexOf(goalHours);
  const previousIndex = currentIndex > 0 ? currentIndex - 1 : GOAL_OPTIONS.length - 1;
  handleGoalChange(GOAL_OPTIONS[previousIndex]);
}

function handleNextGoal() {
  const currentIndex = GOAL_OPTIONS.indexOf(goalHours);
  const nextIndex = currentIndex < GOAL_OPTIONS.length - 1 ? currentIndex + 1 : 0;
  handleGoalChange(GOAL_OPTIONS[nextIndex]);
}

// Initialize app
function init() {
  // Load data from storage
  fasts = getFasts();
  goalHours = getGoal();
  const activeFast = getActiveFast();

  // Restore active fast if it exists
  if (activeFast) {
    const startTime = new Date(activeFast.startTime);
    fastStart = startTime;
    fasting = true;
    goalHours = activeFast.goalHours;

    // Start update interval
    updateElapsed();
    updateInterval = setInterval(updateElapsed, 1000);
  }

  // Attach event listeners
  startBtn.addEventListener('click', handleStartFast);
  stopBtn.addEventListener('click', handleStopFast);
  prevGoalFasting.addEventListener('click', handlePreviousGoal);
  nextGoalFasting.addEventListener('click', handleNextGoal);
  prevGoalReady.addEventListener('click', handlePreviousGoal);
  nextGoalReady.addEventListener('click', handleNextGoal);
  exportBtn.addEventListener('click', exportCSV);

  // Initial render
  updateUI();
  renderHistory();
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
