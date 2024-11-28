import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TokenSwap from '../components/TokenSwap';
import OrderBook from '../components/OrderBook';

const Home = () => {
  // initial state true for dark mode
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleDarkMode = (value) => {
    setIsDarkMode(value);
  };

  useEffect(() => {
    if (!localStorage.getItem('isDarkMode')) {
      localStorage.setItem('isDarkMode', true);
    } else {
      setIsDarkMode(JSON.parse(localStorage.getItem('isDarkMode')));
    }
  }, []);

  useEffect(() => {
    // Store the dark mode setting in localStorage
    localStorage.setItem('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div
      className={`min-h-screen ${isDarkMode ? 'bg-gradient-to-b from-black to-blue-200 text-white' : 'bg-white text-black'}`}
    >
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="flex flex-col lg:flex-row mt-10 px-6">
        <div className="flex-1 mr-8">
          <h2 className="text-2xl font-semibold mb-4 ml-4">Token Swap</h2>
          <TokenSwap isDarkMode={isDarkMode} />
        </div>
        <div className="flex-1 mr-10">
          <h2 className="text-2xl font-semibold mb-4">Order Book</h2>
          <OrderBook isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default Home;
