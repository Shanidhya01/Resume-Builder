'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

const COLORS = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#f472b6', '#38bdf8'];

const KeywordDistributionChart = ({ keywords = [] }) => {
    const data = keywords.slice(0, 10).map(k => ({ keyword: k.keyword, count: k.count }));

    if (data.length === 0) {
        return <p className="text-sm text-slate-400">No keyword data yet — add more content to your resume.</p>;
    }

    return (
        <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" fontSize={12} allowDecimals={false} />
                <YAxis type="category" dataKey="keyword" stroke="#94a3b8" fontSize={11} width={90} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #7c3aed40', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                    {data.map((entry, i) => (
                        <Cell key={entry.keyword} fill={COLORS[i % COLORS.length]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};

export default KeywordDistributionChart;
