import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
    { name: 'Healthcare', value: 35, color: '#0f172a' }, // Primary
    { name: 'Education', value: 25, color: '#334155' }, // Slate 700
    { name: 'Infrastructure', value: 20, color: '#64748b' }, // Slate 500
    { name: 'Public Safety', value: 15, color: '#94a3b8' }, // Slate 400
    { name: 'Other', value: 5, color: '#cbd5e1' }, // Slate 300
];

const BudgetChart = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Budget Allocation by Department</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            iconType="rect"
                            iconSize={12}
                            formatter={(value) => <span className="text-xs text-slate-500 ml-1">{value}</span>}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default BudgetChart;
