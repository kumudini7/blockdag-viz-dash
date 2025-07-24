import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Database, Zap, Clock, Users, DollarSign } from 'lucide-react';

// Mock data for real-time stats
const generateMockData = () => ({
  tps: Math.floor(Math.random() * 1000) + 500,
  blockHeight: Math.floor(Math.random() * 100000) + 500000,
  gasUsage: Math.floor(Math.random() * 80) + 20,
  mempoolSize: Math.floor(Math.random() * 5000) + 1000,
  activeNodes: Math.floor(Math.random() * 50) + 100,
  totalSupply: '21000000',
  marketCap: '$1.2B',
  avgBlockTime: Math.random() * 2 + 1
});

const chartData = [
  { time: '00:00', tps: 650, blocks: 45 },
  { time: '04:00', tps: 720, blocks: 52 },
  { time: '08:00', tps: 890, blocks: 61 },
  { time: '12:00', tps: 1100, blocks: 78 },
  { time: '16:00', tps: 950, blocks: 65 },
  { time: '20:00', tps: 820, blocks: 58 },
];

const gasData = [
  { name: 'Contract Calls', value: 45, color: '#8b5cf6' },
  { name: 'Transfers', value: 30, color: '#06b6d4' },
  { name: 'DEX Swaps', value: 15, color: '#10b981' },
  { name: 'NFT Mints', value: 10, color: '#f59e0b' },
];

const Analytics = () => {
  const [stats, setStats] = useState(generateMockData());
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isLive) {
        setStats(generateMockData());
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isLive]);

  const StatCard = ({ title, value, change, icon: Icon, description }: any) => (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {change > 0 ? <TrendingUp className="h-3 w-3 text-green-500" /> : <TrendingDown className="h-3 w-3 text-red-500" />}
          <span className={change > 0 ? 'text-green-500' : 'text-red-500'}>
            {Math.abs(change)}%
          </span>
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Real-time BlockDAG network statistics</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={isLive ? "default" : "secondary"} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            {isLive ? 'Live' : 'Paused'}
          </Badge>
          <button
            onClick={() => setIsLive(!isLive)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {isLive ? 'Pause' : 'Resume'}
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Transactions Per Second"
          value={stats.tps.toLocaleString()}
          change={12.5}
          icon={Zap}
          description="from last hour"
        />
        <StatCard
          title="Block Height"
          value={stats.blockHeight.toLocaleString()}
          change={8.2}
          icon={Database}
          description="blocks processed"
        />
        <StatCard
          title="Gas Usage"
          value={`${stats.gasUsage}%`}
          change={-3.1}
          icon={Activity}
          description="network capacity"
        />
        <StatCard
          title="Active Nodes"
          value={stats.activeNodes}
          change={5.7}
          icon={Users}
          description="validators online"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Performance</CardTitle>
            <CardDescription>TPS and Block Production (24h)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="tps" stroke="#8b5cf6" strokeWidth={2} />
                <Line type="monotone" dataKey="blocks" stroke="#06b6d4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gas Usage by Type</CardTitle>
            <CardDescription>Transaction distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={gasData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gasData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Network Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network Uptime</span>
                <span>99.98%</span>
              </div>
              <Progress value={99.98} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Validator Participation</span>
                <span>94.2%</span>
              </div>
              <Progress value={94.2} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Mempool Utilization</span>
                <span>{stats.gasUsage}%</span>
              </div>
              <Progress value={stats.gasUsage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Blocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                  <div>
                    <p className="font-mono text-sm">#{(stats.blockHeight - i).toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{Math.floor(Math.random() * 100)} txs</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{i === 0 ? 'Just now' : `${i * 2}s ago`}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Market Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-mono">{stats.marketCap}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Supply</span>
              <span className="font-mono">{stats.totalSupply} BDAG</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Avg Block Time</span>
              <span className="font-mono">{stats.avgBlockTime.toFixed(2)}s</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mempool Size</span>
              <span className="font-mono">{stats.mempoolSize.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;