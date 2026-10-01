# React + Vite

## Run locally

Start the backend first:

```powershell
cd ../backend
.\venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

Then start the frontend:

```powershell
cd ../frontend
npm run dev
```

The Vite development proxy forwards `/api` to `http://localhost:8000`.

Open the URL printed by Vite (normally `http://localhost:5173/`). The backend
API is available at `http://localhost:8000/`.

## Android build

The Capacitor Android project is in `android/`. Before building for a device,
set `VITE_API_URL` to the deployed HTTPS backend URL in a local `.env` file,
then run:

```powershell
npm run android:sync
npm run android:open
```

Android Studio and a JDK are required to build the APK or AAB.

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
