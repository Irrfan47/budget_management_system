import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    subValue: string;
    highlight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, highlight = false }) => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <h3 className={`text-sm font-medium mb-2 ${highlight ? 'text-red-500' : 'text-slate-500'}`}>{title}</h3>
            <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
            <div className="text-xs text-slate-400">{subValue}</div>
        </div>
    );
};

export default StatCard;
