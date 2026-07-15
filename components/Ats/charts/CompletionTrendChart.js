'use client';

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const CompletionTrendChart = ({ history = [] }) => {
    const data = [...history].reverse().map((h, i) => ({
        index: i + 1,
        completion: h.completion,
        date: new Date(h.timestamp).toLocaleDateString(),
    }));

    if (data.length < 2) {
        return <p className="text-sm text-fg-muted">Completion trend appears once there are at least two analyses.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <defs>
                    <linearGradient id="completionFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="index" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="completion" stroke="#34d399" strokeWidth={2} fill="url(#completionFill)" />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default CompletionTrendChart;
