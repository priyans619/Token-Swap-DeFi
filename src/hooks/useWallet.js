import { useState } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);

  const connectWallet = async () => {
    // Web3Provider and request access to accounts
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); 
      const signer = provider.getSigner();

      // wallet address and balance
      const walletAddress = await signer.getAddress();
      const balance = await signer.getBalance();
      const balanceInEth = ethers.utils.formatEther(balance);

      setAddress(walletAddress);
      setBalance(balanceInEth);
    } 

  return { address, balance, connectWallet };
};
