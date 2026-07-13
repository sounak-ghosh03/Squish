# Squish 🗜️

> Privacy-first file compression — browser-side when possible, server-side when needed.

Supports **PDF, JPEG, PNG, DOCX**. Files under 10 MB are compressed entirely in the browser — they never leave your device. DOCX and files over 10 MB are sent to the server, compressed, and **deleted immediately**.

---

## Project Structure

```
squish/
├── frontend/   # React + Vite + TypeScript + Tailwind CSS v4
└── backend/    # FastAPI compression API (Python 3.11)
```

---

## Frontend — Quick Start

```bash
cd frontend
cp .env.example .env          # set VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Backend — Quick Start

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env          # set ALLOWED_ORIGINS if needed

uvicorn main:app --reload
```

API runs at [http://localhost:8000](http://localhost:8000).  
Docs at [http://localhost:8000/docs](http://localhost:8000/docs).

---

## Environment Variables

### Frontend (`frontend/.env`)
| Variable | Example | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | FastAPI server URL (no trailing slash) |

### Backend (`backend/.env`)
| Variable | Example | Description |
|---|---|---|
| `ALLOWED_ORIGINS` | `https://squish.vercel.app` | Comma-separated CORS-allowed origins |

---

## Deployment

| Layer | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Root: `frontend/`, build: `npm run build`, output: `dist` |
| Backend | Railway / Render | Root: `backend/`, uses `Procfile` |

After deploying the backend, set `VITE_API_URL` in Vercel to the Railway/Render URL, and set `ALLOWED_ORIGINS` in Railway/Render to your Vercel domain.

---

## Privacy

- Files ≤ 10 MB: compressed 100% in the browser — **never uploaded**
- Files > 10 MB or DOCX: sent over HTTPS, compressed, **deleted immediately** — no logging, no storage
- No user accounts, no file content ever stored or shared
