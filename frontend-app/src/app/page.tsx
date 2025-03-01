'use client';
import '@aptos-labs/wallet-adapter-ant-design/dist/index.css';
import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { WalletSelector } from '@aptos-labs/wallet-adapter-ant-design';
import backend from '../services/backend';
import { useAuth } from '../context/AuthProvider';
import { executeAction } from 'helpers';
import { useAgent } from '../context/AgentProvider';

export default function Index() {
  const { account, connected } = useWallet();
  const { agent } = useAgent();
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [lendAmount, setLendAmount] = useState('');
  const { jwt, handleDisconnect } = useAuth();

  const handleTransfer = async () => {
    if (!connected || !account) return;

    try {
      const response = await backend.post(
        '/onchain-agent',
        {
          prompt: `Transfer ${transferAmount} APT to ${recipientAddress}`,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      await Promise.all(
        response.data.map(async (action: any) => {
          const { name, args } = action;

          await executeAction(name, args, agent);
        })
      );

      alert('Transfer successful');
      setTransferAmount('');
      setRecipientAddress('');
    } catch (error) {
      console.error('Error transferring APT:', error);
    }
  };

  const handleLendInJoule = async () => {
    if (!connected || !account) return;

    try {
      const response = await backend.post(
        '/onchain-agent',
        {
          prompt: `Lend ${lendAmount} APT in Joule Finance`,
        },
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      await Promise.all(
        response.data.map(async (action: any) => {
          const { name, args } = action;

          await executeAction(name, args, agent);
        })
      );

      alert('Lending successful');
      setLendAmount('');
    } catch (error) {
      console.error('Error lending in Joule Finance:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Aptos Wallet Dashboard</h1>
      <WalletSelector />
      <button
        onClick={handleDisconnect}
        className="bg-red-500 ml-5 text-white px-4 py-2"
      >
        delete Auth token
      </button>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipientAddress}
          onChange={(e) => setRecipientAddress(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          placeholder="Amount to Transfer"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={handleTransfer}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Transfer APT
        </button>
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="Amount to Lend"
          value={lendAmount}
          onChange={(e) => setLendAmount(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={handleLendInJoule}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Lend in Joule Finance
        </button>
      </div>
    </div>
  );
}
