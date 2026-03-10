# 🏭 IndusMind - Project Deep Dive

**IndusMind** is a sophisticated Industrial IoT (IIoT) platform designed for **Smart Factory Monitoring** and **Predictive Maintenance**. It bridges the gap between hardware sensors and actionable intelligence, allowing factory managers to foresee equipment failures before they happen.

---

## 🏗️ System Architecture

The project follows a clean, decoupled architecture consisting of four main layers:

1.  **Frontend (React)**:
    *   A modern, responsive dashboard for real-time visualization.
    *   Features include machine status cards, historical trend charts (via Recharts), and a smart alerting system.
    *   Includes a built-in **Simulation Engine** that generates realistic sensor telemetry.
    *   Implements **Role-Based Access Control (RBAC)** to manage permissions for Operators, Engineers, and Managers.

2.  **Backend (Node.js/Express)**:
    *   The central orchestrator for data flow.
    *   Provides RESTful APIs for receiving sensor data and requesting ML predictions.
    *   Integrates with **MongoDB** for persistent storage of historical machine performance.
    *   Uses `child_process.spawn` to bridge the JavaScript environment with the Python ML engine.

3.  **ML Engine (Python)**:
    *   The "Brain" of the system.
    *   Currently utilizes a high-fidelity heuristic model in [predict_api.py](file:///c:/Users/KARTHIK/OneDrive/Desktop/Placements/college_project/Indusmind/ml-engine/predict_api.py) for high-performance, low-latency failure detection.
    *   Includes a training pipeline (`train_model.py`) that uses **Scikit-learn** to develop robust predictive models based on historical datasets.

4.  **Data Simulation (Python)**:
    *   A standalone script that mimics real industrial sensor behavior, feeding periodic telemetry into the system to demonstrate real-time monitoring capabilities.

---

## 🔍 Core Logic & Intelligence

### 1. Prediction Algorithm
The system analyzes three critical parameters to determine machine health:
*   🌡️ **Temperature**: Monitors overheating conditions (Critical above 85°C-92°C).
*   📳 **Vibration**: Detects mechanical imbalance or wear (Critical above 2.0-2.5 mm/s).
*   ⚡ **Power Usage**: Identifies overload or efficiency drops (Critical above 60-70 kWh).

### 2. Health Score Calculation
Every machine is assigned a dynamic health score (0-100%):
*   **Base Score**: 100
*   **Deductions**: Based on sensor thresholds (e.g., Temp > 82°C = -20 pts).
*   **Failure State**: A "FAILURE" prediction immediately caps the health at 40%, signaling urgent attention.

### 3. Smart Alerting
The system categorizes events into three severity levels:
*   🔴 **CRITICAL**: Outright failure predictions or extreme sensor spikes (e.g., >92°C).
*   🟡 **WARNING**: Significant health drops (e.g., health < 80%).
*   🔵 **INFO**: System events or return to normal operations.

---

## 🛠️ Tech Stack Highlights

*   **Frontend**: React 19, React Router 7, Recharts, Axios.
*   **Backend**: Node.js, Express 5, Mongoose (MongoDB).
*   **ML/Simulation**: Python, Scikit-learn, Pandas, NumPy, Joblib.

---

## 🚀 How Data Flows
1.  **Sensors** (Simulated) → **Backend API** (`POST /api/machine-data`).
2.  **Backend** → **MongoDB** (Storage).
3.  **Frontend** → **Backend API** (`POST /api/predict`).
4.  **Backend** → **Python ML Engine** (Spawns process).
5.  **ML Engine** → **Backend** (Returns JSON result).
6.  **Backend** → **Frontend** (Updates UI & Alerts).
