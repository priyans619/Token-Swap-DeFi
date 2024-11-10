import React from 'react';
import WalletConnect from '../components/WalletConnect';
import TokenSwap from '../components/TokenSwap';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-violet-400">Token Swap Interface</h1>
      </div>
      <WalletConnect />
      <TokenSwap />
    </div>
  );
};

export default Home;
