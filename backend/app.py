"""
Traffix Portal – Comprehensive FastAPI Backend
Chennai Intelligent Traffic Management System
"""

from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import asyncio, random, json, math
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import jwt as pyjwt

# ─────────────────────────────────────────────────────────────────────────────
# App & Config
# ─────────────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Traffix Portal API",
    description="Chennai Intelligent Traffic Management System",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "traffix-super-secret-jwt-key-chennai-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 hours

security = HTTPBearer(auto_error=False)

# ─────────────────────────────────────────────────────────────────────────────
# Users / Roles
# ─────────────────────────────────────────────────────────────────────────────

USERS = {
    "admin":     {"password": "admin",     "role": "super_admin",     "name": "Super Administrator",          "email": "admin@traffix.in"},
    "regional":  {"password": "regional",  "role": "regional_auth",   "name": "Regional Traffic Authority",   "email": "regional@traffix.in"},
    "police":    {"password": "police",    "role": "police_ctrl",     "name": "Police Station Controller",    "email": "police@traffix.in"},
    "operator":  {"password": "operator",  "role": "junction_op",     "name": "Junction Operator",            "email": "operator@traffix.in"},
    "emergency": {"password": "emergency", "role": "emergency_ctrl",  "name": "Emergency Operations Controller","email": "emergency@traffix.in"},
}

ROLE_PERMISSIONS = {
    "super_admin":    ["all"],
    "regional_auth":  ["view_all", "view_analytics", "manage_emergency"],
    "police_ctrl":    ["view_junctions", "view_alerts", "manage_emergency", "view_police"],
    "junction_op":    ["view_junctions", "view_sensors"],
    "emergency_ctrl": ["view_all", "manage_emergency", "emergency_override"],
}

blacklisted_tokens: set = set()

# ─────────────────────────────────────────────────────────────────────────────
# JWT Helpers
# ─────────────────────────────────────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    return pyjwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    try:
        return pyjwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except pyjwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except pyjwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials is None:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    token = credentials.credentials
    if token in blacklisted_tokens:
        raise HTTPException(status_code=401, detail="Token has been revoked")
    payload = decode_token(token)
    username = payload.get("sub")
    if username not in USERS:
        raise HTTPException(status_code=401, detail="User not found")
    user = USERS[username].copy()
    user["username"] = username
    user["token"] = token
    return user


def require_role(*roles):
    def checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in roles and "super_admin" not in [current_user["role"]]:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return current_user
    return checker

# ─────────────────────────────────────────────────────────────────────────────
# Pydantic Models
# ─────────────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str

class SignalControlRequest(BaseModel):
    junction_id: str
    direction: str  # N/E/S/W
    green_duration: int  # seconds
    reason: Optional[str] = None

class EmergencyActivateRequest(BaseModel):
    vehicle_id: str
    vehicle_type: str
    origin_junction: str
    destination_junction: str
    route_junctions: List[str]

# ─────────────────────────────────────────────────────────────────────────────
# Static Junction Data (12 Chennai Junctions)
# ─────────────────────────────────────────────────────────────────────────────

JUNCTIONS_STATIC = [
    {"id": "J-001", "name": "Anna Salai Command Junction",  "lat": 13.0604, "lng": 80.2496, "zone": "Central",   "police_station": "Anna Salai PS",  "region": "Chennai Central",  "priority_class": "CRITICAL", "base_density": 0.82, "base_speed": 18},
    {"id": "J-002", "name": "Koyambedu Interchange",        "lat": 13.0713, "lng": 80.1946, "zone": "West",      "police_station": "Koyambedu PS",   "region": "Chennai West",     "priority_class": "HIGH",     "base_density": 0.76, "base_speed": 22},
    {"id": "J-003", "name": "T. Nagar Smart Cross",         "lat": 13.0418, "lng": 80.2341, "zone": "Central",   "police_station": "T. Nagar PS",    "region": "Chennai Central",  "priority_class": "HIGH",     "base_density": 0.79, "base_speed": 16},
    {"id": "J-004", "name": "Vadapalani Junction",          "lat": 13.0528, "lng": 80.2121, "zone": "West",      "police_station": "Vadapalani PS",  "region": "Chennai West",     "priority_class": "MEDIUM",   "base_density": 0.65, "base_speed": 25},
    {"id": "J-005", "name": "Guindy Industrial Corridor",   "lat": 13.0069, "lng": 80.2206, "zone": "South",     "police_station": "Guindy PS",      "region": "Chennai South",    "priority_class": "HIGH",     "base_density": 0.71, "base_speed": 30},
    {"id": "J-006", "name": "Adyar Signal Point",           "lat": 13.0012, "lng": 80.2565, "zone": "South",     "police_station": "Adyar PS",       "region": "Chennai South",    "priority_class": "MEDIUM",   "base_density": 0.60, "base_speed": 28},
    {"id": "J-007", "name": "Egmore – NSC Bose Road",       "lat": 13.0732, "lng": 80.2609, "zone": "North",     "police_station": "Egmore PS",      "region": "Chennai North",    "priority_class": "HIGH",     "base_density": 0.74, "base_speed": 20},
    {"id": "J-008", "name": "Tambaram Bypass",              "lat": 12.9249, "lng": 80.1000, "zone": "South",     "police_station": "Tambaram PS",    "region": "Chennai South",    "priority_class": "LOW",      "base_density": 0.45, "base_speed": 48},
    {"id": "J-009", "name": "Perambur Junction",            "lat": 13.1143, "lng": 80.2322, "zone": "North",     "police_station": "Perambur PS",    "region": "Chennai North",    "priority_class": "MEDIUM",   "base_density": 0.58, "base_speed": 32},
    {"id": "J-010", "name": "Velachery IT Corridor",        "lat": 12.9816, "lng": 80.2209, "zone": "South",     "police_station": "Velachery PS",   "region": "Chennai South",    "priority_class": "HIGH",     "base_density": 0.73, "base_speed": 24},
    {"id": "J-011", "name": "Porur Signal",                 "lat": 13.0374, "lng": 80.1574, "zone": "West",      "police_station": "Porur PS",       "region": "Chennai West",     "priority_class": "MEDIUM",   "base_density": 0.62, "base_speed": 34},
    {"id": "J-012", "name": "Sholinganallur Junction",      "lat": 12.9010, "lng": 80.2279, "zone": "East",      "police_station": "Sholinganallur PS","region": "Chennai East",   "priority_class": "HIGH",     "base_density": 0.78, "base_speed": 22},
]

