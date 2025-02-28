import { Module } from '@nestjs/common';
import { AptosOnchainService } from './aptos-onchain.service';
import { AptosOnchainController } from './aptos-onchain.controller';
import { OnchainAgentModule } from '../onchain-agent/onchain-agent.module';

@Module({
  imports: [OnchainAgentModule],
  providers: [AptosOnchainService],
  controllers: [AptosOnchainController],
})
export class AptosOnchainModule {}
