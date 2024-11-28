import React, { useEffect, useState } from 'react';

const OrderBook = () => {
  const [orderBooks, setOrderBooks] = useState({
    ethusdt: { bids: [], asks: [] },
    ethbtc: { bids: [], asks: [] },
  });
  const [priceTrends, setPriceTrends] = useState({
    ethusdt: { bidTrend: null, askTrend: null },
    ethbtc: { bidTrend: null, askTrend: null },
  });
  const [selectedPair, setSelectedPair] = useState('ethusdt');

  const pairs = [
    { symbol: 'ethusdt', name: 'ETH/USDT' },
    { symbol: 'ethbtc', name: 'ETH/BTC' },
  ];

  useEffect(() => {
    const sockets = {};

    pairs.forEach(({ symbol }) => {
      const socket = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol}@depth`);
      sockets[symbol] = socket;

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const bids = data.b || [];
        const asks = data.a || [];

        if (!bids.length || !asks.length) return;

        // Update the order book for the current pair
        setOrderBooks((prev) => ({
          ...prev,
          [symbol]: { bids, asks },
        }));

        // Calculate price trends
        const prevBidPrice = prev[symbol]?.bids[0]?.[0] || 0;
        const prevAskPrice = prev[symbol]?.asks[0]?.[0] || Infinity;

        setPriceTrends((prevTrends) => ({
          ...prevTrends,
          [symbol]: {
            bidTrend: bids[0][0] > prevBidPrice ? 'up' : 'down',
            askTrend: asks[0][0] < prevAskPrice ? 'down' : 'up',
          },
        }));
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
      <div className="flex gap-4 mb-6">
        {pairs.map(({ symbol, name }) => (
          <button
            key={symbol}
            className={`px-4 py-2 text-lg font-semibold rounded-lg ${
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
        {/* Bids and Asks horizontal*/}
        <div className="flex-1 bg-black p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">
            Bids & Asks for {pairs.find(pair => pair.symbol === selectedPair)?.name}
          </h3>

          <div className="flex justify-between">
            <div className="flex-1 h-64 overflow-y-auto">
              <h4 className="text-lg font-medium text-gray-600 mb-2">Bids</h4>
              {orderBooks[selectedPair]?.bids?.slice(0, 5).map((bid, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                  <span className="text-green-500 font-medium">{bid[0]}</span>
                  <span className="text-blue-500 font-medium">{bid[1]}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 ml-6 h-64 overflow-y-auto">
              <h4 className="text-lg font-medium text-gray-600 mb-2">Asks</h4>
              {orderBooks[selectedPair]?.asks?.slice(0, 5).map((ask, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b border-gray-300">
                  <span className="text-red-500 font-medium">{ask[0]}</span>
                  <span className="text-purple-500 font-medium">{ask[1]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between mt-4">
            <div
              className={`text-3xl text-${priceTrends[selectedPair]?.bidTrend === 'up' ? 'green' : 'red'}-500`}
            >
              {priceTrends[selectedPair]?.bidTrend && (priceTrends[selectedPair]?.bidTrend === 'up' ? '↑' : '↓')}
            </div>
            <div
              className={`text-3xl text-${priceTrends[selectedPair]?.askTrend === 'up' ? 'green' : 'red'}-500`}
            >
              {priceTrends[selectedPair]?.askTrend && (priceTrends[selectedPair]?.askTrend === 'up' ? '↑' : '↓')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