# ─────────────────────────────────────────────────────────────────────────────
# Data Simulation Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _hour_factor() -> float:
    """Returns a multiplier based on time-of-day (peak vs off-peak)."""
    h = datetime.now().hour
    if 7 <= h <= 10:   return 1.4   # morning peak
    if 17 <= h <= 21:  return 1.5   # evening peak
    if 0 <= h <= 5:    return 0.3   # night
    return 1.0


def _jitter(value: float, pct: float = 0.08) -> float:
    return value * (1 + random.uniform(-pct, pct))


def _sensor_status() -> dict:
    states = ["Healthy", "Healthy", "Healthy", "Degraded", "Failed"]
    return {
        "camera":      random.choices(states, weights=[75, 10, 10, 4, 1])[0],
        "radar":       random.choices(states, weights=[80, 8,  8,  3, 1])[0],
        "temperature": random.choices(states, weights=[90, 5,  3,  1, 1])[0],
        "humidity":    random.choices(states, weights=[90, 5,  3,  1, 1])[0],
        "gps_rf":      random.choices(states, weights=[85, 8,  5,  1, 1])[0],
    }


def _signal_phases() -> dict:
    total = 120
    n = random.randint(25, 40)
    e = random.randint(20, 35)
    s = random.randint(20, 35)
    w = total - n - e - s
    w = max(15, w)
    statuses = ["GREEN", "RED", "YELLOW"]
    current = random.choice(["N", "E", "S", "W"])
    return {
        d: {
            "green_duration": v,
            "current_phase": "GREEN" if d == current else "RED",
            "time_remaining": random.randint(1, v),
            "vehicle_count": random.randint(8, 45),
        }
        for d, v in zip(["N", "E", "S", "W"], [n, e, s, w])
    }


def _mmwave_radar(base_speed: float) -> dict:
    lanes = []
    for i in range(1, 4):
        lanes.append({
            "lane_id": i,
            "vehicle_count": random.randint(2, 18),
            "avg_speed": round(_jitter(base_speed) * _hour_factor(), 1),
            "lane_occupancy": round(random.uniform(0.2, 0.92), 2),
            "heavy_vehicle_pct": round(random.uniform(0.05, 0.35), 2),
        })
    return {"lanes": lanes, "last_updated": datetime.now().isoformat()}


def _lstm_predictions(base_density: float) -> dict:
    horizons = {
        "5min":  {"factor": 1.0,  "conf_range": (0.88, 0.97)},
        "15min": {"factor": 1.05, "conf_range": (0.82, 0.93)},
        "30min": {"factor": 1.10, "conf_range": (0.78, 0.90)},
        "1hr":   {"factor": 1.20, "conf_range": (0.72, 0.86)},
    }
    result = {}
    hf = _hour_factor()
    for label, cfg in horizons.items():
        density = min(1.0, _jitter(base_density * hf * cfg["factor"], 0.06))
        cong_prob = round(min(1.0, density * random.uniform(0.9, 1.1)), 3)
        result[label] = {
            "predicted_density":    round(density, 3),
            "congestion_prob":      cong_prob,
            "queue_length":         int(density * random.randint(60, 150)),
            "vehicle_arrival_rate": round(density * random.uniform(8, 20), 1),
            "signal_recommendation": "EXTEND_GREEN" if cong_prob > 0.75 else ("NORMAL" if cong_prob > 0.45 else "REDUCE_GREEN"),
            "confidence":           round(random.uniform(*cfg["conf_range"]), 3),
        }
    return result


def _build_traffic_data(j: dict) -> dict:
    hf = _hour_factor()
    density = min(1.0, _jitter(j["base_density"] * hf))
    speed   = max(5, _jitter(j["base_speed"] / hf))
    return {
        "junction_id":    j["id"],
        "junction_name":  j["name"],
        "timestamp":      datetime.now().isoformat(),
        "vehicle_count":  int(density * random.randint(120, 280)),
        "avg_speed":      round(speed, 1),
        "density":        round(density, 3),
        "queue_length":   int(density * random.randint(40, 130)),
        "wait_time":      int(density * random.randint(30, 180)),
        "congestion_level": (
            "CRITICAL" if density > 0.85 else
            "HIGH"     if density > 0.70 else
            "MODERATE" if density > 0.50 else
            "LOW"
        ),
        "signal_phases":  _signal_phases(),
        "sensor_status":  _sensor_status(),
        "predictions":    _lstm_predictions(j["base_density"]),
        "radar":          _mmwave_radar(j["base_speed"]),
        "throughput_vph": int(density * random.randint(800, 1800)),
        "incidents":      random.randint(0, 2),
    }


def _build_all_junctions_summary() -> List[dict]:
    hf = _hour_factor()
    result = []
    for j in JUNCTIONS_STATIC:
        density = min(1.0, _jitter(j["base_density"] * hf))
        result.append({
            **j,
            "density":         round(density, 3),
            "congestion_level": (
                "CRITICAL" if density > 0.85 else
                "HIGH"     if density > 0.70 else
                "MODERATE" if density > 0.50 else
                "LOW"
            ),
            "vehicle_count":   int(density * random.randint(120, 280)),
            "avg_speed":       round(max(5, _jitter(j["base_speed"] / hf)), 1),
            "status":          random.choices(["OPERATIONAL", "OPERATIONAL", "DEGRADED", "MAINTENANCE"], weights=[80, 10, 7, 3])[0],
            "active_incidents": random.randint(0, 2),
            "last_updated":    datetime.now().isoformat(),
        })
    return result


