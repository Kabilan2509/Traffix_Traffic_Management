export const defaultJunctions = [
  { id: "J-001", name: "Anna Salai - Mount Road", lat: 13.0604, lng: 80.2496, congestion: "Red", phase: "Red", density: 82, vehicles: 342, delay: 8.2 },
  { id: "J-002", name: "Koyambedu Interchange", lat: 13.0713, lng: 80.1946, congestion: "Yellow", phase: "Green", density: 65, vehicles: 210, delay: 4.5 },
  { id: "J-003", name: "T. Nagar - Usman Road", lat: 13.0418, lng: 80.2341, congestion: "Red", phase: "Red", density: 90, vehicles: 401, delay: 11.3 },
  { id: "J-004", name: "Vadapalani Junction", lat: 13.0528, lng: 80.2121, congestion: "Green", phase: "Green", density: 48, vehicles: 145, delay: 2.1 },
  { id: "J-005", name: "Guindy Industrial Estate", lat: 13.0069, lng: 80.2206, congestion: "Yellow", phase: "Yellow", density: 55, vehicles: 178, delay: 3.8 },
  { id: "J-006", name: "Adyar Signal", lat: 13.0012, lng: 80.2565, congestion: "Green", phase: "Green", density: 38, vehicles: 112, delay: 1.5 },
  { id: "J-007", name: "Egmore - NSC Bose Road", lat: 13.0732, lng: 80.2609, congestion: "Yellow", phase: "Yellow", density: 74, vehicles: 263, delay: 5.9 },
  { id: "J-008", name: "Tambaram Bypass", lat: 12.9249, lng: 80.1, congestion: "Green", phase: "Green", density: 30, vehicles: 90, delay: 1.2 },
];

export const defaultEvents = [
  { eventId: "EVT-8841", time: "10:45:22", type: "AI Optimisation", junction: "Anna Salai (J-001)", details: "N-S phase extended +15s. Surge detected.", status: "Success" },
  { eventId: "EVT-8840", time: "10:12:05", type: "Manual Override", junction: "Egmore (J-007)", details: "All-red phase for VIP convoy. Operator request.", status: "Warning" },
  { eventId: "EVT-8839", time: "09:30:00", type: "System Event", junction: "Network Wide", details: "ML model weights updated and deployed.", status: "Success" },
  { eventId: "EVT-8838", time: "08:15:44", type: "Sensor Alert", junction: "T. Nagar (J-003)", details: "E-bound camera occlusion. Confidence <40%.", status: "Error" },
  { eventId: "EVT-8837", time: "07:00:00", type: "Peak Transition", junction: "Network Wide", details: "Mode switched to Morning Rush Hour.", status: "Success" },
  { eventId: "EVT-8836", time: "06:30:10", type: "AI Optimisation", junction: "Vadapalani (J-004)", details: "Off-peak compression -20s applied.", status: "Success" },
  { eventId: "EVT-8835", time: "18:45:00", type: "Emergency Override", junction: "Guindy (J-005)", details: "Ambulance corridor cleared. ETA 6 min.", status: "Success" },
];

export const defaultSettings = {
  autoOptimise: true,
  emergencyBroadcast: true,
  auditLogging: true,
  congestionThreshold: 75,
  syncInterval: 10,
};
