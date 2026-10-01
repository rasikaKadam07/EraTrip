import unittest

from fastapi.testclient import TestClient

from app.main import app
from app.routes.trips import hotel_recommendations


class EraTripAppTests(unittest.TestCase):
    def test_app_exists(self):
        self.assertIsNotNone(app)

    def test_root_route(self):
        client = TestClient(app)
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("EraTrip", response.json()["message"])

    def test_curated_destinations_include_real_hotels_and_search_links(self):
        for destination in ("Paris, France", "London, UK", "Tokyo, Japan", "Mumbai, India"):
            with self.subTest(destination=destination):
                hotels = hotel_recommendations(destination)
                self.assertEqual(len(hotels), 3)
                for hotel in hotels:
                    self.assertTrue(hotel["name"])
                    self.assertTrue(hotel["area"])
                    self.assertTrue(hotel["description"])
                    self.assertIn("https://www.google.com/maps/search/", hotel["maps_link"])
                    self.assertIn("%", hotel["maps_link"])

    def test_other_destinations_get_live_hotel_search_link(self):
        hotels = hotel_recommendations("Rome, Italy")
        self.assertEqual(len(hotels), 1)
        self.assertEqual(hotels[0]["name"], "Hotels in Rome, Italy")
        self.assertIn("hotels%20in%20Rome", hotels[0]["maps_link"])


if __name__ == "__main__":
    unittest.main()
