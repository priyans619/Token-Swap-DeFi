import React, { useState, useEffect } from 'react';
import { useToken } from '../hooks/useToken';
import { ethers } from 'ethers';

const TokenSwap = () => {
  const [fromToken] = useState('ethereum');
  const [toToken, setToToken] = useState('usd-coin');
  const [amount, setAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Custom hook to fetch price
  const { price, loading, priceDirection } = useToken(fromToken, toToken);

  useEffect(() => {
    if (amount && price) {
      setEstimatedAmount((amount * price).toFixed(4));
    }
  }, [amount, price]);

  const handleSwap = async () => {
    if (!amount) return alert("Please enter an amount");

    // Mock details
    const slippage = 0.5;
    const estimatedGas = 21000;

    //confirmation modal with details
    setTransactionDetails({ fromToken, toToken, amount, slippage, estimatedGas });
    setShowModal(true);
  };

  // Function to confirm and initiate transaction via MetaMask
  const confirmTransaction = async () => {
    setShowModal(false);
    setIsPending(true);

    try {
      
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Simulate a transaction with a mock address
        const transaction = await signer.sendTransaction({
          to: "0x66F7D70d17c1D2366aA54237fB56684AD35c685b", 
          value: ethers.utils.parseEther(amount),
        });

        await transaction.wait();
        alert("Transaction Confirmed!");
      } else {
        alert("Please install MetaMask!");
      }
    } catch (error) {
      console.error(error);
      alert("Transaction Failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-white w-full max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Token Swap</h2>
      </div>

      <div className="flex flex-col gap-6">
        {/* From Token */}
        <div className="flex items-center justify-between">
          <label htmlFor="fromToken" className="text-lg">From</label>
          <select id="fromToken" className="bg-gray-700 text-white p-2 rounded" disabled>
            <option value="ethereum">ETH</option>
          </select>
        </div>

        {/* To Token */}
        <div className="flex items-center justify-between">
          <label htmlFor="toToken" className="text-lg">To</label>
          <select id="toToken" className="bg-gray-700 text-white p-2 rounded" value={toToken} onChange={(e) => setToToken(e.target.value)}>
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

        {/* Price Display */}
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
            className={`bg-green-900 text-white py-2 px-4 rounded-lg hover:bg-green-700 ${isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isPending}
          >
            {isPending ? 'Transaction Pending...' : 'Swap'}
          </button>
        </div>
      </div>

      {/*Transaction Confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded shadow-lg text-white max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Swap</h2>
            <p>From: {fromToken}</p>
            <p>To: {toToken}</p>
            <p>Amount: {amount}</p>
            <p>Slippage: {transactionDetails.slippage}%</p>
            <p>Estimated Gas: {transactionDetails.estimatedGas} Gwei</p>
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
