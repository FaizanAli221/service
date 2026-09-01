# Apex Auto Care — Full-Stack Serverless Platform

Zero-config full-stack web application for **Apex Auto Care**, featuring:
- High-converting responsive landing page built with Tailwind CSS & Lucide icons.
- Serverless API architecture running natively on Vercel Functions.
- Live service catalog & dynamic package booking with tracking codes (`PKG-2026-XXXX`).
- Real-time instant cost estimator with vehicle multiplier & sales tax calculation.
- Server-side payload validation with Zod and clean CORS handling.

---

## Project Structure

```
service/
├── api/
│   ├── health.js                 # GET  /api/health (root health check)
│   ├── services.js               # GET  /api/services (services catalog)
│   ├── appointments.js           # POST /api/appointments (general appointment booking)
│   ├── estimate-cost.js          # POST /api/estimate-cost (instant cost calculation)
│   ├── packages.js               # GET  /api/packages (packages catalog)
│   └── packages/
│       ├── [id].js               # GET  /api/packages/:id (single package query)
│       ├── book.js               # POST /api/packages/book (package booking with tracking ID)
│       └── health.js             # GET  /api/packages/health (packages health probe)
├── lib/
│   ├── cors.js                   # Unified CORS handling
│   ├── data.js                   # Service catalog & pricing constants
│   ├── validators.js             # Request validation helpers
│   ├── data/
│   │   ├── packages.js           # Packages catalog & feature matrix
│   │   └── bookingsStore.js      # Package bookings in-memory store
│   ├── validation/
│   │   └── bookingSchema.js      # Zod schema for package booking payload
│   └── utils/
│       ├── booking.js            # Reference generator, phone formatter, pricing math
│       └── cors.js               # CORS helper alias
├── index.html                    # Responsive frontend connecting to all APIs
├── vercel.json                   # Vercel routing & headers configuration
├── package.json                  # Dependencies & npm scripts
├── test-api.js                   # Automated API test suite
└── README.md                     # Documentation & deployment guide
```

---

## Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Test Suite
Verify all backend API handlers:
```bash
npm test
```

### 3. Run Locally with Vercel CLI
```bash
npm run dev
# or: npx vercel dev
```
Open your browser at `http://localhost:3000`.

---

## Deploy to Vercel

You can deploy this full-stack application to Vercel in 2 simple ways:

### Option A: Via Vercel CLI (Recommended)
1. Install Vercel CLI globally if you haven't already:
   ```bash
   npm i -g vercel
   ```
2. In the `service` directory, run:
   ```bash
   vercel
   ```
   Follow the prompts to link your Vercel account and project.
3. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option B: Via GitHub & Vercel Dashboard
1. Push this folder to a GitHub repository.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your repository.
4. Click **Deploy** (No extra build settings or environment variables needed!).

---

## API Endpoints Reference

### 1. System Health
- **`GET /api/health`** — Uptime check probe.
- **`GET /api/packages/health`** — Packages API probe.

### 2. Services
- **`GET /api/services`** — Returns the full service catalog with categories, turnaround times, and starting prices.

### 3. Service Packages
- **`GET /api/packages`** — Returns bundled packages with included features and discounted rates.
- **`GET /api/packages/:id`** — Returns single package details.
- **`POST /api/packages/book`** — Books a service package. Returns 201 Created with tracking reference (e.g., `PKG-2026-4F9A`) and itemized tax/total.

### 4. Cost Estimator
- **`POST /api/estimate-cost`** — Computes itemized parts, labor, multiplier, tax, and total.
  ```json
  {
    "vehicleType": "suv",
    "serviceIds": ["oil", "brakes"]
  }
  ```

### 5. Appointments
- **`POST /api/appointments`** — General appointment request. Returns booking confirmation (`APX-XXXX`).
