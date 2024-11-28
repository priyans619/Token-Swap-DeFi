import React, { useEffect, useState } from 'react';

const OrderBook = () => {
  const [orderBooks, setOrderBooks] = useState({
    ethusdt: { bids: [], asks: [] },
    ethbtc: { bids: [], asks: [] },
  });

  const [priceTrends, setPriceTrends] = useState({
    ethusdt: { bids: {}, asks: {} },
    ethbtc: { bids: {}, asks: {} },
  });

  const [selectedPair, setSelectedPair] = useState('ethusdt');

  const pairs = [
    { symbol: 'ethusdt', name: 'ETH/USDT' },
    { symbol: 'ethbtc', name: 'ETH/BTC' },
  ];

  useEffect(() => {
    const sockets = {};
    const previousPrices = {}; // Local reference for previous prices

    pairs.forEach(({ symbol }) => {
      previousPrices[symbol] = { bids: [], asks: [] }; // Initialize previous prices

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

        // Calculate trends using local previous prices reference
        const updatedTrends = { bids: {}, asks: {} };

        // Compare bids
        bids.slice(0, 5).forEach(([price], index) => {
          const prevBidPrice = parseFloat(previousPrices[symbol]?.bids[index]?.[0] || 0);
          updatedTrends.bids[price] = parseFloat(price) > prevBidPrice ? 'up' : 'down';
        });

        // Compare asks
        asks.slice(0, 5).forEach(([price], index) => {
          const prevAskPrice = parseFloat(previousPrices[symbol]?.asks[index]?.[0] || Infinity);
          updatedTrends.asks[price] = parseFloat(price) < prevAskPrice ? 'up' : 'down';
        });

        setPriceTrends((prevTrends) => ({
          ...prevTrends,
          [symbol]: updatedTrends,
        }));

        // Update local previous prices reference
        previousPrices[symbol] = { bids, asks };
      };

      // Cleanup WebSocket connection
      return () => {
        Object.values(sockets).forEach((socket) => socket.close());
      };
    });
  }, []);

  return (
    <div className="p-7 mt-5 bg-black rounded-lg shadow-md border-2">
      {/* Pair Selection */}
      <div className="flex gap-4 mb-6 ml-3">
        {pairs.map(({ symbol, name }) => (
          <button
            key={symbol}
            className={`px-4 py-1 text-lg font-semibold rounded-lg ${
              selectedPair === symbol ? 'bg-violet-400 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedPair(symbol)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Order Book Display for Selected Pair */}
      <div className="flex gap-8">
        {/* Bids and Asks */}
        <div className="flex-1 bg-black p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-3">
            Top-5 Bids & Asks for {pairs.find((pair) => pair.symbol === selectedPair)?.name}
          </h3>

          <div className="flex justify-between">
            <div className="flex-1 overflow-y-hidden">
              <h4 className="text-lg font-medium text-gray-600 mb-4">Bids</h4>
              <div className="flex justify-between font-bold text-gray-400 mb-2 border-b">
                <span>Price</span>
                <span>Quantity</span>
              </div>
              {orderBooks[selectedPair]?.bids?.slice(0, 5).map((bid, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                  <span className="flex items-center text-gray-400 font-medium">
                    {priceTrends[selectedPair]?.bids[bid[0]] === 'up' ? (
                      <span className="text-green-400 mr-1">↑</span>
                    ) : (
                      <span className="text-red-400 mr-1">↓</span>
                    )}
                    {bid[0]}
                  </span>
                  <span className="text-blue-500 font-medium">{bid[1]}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 ml-6 overflow-y-hidden">
              <h4 className="text-lg font-medium text-gray-600 mb-4">Asks</h4>
              <div className="flex justify-between font-bold text-gray-400 mb-2 border-b">
                <span>Price</span>
                <span>Quantity</span>
              </div>
              {orderBooks[selectedPair]?.asks?.slice(0, 5).map((ask, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                  <span className="flex items-center text-gray-400 font-medium">
                    {priceTrends[selectedPair]?.asks[ask[0]] === 'up' ? (
                      <span className="text-green-400 mr-1">↑</span>
                    ) : (
                      <span className="text-red-400 mr-1">↓</span>
                    )}
                    {ask[0]}
                  </span>
                  <span className="text-blue-500  font-medium">{ask[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
