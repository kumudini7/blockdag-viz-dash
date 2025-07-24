import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet, Activity, Globe, Zap } from 'lucide-react';

// Mock wallet connection
const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [balance, setBalance] = useState('0');

  const connect = async () => {
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnected(true);
      setAddress('0x1234567890abcdef1234567890abcdef12345678');
      setBalance('1,456.789');
    }, 1000);
  };

  const disconnect = () => {
    setIsConnected(false);
    setAddress('');
    setBalance('0');
  };

  return { isConnected, address, balance, connect, disconnect };
};

const Home = () => {
  const { isConnected, address, balance, connect, disconnect } = useWallet();
  const [liveData, setLiveData] = useState({
    tps: 850,
    blockHeight: 1234567,
    gasPrice: 20,
    activeNodes: 156
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        tps: Math.floor(Math.random() * 200) + 750,
        blockHeight: prev.blockHeight + Math.floor(Math.random() * 3) + 1,
        gasPrice: Math.floor(Math.random() * 10) + 15,
        activeNodes: Math.floor(Math.random() * 20) + 140
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20">
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Flowing connections */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full">
            <defs>
              <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="url(#connectionGradient)"
                strokeWidth="1"
                className="animate-pulse"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '4s'
                }}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            BlockDAG Vision
          </h1>
          <p className="text-xl text-muted-foreground mb-2">
            Visual Explorer & Developer Dashboard
          </p>
          <p className="text-lg text-muted-foreground mb-8">
            For the BlockDAG Primordial Testnet
          </p>
          
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <p className="text-lg leading-relaxed">
              Explore the next generation of blockchain technology with our comprehensive developer dashboard. 
              Built for the BlockDAG Primordial Testnet, this platform combines the transparency of Etherscan 
              with the analytics power of Dune, tailored specifically for DAG architecture.
            </p>
          </div>
        </div>

        {/* Wallet Connection */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-primary/20 bg-gradient-to-r from-card to-muted/20">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Wallet className="w-6 h-6" />
                BlockDAG Network Connection
              </CardTitle>
              <CardDescription>
                Connect your MetaMask wallet to access live data and interact with the testnet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <Button onClick={connect} className="w-full" size="lg">
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect to BlockDAG Network
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Connected Wallet</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{balance} BDAG</p>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Connected
                      </Badge>
                    </div>
                  </div>
                  <Button onClick={disconnect} variant="outline" className="w-full">
                    Disconnect Wallet
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Live Network Stats */}
        {isConnected && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Live Network Analytics</h2>
              <p className="text-muted-foreground">Real-time data from your connected wallet</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">TPS</p>
                      <p className="text-2xl font-bold">{liveData.tps.toLocaleString()}</p>
                    </div>
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Block Height</p>
                      <p className="text-2xl font-bold">{liveData.blockHeight.toLocaleString()}</p>
                    </div>
                    <Activity className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Gas Price</p>
                      <p className="text-2xl font-bold">{liveData.gasPrice} gwei</p>
                    </div>
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Active Nodes</p>
                      <p className="text-2xl font-bold">{liveData.activeNodes}</p>
                    </div>
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Features Overview */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Explore BlockDAG</h2>
            <p className="text-lg text-muted-foreground">
              Comprehensive tools for developers and researchers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>📊 Analytics Dashboard</CardTitle>
                <CardDescription>
                  Real-time network metrics, TPS monitoring, and performance analytics
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>🎨 DAG Visualization</CardTitle>
                <CardDescription>
                  Interactive network graph showing block relationships and dependencies
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>🔍 Block Explorer</CardTitle>
                <CardDescription>
                  Search and analyze blocks, transactions, and wallet addresses
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>🔌 Smart Contracts</CardTitle>
                <CardDescription>
                  Deploy, verify, and interact with smart contracts on the testnet
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>🧾 Wallet Analysis</CardTitle>
                <CardDescription>
                  Deep wallet insights with transaction history and risk analysis
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>📈 Advanced Analytics</CardTitle>
                <CardDescription>
                  Dune-style querying and AI-powered contract analysis
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;