def _weather_data() -> dict:
    conditions = [
        ("Clear",      1.0,  0.0,  10.0, 0.90),
        ("Cloudy",     0.9,  0.0,   8.0, 0.85),
        ("Rainy",      0.6,  8.5,   5.0, 0.65),
        ("Heavy Rain", 0.3, 28.0,   2.0, 0.40),
        ("Foggy",      0.5,  0.0,   3.5, 0.55),
    ]
    c = random.choices(conditions, weights=[40, 25, 20, 8, 7])[0]
    cond, vis_factor, rain_mm, wind, impact = c
    return {
        "timestamp":       datetime.now().isoformat(),
        "temperature":     round(random.uniform(28, 38), 1),
        "humidity":        round(random.uniform(55, 85), 1),
        "condition":       cond,
        "visibility_km":   round(vis_factor * 10, 1),
        "wind_speed_kmh":  round(wind + random.uniform(0, 10), 1),
        "rainfall_mm":     round(rain_mm + random.uniform(0, 5) if rain_mm > 0 else 0.0, 1),
        "uv_index":        round(random.uniform(3, 11), 1),
        "traffic_impact":  round(1.0 - impact + random.uniform(-0.05, 0.05), 2),
        "advisory":        (
            "Reduce speed, maintain safe distance" if cond in ("Rainy", "Heavy Rain") else
            "Fog lights recommended, drive cautiously" if cond == "Foggy" else
            "Normal driving conditions"
        ),
        "rerouting_suggestions": (
            ["Avoid coastal roads", "Use inner city routes"] if cond == "Heavy Rain" else
            ["Use elevated expressway"] if cond == "Foggy" else []
        ),
    }


def _weather_alerts() -> List[dict]:
    possible = [
        {"type": "HEAVY_RAIN",  "severity": "HIGH",   "message": "Heavy rainfall expected in South Chennai, avoid Adyar and Velachery low-lying roads"},
        {"type": "FOG_WARNING", "severity": "MEDIUM",  "message": "Dense fog advisory for Tambaram bypass and Old Mahabalipuram Road"},
        {"type": "HEAT_WAVE",   "severity": "LOW",    "message": "Extreme heat 39°C, sensor accuracy may be affected"},
        {"type": "CYCLONE_WATCH","severity": "CRITICAL","message": "Cyclonic system forming in Bay of Bengal, monitor coastal junctions"},
    ]
    count = random.randint(0, 2)
    selected = random.sample(possible, min(count, len(possible)))
    for a in selected:
        a["issued_at"] = (datetime.now() - timedelta(minutes=random.randint(10, 120))).isoformat()
        a["expires_at"] = (datetime.now() + timedelta(hours=random.randint(2, 12))).isoformat()
        a["affected_zones"] = random.sample(["Chennai North", "Chennai South", "Chennai Central", "Chennai West", "Chennai East"], random.randint(1, 3))
    return selected


def _system_alerts() -> List[dict]:
    alert_pool = [
        {"type": "CONGESTION",      "severity": "HIGH",     "message": "Critical congestion detected – vehicle density exceeds 90%"},
        {"type": "SENSOR_FAILURE",  "severity": "MEDIUM",   "message": "mmWave radar offline – manual count override activated"},
        {"type": "CAMERA_FAILURE",  "severity": "MEDIUM",   "message": "PTZ camera feed lost – backup stream engaged"},
        {"type": "COMM_FAILURE",    "severity": "CRITICAL", "message": "4G/LTE link down – switching to VSAT backup"},
        {"type": "EMERGENCY_VEHICLE","severity": "HIGH",    "message": "Ambulance detected on route – green corridor activated"},
        {"type": "WEATHER_HAZARD",  "severity": "HIGH",     "message": "Waterlogging reported – signal timing adjusted"},
        {"type": "SIGNAL_FAILURE",  "severity": "CRITICAL", "message": "Signal controller unresponsive – manual mode required"},
        {"type": "CONGESTION",      "severity": "MEDIUM",   "message": "Queue spillback beyond intersection limits"},
        {"type": "SENSOR_FAILURE",  "severity": "LOW",      "message": "Temperature sensor drift detected – calibration needed"},
    ]
    count = random.randint(3, 7)
    selected = random.sample(alert_pool, min(count, len(alert_pool)))
    alerts = []
    for i, a in enumerate(selected):
        junc = random.choice(JUNCTIONS_STATIC)
        alerts.append({
            "id":                f"ALT-{random.randint(10000, 99999)}",
            "type":              a["type"],
            "severity":          a["severity"],
            "message":           a["message"],
            "affected_junction": junc["id"],
            "junction_name":     junc["name"],
            "timestamp":         (datetime.now() - timedelta(minutes=random.randint(0, 60))).isoformat(),
            "acknowledged":      random.choice([True, False]),
            "auto_resolved":     random.choice([True, False, False]),
        })
    return sorted(alerts, key=lambda x: x["timestamp"], reverse=True)


def _emergency_vehicles() -> List[dict]:
    v_types = [
        {"type": "AMBULANCE", "prefix": "AMB", "agency": "GH Chennai"},
        {"type": "FIRE",      "prefix": "FTN", "agency": "TNFRS"},
        {"type": "POLICE",    "prefix": "PCH", "agency": "Tamil Nadu Police"},
    ]
    vehicles = []
    for i in range(random.randint(2, 5)):
        vt = random.choice(v_types)
        junc_from = random.choice(JUNCTIONS_STATIC)
        junc_to   = random.choice(JUNCTIONS_STATIC)
        vehicles.append({
            "vehicle_id":       f"{vt['prefix']}-{random.randint(100, 999)}",
            "vehicle_type":     vt["type"],
            "agency":           vt["agency"],
            "registration":     f"TN{random.randint(10,99)}-{random.randint(1000,9999)}",
            "origin":           junc_from["name"],
            "destination":      junc_to["name"],
            "status":           random.choice(["EN_ROUTE", "APPROACHING", "ON_SCENE"]),
            "speed_kmh":        round(random.uniform(40, 90), 1),
            "gps_lat":          round(junc_from["lat"] + random.uniform(-0.005, 0.005), 6),
            "gps_lng":          round(junc_from["lng"] + random.uniform(-0.005, 0.005), 6),
            "corridor_active":  random.choice([True, False]),
            "eta_minutes":      random.randint(2, 15),
            "detected_at":      (datetime.now() - timedelta(minutes=random.randint(1, 20))).isoformat(),
        })
    return vehicles


