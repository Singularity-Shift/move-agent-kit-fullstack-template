'use client';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { AgentRuntime, WalletSigner } from 'move-agent-kit-fullstack';
import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import { Account, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';

type Agent = {
  agent: AgentRuntime;
};

const AgentContext = createContext<Agent>({} as Agent);

export const AgentProvider = ({ children }: { children: React.ReactNode }) => {
  const [agent, setAgent] = useState<AgentRuntime>({} as AgentRuntime);
  const { walletAddress } = useAuth();
  const wallet = useWallet();

  useEffect(() => {
    if (!walletAddress) return;

    const signer = new WalletSigner({} as Account, wallet);

    const aptosConfig = new Aptos(
      new AptosConfig({
        network: process.env.APTOS_NETWORK as Network,
      })
    );

    const agentInstance = new AgentRuntime(signer, aptosConfig, {
      PANORA_API_KEY: process.env.PANORA_API_KEY,
    });

    setAgent(agentInstance);
  }, [walletAddress]);

  const values = { agent };

  return (
    <AgentContext.Provider value={values}>{children}</AgentContext.Provider>
  );
};

export const useAgent = () => {
  return useContext(AgentContext);
};
