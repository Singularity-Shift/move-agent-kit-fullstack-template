import { IActionFunction } from 'helpers';
import { Logger } from '@nestjs/common';
import { ToolsNameList } from 'move-agent-kit-fullstack';

export class GetActionDto {
  name: ToolsNameList;
  args: any[];
  onchain: boolean;
  logger = new Logger('GetActionDto');

  static fromJson(json: IActionFunction): GetActionDto {
    return new GetActionDto(json.name, json.arguments);
  }

  constructor(name: ToolsNameList, args: string) {
    this.name = name;
    const values = JSON.parse(args);

    if (values?.input && Object.keys(values.input).length) {
      if (['aptos_balance', 'aptos_token_details'].includes(name)) {
        values.input = { balance: values.input };
      } else if (
        ['panora_aggregator_list'].includes(name) &&
        values.input.includes('0x')
      ) {
        values.input = { tokenAddress: values.input };
      } else if (typeof values.input === 'string') {
        values.input = JSON.parse(values.input);
      }
    }

    this.args = Object.values(values?.input || values);
    this.onchain = true;
  }
}
