import json
from datetime import datetime, timedelta, timezone
from typing import Optional
from urllib.parse import quote

from pydantic import BaseModel, Field, field_validator
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.postgresql import get_db
from app.models.trip import Trip
from app.models.user import User
from app.routes.auth import get_current_user

router = APIRouter()


class TripPayload(BaseModel):
    destination: str = Field(min_length=2, max_length=255)
    start_date: datetime
    travelers: int = Field(ge=1, le=20)
    budget: float = Field(gt=0)
    user_id: int = Field(gt=0)
    trip_days: int = Field(ge=1, le=365)
    interests: list[str] = Field(default_factory=list)
    additional_prompt: str = Field(default="", max_length=2000)

    @field_validator("start_date")
    @classmethod
    def validate_start_date(cls, value):
        if value.tzinfo is None:
            comparison = value.date()
        else:
            comparison = value.astimezone(timezone.utc).date()
        if comparison < datetime.now(timezone.utc).date():
            raise ValueError("start_date cannot be in the past")
        return value


class TripUpdate(BaseModel):
    destination: Optional[str] = Field(default=None, min_length=2, max_length=255)
    start_date: Optional[datetime] = None
    travelers: Optional[int] = Field(default=None, ge=1, le=20)
    budget: Optional[float] = Field(default=None, gt=0)
    trip_days: Optional[int] = Field(default=None, ge=1, le=365)
    interests: Optional[list[str]] = None
    additional_prompt: Optional[str] = Field(default=None, max_length=2000)
    status: Optional[str] = None


REAL_PLACES = {
    "paris": [
        ("Eiffel Tower", "Iconic Paris landmark with panoramic city views", "09:00", 35),
        ("Louvre Museum", "World-class art museum and historic palace", "11:30", 22),
        ("Le Marais", "Historic neighborhood for cafes, galleries, and local shops", "15:00", 0),
        ("Seine River", "Evening riverside walk through central Paris", "19:00", 0),
        ("Arc de Triomphe", "Monument at the western end of the Champs-Élysées", "09:00", 16),
        ("Musée d'Orsay", "Impressionist art museum in a former railway station", "11:30", 18),
        ("Montmartre", "Hilltop artists' quarter around Sacré-Cœur", "15:00", 0),
        ("Sacré-Cœur Basilica", "White-domed basilica with city views", "17:00", 0),
        ("Latin Quarter", "Historic left-bank district with bookshops and cafes", "09:00", 0),
        ("Luxembourg Gardens", "Formal gardens beside the Luxembourg Palace", "11:30", 0),
        ("Canal Saint-Martin", "Local waterside neighborhood with tree-lined walks", "15:00", 0),
        ("Bouillon Pigalle", "Historic Parisian restaurant known for classic French dishes", "19:00", 30),
    ],
    "london": [
        ("Tower of London", "Historic fortress on the River Thames", "09:00", 35),
        ("Borough Market", "Historic food market with local and international vendors", "12:00", 25),
        ("British Museum", "Free national museum with global collections", "14:30", 0),
        ("Westminster Abbey", "Historic church beside Parliament Square", "18:00", 30),
        ("St Paul's Cathedral", "Landmark cathedral in the City of London", "09:00", 25),
        ("Tate Modern", "Modern art museum in a converted power station", "11:30", 0),
        ("Covent Garden", "Historic market district with shops and street performers", "15:00", 0),
        ("Notting Hill", "Colorful west London neighborhood and Portobello Road", "18:00", 0),
        ("Kensington Gardens", "Royal park beside Kensington Palace", "09:00", 0),
        ("Natural History Museum", "Landmark museum of natural history", "11:30", 0),
        ("Camden Market", "Large market with independent food and retail stalls", "15:00", 0),
        ("Dishoom Shoreditch", "Popular restaurant serving Bombay-inspired food in East London", "18:00", 35),
    ],
    "tokyo": [
        ("Senso-ji Temple", "Tokyo's oldest temple in historic Asakusa", "09:00", 0),
        ("Tsukiji Outer Market", "Fresh seafood and traditional Japanese food stalls", "11:30", 25),
        ("Meiji Jingu", "Forest shrine near Harajuku", "15:00", 0),
        ("Shibuya Crossing", "Famous city crossing and evening neighborhood walk", "19:00", 0),
        ("Tokyo Skytree", "Broadcasting tower with panoramic city views", "09:00", 23),
        ("Ueno Park", "Large park with museums, temples, and gardens", "11:30", 0),
        ("Harajuku", "Fashion and food neighborhood beside Meiji Jingu", "15:00", 0),
        ("Odaiba", "Waterfront entertainment district across Tokyo Bay", "19:00", 0),
        ("Imperial Palace East Gardens", "Historic gardens in central Tokyo", "09:00", 0),
        ("teamLab Borderless", "Immersive digital art museum in Azabudai Hills", "11:30", 38),
        ("Yanaka", "Traditional neighborhood with temples and local streets", "15:00", 0),
        ("Sushi Dai", "Well-known sushi counter in the Toyosu Market area", "19:00", 45),
    ],
    "mumbai": [
        ("Gateway of India", "Waterfront monument overlooking Mumbai Harbour", "08:00", 0),
        ("Chhatrapati Shivaji Maharaj Terminus", "UNESCO-listed railway station", "10:30", 0),
        ("Crawford Market", "Historic market for produce, spices, and local goods", "13:00", 20),
        ("Marine Drive", "Seafront promenade for a sunset walk", "18:00", 0),
        ("Elephanta Caves", "UNESCO-listed rock-cut cave temples in Mumbai Harbour", "09:00", 10),
        ("Chhatrapati Shivaji Maharaj Vastu Sangrahalaya", "Museum of Indian art and history", "11:30", 10),
        ("Kala Ghoda", "Arts district with galleries, museums, and cafes", "15:00", 0),
        ("Colaba Causeway", "Popular market street near South Mumbai landmarks", "18:00", 0),
        ("Bandra Bandstand", "Seafront promenade near Bandra Fort", "09:00", 0),
        ("Sanjay Gandhi National Park", "Large protected green space in northern Mumbai", "11:30", 0),
        ("Haji Ali Dargah", "Historic mosque and tomb on an islet", "15:00", 0),
        ("Britannia & Co.", "Historic Mumbai restaurant known for Parsi cuisine", "18:00", 25),
    ],
}

