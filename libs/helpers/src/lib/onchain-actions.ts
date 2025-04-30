import {
  AccountAddress,
  convertAmountFromHumanReadableToOnChain,
  convertAmountFromOnChainToHumanReadable,
  MoveStructId,
} from '@aptos-labs/ts-sdk';
import { AgentRuntime } from 'move-agent-kit-fullstack';

import type { SymbolEmoji } from 'move-agent-kit-fullstack';

export const executeAction = async (
  name: string,
  values: any[],
  agent: AgentRuntime,
  walletAddress?: string
) => {
  switch (name) {
    case 'aptos_transfer_token': {
      const args = values as [AccountAddress, number, string];

      const tokenDetails = await agent.getTokenDetails(args[2]);
      args[1] = convertAmountFromHumanReadableToOnChain(
        args[1],
        tokenDetails.decimals || 8
      );

      await agent.transferTokens(...args);

      break;
    }
    case 'aptos_get_transaction': {
      const args = values as [string];

      const transaction = await agent.aptos.getTransactionByHash({
        transactionHash: args[0],
      });

      return transaction;
    }
    case 'aptos_get_transaction_history': {
      const args = values as [number, number];

      const transactions = await agent.aptos.getAccountTransactions({
        options: {
          offset: args[0],
          limit: args[1],
        },
        accountAddress: walletAddress as string,
      });

      return transactions;
    }
    case 'aptos_create_token': {
      const args = values as [string, string, string, string];
      await agent.createToken(...args);

      break;
    }
    case 'aptos_mint_token': {
      const args = values as [AccountAddress, string, number];

      const tokenDetails = await agent.getTokenDetails(args[1]);
      args[2] = convertAmountFromHumanReadableToOnChain(
        args[2],
        tokenDetails.decimals || 8
      );

      await agent.mintToken(...args);
      break;
    }
    case 'aptos_balance': {
      const args = values as [string];

      const mint = args[0];

      if (mint) {
        let balance: number;
        if (mint.split('::').length !== 3) {
          const balances = await agent.aptos.getCurrentFungibleAssetBalances({
            options: {
              where: {
                owner_address: {
                  _eq: walletAddress,
                },
                asset_type: { _eq: mint },
              },
            },
          });

          balance = balances[0].amount ?? 0;
        } else {
          balance = await agent.aptos.getAccountCoinAmount({
            accountAddress: walletAddress as string,
            coinType: mint as MoveStructId,
          });
        }

        const tokenDetails = await agent.getTokenDetails(mint);

        const convertedBalance = convertAmountFromOnChainToHumanReadable(
          balance,
          tokenDetails.decimals || 8
        );

        return convertedBalance;
      }
      const balance = await agent.aptos.getAccountAPTAmount({
        accountAddress: walletAddress as string,
      });

      const convertedBalance = convertAmountFromOnChainToHumanReadable(
        balance,
        8
      );

      return convertedBalance;
    }
    case 'aptos_get_wallet_address': {
      return walletAddress;
    }

    case 'aptos_token_price': {
      const args = values as [string];

      return agent.getTokenPrice(...args);
    }

    case 'aptos_token_details': {
      const args = values as [string];

      return agent.getTokenDetails(...args);
    }
    case 'joule_lend_token': {
      const args = values as [number, MoveStructId, string, boolean];

      const details = await agent.getTokenDetails(args[1]);

      args[0] = convertAmountFromHumanReadableToOnChain(
        args[0],
        details.decimals || 8
      );

      await agent.lendToken(...args);
      break;
    }
    case 'joule_withdraw_token': {
      const args = values as [number, MoveStructId, string];

      const details = await agent.getTokenDetails(args[1]);

      args[0] = convertAmountFromHumanReadableToOnChain(
        args[0],
        details.decimals || 8
      );

      await agent.withdrawToken(...args);

      break;
    }
    case 'joule_borrow_token': {
      const args = values as [number, MoveStructId, string];

      const details = await agent.getTokenDetails(args[1]);
      args[0] = convertAmountFromHumanReadableToOnChain(
        args[0],
        details.decimals || 8
      );

      await agent.borrowToken(...args);

      break;
    }
    case 'joule_repay_token': {
      const args = values as [number, MoveStructId, string];

      const details = await agent.getTokenDetails(args[1]);
      args[0] = convertAmountFromHumanReadableToOnChain(
        args[0],
        details.decimals || 8
      );

      await agent.repayToken(...args);
      break;
    }
    case 'joule_get_user_position': {
      const args = values as [string];

      const address = AccountAddress.from(walletAddress as string);

      return agent.getUserPosition(address, ...args);
    }
    case 'joule_get_user_all_positions': {
      const args = values as [AccountAddress];

      args[0] = AccountAddress.from(walletAddress as string);
      const response = await agent.getUserAllPositions(...args);

      return Promise.all(
        response.map(async (r: any) => {
          const positions_map = await Promise.all(
            r.positions_map.data.map(async (position: any) => {
              const borrow_positions = await Promise.all(
                position.value.borrow_positions.data.map(async (p: any) => ({
                  ...p,
                  value: convertAmountFromOnChainToHumanReadable(
                    p.value,
                    (
                      await agent.getTokenDetails(position.token_id)
                    )?.decimals || 8
                  ).toString(),
                }))
              );

              const lend_positions = await Promise.all(
                position.value.lend_positions.data.map(async (p: any) => ({
                  ...p,
                  value: convertAmountFromOnChainToHumanReadable(
                    p.value,
                    (
                      await agent.getTokenDetails(position.token_id)
                    )?.decimals || 8
                  ).toString(),
                }))
              );

              return { ...position, borrow_positions, lend_positions };
            })
          );

          return { ...r, positions_map };
        })
      );
    }
    case 'amnis_stake': {
      const args = values as [number];

      const address = agent.account.getAddress();
      args[0] = convertAmountFromHumanReadableToOnChain(args[0], 8);

      await agent.stakeTokensWithAmnis(address, ...args);
      break;
    }
    case 'amnis_withdraw_stake': {
      const args = values as [number];

      const address = agent.account.getAddress();
      args[0] = convertAmountFromHumanReadableToOnChain(args[0], 8);

      await agent.withdrawStakeFromAmnis(address, ...args);
      break;
    }
    case 'panora_aggregator_swap': {
      const args = values as [string, string, number, string];

      await agent.swapWithPanora(...args);
      break;
    }
    case 'panora_aggregator_list': {
      const args = values as [string, boolean, string];

      return agent.listWithPanora(...args);
    }
    case 'emojicoin_provide_liquidity': {
      const args = values as [SymbolEmoji[], number];

      args[1] = convertAmountFromHumanReadableToOnChain(args[1], 8);

      await agent.provideLiquidityEmojicoin(...args);
      break;
    }
    case 'emojicoin_remove_liquidity': {
      const args = values as [SymbolEmoji[], number];

      args[1] = convertAmountFromHumanReadableToOnChain(args[1], 8);

      await agent.removeLiquidityEmojicoin(...args);
      break;
    }
    case 'emojicoin_register_market': {
      const args = values as [SymbolEmoji[]];

      await agent.registerMarketEmojicoin(...args);

      break;
    }
    case 'emojicoin_swap': {
      const args = values as [SymbolEmoji[], number, boolean];

      args[1] = convertAmountFromHumanReadableToOnChain(args[1], 8);

      await agent.swapEmojicoins(...args);

      break;
    }
    case 'emojicoin_get_market': {
      const args = values as [SymbolEmoji[]];

      if (typeof args[0] === 'string') {
        args[0] = [args[0]] as any;
      }

      return agent.getMarketEmojicoin(...args);
    }
    default:
      return;
  }
};
