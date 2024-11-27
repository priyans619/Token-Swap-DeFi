import React from 'react';
import { useWallet } from '../hooks/useWallet';

const Navbar = () => {
  const { connectWallet } = useWallet();

  return (
    <div className="bg-black text-white p-3 flex justify-between items-center border-b-2 border-gray-600">
      <h1 className="text-3xl ml-14 font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-white to-violet-400">
        DeFi Exchange
      </h1>
      <button
        onClick={connectWallet}
        className="bg-gradient-to-r from-yellow-500 via-violet-500 to-blue-500 mr-5 text-white font-bold py-2 px-7 rounded-2xl border-2 border-blue-500 transition duration-300 hover:bg-black hover:from-black hover:via-black hover:to-black"
      >
        Goemon Wallet
      </button>
    </div>
  );
};

export default Navbar;
