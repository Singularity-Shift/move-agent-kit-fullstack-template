import { Body, Controller, Post } from '@nestjs/common';
import { AptosOnchainService } from './aptos-onchain.service';
import { ActionsDto } from './dto/actions.dto';
import { ToolsNameList } from 'move-agent-kit-fullstack';
import { UserAuth } from '../auth/auth.decorator';
import { IUserAuth } from 'helpers';

@Controller('onchain-agent')
export class AptosOnchainController {
  constructor(private readonly aptosOnchainService: AptosOnchainService) {}

  @Post()
  async getAction(
    @Body() actionDto: ActionsDto,
    @UserAuth() userAuth: IUserAuth
  ) {
    const actionsWithResponses: ToolsNameList[] = [
      'aptos_get_wallet_address',
      'aptos_token_details',
      'aptos_balance',
      'aptos_token_price',
      'aptos_get_transaction',
      'aptos_get_transaction_history',
      'joule_get_user_position',
      'joule_get_user_all_positions',
      'emojicoin_get_market',
      'panora_aggregator_list',
      'panora_aggregator_swap',
    ];

    const actions = await this.aptosOnchainService.getAction(actionDto.prompt);

    if (
      actions.some((action) =>
        actionsWithResponses.includes(action.name as ToolsNameList)
      )
    ) {
      return this.aptosOnchainService.getResponses(actions, userAuth.address);
    }

    return actions;
  }
}
