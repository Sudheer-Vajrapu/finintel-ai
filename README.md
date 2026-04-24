# FinIntel AI — Frontend

Financial document intelligence dashboard built with React, TypeScript, Vite, Tailwind CSS, TanStack Query, and React Router.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# 3. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

> The app runs fully without a backend — paste CSV data and click Analyze to see the local analytics engine in action.

---

## Project Structure

```
src/
├── app/
│   ├── providers/
│   │   └── AuthProvider.tsx      # JWT auth context + localStorage rehydration
│   └── router/
│       └── AppRouter.tsx         # Route definitions (ProtectedRoute ready to enable)
│
├── features/
│   ├── auth/
│   │   ├── components/           # LoginPage, SignupPage
│   │   └── hooks/                # useLogin, useSignup (React Query mutations)
│   ├── upload/
│   │   ├── components/           # UploadSection, DropZone, FilePillList
│   │   └── hooks/                # useUpload (FormData POST mutation)
│   ├── dashboard/
│   │   ├── components/           # DashboardPage (main orchestrator)
│   │   └── hooks/                # useDashboard (metrics/projects/employees/risks queries)
│   ├── projects/
│   │   └── components/           # ProjectsList, ProjectCard
│   ├── employees/
│   │   └── components/           # EmployeesList, EmployeeCard
│   ├── risks/
│   │   └── components/           # RisksPanel, RiskAlert, RecommendationCard
│   └── qa/
│       ├── components/           # QAPanel, AnswerDisplay
│       └── hooks/                # useAsk, getLocalAnswer
│
└── shared/
    ├── api/
    │   ├── client.ts             # apiFetch() wrapper — JWT, errors, JSON
    │   └── types.ts              # All TypeScript interfaces
    ├── components/
    │   ├── layout/               # AppLayout, Topbar
    │   └── ui/                   # Button, Card, Badge, Input, Tabs, Loader,
    │                             # ProgressBar, MetricCard, EmptyState
    └── utils/
        └── index.ts              # formatCurrency, parseCSV, computeAnalysis, ...
```

---

## API Layer

All requests go through `src/shared/api/client.ts`:

```typescript
import { api } from '@/shared/api/client'

// GET with auto JWT header
const projects = await api.get<Project[]>('/projects?range=3m')

// POST JSON
const result = await api.post<AskResponse>('/ask', { query: 'Which project is risky?' })

// File upload (FormData)
const upload = await api.upload<UploadResponse>('/upload', formData)
```

**Error types exported:**
- `ApiError(status, message, data)` — non-2xx HTTP responses
- `NetworkError` — fetch failed entirely

---

## FastAPI Backend Integration

### Expected endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/auth/login` | Returns `{ access_token, token_type, user }` |
| `POST` | `/auth/signup` | Returns `{ access_token, token_type, user }` |
| `POST` | `/upload` | `multipart/form-data` with `files[]` field |
| `GET` | `/metrics?range=all` | Returns `MetricsResponse` |
| `GET` | `/projects?range=all` | Returns `Project[]` |
| `GET` | `/employees` | Returns `Employee[]` |
| `GET` | `/risks` | Returns `{ risks, recommendations }` |
| `POST` | `/ask` | Body: `{ query, context? }` → `{ answer, sources? }` |

All types are in `src/shared/api/types.ts`.

### CORS (FastAPI)

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Enabling Auth Protection

Auth scaffolding is fully in place. To enforce JWT on all routes:

1. Open `src/app/router/AppRouter.tsx`
2. Uncomment the `ProtectedRoute` component (3 lines)
3. Wrap the main `<Route element={<AppLayout />}>` with `<ProtectedRoute>`

```tsx
// Before (open access):
<Route element={<AppLayout />}>

// After (protected):
<Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
```

---

## State Management

| State type | Solution |
|-----------|---------|
| Server data (metrics, projects, etc.) | TanStack Query |
| Auth (JWT token, user) | Context API + localStorage |
| UI state (tabs, time range, upload) | Local `useState` |

Redux and MobX are intentionally excluded.

---

## Design System

Fonts: **DM Sans** (body) + **DM Serif Display** (headings) + **DM Mono** (code/CSV)

Custom Tailwind color tokens:
- `brand-*` — neutral grays and surfaces
- `success-*` — green (healthy projects)
- `danger-*` — red (risk alerts)
- `warning-*` — amber (cautions)
- `info-*` — blue (recommendations, Q&A)

---

## Scripts

```bash
npm run dev       # Dev server on :5173
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint check
```
