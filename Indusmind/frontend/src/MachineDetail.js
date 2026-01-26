import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const MachineDetail = ({ machines }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const machine = machines.find(m => m.id === id);

    if (!machine) return <div className="detail-container">Machine not found</div>;

    // Use healthScore from machine state (updated every 45s)
    const healthScore = machine.healthScore || 100;
    const healthColor = healthScore >= 80 ? '#27ae60' : healthScore >= 50 ? '#f1c40f' : '#e74c3c';
    const condition = healthScore >= 80 ? 'EXCELLENT' : healthScore >= 50 ? 'GOOD' : 'CRITICAL';

    return (
        <div className="detail-container">
            <div className="detail-header">
                <button className="back-btn" onClick={() => navigate('/')}>← Back to Dashboard</button>

                <div className="detail-health-header">
                    <div className="large-health-ring" style={{
                        background: `conic-gradient(${healthColor} ${healthScore * 3.6}deg, #ecf0f1 0deg)`
                    }}>
                        <div className="large-health-ring-inner">
                            <span style={{ color: healthColor }}>{healthScore}%</span>
                        </div>
                    </div>

                    <div className="health-label">
                        <span className="insight-header">Machine Health Index</span>
                        <h1>{machine.id} Analysis</h1>
                        <div className="health-status-text" style={{ color: healthColor }}>
                            Current Condition: {condition}
                        </div>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                {/* Temperature Chart */}
                <div className="chart-card">
                    <h3>Temperature Trend (°C)</h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <LineChart data={machine.history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="temperature" stroke="#ff7675" strokeWidth={3} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Vibration Chart */}
                <div className="chart-card">
                    <h3>Vibration Analysis (mm/s)</h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <LineChart data={machine.history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="vibration" stroke="#fdcb6e" strokeWidth={3} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Power Usage Chart */}
                <div className="chart-card">
                    <h3>Power Consumption (kW)</h3>
                    <div style={{ width: '100%', height: 250 }}>
                        <ResponsiveContainer>
                            <LineChart data={machine.history}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="time" hide />
                                <YAxis domain={['auto', 'auto']} />
                                <Tooltip />
                                <Line type="monotone" dataKey="power_usage" stroke="#74b9ff" strokeWidth={3} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status History Table */}
                <div className="chart-card full-width">
                    <h3>Prediction History Log</h3>
                    <div className="history-table-wrapper">
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Temp</th>
                                    <th>Vibration</th>
                                    <th>Power</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...machine.history].reverse().slice(0, 10).map((log, i) => (
                                    <tr key={i}>
                                        <td>{log.time}</td>
                                        <td>{log.temperature}°C</td>
                                        <td>{log.vibration}</td>
                                        <td>{log.power_usage}</td>
                                        <td>
                                            <span className={`log-badge ${log.status === 'NORMAL' ? 'log-normal' : 'log-failure'}`}>
                                                {log.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MachineDetail;
