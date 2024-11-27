import React from 'react';
import WalletConnect from '../components/WalletConnect';
import TokenSwap from '../components/TokenSwap';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-200 via-black p-4 bg-[length:100%_100%]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-white to-violet-400">
          DeFi Exchange
        </h1>
      </div>
      <WalletConnect />
      <TokenSwap />
    </div>
  );
};

export default Home;
