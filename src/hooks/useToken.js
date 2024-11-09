import { useState, useEffect } from 'react';

export const useToken = (fromToken, toToken) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await client.query({
          query: GET_TOKEN_PRICE,
          variables: {
            token0: fromToken,
            token1: toToken,  
          },
        });

        const price = response.data.pair.token0Price;
        setPrice(price);
      } catch (error) {
        console.error('Error fetching token price:', error);
      } finally {
        setLoading(false);
      }
    };

    if (fromToken && toToken) {
      fetchPrice();
    }
  }, [fromToken, toToken]);

  return { price, loading };
};
