import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Mock DAG node data
const generateDAGNodes = (count: number) => {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      id: `block_${i}`,
      label: `Block ${i}`,
      x: Math.random() * 800,
      y: Math.random() * 600,
      size: Math.random() * 20 + 10,
      color: i === count - 1 ? '#10b981' : ['#8b5cf6', '#06b6d4', '#f59e0b'][Math.floor(Math.random() * 3)],
      transactions: Math.floor(Math.random() * 100) + 1,
      timestamp: Date.now() - (count - i) * 60000,
      gasUsed: Math.floor(Math.random() * 1000000),
      difficulty: Math.floor(Math.random() * 1000000000),
    });
  }
  return nodes;
};

const generateDAGEdges = (nodes: any[]) => {
  const edges = [];
  for (let i = 1; i < nodes.length; i++) {
    // Each block references 1-3 previous blocks
    const refCount = Math.min(Math.floor(Math.random() * 3) + 1, i);
    for (let j = 0; j < refCount; j++) {
      const refIndex = Math.max(0, i - Math.floor(Math.random() * Math.min(5, i)) - 1);
      edges.push({
        id: `edge_${i}_${refIndex}`,
        from: nodes[refIndex].id,
        to: nodes[i].id,
        arrows: 'to',
        color: { color: '#64748b', opacity: 0.6 },
        width: 2,
      });
    }
  }
  return edges;
};

const Visuals = () => {
  const [nodes, setNodes] = useState(generateDAGNodes(20));
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [zoom, setZoom] = useState(1);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    setEdges(generateDAGEdges(nodes));
  }, [nodes]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setNodes(prev => {
          const newNode = {
            id: `block_${prev.length}`,
            label: `Block ${prev.length}`,
            x: Math.random() * 800,
            y: Math.random() * 600,
            size: Math.random() * 20 + 10,
            color: '#10b981',
            transactions: Math.floor(Math.random() * 100) + 1,
            timestamp: Date.now(),
            gasUsed: Math.floor(Math.random() * 1000000),
            difficulty: Math.floor(Math.random() * 1000000000),
          };
          const updated = [...prev, newNode];
          return updated.slice(-50); // Keep only last 50 blocks
        });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Simple canvas-based DAG visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set zoom
    ctx.setTransform(zoom, 0, 0, zoom, 0, 0);

    // Draw edges first
    edges.forEach((edge: any) => {
      const fromNode = nodes.find(n => n.id === edge.from);
      const toNode = nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = edge.color.color;
        ctx.globalAlpha = edge.color.opacity;
        ctx.lineWidth = edge.width;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      if (filter !== 'all') {
        // Apply filters based on node properties
        if (filter === 'recent' && Date.now() - node.timestamp > 300000) return;
        if (filter === 'high-tx' && node.transactions < 50) return;
      }

      if (searchTerm && !node.label.toLowerCase().includes(searchTerm.toLowerCase())) return;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      
      // Highlight selected node
      if (selectedNode?.id === node.id) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Add pulsing effect for newest blocks
      if (Date.now() - node.timestamp < 10000) {
        const pulseSize = node.size + Math.sin(Date.now() / 200) * 5;
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, 2 * Math.PI);
        ctx.strokeStyle = node.color;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    });
  }, [nodes, edges, selectedNode, filter, searchTerm, zoom]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;

    // Find clicked node
    const clickedNode = nodes.find(node => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= node.size;
    });

    setSelectedNode(clickedNode || null);
  };

  const resetView = () => {
    setZoom(1);
    setNodes(generateDAGNodes(20));
    setSelectedNode(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">DAG Visualization</h1>
          <p className="text-muted-foreground">Interactive BlockDAG network structure</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={isPlaying ? "default" : "secondary"} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            {isPlaying ? 'Live' : 'Paused'}
          </Badge>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center gap-2"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        
        <Button variant="outline" size="sm" onClick={resetView} className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4" />
          Reset View
        </Button>

        <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(zoom * 1.2, 3))} className="flex items-center gap-2">
          <ZoomIn className="w-4 h-4" />
          Zoom In
        </Button>

        <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(zoom / 1.2, 0.3))} className="flex items-center gap-2">
          <ZoomOut className="w-4 h-4" />
          Zoom Out
        </Button>

        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Blocks</SelectItem>
            <SelectItem value="recent">Recent (5min)</SelectItem>
            <SelectItem value="high-tx">High Activity</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-40"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* DAG Canvas */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>BlockDAG Network Graph</CardTitle>
              <CardDescription>
                Interactive visualization of block dependencies and relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border rounded-lg overflow-hidden bg-gradient-to-br from-background to-muted/20">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  onClick={handleCanvasClick}
                  className="cursor-pointer w-full"
                  style={{ maxHeight: '600px' }}
                />
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2">
                  <p className="text-sm text-muted-foreground">
                    Zoom: {(zoom * 100).toFixed(0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Block Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Blocks</span>
                <span className="font-mono">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connections</span>
                <span className="font-mono">{edges.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Degree</span>
                <span className="font-mono">{(edges.length / nodes.length).toFixed(1)}</span>
              </div>
            </CardContent>
          </Card>

          {selectedNode && (
            <Card>
              <CardHeader>
                <CardTitle>Block Details</CardTitle>
                <CardDescription>Selected: {selectedNode.label}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Block ID</span>
                  <span className="font-mono text-sm">{selectedNode.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transactions</span>
                  <span className="font-mono">{selectedNode.transactions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Used</span>
                  <span className="font-mono">{selectedNode.gasUsed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Timestamp</span>
                  <span className="font-mono text-xs">
                    {new Date(selectedNode.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <span className="font-mono text-xs">{selectedNode.difficulty.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Latest Block</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-sm">Confirmed Block</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
                <span className="text-sm">High Activity</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-4 bg-gray-500"></div>
                <span className="text-sm">Block Reference</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Visuals;