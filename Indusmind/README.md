# 🏭 IndusMind - Smart Factory Monitoring System

A comprehensive industrial machine monitoring and predictive maintenance system that uses AI/ML to predict equipment failures before they occur.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [How It Works](#how-it-works)
- [Screenshots](#screenshots)
- [Future Enhancements](#future-enhancements)
- [Contributors](#contributors)

## 🎯 Overview

**IndusMind** is an intelligent factory monitoring system designed to track industrial machines in real-time and predict potential failures using machine learning. The system monitors critical parameters like temperature, vibration, and power usage, providing early warnings to prevent costly downtime.

### Key Highlights
- ✅ Real-time machine monitoring with live updates
- ✅ AI-powered failure prediction using machine learning
- ✅ Health score calculation for each machine
- ✅ Smart alert system with severity levels (INFO, WARNING, CRITICAL)
- ✅ Historical data visualization with charts
- ✅ Simulation mode for testing and demonstration
- ✅ Manual testing interface for custom inputs
- ✅ **Role-Based Access Control (3 user roles)**
- ✅ **Mobile-responsive dashboard for on-site monitoring**

## ⭐ Features

### 1. **Real-Time Monitoring**
- Live sensor data updates every 3 seconds
- Monitor multiple machines simultaneously (M-101 to M-104)
- Visual status indicators (NORMAL, FAILURE, OFFLINE, LOADING)

### 2. **Predictive Analytics**
- Machine learning model predicts failures based on sensor data
- Health score calculation (0-100%) for each machine
- Historical trend analysis with interactive charts

### 3. **Smart Alert System**
- Three severity levels: INFO, WARNING, CRITICAL
- Alerts for status changes, health drops, and sensor spikes
- Alert history with timestamps

### 4. **Interactive Dashboard**
- Machine cards showing live status and health
- Detailed machine view with historical graphs
- Alerts page for comprehensive monitoring

### 5. **Simulation & Testing**
- Auto-simulation mode generates realistic sensor data
- Manual test mode for custom input analysis
- Data persistence with MongoDB

### 6. **Role-Based Access Control (RBAC)** 🆕
- Three user roles: Operator, Maintenance Engineer, Manager
- Permission-based access to features
- Protected routes with authentication
- Role-specific UI rendering
- Secure session management with localStorage

### 7. **Mobile-Friendly Dashboard** 📱
- Fully responsive design for all devices
- Optimized layouts for desktop, tablet, and mobile
- Touch-friendly controls
- Adaptive charts (hidden on small screens)
- Mobile-first navigation

## 🏗️ System Architecture

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│   FRONTEND      │◄───────►│    BACKEND      │◄───────►│   ML ENGINE     │
│   (React)       │         │   (Express)     │         │   (Python)      │
│                 │         │                 │         │                 │
└─────────────────┘         └────────┬────────┘         └─────────────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │                 │
                            │    DATABASE     │
                            │   (MongoDB)     │
                            │                 │
                            └─────────────────┘
                                     ▲
                                     │
                            ┌────────┴────────┐
                            │                 │
                            │   SIMULATION    │
                            │   (Python)      │
                            │                 │
                            └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React** 19.2.3 - UI framework
- **React Router DOM** 7.13.0 - Navigation
- **Recharts** 3.7.0 - Data visualization
- **Axios** 1.13.2 - HTTP client
- **CSS3** - Styling with modern animations

### Backend
- **Node.js** - Runtime environment
- **Express.js** 5.2.1 - Web framework
- **MongoDB** with Mongoose 9.1.5 - Database
- **CORS** 2.8.5 - Cross-origin resource sharing
- **Body-Parser** 2.2.2 - Request parsing

### ML Engine
- **Python** - ML implementation
- **Scikit-learn** - Machine learning library
- **Joblib** - Model serialization
- **NumPy/Pandas** - Data processing

### Simulation
- **Python** - Data generation
- **Requests** - HTTP client

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.7 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/)
- **npm** or **yarn** - Package manager
- **Git** - Version control

### Python Dependencies
```bash
pip install scikit-learn pandas numpy joblib
```

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Indusmind
```

### 2. Backend Setup
```bash
cd backend
npm install
```

**Configure MongoDB:**
- Ensure MongoDB is running on `localhost:27017`
- Or update the connection string in `backend/db.js`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

### 4. ML Engine Setup
```bash
cd ml-engine
pip install -r requirements.txt
```

**Note:** If `requirements.txt` doesn't exist, install manually:
```bash
pip install scikit-learn pandas numpy joblib
```

### 5. Train the ML Model (if needed)
```bash
cd ml-engine
python train_model.py
```

This will generate `failure_model.pkl` used for predictions.

## ▶️ Running the Application

You need to start **three services** in separate terminals:

### Terminal 1: Backend Server
```bash
cd backend
npm start
```
**Output:** Server running on port 5000

### Terminal 2: Frontend Server
```bash
cd frontend
npm start
```
**Output:** React app running on http://localhost:3000

### Terminal 3: Data Simulator (Optional)
```bash
cd simulation
python data_simulator.py
```
**Output:** Sends simulated data to backend every 2 seconds

### Access the Application
Open your browser and navigate to: **http://localhost:3000**

## 📁 Project Structure

```
Indusmind/
│
├── backend/                    # Node.js Express backend
│   ├── models/
│   │   └── machinedata.js     # MongoDB schema for machine data
│   ├── db.js                  # MongoDB connection
│   ├── server.js              # Main server file
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── App.js             # Main application component
│   │   ├── MachineCard.js     # Machine status card component
│   │   ├── MachineDetail.js   # Detailed machine view with charts
│   │   ├── AlertsPage.js      # Alerts monitoring page
│   │   ├── App.css            # Application styles
│   │   └── index.js           # React entry point
│   ├── public/
│   └── package.json
│
├── ml-engine/                  # Python ML backend
│   ├── machine_data.csv       # Training data
│   ├── train_model.py         # Model training script
│   ├── model.py               # Model definition
│   ├── predict.py             # Standalone prediction script
│   ├── predict_api.py         # API-compatible prediction script
│   └── failure_model.pkl      # Trained model (generated)
│
├── simulation/                 # Data simulation
│   └── data_simulator.py      # Generates random machine data
│
└── README.md                   # This file
```

## 🌐 API Endpoints

### 1. Health Check
```http
GET /
```
**Response:** "IndusMind Backend is Running"

### 2. Store Machine Data
```http
POST /api/machine-data
Content-Type: application/json

{
  "machine_id": "M-101",
  "temperature": 75.5,
  "vibration": 1.2,
  "power_usage": 45.3,
  "timestamp": "2026-02-03 21:24:28"
}
```

### 3. Predict Failure
```http
POST /api/predict
Content-Type: application/json

{
  "temperature": 85,
  "vibration": 2.5,
  "power_usage": 65
}
```

**Response:**
```json
{
  "prediction": "FAILURE",
  "input": {
    "temperature": 85,
    "vibration": 2.5,
    "power_usage": 65
  }
}
```

## 🔍 How It Works

### 1. **Data Collection**
- Sensors collect temperature (°C), vibration (mm/s), and power usage (kWh)
- Data is sent to backend via REST API
- Stored in MongoDB for historical analysis

### 2. **Machine Learning Prediction**
The system uses a rule-based model (can be replaced with ML model):
```python
# Failure conditions:
- Temperature > 82°C
- Vibration > 2.2 mm/s  
- Power usage > 70 kWh
```

### 3. **Health Score Calculation**
```javascript
Base Score: 100
- Temperature > 82°C: -20 points
- Temperature > 90°C: -15 additional points
- Vibration > 2.2: -25 points
- Power > 70: -20 points
- Status = FAILURE: Max 40 points
```

### 4. **Alert Generation**
Alerts are triggered on:
- **CRITICAL**: Failure prediction, health < 50%, extreme temperature (>92°C)
- **WARNING**: Health drops below 80%
- **INFO**: Return to normal operation

### 5. **Real-Time Updates**
- Simulation mode updates sensors every 3 seconds
- AI prediction runs every 45 seconds (to avoid backend overload)
- Frontend polls for updates continuously

## 📸 Screenshots

### Main Dashboard
*Shows all machines with real-time status and health scores*

### Machine Detail View
*Historical charts for temperature, vibration, and power usage*

### Alerts Page
*Comprehensive list of all system alerts with severity levels*

## 🚀 Future Enhancements

- [ ] **Advanced ML Models**: Implement LSTM or Random Forest for better accuracy
- [x] **User Authentication**: ✅ Role-based access control implemented
- [ ] **Backend Authentication**: Add JWT tokens and password hashing for production
- [ ] **Email/SMS Notifications**: Alert users via email when critical failures occur
- [ ] **Mobile App**: React Native mobile application
- [x] **Mobile Dashboard**: ✅ Responsive web dashboard implemented
- [ ] **Export Reports**: Generate PDF reports of machine performance
- [ ] **Multi-Factory Support**: Monitor machines across multiple locations
- [ ] **Maintenance Scheduling**: Auto-schedule maintenance based on predictions
- [ ] **IoT Integration**: Connect to real industrial sensors
- [ ] **Advanced Analytics**: Predictive trends, anomaly detection

## 👥 Contributors

- **Your Name** - Project Developer

## 📄 License

This project is created for educational purposes as part of a college project.

## 🙏 Acknowledgments

- MongoDB documentation
- React documentation
- Scikit-learn tutorials
- Recharts library

---

**Made with ❤️ for Industrial IoT and Predictive Maintenance**

For any queries or issues, please create an issue in the repository.
