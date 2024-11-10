import React, { useState, useEffect } from 'react';
import { useToken } from '../hooks/useToken';  

const TokenSwap = () => {
  const [fromToken] = useState('ethereum'); 
  const [toToken, setToToken] = useState('usd-coin'); 
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState(null);

  // Custom hook to fetch price
  const { price, loading } = useToken(fromToken, toToken);

  useEffect(() => {
    if (amount && price) {
      setEstimatedAmount((amount * price).toFixed(4)); 
    }
  }, [amount, price]);

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Token Swap</h2>
      </div>
    </div>
  );
};

export default TokenSwap;
