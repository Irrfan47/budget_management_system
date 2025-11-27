import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', value: 450000 },
    { name: 'Feb', value: 520000 },
    { name: 'Mar', value: 480000 },
    { name: 'Apr', value: 610000 },
    { name: 'May', value: 590000 },
    { name: 'Jun', value: 680000 },
];

const SpendingTrendChart = () => {
    return (
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Monthly Spending Trend</h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            tickFormatter={(value) => `${value / 1000}k`}
                        />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Spending']}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#0f172a"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#fff' }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SpendingTrendChart;
