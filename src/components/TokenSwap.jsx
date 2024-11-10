import React, { useState, useEffect } from 'react';
import { useToken } from '../hooks/useToken';  

const TokenSwap = () => {
  const [fromToken] = useState('ethereum'); 
  const [toToken, setToToken] = useState('usd-coin'); 
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState(null);

  // Custom hook to fetch price
  const { price, loading, priceDirection } = useToken(fromToken, toToken);

  useEffect(() => {
    if (amount && price) {
      setEstimatedAmount((amount * price).toFixed(4)); 
    }
  }, [amount, price]);

  const handleSwap = () => {
    alert(`Swapping ${amount} ${fromToken} to ${toToken}`);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Token Swap</h2>
      </div>
      
      <div className="flex flex-col gap-6">
        {/* From Token (ETH) */}
        <div className="flex items-center justify-between">
          <label htmlFor="fromToken" className="text-lg">From</label>
          <select
            id="fromToken"
            className="bg-gray-700 text-white p-2 rounded"
            disabled
          >
            <option value="ethereum">ETH</option>
          </select>
        </div>

        {/* To Token(USDC, USDT, WBTC) */}
        <div className="flex items-center justify-between">
          <label htmlFor="toToken" className="text-lg">To</label>
          <select
            id="toToken"
            className="bg-gray-700 text-white p-2 rounded"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
          >
            <option value="usd-coin">USDC</option>
            <option value="tether">USDT</option>
            <option value="wrapped-bitcoin">WBTC</option>
          </select>
        </div>

        {/* Amount Input */}
        <div className="flex items-center justify-between">
          <label htmlFor="amount" className="text-lg">Amount</label>
          <input
            type="number"
            id="amount"
            className="bg-gray-700 text-white p-2 rounded w-2/3"
            placeholder={`Amount in ${fromToken}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* Price Display and Direction Indicator */}
        <div className="mt-4 text-center">
          {loading ? (
            <p>Loading price...</p>
          ) : (
            <>
              <p className="text-xl">
                1 {fromToken} = {price} {toToken}
              </p>
              {priceDirection && (
                <div className="mt-2">
                  <span className={`text-xl ${priceDirection === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                    {priceDirection === 'up' ? '↑' : '↓'} {priceDirection === 'up' ? 'Price Went Up' : 'Price Went Down'}
                  </span>
                </div>
              )}
              {estimatedAmount && (
                <p className="mt-2">
                  Estimated {amount} {fromToken} = {estimatedAmount} {toToken}
                </p>
              )}
            </>
          )}
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSwap}
            className="bg-green-900 text-white py-2 px-4 rounded-lg hover:bg-green-700"
          >
            Swap
          </button>
        </div>
      </div>
    </div>
  );
};

export default TokenSwap;
