import React from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import { useWallet } from '../hooks/useWallet';

const Navbar = ({ isDarkMode, toggleDarkMode }) => {
  const { connectWallet } = useWallet();

  const handleDarkModeToggle = () => {
    toggleDarkMode(!isDarkMode);
  };

  return (
    <div
      className={`p-3 flex justify-between items-center border-b-2 ${
        isDarkMode ? 'bg-black text-white border-gray-600' : 'bg-white text-black border-gray-300'
      }`}
    >
      <h1 className="text-2xl sm:text-3xl ml-3 font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-gray-300 to-violet-400">
        DeFi Exchange
      </h1>

      <div className="flex items-center gap-4 sm:gap-6">
        <button
          onClick={connectWallet}
          className="bg-gradient-to-r from-yellow-500 via-violet-500 to-blue-500 text-white font-bold py-2 px-6 rounded-2xl border-2 border-blue-500 transition duration-300 hover:bg-black hover:from-black hover:via-black hover:to-black text-xs sm:text-base"
        >
          Goemon Wallet
        </button>

        <button
          onClick={handleDarkModeToggle}
          className={`text-2xl sm:text-3xl ${isDarkMode ? 'text-white' : 'text-black'} transition duration-300`}
        >
          {isDarkMode ? <MdDarkMode /> : <MdLightMode />}
        </button>
      </div>
    </div>
  );
};

export default Navbar;
