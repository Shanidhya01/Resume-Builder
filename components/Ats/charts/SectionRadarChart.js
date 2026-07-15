'use client';

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

const LABELS = {
    header: 'Header', summary: 'Summary', experience: 'Experience', projects: 'Projects',
    education: 'Education', skills: 'Skills', certificates: 'Certificates',
    formatting: 'Formatting', keywordMatch: 'Keywords', readability: 'Readability',
};

const SectionRadarChart = ({ sectionScores = {} }) => {
    const data = Object.entries(sectionScores).map(([key, value]) => ({ section: LABELS[key] || key, score: value }));

    return (
        <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={data} outerRadius="75%">
                <PolarGrid stroke="rgba(148,163,184,0.2)" />
                <PolarAngleAxis dataKey="section" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.35)', borderRadius: 8, fontSize: 12 }} />
                <Radar dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.35} />
            </RadarChart>
        </ResponsiveContainer>
    );
};

export default SectionRadarChart;
