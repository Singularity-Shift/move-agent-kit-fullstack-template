import { Body, Controller, Post } from '@nestjs/common';
import { AptosOnchainService } from './aptos-onchain.service';
import { ActionsDto } from './dto/actions.dto';
import { GetActionDto } from './dto/get-action.dto';
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
      'joule_get_user_position',
      'joule_get_user_all_positions',
      'emojicoin_get_market',
    ];

    const actions = await this.aptosOnchainService.getAction(actionDto.prompt);

    const actionsFormated = actions.map(GetActionDto.fromJson);

    if (
      actionsFormated.some((action) =>
        actionsWithResponses.includes(action.name)
      )
    ) {
      return this.aptosOnchainService.getResponses(
        actionsFormated,
        userAuth.address
      );
    }

    return actionsFormated;
  }
}
