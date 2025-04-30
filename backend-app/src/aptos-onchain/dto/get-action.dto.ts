import { Logger } from '@nestjs/common';
import { ToolsNameList } from 'move-agent-kit-fullstack';

export class GetActionDto {
  name: ToolsNameList;
  args: any[];
  onchain: boolean;
  logger = new Logger('GetActionDto');
}
