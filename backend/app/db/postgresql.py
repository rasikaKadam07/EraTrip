from typing import Any, Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

from app.config import settings

database_url = settings.DATABASE_URL
engine_options: dict[str, Any] = {"echo": settings.DEBUG, "pool_pre_ping": True}
if database_url.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}
else:
    engine_options.update({"pool_size": 10, "max_overflow": 20})

engine = create_engine(database_url, **engine_options)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_postgres_db() -> Generator[Session, None, None]:
    """Get a PostgreSQL database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_db() -> Generator[Session, None, None]:
    """Compatibility wrapper used by the auth and trip routes."""
    yield from get_postgres_db()


def init_postgres_db():
    """Initialize PostgreSQL database by creating tables."""
    Base.metadata.create_all(bind=engine)
    print("Database initialized")