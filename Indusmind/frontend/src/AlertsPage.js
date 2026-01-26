import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AlertsPage = ({ alerts }) => {
    const navigate = useNavigate();
    const [filterMachine, setFilterMachine] = useState('ALL');
    const [filterSeverity, setFilterSeverity] = useState('ALL');

    // Filter Logic
    const filteredAlerts = alerts.filter(alert => {
        const matchMachine = filterMachine === 'ALL' || alert.machineId === filterMachine;
        const matchSeverity = filterSeverity === 'ALL' || alert.severity === filterSeverity;
        return matchMachine && matchSeverity;
    });

    // Unique machine IDs for filter dropdown
    const machineIds = ['ALL', ...new Set(alerts.map(a => a.machineId))];

    const getSeverityClass = (sev) => {
        switch (sev) {
            case 'CRITICAL': return 'alert-sev-critical';
            case 'WARNING': return 'alert-sev-warning';
            case 'INFO': return 'alert-sev-info';
            default: return '';
        }
    };

    const getSeverityIcon = (sev) => {
        switch (sev) {
            case 'CRITICAL': return '🚨';
            case 'WARNING': return '⚠️';
            case 'INFO': return 'ℹ️';
            default: return '🔔';
        }
    };

    return (
        <div className="alerts-container">
            <div className="alerts-header">
                <div className="header-top">
                    <button className="back-btn" onClick={() => navigate('/')}>← Dashboard</button>
                    <h1>System Event Log</h1>
                </div>

                <div className="filter-bar">
                    <div className="filter-group">
                        <label>Filter Machine:</label>
                        <select value={filterMachine} onChange={(e) => setFilterMachine(e.target.value)}>
                            {machineIds.map(id => <option key={id} value={id}>{id}</option>)}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label>Filter Severity:</label>
                        <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
                            <option value="ALL">All Severities</option>
                            <option value="CRITICAL">Critical</option>
                            <option value="WARNING">Warning</option>
                            <option value="INFO">Info</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="alerts-list">
                {filteredAlerts.length === 0 ? (
                    <div className="no-alerts">No events match your current filters.</div>
                ) : (
                    filteredAlerts.map((alert, index) => (
                        <div key={index} className={`alert-row ${getSeverityClass(alert.severity)}`}>
                            <div className="alert-icon-cell">
                                {getSeverityIcon(alert.severity)}
                            </div>
                            <div className="alert-time-cell">
                                {alert.time}
                            </div>
                            <div className="alert-machine-cell">
                                <span className="machine-tag">{alert.machineId}</span>
                            </div>
                            <div className="alert-desc-cell">
                                <strong>[{alert.severity}]</strong> {alert.description}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertsPage;
