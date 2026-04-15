import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import API_BASE_URL from "./config";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
// Import Components
import MachineCard from "./MachineCard";
import MachineDetail from "./MachineDetail";
import AlertsPage from "./AlertsPage";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import RoleIndicator from "./RoleIndicator";
// Import Authentication
import { AuthProvider, useAuth } from "./AuthContext";
import "./App.css";

const INITIAL_MACHINES = [
  { id: "M-101", temperature: 45, vibration: 0.1, power_usage: 80, status: "Pending", healthScore: 100, history: [] },
  { id: "M-102", temperature: 55, vibration: 0.3, power_usage: 95, status: "Pending", healthScore: 100, history: [] },
  { id: "M-103", temperature: 65, vibration: 0.5, power_usage: 110, status: "Pending", healthScore: 100, history: [] },
  { id: "M-104", temperature: 75, vibration: 0.7, power_usage: 125, status: "Pending", healthScore: 100, history: [] },
];

function App() {
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [alerts, setAlerts] = useState([]);
  const [selectedMachineId, setSelectedMachineId] = useState("M-101");
  const [formData, setFormData] = useState({
    temperature: "",
    vibration: "",
    power_usage: ""
  });

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);

  // Ref to track last alerted state per machine to avoid spamming alerts
  const lastStateRef = useRef({});

  // Helper: Add Alert to list
  const addAlert = (machineId, severity, description) => {
    const newAlert = {
      time: new Date().toLocaleTimeString(),
      machineId,
      severity,
      description
    };
    setAlerts(prev => [newAlert, ...prev].slice(0, 100)); // Keep last 100 alerts
  };



  // Helper: Generate Random Float in Range
  const getRandom = (min, max) => (Math.random() * (max - min) + min).toFixed(2);

  // Helper: Update status and append to history + Generate Alerts
  const updateMachineStatus = (id, newStatus, newData) => {
    const timestamp = new Date().toLocaleTimeString();

    setMachines(prevMachines => prevMachines.map(m => {
      if (m.id === id) {
        const prevStatus = m.status;
        const prevHealth = m.healthScore || 100;

        const updatedMachine = { ...m, ...newData, status: newStatus };

        // Calculate Health Score (Aligned with Prediction)
        let score = 100;
        const temp = Number(updatedMachine.temperature) || 0;
        const vib = Number(updatedMachine.vibration) || 0;
        const pwr = Number(updatedMachine.power_usage) || 0;

        if (temp > 82) score -= 20;
        if (temp > 90) score -= 15;
        if (vib > 2.2) score -= 25;
        if (pwr > 70) score -= 20;
        if (newStatus === 'FAILURE') score = Math.min(score, 40);

        const newHealth = Math.max(0, score);
        updatedMachine.healthScore = newHealth;

        // --- ALERT GENERATION LOGIC ---

        // 1. Status Change Alert
        if (prevStatus !== 'FAILURE' && newStatus === 'FAILURE') {
          addAlert(id, 'CRITICAL', `AI Model predicted FAILURE for machine ${id}.`);
        } else if (prevStatus === 'FAILURE' && newStatus === 'NORMAL') {
          addAlert(id, 'INFO', `Machine ${id} has returned to normal operation.`);
        }

        // 2. Health Score Threshold Alerts
        if (prevHealth >= 80 && newHealth < 80 && newHealth >= 50) {
          addAlert(id, 'WARNING', `Machine ${id} health dropped into Warning zone (${newHealth}%).`);
        } else if (prevHealth >= 50 && newHealth < 50) {
          addAlert(id, 'CRITICAL', `Machine ${id} health dropped into Critical zone (${newHealth}%).`);
        }

        // 3. Sensor Spikes (Independent of prediction)
        if (updatedMachine.temperature > 92 && (!lastStateRef.current[id]?.tempSpike)) {
          addAlert(id, 'CRITICAL', `Extreme Temperature Spike detected: ${updatedMachine.temperature}°C.`);
          lastStateRef.current[id] = { ...lastStateRef.current[id], tempSpike: true };
        } else if (updatedMachine.temperature <= 90) {
          lastStateRef.current[id] = { ...lastStateRef.current[id], tempSpike: false };
        }

        // Create new history entry
        const historyEntry = {
          time: timestamp,
          temperature: updatedMachine.temperature,
          vibration: updatedMachine.vibration,
          power_usage: updatedMachine.power_usage,
          status: newStatus,
          healthScore: newHealth
        };
        updatedMachine.history = [...m.history, historyEntry].slice(-50);
        return updatedMachine;
      }
      return m;
    }));
  };

  // Prediction Lock Ref (Set of IDs currently processing)
  const requestLocks = useRef(new Set());


  // Timestamp Ref for interval control (45 seconds)
  const lastPredictionTimes = useRef({});

  // Helper: Just update sensor values (No API Call)
  const updateSensorValues = (id, dataParams) => {
    setMachines(prev => prev.map(m =>
      m.id === id ? { ...m, ...dataParams } : m
    ));
  };

  // Helper: Predict for a specific machine (API Call)
  const predictForMachine = async (id, dataParams) => {
    if (requestLocks.current.has(id)) return;
    requestLocks.current.add(id);

    // Only show LOADING... if the machine has no previous status (like 'Pending')
    setMachines(prev => prev.map(m =>
      m.id === id ? { ...m, ...dataParams, status: (m.status === 'Pending' || m.status === 'OFFLINE') ? "LOADING..." : m.status } : m
    ));

    try {
      // 10 Second Timeout - Rule based is fast, but better safe
      const response = await axios.post(`${API_BASE_URL}/api/predict`, dataParams, { timeout: 10000 });

      if (response.data.prediction) {
        updateMachineStatus(id, response.data.prediction, dataParams); // Pass dataParams to history
      } else {
        updateMachineStatus(id, "ERROR", dataParams); // Pass dataParams to history
      }
    } catch (error) {
      console.error(`Error predicting for ${id}`, error);
      updateMachineStatus(id, "OFFLINE", dataParams); // Pass dataParams to history
    } finally {
      requestLocks.current.delete(id);
    }
  };

  // When machine selection changes, load its current data
  const handleMachineSelect = (e) => {
    const id = e.target.value;
    setSelectedMachineId(id);
    const machine = machines.find(m => m.id === id);
    if (machine) {
      setFormData({
        temperature: machine.temperature,
        vibration: machine.vibration,
        power_usage: machine.power_usage
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manual Prediction Handler
  const predictFailure = async () => {
    if (!formData.temperature || !formData.vibration || !formData.power_usage) {
      alert("Please enter all sensor values");
      return;
    }

    // Use shared logic
    await predictForMachine(selectedMachineId, {
      temperature: Number(formData.temperature),
      vibration: Number(formData.vibration),
      power_usage: Number(formData.power_usage)
    });
  };

  // Simulation Logic (Always runs in background)
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        INITIAL_MACHINES.forEach((machine, index) => {
          const simulatedData = {
            temperature: Number(getRandom(60, 95)),
            vibration: Number(getRandom(0.5, 3.0)),
            power_usage: Number(getRandom(30, 75))
          };

          const now = Date.now();
          const lastTime = lastPredictionTimes.current[machine.id] || 0;

          // Prediction threshold: 45 seconds (45000 ms)
          if (now - lastTime > 45000) {
            lastPredictionTimes.current[machine.id] = now;
            // STAGGER: Delay each prediction to prevent backend congestion
            setTimeout(() => {
              predictForMachine(machine.id, simulatedData);
            }, index * 1000);
          } else {
            // Just update sensor values, keep previous status
            updateSensorValues(machine.id, simulatedData);
          }
        });
      }, 3000); // Sensor data updates every 3 seconds
    } else {
      lastPredictionTimes.current = {}; // Reset for fresh start
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulating]);

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
  };

  // SUB-COMPONENT: Dashboard Overview
  const Dashboard = () => (
    <div className="dashboard-content">
      <div className="control-panel">
        <div style={{ marginBottom: '25px', paddingBottom: '15px', borderBottom: '2px solid #ecf0f1' }}>
          <h2>Simulation Control</h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontWeight: 'bold', color: isSimulating ? 'green' : '#7f8c8d' }}>
              {isSimulating ? "🟢 Live Simulation Running" : "🔴 Simulation Stopped"}
            </span>
          </div>
          <button
            onClick={toggleSimulation}
            style={{ backgroundColor: isSimulating ? '#e74c3c' : '#27ae60' }}
          >
            {isSimulating ? "⏸ Stop Simulation" : "▶ Start Simulation"}
          </button>
        </div>

        <h2>Manual Test Input</h2>
        <div className="form-group">
          <label>Select Machine:</label>
          <select value={selectedMachineId} onChange={handleMachineSelect} disabled={isSimulating}>
            {machines.map(m => (
              <option key={m.id} value={m.id}>{m.id}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Temperature (°C)</label>
          <input type="number" name="temperature" value={formData.temperature} placeholder="e.g. 60" onChange={handleInputChange} disabled={isSimulating} />
        </div>
        <div className="form-group">
          <label>Vibration (mm/s)</label>
          <input type="number" name="vibration" value={formData.vibration} placeholder="e.g. 0.5" onChange={handleInputChange} disabled={isSimulating} />
        </div>
        <div className="form-group">
          <label>Power Usage (kWh)</label>
          <input type="number" name="power_usage" value={formData.power_usage} placeholder="e.g. 100" onChange={handleInputChange} disabled={isSimulating} />
        </div>
        <button onClick={predictFailure} disabled={isSimulating} style={{ opacity: isSimulating ? 0.6 : 1 }}>
          Analyze Manual Input
        </button>
      </div>

      <div className="machine-grid">
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </div>
    </div>
  );

  // Main App Content (After Login)
  const MainApp = () => {
    const { isAuthenticated, hasPermission } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return (
      <div className="dashboard-container">
        <nav className="main-nav">
          <h1>🏭 <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Smart Factory Monitoring</Link></h1>
          <div className="nav-links">
            <Link to="/" className="nav-link">Overview</Link>
            {hasPermission('view_alerts') && (
              <Link to="/alerts" className="nav-link alert-nav-link">
                Alerts {alerts.length > 0 && <span className="alert-count">{alerts.length}</span>}
              </Link>
            )}
            <RoleIndicator />
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/machine/:id"
            element={
              <ProtectedRoute requiredPermission="view_machine_details">
                <MachineDetail machines={machines} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alerts"
            element={
              <ProtectedRoute requiredPermission="view_alerts">
                <AlertsPage alerts={alerts} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    );
  };

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
