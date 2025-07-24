import { useState } from 'react';
import { Search, Filter, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const mockSearchResults = {
  blocks: [
    { id: 'block_12345', height: 12345, hash: '0x1a2b3c...', transactions: 156, timestamp: Date.now() - 300000 },
    { id: 'block_12344', height: 12344, hash: '0x4d5e6f...', transactions: 89, timestamp: Date.now() - 360000 },
  ],
  transactions: [
    { id: 'tx_abc123', hash: '0xabc123...', from: '0x1234...', to: '0x5678...', value: '1.5 BDAG', status: 'success' },
    { id: 'tx_def456', hash: '0xdef456...', from: '0x9abc...', to: '0xdef0...', value: '0.8 BDAG', status: 'pending' },
  ],
  addresses: [
    { id: 'addr_1', address: '0x1234567890abcdef...', balance: '145.23 BDAG', transactions: 1247 },
    { id: 'addr_2', address: '0xfedcba0987654321...', balance: '89.67 BDAG', transactions: 892 },
  ]
};

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [results, setResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'block 12345',
    '0x1a2b3c4d5e6f...',
    'tx abc123',
  ]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Add to recent searches
    if (!recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
    
    // Simulate API call
    setTimeout(() => {
      setResults(mockSearchResults);
      setIsSearching(false);
    }, 1000);
  };

  const getSearchPlaceholder = () => {
    switch (searchType) {
      case 'block': return 'Enter block height or hash...';
      case 'transaction': return 'Enter transaction hash...';
      case 'address': return 'Enter wallet address...';
      default: return 'Search blocks, transactions, or addresses...';
    }
  };

  const ResultCard = ({ title, items, type }: any) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{items.length} results found</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item: any, index: number) => (
            <div key={item.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              {type === 'block' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">Block #{item.height}</span>
                    <Badge variant="secondary">{item.transactions} txs</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{item.hash}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(item.timestamp).toLocaleString()}
                  </p>
                </div>
              )}
              {type === 'transaction' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{item.hash}</span>
                    <Badge variant={item.status === 'success' ? 'default' : 'secondary'}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>From: {item.from}</span>
                    <span>Value: {item.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">To: {item.to}</p>
                </div>
              )}
              {type === 'address' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{item.address}</span>
                    <Badge variant="outline">{item.transactions} txs</Badge>
                  </div>
                  <p className="text-sm font-medium">Balance: {item.balance}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">BlockDAG Explorer</h1>
        <p className="text-muted-foreground">Search and analyze blocks, transactions, and addresses</p>
      </div>

      {/* Search Interface */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={getSearchPlaceholder()}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-40">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="block">Blocks</SelectItem>
                <SelectItem value="transaction">Transactions</SelectItem>
                <SelectItem value="address">Addresses</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleSearch} disabled={isSearching} className="px-8">
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setQuery(search)}
              >
                {search}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Search Results</h2>
            <Badge variant="secondary">
              Query: "{query}"
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {(searchType === 'all' || searchType === 'block') && (
              <ResultCard title="Blocks" items={results.blocks} type="block" />
            )}
            {(searchType === 'all' || searchType === 'transaction') && (
              <ResultCard title="Transactions" items={results.transactions} type="transaction" />
            )}
            {(searchType === 'all' || searchType === 'address') && (
              <ResultCard title="Addresses" items={results.addresses} type="address" />
            )}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">1,234,567</h3>
              <p className="text-muted-foreground">Total Blocks</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">8,901,234</h3>
              <p className="text-muted-foreground">Total Transactions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold">456,789</h3>
              <p className="text-muted-foreground">Active Addresses</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchBar;