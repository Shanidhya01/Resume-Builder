'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const AtsHistoryChart = ({ history = [] }) => {
    const data = [...history].reverse().map((h, i) => ({
        index: i + 1,
        score: h.overall,
        date: new Date(h.timestamp).toLocaleDateString(),
    }));

    if (data.length < 2) {
        return <p className="text-sm text-fg-muted">Keep editing your resume — the ATS score history chart appears once there are at least two analyses.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="index" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, fontSize: 12 }}
                    labelFormatter={i => data[i - 1]?.date || ''}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6' }} activeDot={{ r: 5 }} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default AtsHistoryChart;
