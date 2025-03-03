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
      values.input =
        name === 'aptos_balance' || name === 'aptos_token_details'
          ? {
              balance: values.input,
            }
          : JSON.parse(values.input);
    }
    this.args = Object.values(values?.input || values);
    this.onchain = true;
  }
}
