'use client';

import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PropsWithChildren } from 'react';
import { AptosConfig, Network } from '@aptos-labs/ts-sdk';

export const WalletProvider = ({ children }: PropsWithChildren) => {
  return (
    <AptosWalletAdapterProvider
      dappConfig={
        new AptosConfig({
          network: process.env.APTOS_NETWORK as Network,
        })
      }
      onError={(error) => {
        console.error('Error in wallet adapter:', error);
      }}
      autoConnect={true}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};
