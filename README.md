# Fasting Tracker PWA

A Progressive Web App for tracking fasting periods with offline support.

## Features

- Track fasting start and end times
- View fasting history with duration in hours
- Export data to CSV
- Works offline via service worker
- Installable as a PWA on mobile and desktop

## Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. Start development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

3. Visit the local URL shown in terminal (typically `http://localhost:5173`)

4. To install as PWA:
   - On mobile: Use "Add to Home Screen" in your browser
   - On desktop: Look for install icon in address bar

## Build for Production

```bash
npm run build
# or
pnpm build
# or
yarn build
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Service Worker for offline support
- LocalStorage for data persistence

## Note

The app requires a 192x192 PNG icon at `public/icon-192.png` for full PWA functionality. Add your own logo image there.