def _emergency_corridors() -> List[dict]:
    corridors = []
    for i in range(random.randint(1, 3)):
        route = random.sample([j["id"] for j in JUNCTIONS_STATIC], random.randint(3, 5))
        eta_before = random.randint(12, 25)
        eta_after  = int(eta_before * random.uniform(0.55, 0.75))
        corridors.append({
            "corridor_id":       f"COR-{random.randint(100, 999)}",
            "vehicle_id":        f"AMB-{random.randint(100, 999)}",
            "vehicle_type":      random.choice(["AMBULANCE", "FIRE", "POLICE"]),
            "route_junctions":   route,
            "signal_sync_status": random.choice(["SYNCED", "SYNCED", "PARTIAL", "PENDING"]),
            "junctions_cleared": random.randint(0, len(route)),
            "eta_before_opt":    eta_before,
            "eta_after_opt":     eta_after,
            "time_saved_min":    eta_before - eta_after,
            "activated_at":      (datetime.now() - timedelta(minutes=random.randint(1, 10))).isoformat(),
            "status":            random.choice(["ACTIVE", "ACTIVE", "COMPLETED"]),
        })
    return corridors


def _sensors_health() -> List[dict]:
    sensor_types = ["mmWave Radar", "PTZ Camera", "Temperature Sensor", "Humidity Sensor", "GPS/RF Beacon", "Inductive Loop", "LIDAR Unit"]
    health_list = []
    for j in JUNCTIONS_STATIC:
        for st in sensor_types:
            ok = random.random()
            health_list.append({
                "junction_id":    j["id"],
                "junction_name":  j["name"],
                "sensor_type":    st,
                "sensor_id":      f"SN-{j['id']}-{st[:3].upper()}-{random.randint(1,3)}",
                "status":         "Healthy" if ok > 0.15 else ("Degraded" if ok > 0.05 else "Failed"),
                "uptime_pct":     round(random.uniform(92, 99.9) if ok > 0.15 else random.uniform(50, 91), 2),
                "last_ping_ms":   round(random.uniform(12, 45), 1),
                "battery_pct":    round(random.uniform(40, 100), 1),
                "firmware":       f"v{random.randint(2,4)}.{random.randint(0,9)}.{random.randint(0,15)}",
                "last_maintenance":(datetime.now() - timedelta(days=random.randint(1, 90))).strftime("%Y-%m-%d"),
                "alert":          None if ok > 0.15 else ("Sensor degraded – schedule maintenance" if ok > 0.05 else "SENSOR FAILED – immediate replacement needed"),
            })
    return health_list


def _authority_insights() -> dict:
    hf = _hour_factor()
    return {
        "timestamp":        datetime.now().isoformat(),
        "network_summary": {
            "total_junctions":       len(JUNCTIONS_STATIC),
            "operational":           random.randint(10, 12),
            "degraded":              random.randint(0, 2),
            "critical_alerts":       random.randint(0, 3),
            "avg_network_density":   round(hf * 0.65 + random.uniform(-0.05, 0.05), 3),
            "total_vehicles_tracked":random.randint(8000, 18000),
        },
        "peak_junctions": [
            {"id": j["id"], "name": j["name"], "density": round(_jitter(j["base_density"] * hf), 3)}
            for j in sorted(JUNCTIONS_STATIC, key=lambda x: x["base_density"], reverse=True)[:5]
        ],
        "signal_optimization": {
            "cycles_adjusted_today": random.randint(120, 450),
            "avg_wait_reduction_pct": round(random.uniform(12, 28), 1),
            "fuel_saved_liters":      round(random.uniform(800, 2400), 1),
            "co2_reduced_kg":         round(random.uniform(1800, 5500), 1),
        },
        "emergency_summary": {
            "active_corridors":  random.randint(0, 3),
            "corridors_today":   random.randint(5, 20),
            "avg_time_saved_min": round(random.uniform(4, 12), 1),
        },
        "top_alerts": _system_alerts()[:3],
    }


def _daily_analytics() -> dict:
    hours = list(range(0, 24))
    hourly = []
    for h in hours:
        hf2 = 1.4 if 7 <= h <= 10 else (1.5 if 17 <= h <= 21 else (0.3 if 0 <= h <= 5 else 1.0))
        hourly.append({
            "hour":             h,
            "vehicle_count":    int(hf2 * random.randint(3000, 8000)),
            "avg_speed_kmh":    round(40 / hf2 + random.uniform(-3, 3), 1),
            "congestion_score": round(min(1.0, hf2 * random.uniform(0.4, 0.7)), 3),
            "incidents":        random.randint(0, int(hf2 * 4)),
        })
    return {
        "date":                  datetime.now().strftime("%Y-%m-%d"),
        "total_vehicles":        sum(h["vehicle_count"] for h in hourly),
        "peak_hour":             {"morning": "08:00-09:00", "evening": "18:00-19:00"},
        "avg_speed_kmh":         round(sum(h["avg_speed_kmh"] for h in hourly) / 24, 1),
        "total_incidents":       sum(h["incidents"] for h in hourly),
        "signal_cycles_run":     random.randint(2000, 5000),
        "emergency_corridors":   random.randint(8, 25),
        "fuel_saved_liters":     round(random.uniform(500, 2000), 1),
        "co2_reduced_kg":        round(random.uniform(1200, 4500), 1),
        "avg_wait_reduction_pct":round(random.uniform(15, 30), 1),
        "hourly_breakdown":      hourly,
    }


def _weekly_analytics() -> dict:
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    today_idx = datetime.now().weekday()
    weekly = []
    for i, day in enumerate(days):
        wf = 1.3 if i < 5 else 0.7  # weekday vs weekend
        weekly.append({
            "day":           day,
            "total_vehicles": int(wf * random.randint(60000, 100000)),
            "peak_density":   round(wf * random.uniform(0.6, 0.95), 3),
            "avg_speed_kmh":  round(30 / wf + random.uniform(-5, 5), 1),
            "incidents":      random.randint(5, int(wf * 40)),
            "fuel_saved_l":   round(wf * random.uniform(400, 1500), 1),
        })
    return {
        "week_start":      (datetime.now() - timedelta(days=today_idx)).strftime("%Y-%m-%d"),
        "week_end":        (datetime.now() + timedelta(days=6 - today_idx)).strftime("%Y-%m-%d"),
        "total_vehicles":  sum(d["total_vehicles"] for d in weekly),
        "busiest_day":     "Friday",
        "quietest_day":    "Sunday",
        "total_incidents": sum(d["incidents"] for d in weekly),
        "total_fuel_saved": round(sum(d["fuel_saved_l"] for d in weekly), 1),
        "total_co2_saved":  round(sum(d["fuel_saved_l"] for d in weekly) * 2.3, 1),
        "daily_breakdown": weekly,
    }


