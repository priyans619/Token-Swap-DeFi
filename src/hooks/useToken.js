import { useState, useEffect } from 'react';
import axios from 'axios';

export const useToken = (fromToken, toToken) => {
  const [price, setPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceDirection, setPriceDirection] = useState(null);

  useEffect(() => {
    let intervalId;

    const fetchPrice = async () => {
      if (!fromToken || !toToken) return;

      setLoading(true);
      try {
        let url = '';
        if (fromToken === 'ethereum' && (toToken === 'usd-coin' || toToken === 'tether')) {
          // ETH -> USDC/USDT
          url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`;
        } else if (fromToken === 'ethereum' && toToken === 'wrapped-bitcoin') {
          // ETH -> WBTC
          url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd`;
        } else if (fromToken === 'usd-coin' || fromToken === 'tether') {
          // USDC/USDT -> ETH/WBTC
          url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd`;
        } else if (fromToken === 'wrapped-bitcoin') {
          // WBTC -> ETH/USDC/USDT
          url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd`;
        }

        const response = await axios.get(url);
        let priceData = 0;

        if (fromToken === 'ethereum') {
          if (toToken === 'usd-coin' || toToken === 'tether') {
            priceData = response.data.ethereum?.usd || 0; // ETH -> USD
          } else if (toToken === 'wrapped-bitcoin') {
            const ethPriceInUsd = response.data.ethereum?.usd;
            const btcPriceInUsd = response.data.bitcoin?.usd;
            priceData = ethPriceInUsd / btcPriceInUsd; // ETH -> BTC
          }
        } else if (fromToken === 'usd-coin' || fromToken === 'tether') {
          const ethPriceInUsd = response.data.ethereum?.usd;
          if (toToken === 'ethereum') {
            priceData = 1 / ethPriceInUsd; // USD -> ETH
          } else if (toToken === 'wrapped-bitcoin') {
            const btcPriceInUsd = response.data.bitcoin?.usd;
            priceData = ethPriceInUsd / btcPriceInUsd; // USD -> BTC
          }
        } else if (fromToken === 'wrapped-bitcoin') {
          const btcPriceInUsd = response.data.bitcoin?.usd;
          if (toToken === 'ethereum') {
            const ethPriceInUsd = response.data.ethereum?.usd;
            priceData = btcPriceInUsd / ethPriceInUsd; // BTC -> ETH
          } else if (toToken === 'usd-coin' || toToken === 'tether') {
            const btcPriceInUsd = response.data.bitcoin?.usd;
            priceData = btcPriceInUsd; // BTC -> USD
          }
        }

        if (priceData) {
          setPrice(priceData);
        } else {
          console.error('Price data not found for the selected pair');
        }
      } catch (error) {
        console.error('Error fetching price:', error);
      } finally {
        setLoading(false);
      }
    };

    // Trigger an immediate fetch when token pair changes
    fetchPrice();

    // polling
    intervalId = setInterval(() => {
      fetchPrice();
    }, 5000);

    // Cleanup for token change
    return () => clearInterval(intervalId);
  }, [fromToken, toToken]);

  useEffect(() => {
    // Detect price direction
    if (price && previousPrice !== null) {
      if (price > previousPrice) {
        setPriceDirection('up');
      } else if (price < previousPrice) {
        setPriceDirection('down');
      } else {
        setPriceDirection(null);
      }
    }
    setPreviousPrice(price);
  }, [price]);

  return { price, loading, priceDirection };
};
