import { useState, useEffect } from 'react';
import axios from 'axios';

// hook for CoinGecko API
export const useToken = (fromToken, toToken) => {
  const [price, setPrice] = useState(null);
  const [previousPrice, setPreviousPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [priceDirection, setPriceDirection] = useState(null);

  useEffect(() => {
    const fetchPrice = async () => {
      if (!fromToken || !toToken) return;

      try {
        let url = '';

        if (toToken === 'usd-coin' || toToken === 'tether') {
          // Fetch ETH -> USD price for USDC/USDT (stablecoins)
          url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`;
        } else if (toToken === 'wrapped-bitcoin') {
          // Fetch ETH -> BTC price for WBTC
          url = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd`;
        }
        
        // this will fetch from CoinGecko API
        const response = await axios.get(url);
        console.log('API Response:', response.data);

        let priceData = 0;

        if (toToken === 'usd-coin' || toToken === 'tether') {
          // For USDC/USDT, price is the ETH to USD price
          priceData = response.data.ethereum?.usd || 0;
        } else if (toToken === 'wrapped-bitcoin') {
          // For WBTC, get ETH -> BTC and then calculate the price in WBTC
          const ethPriceInUsd = response.data.ethereum?.usd;
          const btcPriceInUsd = response.data.bitcoin?.usd;
          priceData = ethPriceInUsd / btcPriceInUsd;
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

    fetchPrice();

    // Polling in 5 seconds
    const intervalId = setInterval(() => {
      fetchPrice();
    }, 5000);

    return () => clearInterval(intervalId);

  }, [fromToken, toToken]); // token pair changes, will change price also

  // for price fluctuation
  useEffect(() => {
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