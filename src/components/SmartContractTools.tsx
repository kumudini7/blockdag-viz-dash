import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Rocket, FileText, Play, Settings, Upload, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { bdagApi, type Contract } from '@/services/bdagApi';

const mockContracts = [
  {
    id: 'contract_1',
    name: 'SimpleToken',
    address: '0x1234567890abcdef...',
    deployedAt: Date.now() - 86400000,
    status: 'verified',
    language: 'Solidity',
    version: '0.8.19'
  },
  {
    id: 'contract_2',
    name: 'MultiSigWallet',
    address: '0xfedcba0987654321...',
    deployedAt: Date.now() - 172800000,
    status: 'unverified',
    language: 'Solidity',
    version: '0.8.17'
  }
];

const contractTemplates = [
  {
    name: 'ERC-20 Token',
    description: 'Standard fungible token contract',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    string public name = "Simple Token";
    string public symbol = "STK";
    uint8 public decimals = 18;
    uint256 public totalSupply = 1000000 * 10**decimals;
    
    mapping(address => uint256) public balanceOf;
    
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }
    
    function transfer(address to, uint256 amount) public returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}`
  },
  {
    name: 'Simple Storage',
    description: 'Basic data storage contract',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    uint256 private storedData;
    
    function set(uint256 x) public {
        storedData = x;
    }
    
    function get() public view returns (uint256) {
        return storedData;
    }
}`
  }
];

const SmartContractTools = () => {
  const [activeTab, setActiveTab] = useState('deploy');
  const [contractCode, setContractCode] = useState('');
  const [contractName, setContractName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [contractAddress, setContractAddress] = useState('');
  const [abiJson, setAbiJson] = useState('');
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoadingContracts, setIsLoadingContracts] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      setIsLoadingContracts(true);
      try {
        const realContracts = await bdagApi.getContracts();
        setContracts(realContracts);
      } catch (error) {
        console.error('Failed to fetch contracts:', error);
        setContracts([]);
      } finally {
        setIsLoadingContracts(false);
      }
    };

    fetchContracts();
  }, []);

  const handleTemplateSelect = (templateName: string) => {
    const template = contractTemplates.find(t => t.name === templateName);
    if (template) {
      setContractCode(template.code);
      setContractName(templateName.replace(' ', ''));
      setSelectedTemplate(templateName);
    }
  };

  const handleDeploy = async () => {
    if (!contractCode || !contractName) return;
    
    setDeploymentStatus('deploying');
    
    // Simulate deployment
    setTimeout(() => {
      setDeploymentStatus('success');
      setContractAddress('0x' + Math.random().toString(16).substr(2, 40));
    }, 3000);
  };

  const DeploymentCard = ({ contract }: any) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">{contract.name}</h3>
            <p className="text-sm text-muted-foreground font-mono">{contract.address}</p>
          </div>
          <Badge variant={contract.status === 'verified' ? 'default' : 'secondary'}>
            {contract.status === 'verified' ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <AlertCircle className="w-3 h-3 mr-1" />
            )}
            {contract.status}
          </Badge>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground mb-4">
          <span>{contract.language} {contract.version}</span>
          <span>{new Date(contract.deployedAt).toLocaleDateString()}</span>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">View</Button>
          <Button variant="outline" size="sm">Verify</Button>
          <Button variant="outline" size="sm">Interact</Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Smart Contract Tools</h1>
        <p className="text-muted-foreground">Deploy, verify, and interact with smart contracts on BlockDAG</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deploy" className="flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Deploy
          </TabsTrigger>
          <TabsTrigger value="verify" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Verify
          </TabsTrigger>
          <TabsTrigger value="interact" className="flex items-center gap-2">
            <Play className="w-4 h-4" />
            Interact
          </TabsTrigger>
          <TabsTrigger value="contracts" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            My Contracts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deploy" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Contract Code</CardTitle>
                  <CardDescription>Write or paste your Solidity contract code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Choose template" />
                      </SelectTrigger>
                      <SelectContent>
                        {contractTemplates.map(template => (
                          <SelectItem key={template.name} value={template.name}>
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Upload File
                    </Button>
                  </div>
                  
                  <Textarea
                    placeholder="Enter your contract code here..."
                    value={contractCode}
                    onChange={(e) => setContractCode(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Deployment Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Contract Name</label>
                    <Input
                      value={contractName}
                      onChange={(e) => setContractName(e.target.value)}
                      placeholder="MyContract"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Compiler Version</label>
                    <Select defaultValue="0.8.19">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.8.19">0.8.19</SelectItem>
                        <SelectItem value="0.8.18">0.8.18</SelectItem>
                        <SelectItem value="0.8.17">0.8.17</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Gas Limit</label>
                    <Input defaultValue="3000000" />
                  </div>

                  <Button 
                    onClick={handleDeploy} 
                    disabled={deploymentStatus === 'deploying' || !contractCode}
                    className="w-full"
                  >
                    {deploymentStatus === 'deploying' ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4 mr-2" />
                        Deploy Contract
                      </>
                    )}
                  </Button>

                  {deploymentStatus === 'success' && (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-green-700 mb-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="font-medium">Deployment Successful!</span>
                        </div>
                        <p className="text-sm text-green-600 font-mono break-all">
                          {contractAddress}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Templates</CardTitle>
                  <CardDescription>Quick start with common contract patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {contractTemplates.map(template => (
                      <div
                        key={template.name}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleTemplateSelect(template.name)}
                      >
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="verify" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verify Contract Source Code</CardTitle>
              <CardDescription>Make your contract source code publicly available and verified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Contract Address</label>
                <Input placeholder="0x..." />
              </div>
              <div>
                <label className="text-sm font-medium">Contract Name</label>
                <Input placeholder="MyContract" />
              </div>
              <div>
                <label className="text-sm font-medium">Source Code</label>
                <Textarea placeholder="Paste your contract source code..." className="min-h-[200px]" />
              </div>
              <Button className="w-full">
                <CheckCircle className="w-4 h-4 mr-2" />
                Verify Contract
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Interaction</CardTitle>
              <CardDescription>Call functions and read data from deployed contracts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Contract Address</label>
                <Input placeholder="0x..." />
              </div>
              <div>
                <label className="text-sm font-medium">ABI (JSON)</label>
                <Textarea 
                  placeholder='[{"inputs":[],"name":"get","outputs":[{"type":"uint256"}],"type":"function"}]'
                  value={abiJson}
                  onChange={(e) => setAbiJson(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>
              <Button className="w-full">
                <Settings className="w-4 h-4 mr-2" />
                Load Contract Interface
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">My Deployed Contracts</h2>
              <p className="text-muted-foreground">Manage your deployed smart contracts</p>
            </div>
            <Button onClick={() => setActiveTab('deploy')}>
              <Rocket className="w-4 h-4 mr-2" />
              Deploy New Contract
            </Button>
          </div>

          <div className="space-y-4">
            {isLoadingContracts ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading contracts from BlockDAG testnet...</p>
              </div>
            ) : contracts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contracts.map((contract, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold">{contract.name || `Contract ${index + 1}`}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{contract.address}</p>
                        </div>
                        <Badge variant={contract.status === 'Fully verified' ? 'default' : 'secondary'}>
                          {contract.status === 'Fully verified' ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <AlertCircle className="w-3 h-3 mr-1" />
                          )}
                          {contract.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground mb-4">
                        <span>{contract.type}</span>
                        <span>{contract.age}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">Verify</Button>
                        <Button variant="outline" size="sm">Interact</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No contracts found on the testnet</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartContractTools;