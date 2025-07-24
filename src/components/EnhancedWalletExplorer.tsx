import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Copy, ExternalLink, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const mockWalletData = {
  address: '0x1234567890abcdef1234567890abcdef12345678',
  balance: '1,456.789',
  balanceUSD: '$2,913.58',
  transactions: 1247,
  firstSeen: '2023-01-15',
  lastActive: '2025-01-24',
};

const mockTransactions = [
  {
    id: 'tx_1',
    hash: '0xabc123def456...',
    type: 'send',
    amount: '-125.5',
    to: '0x9876543210fedcba...',
    timestamp: Date.now() - 300000,
    status: 'confirmed',
    gasUsed: 21000,
    gasPrice: '20'
  },
  {
    id: 'tx_2',
    hash: '0xdef456abc123...',
    type: 'receive',
    amount: '+50.0',
    from: '0x1111222233334444...',
    timestamp: Date.now() - 600000,
    status: 'confirmed',
    gasUsed: 21000,
    gasPrice: '18'
  },
  {
    id: 'tx_3',
    hash: '0x789abc123def...',
    type: 'contract',
    amount: '-0.05',
    to: '0xcontract123456...',
    timestamp: Date.now() - 900000,
    status: 'pending',
    gasUsed: 85000,
    gasPrice: '22'
  }
];

const balanceHistory = [
  { date: '2025-01-20', balance: 1200 },
  { date: '2025-01-21', balance: 1350 },
  { date: '2025-01-22', balance: 1289 },
  { date: '2025-01-23', balance: 1456 },
  { date: '2025-01-24', balance: 1456.789 }
];

const tokenHoldings = [
  { name: 'BDAG', balance: '1,456.789', value: '$2,913.58', percentage: 85, color: '#8b5cf6' },
  { name: 'USDT', balance: '250.00', value: '$250.00', percentage: 10, color: '#06b6d4' },
  { name: 'ETH', balance: '0.15', value: '$375.00', percentage: 5, color: '#10b981' }
];

const EnhancedWalletExplorer = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [walletData, setWalletData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSearch = async () => {
    if (!walletAddress.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setWalletData(mockWalletData);
      setIsLoading(false);
    }, 1000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'receive': return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      default: return <Wallet className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Wallet Explorer</h1>
        <p className="text-muted-foreground">Analyze wallet addresses, balances, and transaction history</p>
      </div>

      {/* Search Interface */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Enter wallet address (0x...)"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={isLoading} className="px-8">
              {isLoading ? 'Searching...' : 'Explore Wallet'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Data */}
      {walletData && (
        <div className="space-y-6">
          {/* Wallet Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Wallet Overview
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <span className="font-mono">{walletData.address}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(walletData.address)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{walletData.balance} BDAG</h3>
                  <p className="text-sm text-muted-foreground">{walletData.balanceUSD}</p>
                  <p className="text-xs text-green-500 flex items-center justify-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +5.2% (24h)
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold">{walletData.transactions}</h3>
                  <p className="text-sm text-muted-foreground">Total Transactions</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold">{walletData.firstSeen}</h3>
                  <p className="text-sm text-muted-foreground">First Seen</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-bold">{walletData.lastActive}</h3>
                  <p className="text-sm text-muted-foreground">Last Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="tokens">Token Holdings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Balance History</CardTitle>
                    <CardDescription>Balance changes over the last 5 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={balanceHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="balance" stroke="#8b5cf6" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Distribution</CardTitle>
                    <CardDescription>Token holdings breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={tokenHoldings}
                          cx="50%"
                          cy="50%"
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="percentage"
                          label={({ name, percentage }) => `${name} ${percentage}%`}
                        >
                          {tokenHoldings.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Recent wallet activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Hash</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getTransactionIcon(tx.type)}
                              <span className="capitalize">{tx.type}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{formatAddress(tx.hash)}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => copyToClipboard(tx.hash)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className={`font-mono ${tx.amount.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                              {tx.amount} BDAG
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="font-mono text-sm">
                              {formatAddress(tx.to || tx.from || '')}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(tx.timestamp).toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant={tx.status === 'confirmed' ? 'default' : 'secondary'}>
                              {tx.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tokens" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tokenHoldings.map((token, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{token.name}</h3>
                          <p className="text-2xl font-bold">{token.balance}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-medium">{token.value}</p>
                          <p className="text-sm text-muted-foreground">{token.percentage}%</p>
                        </div>
                      </div>
                      <Progress value={token.percentage} className="h-2" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Patterns</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Most Active Hour</span>
                      <span className="font-mono">14:00 UTC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Transaction Value</span>
                      <span className="font-mono">45.2 BDAG</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Gas Spent</span>
                      <span className="font-mono">12.5 BDAG</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contract Interactions</span>
                      <span className="font-mono">156</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Risk Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Wallet Age Score</span>
                        <span>High</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Activity Score</span>
                        <span>Medium</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Diversity Score</span>
                        <span>Low</span>
                      </div>
                      <Progress value={30} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default EnhancedWalletExplorer;