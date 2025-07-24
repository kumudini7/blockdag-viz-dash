import { useState } from 'react';
import Home from '../components/Home';
import Analytics from '../components/Analytics';
import Visuals from '../components/Visuals';
import SearchBar from '../components/SearchBar';
import SmartContractTools from '../components/SmartContractTools';
import EnhancedWalletExplorer from '../components/EnhancedWalletExplorer';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">BlockDAG Vision</h1>
            <nav className="flex space-x-8">
              <button onClick={() => setActiveTab('home')} className={`pb-2 border-b-2 transition-colors ${activeTab === 'home' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Home</button>
              <button onClick={() => setActiveTab('analytics')} className={`pb-2 border-b-2 transition-colors ${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Analytics</button>
              <button onClick={() => setActiveTab('visuals')} className={`pb-2 border-b-2 transition-colors ${activeTab === 'visuals' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Visuals</button>
              <button onClick={() => setActiveTab('explorer')} className={`pb-2 border-b-2 transition-colors ${activeTab === 'explorer' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Explorer</button>
              <button onClick={() => setActiveTab('contracts')} className={`pb-2 border-b-2 transition-colors ${activeTab === 'contracts' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Contracts</button>
              <button onClick={() => setActiveTab('wallet')} className={`pb-2 border-b-2 transition-colors ${activeTab === 'wallet' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>Wallet</button>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {activeTab === 'home' && <Home />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'visuals' && <Visuals />}
        {activeTab === 'explorer' && <SearchBar />}
        {activeTab === 'contracts' && <SmartContractTools />}
        {activeTab === 'wallet' && <EnhancedWalletExplorer />}
      </main>
    </div>
  );
};

export default Index;
