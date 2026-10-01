# EraTrip

EraTrip is a travel-planning prototype with a React/Vite frontend, FastAPI backend, SQLAlchemy persistence, and a Capacitor Android project.

## Current capabilities

- Sign up and log in with backend-validated passwords and JWT sessions.
- Create, update, list, and delete trips scoped to the authenticated user.
- Save profile name changes to the backend.
- Display curated real-world landmark itineraries for selected destinations, with Google Maps links.
- Run the web frontend locally or package it through Capacitor for Android.

The itinerary endpoint currently uses curated landmarks and destination-specific fallbacks. It does not yet use live Gemini-generated plans, live hotel availability/prices, or Google Places search.

## Requirements

- Python 3.14 (or a Python version supported by the pinned dependency ranges)
- Node.js and npm
- Java 17 and Android SDK only for Android builds

## Local development

From the repository root, create and activate the backend environment:

```powershell
cd backend
py -3.14 -m venv venv
.\venv\Scripts\python.exe -m pip install -r requirements.txt
Copy-Item .env.example .env
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`. The development proxy forwards `/api` requests to FastAPI at `http://localhost:8000`. API documentation is at `http://localhost:8000/docs`.

SQLite is the local default and the database file is ignored by Git. For deployment, set a production `DATABASE_URL`, `SECRET_KEY`, and restricted CORS origins through the hosting provider's secret/environment settings.

## Tests and checks

Run backend tests from the `backend` directory:

```powershell
cd backend
.\venv\Scripts\python.exe -m unittest discover -s tests
```

Run frontend checks from the `frontend` directory:

```powershell
npm run lint
npm run build
```

## Android

The Capacitor project is under `frontend/android`.

1. Install Android Studio, Android SDK, and JDK 17.
2. Configure `VITE_API_URL` to the deployed HTTPS backend URL in `frontend/.env` before producing a device build. `/api` only works with the local Vite proxy.
3. From `frontend`, run:

```powershell
npm run android:sync
npm run android:open
```

Build and sign the app from Android Studio or Gradle. Do not commit signing keys or `google-services.json` unless the project intentionally uses a secured, documented workflow for them.

## Environment variables and security

Copy `backend/.env.example` to `backend/.env` for local work. Never commit `.env` files, API keys, OAuth secrets, database passwords, or production signing credentials. Configure secrets in deployment environment settings instead.

Credentials have previously appeared in the working environment/chat. Revoke and replace the associated Gemini, Google Maps/Places, OAuth, database, and JWT secrets before pushing or deploying. Changing `.env` alone does not revoke a leaked key.

## GitHub checklist

- Confirm `.env`, local databases, virtual environments, crash logs, build outputs, and signing files are ignored.
- Commit only `.env.example` templates with placeholders.
- Review `git status` and staged changes before committing.
- Never stage or publish secrets, generated APKs, or local database contents.
