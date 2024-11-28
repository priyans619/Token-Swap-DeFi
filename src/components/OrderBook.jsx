import React, { useEffect, useState } from 'react';

const OrderBook = () => {
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
    <div className="p-6 mt-5 bg-black rounded-lg shadow-md border-2">
      {/* Pair Selection */}
      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {pairs.map(({ symbol, name }) => (
          <button
            key={symbol}
            className={`px-3 py-1 text-sm md:text-lg font-semibold rounded-2xl ${
              selectedPair === symbol ? 'bg-black border-2 text-white' : 'bg-gray-400'
            }`}
            onClick={() => setSelectedPair(symbol)}
          >
            {name}
          </button>
        ))}
      </div>

      {/* Order Book Display for Selected Pair */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-black p-4 rounded-lg shadow-lg">
          <h3 className="text-lg md:text-xl font-semibold text-gray-300 mb-6">
            Bids & Asks for {pairs.find((pair) => pair.symbol === selectedPair)?.name}
          </h3>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Bids Section */}
            <div className="flex-1">
              <h4 className="text-sm md:text-lg font-medium text-gray-600 mb-2">Top-5 Bids</h4>
              <div className="flex justify-between font-bold text-gray-400 mb-2 border-b">
                <span>Price</span>
                <span>Quantity</span>
              </div>
              <div className="h-40 md:h-52 overflow-y-auto">
                {Array.from({ length: 5 }).map((_, index) => {
                  const bid = orderBooks[selectedPair]?.bids[index];
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 border-b border-gray-300"
                    >
                      <span className="flex items-center text-gray-400 font-medium">
                        {bid
                          ? priceTrends[selectedPair]?.bids[bid[0]] === 'up' ? (
                              <span className="text-green-400 mr-1">↑</span>
                            ) : (
                              <span className="text-red-400 mr-1">↓</span>
                            )
                          : ''}
                        {bid ? bid[0] : '—'}
                      </span>
                      <span className="text-blue-500 font-medium">{bid ? bid[1] : '—'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Asks Section */}
            <div className="flex-1">
              <h4 className="text-sm md:text-lg font-medium text-gray-600 mb-2">Top-5 Asks</h4>
              <div className="flex justify-between font-bold text-gray-400 mb-2 border-b">
                <span>Price</span>
                <span>Quantity</span>
              </div>
              <div className="h-40 md:h-52 overflow-y-auto">
                {Array.from({ length: 5 }).map((_, index) => {
                  const ask = orderBooks[selectedPair]?.asks[index];
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 border-b border-gray-300"
                    >
                      <span className="flex items-center text-gray-400 font-medium">
                        {ask
                          ? priceTrends[selectedPair]?.asks[ask[0]] === 'up' ? (
                              <span className="text-green-400 mr-1">↑</span>
                            ) : (
                              <span className="text-red-400 mr-1">↓</span>
                            )
                          : ''}
                        {ask ? ask[0] : '—'}
                      </span>
                      <span className="text-blue-500 font-medium">{ask ? ask[1] : '—'}</span>
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
