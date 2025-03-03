import {
  AccountAddress,
  convertAmountFromHumanReadableToOnChain,
  convertAmountFromOnChainToHumanReadable,
  MoveStructId,
} from '@aptos-labs/ts-sdk';
import {
  AgentRuntime,
  getTokenByTokenName,
  parseFungibleAssetAddressToWrappedAssetAddress,
} from 'move-agent-kit-fullstack';

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

    case 'liquidswap_swap': {
      const args = values as [MoveStructId, MoveStructId, number, number];

      const token0 = getTokenByTokenName(args[0]);
      const token1 = getTokenByTokenName(args[1]);

      if (token0) {
        args[0] = token0.tokenAddress as MoveStructId;
      }

      if (token1) {
        args[1] = token1.tokenAddress as MoveStructId;
      }

      const details1 = await agent.getTokenDetails(args[0]);
      const details2 = await agent.getTokenDetails(args[1]);

      args[2] = convertAmountFromHumanReadableToOnChain(
        args[2],
        details1.decimals || 8
      );
      args[3] = convertAmountFromHumanReadableToOnChain(
        args[3],
        details2.decimals || 8
      );

      await agent.swap(...args);
      break;
    }
    case 'liquidswap_add_liquidity': {
      const args = values as [MoveStructId, MoveStructId, number, number];

      args[0] = parseFungibleAssetAddressToWrappedAssetAddress(args[0]);
      args[1] = parseFungibleAssetAddressToWrappedAssetAddress(args[1]);

      const details1 = await agent.getTokenDetails(args[0]);
      const details2 = await agent.getTokenDetails(args[1]);

      args[2] = convertAmountFromHumanReadableToOnChain(
        args[2],
        details1.decimals || 8
      );
      args[3] = convertAmountFromHumanReadableToOnChain(
        args[3],
        details2.decimals || 8
      );

      await agent.addLiquidity(...args);
      break;
    }
    case 'liquidswap_remove_liquidity': {
      const args = values as [
        MoveStructId,
        MoveStructId,
        number,
        number,
        number
      ];

      args[0] = parseFungibleAssetAddressToWrappedAssetAddress(args[0]);
      args[1] = parseFungibleAssetAddressToWrappedAssetAddress(args[1]);

      if (args[2]) {
        const details1 = await agent.getTokenDetails(args[0]);

        args[2] = convertAmountFromHumanReadableToOnChain(
          args[2],
          details1.decimals
        );
      }

      if (args[3]) {
        const details2 = await agent.getTokenDetails(args[1]);

        args[3] = convertAmountFromHumanReadableToOnChain(
          args[3],
          details2.decimals
        );
      }

      args[4] = convertAmountFromHumanReadableToOnChain(args[4], 6);

      await agent.removeLiquidity(...args);
      break;
    }
    case 'liquidswap_create_pool': {
      const args = values as [MoveStructId, MoveStructId];

      args[0] = parseFungibleAssetAddressToWrappedAssetAddress(args[0]);
      args[1] = parseFungibleAssetAddressToWrappedAssetAddress(args[1]);

      await agent.createPool(...args);
      break;
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
    case 'aries_borrow': {
      const args = values as [MoveStructId, number];

      const details = await agent.getTokenDetails(args[0]);
      args[1] = convertAmountFromHumanReadableToOnChain(
        args[1],
        details.decimals || 8
      );

      await agent.borrowAriesToken(...args);

      break;
    }
    case 'aries_repay': {
      const args = values as [MoveStructId, number];

      const details = await agent.getTokenDetails(args[0]);
      args[1] = convertAmountFromHumanReadableToOnChain(
        args[1],
        details.decimals || 8
      );

      await agent.repayAriesToken(...args);

      break;
    }
    case 'aries_lend': {
      const args = values as [MoveStructId, number];

      const details = await agent.getTokenDetails(args[0]);
      args[1] = convertAmountFromHumanReadableToOnChain(
        args[1],
        details.decimals || 8
      );

      await agent.lendAriesToken(...args);

      break;
    }
    case 'aries_withdraw': {
      const args = values as [MoveStructId, number];

      const details = await agent.getTokenDetails(args[0]);
      args[1] = convertAmountFromHumanReadableToOnChain(
        args[1],
        details.decimals || 8
      );

      agent.withdrawAriesToken(...args);
      break;
    }
    case 'aries_create_profile': {
      await agent.createAriesProfile();
      break;
    }
    case 'panora_aggregator_swap': {
      const args = values as [string, string, number, string];

      await agent.swapWithPanora(...args);
      break;
    }
    default:
      return;
  }
};