def _monthly_analytics() -> dict:
    month_names = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    current_month = datetime.now().month
    monthly = []
    for i in range(1, 13):
        mf = 1.1 if i not in [3, 9] else 0.85  # slightly vary by month
        monthly.append({
            "month":          month_names[i - 1],
            "total_vehicles": int(mf * random.randint(1_800_000, 2_800_000)),
            "avg_congestion": round(mf * random.uniform(0.5, 0.8), 3),
            "incidents":      random.randint(150, int(mf * 600)),
            "fuel_saved_l":   round(mf * random.uniform(12000, 40000), 0),
            "emergency_corridors": random.randint(100, 400),
        })
    return {
        "year":              datetime.now().year,
        "ytd_vehicles":      sum(m["total_vehicles"] for m in monthly[:current_month]),
        "ytd_fuel_saved":    round(sum(m["fuel_saved_l"] for m in monthly[:current_month]), 0),
        "ytd_co2_saved_kg":  round(sum(m["fuel_saved_l"] for m in monthly[:current_month]) * 2.3, 0),
        "best_month":        "February",
        "monthly_breakdown": monthly,
    }


def _system_health() -> dict:
    return {
        "timestamp":            datetime.now().isoformat(),
        "cpu_usage_pct":        round(random.uniform(12, 35), 1),
        "memory_usage_pct":     round(random.uniform(40, 65), 1),
        "disk_usage_pct":       round(random.uniform(38, 72), 1),
        "network_latency_ms":   round(random.uniform(12, 45), 1),
        "active_ws_connections":random.randint(8, 50),
        "mqtt_broker": {
            "status":           "ONLINE",
            "messages_per_sec": random.randint(200, 800),
            "connected_clients":random.randint(30, 80),
            "uptime_hours":     random.randint(240, 8760),
        },
        "database": {
            "status":           "HEALTHY",
            "query_time_ms":    round(random.uniform(2, 18), 1),
            "connections":      random.randint(10, 60),
            "size_gb":          round(random.uniform(12, 85), 2),
        },
        "ai_engine": {
            "status":           "RUNNING",
            "model_version":    "LSTM-v3.2.1",
            "inference_ms":     round(random.uniform(8, 25), 1),
            "predictions_today":random.randint(5000, 20000),
        },
        "junction_connectivity": {
            "total":      len(JUNCTIONS_STATIC),
            "online":     random.randint(10, 12),
            "offline":    random.randint(0, 2),
            "degraded":   random.randint(0, 1),
        },
        "last_sync":            datetime.now().isoformat(),
        "uptime_hours":         random.randint(720, 8760),
        "overall_status":       "HEALTHY",
    }


REGIONS = [
    {"id": "R-001", "name": "Chennai Central", "junctions": ["J-001", "J-003"],       "population": 820000,  "area_sqkm": 42},
    {"id": "R-002", "name": "Chennai North",   "junctions": ["J-007", "J-009"],       "population": 950000,  "area_sqkm": 65},
    {"id": "R-003", "name": "Chennai South",   "junctions": ["J-005","J-006","J-008","J-010","J-012"], "population": 1100000, "area_sqkm": 88},
    {"id": "R-004", "name": "Chennai West",    "junctions": ["J-002","J-004","J-011"], "population": 780000,  "area_sqkm": 55},
    {"id": "R-005", "name": "Chennai East",    "junctions": ["J-012"],                "population": 620000,  "area_sqkm": 38},
]

POLICE_STATIONS = [
    {"id": "PS-001", "name": "Anna Salai PS",      "region": "Chennai Central", "officer_in_charge": "ACP R. Selvakumar",  "phone": "+91-44-28520100", "junctions_covered": ["J-001"]},
    {"id": "PS-002", "name": "Koyambedu PS",        "region": "Chennai West",    "officer_in_charge": "ACP M. Suresh",      "phone": "+91-44-24793100", "junctions_covered": ["J-002", "J-004"]},
    {"id": "PS-003", "name": "Guindy PS",           "region": "Chennai South",   "officer_in_charge": "ACP P. Anbazhagan",  "phone": "+91-44-22342100", "junctions_covered": ["J-005", "J-006"]},
    {"id": "PS-004", "name": "Egmore PS",           "region": "Chennai North",   "officer_in_charge": "ACP K. Radhakrishnan","phone": "+91-44-28193100", "junctions_covered": ["J-007", "J-009"]},
    {"id": "PS-005", "name": "Velachery PS",        "region": "Chennai South",   "officer_in_charge": "ACP S. Vijayalakshmi","phone": "+91-44-22591100","junctions_covered": ["J-010", "J-012"]},
]

# ─────────────────────────────────────────────────────────────────────────────
# WebSocket Manager
# ─────────────────────────────────────────────────────────────────────────────

class ConnectionManager:
    def __init__(self):
        self.traffic_connections: List[WebSocket] = []
        self.alert_connections:   List[WebSocket] = []

    async def connect_traffic(self, ws: WebSocket):
        await ws.accept()
        self.traffic_connections.append(ws)

    async def connect_alerts(self, ws: WebSocket):
        await ws.accept()
        self.alert_connections.append(ws)

    def disconnect_traffic(self, ws: WebSocket):
        if ws in self.traffic_connections:
            self.traffic_connections.remove(ws)

    def disconnect_alerts(self, ws: WebSocket):
        if ws in self.alert_connections:
            self.alert_connections.remove(ws)

    async def broadcast_traffic(self, data: dict):
        dead = []
        for ws in self.traffic_connections:
            try:
                await ws.send_text(json.dumps(data))
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect_traffic(ws)

    async def broadcast_alerts(self, data: dict):
        dead = []
        for ws in self.alert_connections:
            try:
                await ws.send_text(json.dumps(data))
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect_alerts(ws)


manager = ConnectionManager()

# ─────────────────────────────────────────────────────────────────────────────
# Background Tasks
# ─────────────────────────────────────────────────────────────────────────────

