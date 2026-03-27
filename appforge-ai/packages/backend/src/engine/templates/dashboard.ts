import { GeneratedFile } from '../index';

export function getDashboardTemplate(): GeneratedFile[] {
  return [
    {
      path: 'src/App.tsx',
      content: `import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-gray-900">{{APP_NAME}}</h1>
          <nav className="flex items-center gap-4">
            <a href="/" className="text-sm font-medium text-indigo-600">Dashboard</a>
          </nav>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
`,
    },
    {
      path: 'src/pages/DashboardPage.tsx',
      content: `import { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';

interface Stats {
  totalUsers: number;
  revenue: number;
  orders: number;
  conversionRate: number;
}

interface MetricRow {
  id: string;
  name: string;
  value: number;
  change: number;
  date: string;
}

function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/metrics/stats').then((r) => r.json()),
      fetch('/api/metrics').then((r) => r.json()),
    ])
      .then(([statsData, metricsData]) => {
        setStats(statsData);
        setMetrics(metricsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="py-20 text-center text-gray-400">Loading dashboard...</div>;
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Overview</h2>

      {stats && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            change={12.5}
            icon="users"
          />
          <StatCard
            title="Revenue"
            value={\`$\${stats.revenue.toLocaleString()}\`}
            change={8.2}
            icon="dollar"
          />
          <StatCard
            title="Orders"
            value={stats.orders.toLocaleString()}
            change={-3.1}
            icon="cart"
          />
          <StatCard
            title="Conversion Rate"
            value={\`\${stats.conversionRate}%\`}
            change={1.8}
            icon="chart"
          />
        </div>
      )}

      <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Revenue Trend</h3>
        <div className="flex h-64 items-end gap-2">
          {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 95, 70].map((h, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t bg-indigo-500 transition-all hover:bg-indigo-600"
                style={{ height: \`\${h}%\` }}
              />
              <span className="text-xs text-gray-400">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Metrics</h3>
        <DataTable data={metrics} />
      </div>
    </main>
  );
}

export default DashboardPage;
`,
    },
    {
      path: 'src/components/StatCard.tsx',
      content: `interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: 'users' | 'dollar' | 'cart' | 'chart';
}

const iconMap: Record<string, string> = {
  users: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  dollar: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  cart: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z',
  chart: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
};

function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change >= 0;

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <div className="rounded-lg bg-indigo-50 p-2">
          <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconMap[icon]} />
          </svg>
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className={\`mt-1 flex items-center text-sm \${isPositive ? 'text-green-600' : 'text-red-600'}\`}>
          <span>{isPositive ? '+' : ''}{change}%</span>
          <span className="ml-1 text-gray-400">vs last month</span>
        </p>
      </div>
    </div>
  );
}

export default StatCard;
`,
    },
    {
      path: 'src/components/DataTable.tsx',
      content: `interface MetricRow {
  id: string;
  name: string;
  value: number;
  change: number;
  date: string;
}

interface DataTableProps {
  data: MetricRow[];
}

function DataTable({ data }: DataTableProps) {
  if (data.length === 0) {
    return <p className="py-8 text-center text-gray-400">No data available</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 text-left text-sm text-gray-500">
            <th className="pb-3 font-medium">Metric</th>
            <th className="pb-3 font-medium">Value</th>
            <th className="pb-3 font-medium">Change</th>
            <th className="pb-3 font-medium">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((row) => (
            <tr key={row.id} className="text-sm">
              <td className="py-3 font-medium text-gray-900">{row.name}</td>
              <td className="py-3 text-gray-700">{row.value.toLocaleString()}</td>
              <td className="py-3">
                <span
                  className={\`inline-flex rounded-full px-2 py-0.5 text-xs font-medium \${
                    row.change >= 0
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }\`}
                >
                  {row.change >= 0 ? '+' : ''}{row.change}%
                </span>
              </td>
              <td className="py-3 text-gray-500">
                {new Date(row.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
`,
    },
    {
      path: 'server/index.ts',
      content: `import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Get aggregated stats
app.get('/api/metrics/stats', async (_req, res) => {
  const metrics = await prisma.metric.findMany();
  const totalUsers = metrics.find((m) => m.name === 'Total Users')?.value ?? 0;
  const revenue = metrics.find((m) => m.name === 'Revenue')?.value ?? 0;
  const orders = metrics.find((m) => m.name === 'Orders')?.value ?? 0;
  const conversionRate = metrics.find((m) => m.name === 'Conversion Rate')?.value ?? 0;

  res.json({ totalUsers, revenue, orders, conversionRate });
});

// Get all metrics
app.get('/api/metrics', async (_req, res) => {
  const metrics = await prisma.metric.findMany({
    orderBy: { date: 'desc' },
  });
  res.json(metrics);
});

// Create a metric
app.post('/api/metrics', async (req, res) => {
  const { name, value, change } = req.body;
  if (!name || value === undefined) {
    return res.status(400).json({ error: 'Name and value are required' });
  }
  const metric = await prisma.metric.create({
    data: { name, value, change: change ?? 0 },
  });
  res.status(201).json(metric);
});

// Delete a metric
app.delete('/api/metrics/:id', async (req, res) => {
  try {
    await prisma.metric.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Metric not found' });
  }
});

app.listen(PORT, () => {
  console.log(\`Server running on http://localhost:\${PORT}\`);
});
`,
    },
    {
      path: 'prisma/schema.prisma',
      content: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Metric {
  id     String   @id @default(cuid())
  name   String
  value  Float
  change Float    @default(0)
  date   DateTime @default(now())
}
`,
    },
    {
      path: '.env',
      content: `DATABASE_URL="file:./dev.db"
`,
    },
  ];
}
