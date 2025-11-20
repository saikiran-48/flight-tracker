# Flight Tracker (React + MUI)

A simple, responsive Flight Tracker built with React and Material UI. It queries the Aviationstack `flights` endpoint and shows schedule, status, and basic live/meta info for a single flight (search by IATA like `AI188` or numeric flight number).

---

## Features

* Search flight by flight number (IATA or numeric)
* Shows departure and arrival scheduled/estimated/actual times
* Displays terminal, gate, baggage, delay and flight meta
* Responsive layout using MUI `Box` and `Stack`
* Simple, single-file component `FlightTracker.tsx` that you can drop into a React app

---

## Tech stack

* React (TypeScript friendly component)
* Material UI (MUI v5)
* Fetch API for Aviationstack requests

---

## Files

* `src/FlightTracker.tsx` — main component (search + card display)
* (Optional) `sampleFlights.json` — use if you want to mock API responses locally
* airplane image used in the UI: `/mnt/data/445e5ed0-76e4-4e5e-a071-c1714b96228d.png`

> The image path above references the uploaded asset included with the project. If your dev server serves static assets from a different location, update the `PLANE_IMG` constant in `FlightTracker.tsx`.

---

## Getting started (local)

1. Clone the repo

```bash
git clone <your-repo-url>
cd <repo-folder>
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Add environment variable for the Aviationstack key

Create a `.env` file in project root and add:

```
REACT_APP_AVIATIONSTACK_KEY=your_api_key_here
```

> The component in the repo currently uses a hard-coded `API_KEY` constant. For production, replace it with `process.env.REACT_APP_AVIATIONSTACK_KEY`.

4. Start the dev server

```bash
npm run dev
# or
npm start
# or for CRA
npm run start
```

Open `http://localhost:3000` (or the URL printed by your dev server). Navigate to the page where `FlightTracker` is mounted.

---

## Usage

* Enter a flight number (e.g. `AI188` or `188`) and click Track.
* The component will call Aviationstack and present the most relevant result (prefers active/scheduled flights).
* If you want to mock results, import `sampleFlights.json` and set `setFlight(sample.data[0])` in `handleSearch`.

---

## Deployment

You can deploy to Vercel or Netlify. Example (Vercel):

1. Push your repo to GitHub
2. Import project at [https://vercel.com/import](https://vercel.com/import)
3. Set environment variable `REACT_APP_AVIATIONSTACK_KEY` in Vercel dashboard
4. Deploy

---

## Tests

No unit tests are included in this draft. Recommended tests:

* Unit tests for `formatTime` and helper utilities
* Integration test for `handleSearch` using mocked `fetch` responses (Jest + Testing Library)

---
