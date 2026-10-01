from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.postgresql import init_postgres_db
from app.routes import auth, trips

app = FastAPI(title="EraTrip", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(trips.router, prefix="/api/trips", tags=["trips"])


@app.on_event("startup")
def initialize_database():
    init_postgres_db()


@app.get("/")
def root():
    return {"message": "EraTrip API is running!"}