async def traffic_broadcast_loop():
    """Broadcast traffic updates every 3 seconds to all /ws/traffic subscribers."""
    while True:
        try:
            if manager.traffic_connections:
                payload = {
                    "type":      "TRAFFIC_UPDATE",
                    "timestamp": datetime.now().isoformat(),
                    "junctions": _build_all_junctions_summary(),
                }
                await manager.broadcast_traffic(payload)
        except Exception:
            pass
        await asyncio.sleep(3)


async def alert_broadcast_loop():
    """Broadcast new alerts every 8 seconds to all /ws/alerts subscribers."""
    while True:
        try:
            if manager.alert_connections:
                alerts = _system_alerts()
                if alerts:
                    payload = {
                        "type":      "NEW_ALERTS",
                        "timestamp": datetime.now().isoformat(),
                        "alerts":    alerts[:2],
                    }
                    await manager.broadcast_alerts(payload)
        except Exception:
            pass
        await asyncio.sleep(8)


@app.on_event("startup")
async def startup_event():
    asyncio.create_task(traffic_broadcast_loop())
    asyncio.create_task(alert_broadcast_loop())

# ─────────────────────────────────────────────────────────────────────────────
# AUTH ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    user = USERS.get(req.username)
    if not user or user["password"] != req.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    token = create_access_token({
        "sub":  req.username,
        "role": user["role"],
        "name": user["name"],
    })
    return {
        "access_token": token,
        "token_type":   "bearer",
        "expires_in":   ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        "user": {
            "username":    req.username,
            "name":        user["name"],
            "role":        user["role"],
            "email":       user["email"],
            "permissions": ROLE_PERMISSIONS.get(user["role"], []),
        },
    }


