# Traffix – Urban Traffic Management System

![Python](https://img.shields.io/badge/Python-3.10-blue)
![Computer Vision](https://img.shields.io/badge/Computer%20Vision-YOLO-green)
![OpenCV](https://img.shields.io/badge/OpenCV-Enabled-red)
![SUMO](https://img.shields.io/badge/Simulation-SUMO-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

Traffix is an AI-powered smart traffic management system designed to improve traffic flow at urban intersections. The system uses computer vision to detect vehicles from traffic feeds, analyze traffic density across lanes, and dynamically optimize traffic signal timings.

The objective of Traffix is to reduce congestion, improve traffic efficiency, and enable intelligent transportation management in smart cities.

---

# Project Overview

Urban traffic congestion is one of the biggest challenges in modern cities. Most traditional traffic signals operate using fixed timing cycles that do not adapt to real-time traffic conditions.

Traffix introduces an adaptive traffic signal optimization system powered by artificial intelligence. By analyzing live traffic feeds, the system detects vehicles, measures traffic density, and prioritizes lanes with higher congestion.

Traffix can also store historical traffic data and use it to predict future congestion patterns, enabling smarter traffic planning and management.

---

# Key Features

## AI-Based Vehicle Detection
The system uses YOLO object detection to identify vehicles in traffic footage including:

- Cars
- Motorcycles
- Buses
- Trucks
- Bicycles

## Lane-Based Traffic Density Analysis
Vehicle counts are calculated for each lane of an intersection to determine traffic density levels.

## Adaptive Traffic Signal Optimization
Signal timings dynamically adjust based on traffic conditions rather than fixed signal cycles.

## Multi-Lane Traffic Monitoring
Traffix analyzes traffic flow across multiple lanes simultaneously and prioritizes the most congested lane.

## Traffic Data Storage
Traffic metrics such as vehicle counts, congestion levels, and signal timings can be stored for future analysis.

## Traffic Prediction
Using historical traffic data, the system can predict future congestion patterns similar to weather forecasting systems.

## Traffic Simulation Support
Traffix integrates with SUMO (Simulation of Urban Mobility) to simulate and test traffic optimization strategies.

---

# System Architecture

The Traffix system is composed of multiple modules that work together to manage traffic.

```

Traffic Camera Feed
│
▼
Vehicle Detection Module (YOLO + OpenCV)
│
▼
Vehicle Counting and Density Calculation
│
▼
Traffic Optimization Algorithm
│
▼
Signal Timing Controller
│
▼
Traffic Signal Output

```

---

# System Workflow

The following workflow explains how the system operates:

```

Video Input
│
▼
Frame Processing
│
▼
Vehicle Detection
│
▼
Vehicle Counting
│
▼
Traffic Density Calculation
│
▼
Lane Priority Determination
│
▼
Signal Timing Optimization
│
▼
Traffic Signal Update

```

---

# Technologies Used

## Computer Vision
- YOLO (Ultralytics)
- OpenCV
- PyTorch

## Backend
- Python
- FastAPI

## Simulation
- SUMO (Simulation of Urban Mobility)
- TraCI API

## Frontend Dashboard
- React
- Next.js
- Chart.js

## Database
- MongoDB

---

# Project Structure

```

Urban_Traffic_Management
│
├── detection
│   Vehicle detection and counting modules
│
├── optimization
│   Traffic signal optimization algorithms
│
├── prediction
│   Traffic prediction models
│
├── simulator
│   SUMO traffic simulation integration
│
├── dashboard
│   Web dashboard for traffic monitoring
│
└── data
Traffic datasets and logs

```

---

# Installation

Clone the repository:

```

git clone [https://github.com/Kabilan2509/Urban_Traffic_Management.git](https://github.com/Kabilan2509/Urban_Traffic_Management.git)

```

Navigate to the project directory:

```

cd Urban_Traffic_Management

```

Install required dependencies:

```

pip install -r requirements.txt

```

Run the detection system:

```

python main.py

```

---

---

# Hackathon Presentation

Traffix is designed as a smart city solution for traffic congestion management.

Problem addressed:
- Inefficient fixed traffic signal timings
- Increasing urban traffic congestion
- Lack of real-time traffic analysis

Solution provided:
- AI-based vehicle detection
- Adaptive signal timing optimization
- Multi-lane traffic density analysis
- Traffic congestion prediction

Impact:
- Reduced waiting time at intersections
- Improved traffic flow efficiency
- Better traffic planning for smart cities

---

# Future Improvements

- Emergency vehicle detection
- Reinforcement learning-based signal optimization
- Real-time integration with city traffic cameras
- IoT traffic sensor integration
- Mobile dashboard for traffic authorities
- Cloud-based traffic analytics platform

---

# Applications

Traffix can be used in:

- Smart city traffic control systems
- Urban congestion management
- Intelligent transportation systems
- Traffic research and simulation environments

---

# License

This project is licensed under the MIT License.

---

# Author

Developed by **Kabilan K A**

AI & Data Science | Intelligent Transportation Systems

