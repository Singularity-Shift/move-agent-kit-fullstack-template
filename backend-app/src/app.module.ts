import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AptosOnchainModule } from './aptos-onchain/aptos-onchain.module';
import { AuthGuard } from './auth/auth.guard';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AuthModule, ConfigModule, AptosOnchainModule],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
