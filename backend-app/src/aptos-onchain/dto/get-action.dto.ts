import { IActionFunction } from 'helpers';
import { ToolsNameList } from 'move-agent-kit-fullstack';

export class GetActionDto {
  name: ToolsNameList;
  args: any[];
  onchain: boolean;

  static fromJson(json: IActionFunction): GetActionDto {
    return new GetActionDto(json.name, json.arguments);
  }

  constructor(name: ToolsNameList, args: string) {
    this.name = name;
    const values = JSON.parse(args);
    if (values?.input) {
      values.input = JSON.parse(values.input);
    }
    this.args = Object.values(values?.input || values);
    this.onchain = true;
  }
}
