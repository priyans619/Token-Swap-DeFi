import React, { useEffect, useState } from 'react';

const OrderBook = ({ isDarkMode }) => {
  const [orderBooks, setOrderBooks] = useState({
    ethusdt: { bids: [], asks: [] },
    ethbtc: { bids: [], asks: [] },
    usdtwbtc: { bids: [], asks: [] },
    wbtceth: { bids: [], asks: [] },
  });

  const [priceTrends, setPriceTrends] = useState({
    ethusdt: { bids: {}, asks: {} },
    ethbtc: { bids: {}, asks: {} },
    usdtwbtc: { bids: {}, asks: {} },
    wbtceth: { bids: {}, asks: {} },
  });

  const [selectedPair, setSelectedPair] = useState('ethusdt');

  const pairs = [
    { symbol: 'ethusdt', name: 'ETH/USDT' },
    { symbol: 'ethbtc', name: 'ETH/BTC' },
    { symbol: 'usdtwbtc', name: 'USDT/WBTC' },
    { symbol: 'wbtceth', name: 'WBTC/ETH' },
  ];

  useEffect(() => {
    const sockets = {};
    const previousPrices = {};

    pairs.forEach(({ symbol }) => {
      previousPrices[symbol] = { bids: [], asks: [] };

      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth`);
      sockets[symbol] = socket;

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const bids = data.b || [];
        const asks = data.a || [];

        if (!bids.length || !asks.length) return;

        setOrderBooks((prev) => ({
          ...prev,
          [symbol]: { bids, asks },
        }));

        const updatedTrends = { bids: {}, asks: {} };

        bids.slice(0, 5).forEach(([price], index) => {
          const prevBidPrice = parseFloat(previousPrices[symbol]?.bids[index]?.[0] || 0);
          updatedTrends.bids[price] = parseFloat(price) > prevBidPrice ? 'up' : 'down';
        });

        asks.slice(0, 5).forEach(([price], index) => {
          const prevAskPrice = parseFloat(previousPrices[symbol]?.asks[index]?.[0] || Infinity);
          updatedTrends.asks[price] = parseFloat(price) < prevAskPrice ? 'up' : 'down';
        });

        setPriceTrends((prevTrends) => ({
          ...prevTrends,
          [symbol]: updatedTrends,
        }));

        previousPrices[symbol] = { bids, asks };
      };

      return () => {
        Object.values(sockets).forEach((socket) => socket.close());
      };
    });
  }, []);

  return (
    <div
      className={`p-6 mt-5 rounded-lg shadow-md border-2 ${
        isDarkMode
          ? 'bg-black border-2 text-white'
          : 'bg-gray-100 border-gray-300 text-black'
      }`}
    >
      {/* Pair Selection */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {pairs.map(({ symbol, name }) => (
          <button
            key={symbol}
            className={`px-3 py-1 text-sm md:text-lg font-semibold rounded-2xl ${
              selectedPair === symbol
                ? isDarkMode
                  ? 'bg-black border-2 text-white'
                  : 'bg-gray-200 border-black text-black'
                : 'bg-gray-400 text-black'
            }`}
            onClick={() => setSelectedPair(symbol)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Order Book Display for Selected Pair */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div
          className={`flex-1 p-3 rounded-lg ${
            isDarkMode ? 'bg-black text-gray-300' : 'bg-gray-100 text-black'
          }`}
        >
          <h3 className="text-lg md:text-xl font-semibold mb-6 text-gray-500 text-center border-b-2">
            Bids & Asks for {pairs.find((pair) => pair.symbol === selectedPair)?.name}
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Bids Section */}
            <div className="flex-1">
              <h4 className="text-sm md:text-lg font-medium mb-3 underline text-center ">
                {isDarkMode ? 'Top-5 Bids' : 'Top-5 Bids'}
              </h4>
              <div className="flex justify-between font-bold mb-2 border-b">
                <span>Price</span>
                <span>Quantity</span>
              </div>
              <div className="h-40 md:h-52 overflow-y-auto">
                {Array.from({ length: 5 }).map((_, index) => {
                  const bid = orderBooks[selectedPair]?.bids[index];
                  return (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-2 border-b ${
                        isDarkMode ? 'border-gray-600' : 'border-gray-300'
                      }`}
                    >
                      <span className="flex items-center">
                        {bid
                          ? priceTrends[selectedPair]?.bids[bid[0]] === 'up' ? (
                              <span className="text-green-400 mr-1">↑</span>
                            ) : (
                              <span className="text-red-400 mr-1">↓</span>
                            )
                          : ''}
                        {bid ? bid[0] : '—'}
                      </span>
                      <span className="text-blue-500">{bid ? bid[1] : '—'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Asks Section */}
            <div className="flex-1">
              <h4 className="text-sm md:text-lg font-medium mb-3 underline text-center">
                {isDarkMode ? 'Top-5 Asks' : 'Top-5 Asks'}
              </h4>
              <div className="flex justify-between font-bold mb-2 border-b">
                <span>Price</span>
                <span>Quantity</span>
              </div>
              <div className="h-40 md:h-52 overflow-y-auto">
                {Array.from({ length: 5 }).map((_, index) => {
                  const ask = orderBooks[selectedPair]?.asks[index];
                  return (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-2 border-b ${
                        isDarkMode ? 'border-gray-600' : 'border-gray-300'
                      }`}
                    >
                      <span className="flex items-center">
                        {ask
                          ? priceTrends[selectedPair]?.asks[ask[0]] === 'up' ? (
                              <span className="text-green-400 mr-1">↑</span>
                            ) : (
                              <span className="text-red-400 mr-1">↓</span>
                            )
                          : ''}
                        {ask ? ask[0] : '—'}
                      </span>
                      <span className="text-blue-500">{ask ? ask[1] : '—'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