RECOMMENDED_HOTELS = {
    "paris": [
        ("Hôtel des Grands Boulevards", "Grands Boulevards", "Boutique hotel in a central neighborhood with easy Metro access"),
        ("Hôtel La Comtesse", "7th arrondissement", "Hotel near the Eiffel Tower and the Seine"),
        ("Hôtel Le Six", "6th arrondissement", "Well-located hotel near the Luxembourg Gardens and Latin Quarter"),
    ],
    "london": [
        ("The Tower Hotel", "Tower Bridge", "Riverside hotel beside Tower Bridge and the Tower of London"),
        ("The Resident Covent Garden", "Covent Garden", "Central base near theatres, restaurants, and the West End"),
        ("Park Plaza London Westminster Bridge", "South Bank", "Large hotel close to the London Eye and Westminster"),
    ],
    "tokyo": [
        ("Hotel Gracery Shinjuku", "Shinjuku", "Popular hotel in the Kabukicho entertainment district"),
        ("Mitsui Garden Hotel Ginza Premier", "Ginza", "Upscale hotel convenient for central Tokyo and shopping"),
        ("Onyado Nono Asakusa", "Asakusa", "Japanese-style hotel within walking distance of Senso-ji"),
    ],
    "mumbai": [
        ("The Taj Mahal Palace", "Colaba", "Landmark waterfront hotel opposite the Gateway of India"),
        ("Trident, Nariman Point", "Nariman Point", "Seafront hotel at the southern end of Marine Drive"),
        ("Abode Bombay", "Colaba", "Boutique hotel in the historic Fort and Colaba area"),
    ],
}


def trip_preferences(trip: Trip):
    try:
        return json.loads(str(trip.preferences or "{}"))
    except json.JSONDecodeError:
        return {}


def require_trip_owner(trip_id: int, user: User, db: Session):
    trip = db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user.id).first()
    if not isinstance(trip, Trip):
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


def hotel_recommendations(destination: str):
    destination_key = destination.split(",")[0].strip().lower()
    hotels = RECOMMENDED_HOTELS.get(destination_key)
    if hotels is None:
        search_query = quote(f"hotels in {destination}")
        return [{
            "name": f"Hotels in {destination}",
            "area": destination,
            "description": "Browse current hotel listings, ratings, prices, and availability for this destination.",
            "maps_link": f"https://www.google.com/maps/search/?api=1&query={search_query}",
        }]

    return [
        {
            "name": name,
            "area": area,
            "description": description,
            "maps_link": f"https://www.google.com/maps/search/?api=1&query={quote(name + ' ' + destination)}",
        }
        for name, area, description in hotels
    ]


