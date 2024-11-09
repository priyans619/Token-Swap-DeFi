import React from 'react';
import { useWallet } from '../hooks/useWallet';

const WalletConnect = () => {
  const { address, balance, connectWallet } = useWallet();

  return (
    <div className="bg-gray-900 p-4 rounded-lg text-white">
      <div className="absolute top-4 right-4">
        <button
          onClick={connectWallet}
          className="bg-violet-500 text-white font-bold py-2 px-4 rounded"
        >
          Connect Wallet
        </button>
      </div>

      {/* Wallet Information */}
      {address && (
        <div className="mt-4 pt-12">
          <p><strong>Wallet Address:</strong> {address}</p>
          <p><strong>Balance:</strong> {balance} ETH</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
