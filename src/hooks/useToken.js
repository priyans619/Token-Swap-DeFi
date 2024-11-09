import { useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// Apollo Client to connect to the Uniswap API
const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  cache: new InMemoryCache(),
});

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