@router.get("/")
def list_trips(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trips = db.query(Trip).filter(Trip.user_id == user.id).order_by(Trip.created_at.desc()).offset(skip).limit(limit).all()
    return {"items": trips, "count": len(trips)}


@router.get("/{trip_id}")
def get_trip(trip_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = require_trip_owner(trip_id, user, db)
    return trip


@router.post("/")
def create_trip(
    payload: TripPayload,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if payload.user_id != user.id:
        raise HTTPException(status_code=403, detail="Cannot create a trip for another user")
    trip = Trip(
        user_id=payload.user_id,
        destination=payload.destination,
        start_date=payload.start_date,
        travelers=payload.travelers,
        budget=payload.budget,
        preferences=json.dumps({
            "trip_days": payload.trip_days,
            "interests": payload.interests,
            "additional_prompt": payload.additional_prompt,
        }),
        status="pending",
    )
    db.add(trip)
    db.commit()
    db.refresh(trip)
    return {"message": "Trip created", "trip_id": trip.id}


@router.put("/{trip_id}")
def update_trip(
    trip_id: int,
    payload: TripUpdate,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    trip = require_trip_owner(trip_id, user, db)

    updates = {}
    for field in ("destination", "start_date", "travelers", "budget", "status"):
        value = getattr(payload, field)
        if value is not None:
            updates[field] = value

    preferences = trip_preferences(trip)
    for field in ("trip_days", "interests", "additional_prompt"):
        value = getattr(payload, field)
        if value is not None:
            preferences[field] = value
    if any(field in payload.model_fields_set for field in ("trip_days", "interests", "additional_prompt")):
        updates["preferences"] = json.dumps(preferences)

    if updates:
        db.query(Trip).filter(Trip.id == trip_id).update(updates)
        db.commit()
    return {"message": "Trip updated", "trip_id": trip.id}


@router.delete("/{trip_id}")
def delete_trip(trip_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = require_trip_owner(trip_id, user, db)

    db.delete(trip)
    db.commit()
    return {"message": "Trip deleted", "trip_id": trip.id}


@router.get("/{trip_id}/itinerary")
def get_itinerary(trip_id: int, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    trip = require_trip_owner(trip_id, user, db)
    preferences = trip_preferences(trip)
    destination_key = str(trip.destination).split(",")[0].strip().lower()
    places = REAL_PLACES.get(destination_key, [])
    if not places:
        places = [
            (f"{trip.destination} Old Town", "Historic center and local architecture", "09:00", 0),
            (f"{trip.destination} Central Market", "Local food, crafts, and neighborhood culture", "12:00", 25),
            (f"{trip.destination} Main Museum", "A cultural stop selected for your destination", "15:00", 15),
            (f"{trip.destination} Waterfront", "A relaxed evening walk with local views", "18:30", 0),
        ]

    days = int(preferences.get("trip_days", 1))
    itinerary_days = []
    for day_index in range(days):
        date = trip.start_date.replace(tzinfo=timezone.utc) if trip.start_date.tzinfo is None else trip.start_date
        date = date + timedelta(days=day_index)
        start_index = day_index * 4
        day_places = places[start_index:start_index + 4]
        if not day_places:
            day_places = [
                (
                    f"Rest and local exploration in {trip.destination}",
                    "Use this time to revisit a favorite area or explore nearby streets at your own pace",
                    "10:00",
                    0,
                )
            ]
        activities = [
            {
                "time": place[2],
                "activity": place[0],
                "location": place[0],
                "description": place[1],
                "cost": place[3],
                "maps_link": f"https://www.google.com/maps/search/?api=1&query={quote(place[0] + ' ' + str(trip.destination))}",
            }
            for place in day_places
        ]
        itinerary_days.append({"day": day_index + 1, "date": (date.date()).isoformat(), "activities": activities})

    return {
        "trip_id": trip.id,
        "destination": trip.destination,
        "start_date": trip.start_date,
        "travelers": trip.travelers,
        "trip_days": days,
        "interests": preferences.get("interests", []),
        "hotels": hotel_recommendations(str(trip.destination)),
        "days": itinerary_days,
        "total_cost": sum(activity["cost"] for day in itinerary_days for activity in day["activities"]),
        "source": "curated real-world landmarks",
    }
