import { HumanMessage } from '@langchain/core/messages';
import { CompiledStateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { createReactAgentAnnotation } from '@langchain/langgraph/dist/prebuilt/react_agent_executor';
import { Injectable } from '@nestjs/common';
import { Account, Aptos, AptosConfig, Network } from '@aptos-labs/ts-sdk';
import {
  AgentRuntime,
  LocalSigner,
  getSwapDetails,
} from 'move-agent-kit-fullstack';
import { executeAction } from 'helpers';
import { GetActionDto } from './dto/get-action.dto';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AptosOnchainService {
  constructor(
    private readonly onchainAgent: CompiledStateGraph<
      (typeof MessagesAnnotation)['State'],
      (typeof MessagesAnnotation)['Update'],
      any,
      typeof MessagesAnnotation.spec,
      ReturnType<typeof createReactAgentAnnotation>['spec']
    >,
    private readonly configService: ConfigService
  ) {}

  public async getAction(prompt: string) {
    const result = await this.onchainAgent.invoke(
      {
        messages: [new HumanMessage(prompt)],
      },
      { configurable: { thread_id: 'Aptos Agent Kit!' } }
    );

    const contents = result.messages
      .filter((m) => m.name)
      .map((m) => JSON.parse(m.content as string));

    return contents;
  }

  public async getResponses(actions: GetActionDto[], walletAddress: string) {
    const signer = new LocalSigner({} as Account);

    const aptos = new Aptos(
      new AptosConfig({
        network: Network.MAINNET,
      })
    );

    const agent = new AgentRuntime(signer, aptos, {
      PANORA_API_KEY: this.configService.get<string>('panora.apiKey'),
    });

    const responses = [];

    for await (const action of actions) {
      if (action.name === 'panora_aggregator_swap') {
        const details = await getSwapDetails(
          agent,
          action.args[0],
          action.args[1],
          action.args[2],
          walletAddress
        );

        responses.push({
          ...action,
          txDetails: details.quotes[0],
        });
      } else {
        const response = await executeAction(
          action.name,
          action.args,
          agent,
          walletAddress
        );

        responses.push(response);
      }
    }

    return responses;
  }
}
