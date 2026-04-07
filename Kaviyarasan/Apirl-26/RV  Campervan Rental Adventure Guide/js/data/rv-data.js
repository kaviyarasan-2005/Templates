/**
 * rv-data.js
 * Sample RV Inventory
 */

export const rvData = [
  {
    id: 1,
    name: "Wanderer Class A",
    type: "Class A",
    price: 350,
    capacity: 6,
    features: ["Kitchen", "Bathroom", "Generator", "Slide-out"],
    availability: "Available",
    image: "placeholder-classa.jpg" // Note: implement placeholder logic in HTML mapping
  },
  {
    id: 2,
    name: "Nomad Sprinter B",
    type: "Class B",
    price: 200,
    capacity: 2,
    features: ["Compact", "Solar", "Kitchenette", "Off-grid"],
    availability: "Booked",
    image: "placeholder-classb.jpg"
  },
  {
    id: 3,
    name: "Family Explorer C",
    type: "Class C",
    price: 280,
    capacity: 5,
    features: ["Over-cab Bed", "Full Bath", "Awning"],
    availability: "Available",
    image: "placeholder-classc.jpg"
  },
  {
    id: 4,
    name: "Trailblazer Towable",
    type: "Travel Trailer",
    price: 120,
    capacity: 4,
    features: ["Lightweight", "AC", "Bunk Beds"],
    availability: "Available",
    image: "placeholder-trailer.jpg"
  }
];
