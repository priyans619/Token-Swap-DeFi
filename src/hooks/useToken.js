import { useState, useEffect } from 'react';
import axios from 'axios';

// hook for CoinGecko API
export const useToken = (fromToken, toToken) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

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

        console.log(`Request URL: ${url}`);
        
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
          console.log(`Fetched price: ${priceData}`);
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
  }, [fromToken, toToken]); // token pair changes, will change price also

  return { price, loading };
};
