import { useNavigate } from 'react-router-dom';

// Machine Card Component for displaying individual machine status
const MachineCard = ({ machine }) => {
    const navigate = useNavigate();

    // Use healthScore from machine state (updated every 45s)
    const healthScore = machine.healthScore || 100;
    const healthColor = healthScore >= 80 ? '#27ae60' : healthScore >= 50 ? '#f1c40f' : '#e74c3c';

    // Determine status class
    const getStatusClass = (status) => {
        switch (status) {
            case 'NORMAL': return 'card-normal';
            case 'FAILURE': return 'card-failure';
            default: return '';
        }
    };

    const badgeClass = (status) => {
        switch (status) {
            case 'NORMAL': return 'status-normal';
            case 'FAILURE': return 'status-failure';
            default: return 'status-pending';
        }
    };

    // AI Insights Logic: Generate reasons and recommendations based on thresholds
    const getAIInsights = () => {
        if (machine.status === 'NORMAL') {
            return {
                reasons: ["Optimal condition: All sensors within safe limits."],
                actions: ["Continue routine operations."],
                class: 'insights-normal'
            };
        }

        if (machine.status === 'FAILURE') {
            const reasons = [];
            const actions = [];

            if (machine.temperature > 85) {
                reasons.push("Overheating detected (>85°C)");
                actions.push("Check cooling system and reduce load");
            }
            if (machine.vibration > 2.0) {
                reasons.push("Excessive vibration (>2.0 mm/s)");
                actions.push("Inspect bearings and mechanical alignment");
            }
            if (machine.power_usage > 65) {
                reasons.push("High energy consumption (>65 kWh)");
                actions.push("Analyze motor efficiency and investigate surges");
            }

            // Fallback if the AI detected failure but no individual threshold was hit (unlikely with our rule-based mock)
            if (reasons.length === 0) {
                reasons.push("Abnormal pattern detected by AI model");
                actions.push("Perform full diagnostic check");
            }

            return { reasons, actions, class: 'insights-failure' };
        }

        return null; // For Pending or Loading
    };

    const insights = getAIInsights();

    return (
        <div
            className={`machine-card ${getStatusClass(machine.status)}`}
            onClick={() => navigate(`/machine/${machine.id}`)}
            style={{ cursor: 'pointer' }}
        >
            <div className="card-header">
                <div className="title-section">
                    <h3>🏭 {machine.id}</h3>
                    <span className={`status-badge ${badgeClass(machine.status)}`}>
                        {machine.status === 'NORMAL' && '🟢 '}
                        {machine.status === 'FAILURE' && '🔴 '}
                        {machine.status === 'Pending' && '⚪ '}
                        {machine.status === 'LOADING...' && '⏳ '}
                        {machine.status}
                    </span>
                </div>

                {/* Health Score Ring */}
                <div className="health-ring-container">
                    <div className="health-ring" style={{
                        background: `conic-gradient(${healthColor} ${healthScore * 3.6}deg, #ecf0f1 0deg)`
                    }}>
                        <div className="health-ring-inner">
                            <span style={{ color: healthColor }}>{healthScore}%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card-body">
                <div className="data-row">
                    <span>🌡️ Temp</span>
                    <span className="data-val">{machine.temperature}°C</span>
                </div>
                <div className="data-row">
                    <span>⚠️ Vib</span>
                    <span className="data-val">{machine.vibration} mm/s</span>
                </div>
                <div className="data-row">
                    <span>⚡ Power</span>
                    <span className="data-val">{machine.power_usage} kWh</span>
                </div>

                {insights && (
                    <div className="ai-insights">
                        {machine.status === 'NORMAL' ? (
                            <div className="safe-insights">
                                <span className="insight-header">System Health</span>
                                <div className="status-health-bar">
                                    <div className="health-fill"></div>
                                </div>
                                <div className="safe-msg">
                                    <span>✅</span>
                                    <span>Operating within safe parameters</span>
                                </div>
                            </div>
                        ) : (
                            <div className="failure-insights">
                                <span className="insight-header">Active Alarms</span>
                                <div className="alert-container">
                                    {insights.reasons.map((r, i) => (
                                        <div key={i} className="alert-item">
                                            <span>🚨</span> {r}
                                        </div>
                                    ))}
                                </div>

                                <span className="insight-header">Required Actions</span>
                                <div className="recommendation-grid">
                                    {insights.actions.map((a, i) => (
                                        <div key={i} className="task-chip">
                                            {a}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MachineCard;
