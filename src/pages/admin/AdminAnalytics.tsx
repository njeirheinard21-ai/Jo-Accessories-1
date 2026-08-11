import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { DollarSign, TrendingUp, Users, ShoppingBag } from "lucide-react"

const data = [
  { name: 'Jan', revenue: 4000, orders: 240 },
  { name: 'Feb', revenue: 3000, orders: 139 },
  { name: 'Mar', revenue: 2000, orders: 980 },
  { name: 'Apr', revenue: 2780, orders: 390 },
  { name: 'May', revenue: 1890, orders: 480 },
  { name: 'Jun', revenue: 2390, orders: 380 },
  { name: 'Jul', revenue: 3490, orders: 430 },
]

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('7d')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-serif font-bold tracking-widest uppercase">Analytics Overview</h1>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-ash-light rounded-md px-3 py-2 text-sm focus:outline-none focus:border-ash"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="12m">Last 12 Months</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-ash-muted">Gross Sales</h3>
            <DollarSign className="w-5 h-5 text-ash-muted" />
          </div>
          <p className="text-3xl font-semibold">$24,592.00</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +12.5% from last period
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-ash-muted">Total Orders</h3>
            <ShoppingBag className="w-5 h-5 text-ash-muted" />
          </div>
          <p className="text-3xl font-semibold">1,249</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +8.2% from last period
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-ash-muted">Conversion Rate</h3>
            <TrendingUp className="w-5 h-5 text-ash-muted" />
          </div>
          <p className="text-3xl font-semibold">3.4%</p>
          <p className="text-sm text-red-500 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4 rotate-180" /> -1.1% from last period
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-ash-muted">Store Visits</h3>
            <Users className="w-5 h-5 text-ash-muted" />
          </div>
          <p className="text-3xl font-semibold">36,738</p>
          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" /> +15.3% from last period
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <h3 className="text-lg font-semibold mb-6">Revenue Over Time</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`$${value}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="#000" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#000' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-ash-light">
          <h3 className="text-lg font-semibold mb-6">Orders by Month</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="orders" fill="#000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
