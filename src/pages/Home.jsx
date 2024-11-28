import React from 'react';
import Navbar from '../components/Navbar';
import TokenSwap from '../components/TokenSwap';
import OrderBook from '../components/OrderBook';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-blue-200 via-black p-4">
      <Navbar />
      <div className="flex flex-col lg:flex-row mt-10">
        <div className="flex-1 mr-8">
          <h2 className="text-2xl font-semibold text-white mb-4 ml-6">Token Swap</h2>
          <TokenSwap />
        </div>
        <div className="flex-1 mr-10">
          <h2 className="text-2xl font-semibold text-white mb-4">Order Book</h2>
          <OrderBook />
        </div>
      </div>
    </div>
  );
};

export default Home;
