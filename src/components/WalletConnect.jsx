import React from 'react';
import { useWallet } from '../hooks/useWallet';

const WalletConnect = () => {
  const { address, balance, connectWallet } = useWallet();

  return (
    <div className="bg-black rounded-lg text-white">
      <div className="absolute top-3 right-4">
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-yellow-500 via-violet-500 to-blue-500 text-white font-bold py-2 px-4 rounded-3xl border-2 border-blue-500 transition duration-300 hover:bg-black hover:from-black hover:via-black hover:to-black"
        >
          Goemon Wallet
        </button>

      </div>

      {/* Wallet Information */}
      {address && (
        <div className=" flex flex-col items-center justify-center mb-6 p-1 mt-2 rounded-lg shadow-lg">
          <p className="text-lg mb-2"><strong>Wallet Address:</strong> {address}</p>
          <p className="text-lg"><strong>Balance:</strong> {balance} ETH</p>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;