@app.post("/api/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    blacklisted_tokens.add(current_user["token"])
    return {"message": "Logged out successfully", "username": current_user["username"]}


@app.get("/api/auth/me")
async def me(current_user: dict = Depends(get_current_user)):
    return {
        "username":    current_user["username"],
        "name":        current_user["name"],
        "role":        current_user["role"],
        "email":       current_user["email"],
        "permissions": ROLE_PERMISSIONS.get(current_user["role"], []),
        "last_login":  datetime.now().isoformat(),
    }

# ─────────────────────────────────────────────────────────────────────────────
# JUNCTION ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/junctions")
async def get_junctions(current_user: dict = Depends(get_current_user)):
    return {"junctions": _build_all_junctions_summary(), "total": len(JUNCTIONS_STATIC)}


@app.get("/api/junction/{junction_id}/traffic")
async def get_junction_traffic(junction_id: str, current_user: dict = Depends(get_current_user)):
    j = next((x for x in JUNCTIONS_STATIC if x["id"] == junction_id), None)
    if not j:
        raise HTTPException(status_code=404, detail=f"Junction {junction_id} not found")
    return _build_traffic_data(j)


@app.get("/api/junction/{junction_id}/history")
async def get_junction_history(junction_id: str, hours: int = 24, current_user: dict = Depends(get_current_user)):
    j = next((x for x in JUNCTIONS_STATIC if x["id"] == junction_id), None)
    if not j:
        raise HTTPException(status_code=404, detail=f"Junction {junction_id} not found")
    history = []
    for h in range(hours, 0, -1):
        ts = datetime.now() - timedelta(hours=h)
        hour_val = ts.hour
        hf = 1.4 if 7 <= hour_val <= 10 else (1.5 if 17 <= hour_val <= 21 else (0.3 if 0 <= hour_val <= 5 else 1.0))
        density = min(1.0, _jitter(j["base_density"] * hf, 0.12))
        history.append({
            "timestamp":    ts.isoformat(),
            "vehicle_count": int(density * random.randint(100, 280)),
            "avg_speed":    round(max(5, j["base_speed"] / (hf + 0.1)), 1),
            "density":      round(density, 3),
            "queue_length": int(density * random.randint(30, 120)),
            "incidents":    random.randint(0, 2),
        })
    return {"junction_id": junction_id, "junction_name": j["name"], "period_hours": hours, "data": history}


@app.get("/api/junction/{junction_id}/prediction")
async def get_junction_prediction(junction_id: str, current_user: dict = Depends(get_current_user)):
    j = next((x for x in JUNCTIONS_STATIC if x["id"] == junction_id), None)
    if not j:
        raise HTTPException(status_code=404, detail=f"Junction {junction_id} not found")
    return {
        "junction_id":   junction_id,
        "junction_name": j["name"],
        "model":         "LSTM-v3.2.1",
        "generated_at":  datetime.now().isoformat(),
        "predictions":   _lstm_predictions(j["base_density"]),
    }


class LSTMPredictionRequest(BaseModel):
    junction_id: str
    current_density: float
    vehicle_count: int
    hour: int


@app.post("/api/lstm/predict")
async def predict_lstm(req: LSTMPredictionRequest, current_user: dict = Depends(get_current_user)):
    j = next((x for x in JUNCTIONS_STATIC if x["id"] == req.junction_id), None)
    if not j:
        raise HTTPException(status_code=404, detail=f"Junction {req.junction_id} not found")
    
    # Simulate LSTM predictions based on hour factor
    hour_factor = 1.4 if 7 <= req.hour <= 10 else (1.5 if 17 <= req.hour <= 21 else (0.3 if 0 <= req.hour <= 5 else 1.0))
    base_density = req.current_density / 100.0
    
    predictions = []
    signals = []
    horizons = ["5min", "15min", "30min", "1hour"]
    factors = [1.0, 1.05, 1.10, 1.20]
    
    for horizon, factor in zip(horizons, factors):
        pred_density = min(0.99, base_density * hour_factor * factor + random.uniform(-0.05, 0.05))
        pred_density_pct = int(pred_density * 100)
        predictions.append(pred_density_pct)
        
        if pred_density > 0.85:
            signals.append("EXTEND_GREEN")
        elif pred_density > 0.65:
            signals.append("NORMAL")
        else:
            signals.append("REDUCE_GREEN")
    
    return {
        "junction_id": req.junction_id,
        "predictions": predictions,
        "signals": signals,
        "confidence": [0.92, 0.87, 0.81, 0.73],
        "model": "LSTM-v3.2.1",
        "timestamp": datetime.now().isoformat(),
    }


@app.get("/api/junction/{junction_id}/sensors")
async def get_junction_sensors(junction_id: str, current_user: dict = Depends(get_current_user)):
    j = next((x for x in JUNCTIONS_STATIC if x["id"] == junction_id), None)
    if not j:
        raise HTTPException(status_code=404, detail=f"Junction {junction_id} not found")
    all_health = _sensors_health()
    junc_sensors = [s for s in all_health if s["junction_id"] == junction_id]
    failed    = sum(1 for s in junc_sensors if s["status"] == "Failed")
    degraded  = sum(1 for s in junc_sensors if s["status"] == "Degraded")
    return {
        "junction_id":   junction_id,
        "junction_name": j["name"],
        "timestamp":     datetime.now().isoformat(),
        "sensors":       junc_sensors,
        "summary": {
            "total":    len(junc_sensors),
            "healthy":  len(junc_sensors) - failed - degraded,
            "degraded": degraded,
            "failed":   failed,
        },
        "radar":         _mmwave_radar(j["base_speed"]),
        "env": {
            "temperature": round(random.uniform(28, 38), 1),
            "humidity":    round(random.uniform(55, 85), 1),
        },
    }


@app.get("/api/junction/{junction_id}/camera")
async def get_junction_camera(junction_id: str, current_user: dict = Depends(get_current_user)):
    j = next((x for x in JUNCTIONS_STATIC if x["id"] == junction_id), None)
    if not j:
        raise HTTPException(status_code=404, detail=f"Junction {junction_id} not found")
    cameras = []
    for i, direction in enumerate(["North", "East", "South", "West"]):
        ok = random.random()
        cameras.append({
            "camera_id":        f"CAM-{junction_id}-{direction[0]}",
            "direction":        direction,
            "status":           "Healthy" if ok > 0.15 else ("Degraded" if ok > 0.05 else "Failed"),
            "resolution":       "1080p",
            "fps":              random.choice([15, 20, 25, 30]),
            "night_vision":     random.choice([True, False]),
            "cv_detections": {
                "vehicles":        random.randint(5, 30),
                "pedestrians":     random.randint(0, 15),
                "two_wheelers":    random.randint(2, 20),
                "heavy_vehicles":  random.randint(0, 8),
                "wrong_way":       random.randint(0, 1),
                "signal_jumpers":  random.randint(0, 2),
            },
            "license_plates_detected": random.randint(0, 12),
            "stream_url":       f"rtsp://traffix-cam/{junction_id.lower()}/{direction.lower()}",
            "last_frame":       datetime.now().isoformat(),
        })
    return {"junction_id": junction_id, "junction_name": j["name"], "cameras": cameras, "timestamp": datetime.now().isoformat()}

# ─────────────────────────────────────────────────────────────────────────────
# SIGNAL CONTROL
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/signal/control")
async def signal_control(req: SignalControlRequest, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "super_admin":
        raise HTTPException(status_code=403, detail="Only Super Administrator can modify signal timing")
    j = next((x for x in JUNCTIONS_STATIC if x["id"] == req.junction_id), None)
    if not j:
        raise HTTPException(status_code=404, detail=f"Junction {req.junction_id} not found")
    if req.direction not in ["N", "E", "S", "W"]:
        raise HTTPException(status_code=400, detail="Direction must be one of N, E, S, W")
    if not (10 <= req.green_duration <= 120):
        raise HTTPException(status_code=400, detail="green_duration must be between 10 and 120 seconds")
    reason_text = (req.reason or "").strip().lower()
    if not any(flag in reason_text for flag in ["emergency", "critical", "incident", "disaster"]):
        raise HTTPException(status_code=400, detail="Signal timing changes are allowed only for critical or emergency situations")
    return {
        "success":       True,
        "message":       f"Signal at {j['name']} ({req.direction}) set to {req.green_duration}s green",
        "junction_id":   req.junction_id,
        "direction":     req.direction,
        "green_duration":req.green_duration,
        "reason":        req.reason,
        "applied_by":    current_user["name"],
        "applied_at":    datetime.now().isoformat(),
        "effective_until":(datetime.now() + timedelta(seconds=req.green_duration * 2)).isoformat(),
    }

# ─────────────────────────────────────────────────────────────────────────────
# AUTHORITY INSIGHTS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/authority/insights")
async def authority_insights(current_user: dict = Depends(get_current_user)):
    allowed = ["super_admin", "regional_auth"]
    if current_user["role"] not in allowed:
        raise HTTPException(status_code=403, detail="Access restricted to authority roles")
    return _authority_insights()

# ─────────────────────────────────────────────────────────────────────────────
# EMERGENCY ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/emergency/corridors")
async def get_emergency_corridors(current_user: dict = Depends(get_current_user)):
    return {"corridors": _emergency_corridors(), "timestamp": datetime.now().isoformat()}


@app.get("/api/emergency/vehicles")
async def get_emergency_vehicles(current_user: dict = Depends(get_current_user)):
    return {"vehicles": _emergency_vehicles(), "timestamp": datetime.now().isoformat()}


@app.post("/api/emergency/activate")
async def activate_emergency_corridor(req: EmergencyActivateRequest, current_user: dict = Depends(get_current_user)):
    allowed = ["super_admin", "regional_auth", "emergency_ctrl", "police_ctrl"]
    if current_user["role"] not in allowed:
        raise HTTPException(status_code=403, detail="Not authorized to activate emergency corridors")
    eta_before = random.randint(12, 25)
    eta_after  = int(eta_before * random.uniform(0.55, 0.75))
    corridor_id = f"COR-{random.randint(100,999)}"
    return {
        "success":       True,
        "corridor_id":   corridor_id,
        "vehicle_id":    req.vehicle_id,
        "vehicle_type":  req.vehicle_type,
        "route":         req.route_junctions,
        "junctions_cleared": 0,
        "signal_sync_status": "SYNCING",
        "eta_before_opt": eta_before,
        "eta_after_opt":  eta_after,
        "time_saved_min": eta_before - eta_after,
        "activated_by":   current_user["name"],
        "activated_at":   datetime.now().isoformat(),
        "message":        f"Green corridor activated for {req.vehicle_type} {req.vehicle_id}",
    }

# ─────────────────────────────────────────────────────────────────────────────
# WEATHER ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/weather")
async def get_weather(current_user: dict = Depends(get_current_user)):
    return _weather_data()


@app.get("/api/weather/alerts")
async def get_weather_alerts(current_user: dict = Depends(get_current_user)):
    return {"alerts": _weather_alerts(), "timestamp": datetime.now().isoformat()}

# ─────────────────────────────────────────────────────────────────────────────
# ALERTS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/alerts")
async def get_alerts(severity: Optional[str] = None, current_user: dict = Depends(get_current_user)):
    alerts = _system_alerts()
    if severity:
        alerts = [a for a in alerts if a["severity"].upper() == severity.upper()]
    return {"alerts": alerts, "total": len(alerts), "timestamp": datetime.now().isoformat()}

# ─────────────────────────────────────────────────────────────────────────────
# ANALYTICS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/analytics/daily")
async def daily_analytics(current_user: dict = Depends(get_current_user)):
    return _daily_analytics()


@app.get("/api/analytics/weekly")
async def weekly_analytics(current_user: dict = Depends(get_current_user)):
    return _weekly_analytics()


@app.get("/api/analytics/monthly")
async def monthly_analytics(current_user: dict = Depends(get_current_user)):
    return _monthly_analytics()

# ─────────────────────────────────────────────────────────────────────────────
# SENSORS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/sensors/health")
async def sensors_health(current_user: dict = Depends(get_current_user)):
    sensors = _sensors_health()
    failed  = [s for s in sensors if s["status"] == "Failed"]
    degraded= [s for s in sensors if s["status"] == "Degraded"]
    return {
        "timestamp":  datetime.now().isoformat(),
        "sensors":    sensors,
        "summary": {
            "total":    len(sensors),
            "healthy":  len(sensors) - len(failed) - len(degraded),
            "degraded": len(degraded),
            "failed":   len(failed),
            "uptime_pct": round(sum(s["uptime_pct"] for s in sensors) / len(sensors), 2),
        },
        "maintenance_required": [s for s in sensors if s["alert"]],
    }

# ─────────────────────────────────────────────────────────────────────────────
# USERS (admin only)
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/users")
async def get_users(current_user: dict = Depends(require_role("super_admin"))):
    return {
        "users": [
            {
                "username":    uname,
                "name":        info["name"],
                "role":        info["role"],
                "email":       info["email"],
                "permissions": ROLE_PERMISSIONS.get(info["role"], []),
                "status":      "ACTIVE",
                "last_login":  (datetime.now() - timedelta(minutes=random.randint(0, 1440))).isoformat(),
            }
            for uname, info in USERS.items()
        ],
        "total": len(USERS),
    }

# ─────────────────────────────────────────────────────────────────────────────
# SYSTEM HEALTH
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/system/health")
async def system_health(current_user: dict = Depends(get_current_user)):
    return _system_health()

# ─────────────────────────────────────────────────────────────────────────────
# REGIONS & POLICE STATIONS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/regions")
async def get_regions(current_user: dict = Depends(get_current_user)):
    enriched = []
    for r in REGIONS:
        hf = _hour_factor()
        enriched.append({
            **r,
            "active_incidents": random.randint(0, 5),
            "avg_density":      round(hf * random.uniform(0.45, 0.85), 3),
            "operational_junctions": len(r["junctions"]),
        })
    return {"regions": enriched, "total": len(REGIONS)}


@app.get("/api/police-stations")
async def get_police_stations(current_user: dict = Depends(get_current_user)):
    enriched = []
    for ps in POLICE_STATIONS:
        enriched.append({
            **ps,
            "active_officers_on_road": random.randint(5, 20),
            "active_emergency_calls":  random.randint(0, 5),
            "patrol_vehicles":         random.randint(3, 10),
            "status":                  "ACTIVE",
        })
    return {"police_stations": enriched, "total": len(POLICE_STATIONS)}

# ─────────────────────────────────────────────────────────────────────────────
# WEBSOCKET ENDPOINTS
# ─────────────────────────────────────────────────────────────────────────────

@app.websocket("/ws/traffic")
async def ws_traffic(websocket: WebSocket):
    await manager.connect_traffic(websocket)
    try:
        # Send initial snapshot immediately on connect
        payload = {
            "type":      "INITIAL_SNAPSHOT",
            "timestamp": datetime.now().isoformat(),
            "junctions": _build_all_junctions_summary(),
        }
        await websocket.send_text(json.dumps(payload))
        # Keep connection alive – background loop handles broadcasts
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30)
                # Echo back any ping/control messages
                await websocket.send_text(json.dumps({"type": "ACK", "echo": data, "timestamp": datetime.now().isoformat()}))
            except asyncio.TimeoutError:
                # Send keep-alive
                await websocket.send_text(json.dumps({"type": "PING", "timestamp": datetime.now().isoformat()}))
    except WebSocketDisconnect:
        manager.disconnect_traffic(websocket)
    except Exception:
        manager.disconnect_traffic(websocket)


@app.websocket("/ws/alerts")
async def ws_alerts(websocket: WebSocket):
    await manager.connect_alerts(websocket)
    try:
        # Send current alerts immediately
        payload = {
            "type":      "CURRENT_ALERTS",
            "timestamp": datetime.now().isoformat(),
            "alerts":    _system_alerts(),
        }
        await websocket.send_text(json.dumps(payload))
        while True:
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=30)
                await websocket.send_text(json.dumps({"type": "ACK", "echo": data, "timestamp": datetime.now().isoformat()}))
            except asyncio.TimeoutError:
                await websocket.send_text(json.dumps({"type": "PING", "timestamp": datetime.now().isoformat()}))
    except WebSocketDisconnect:
        manager.disconnect_alerts(websocket)
    except Exception:
        manager.disconnect_alerts(websocket)

# ─────────────────────────────────────────────────────────────────────────────
# Root / Health Check (unauthenticated)
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "service":     "Traffix Portal API",
        "version":     "2.0.0",
        "description": "Chennai Intelligent Traffic Management System",
        "status":      "operational",
        "junctions":   len(JUNCTIONS_STATIC),
        "docs":        "/docs",
        "timestamp":   datetime.now().isoformat(),
    }


@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.now().isoformat()}


# ─────────────────────────────────────────────────────────────────────────────
# Entry Point
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True, log_level="info")
