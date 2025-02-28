import { Logger } from '@nestjs/common';
import * as Joi from 'joi';
import { get as loGet } from 'lodash';
import { Profiles } from './profiles';

export interface EnvConfig {
  [key: string]: string;
}

const DOTENV_SCHEMA = Joi.object({
  nodeEnv: Joi.string()
    .valid('development', 'production')
    .default('development'),
  server: Joi.object({
    port: Joi.number().default(3100),
  }).default({
    port: 3100,
  }),
  jwt: Joi.object({
    secret: Joi.string().required(),
    expiredTime: Joi.string().default('31d'),
  }),
  openApi: Joi.object({
    apiKey: Joi.string().required(),
  }),
  panora: Joi.object({
    apiKey: Joi.string().required(),
  }),
});

type DotenvSchemaKeys =
  | 'nodeEnv'
  | 'server.port'
  | 'jwt.secret'
  | 'jwt.expiredTime'
  | 'openApi.apiKey'
  | 'panora.apiKey';

export class ConfigService {
  private readonly envConfig: EnvConfig;
  private readonly logger = new Logger(ConfigService.name);

  constructor() {
    this.envConfig = this.validateInput(
      Profiles[process.env.NODE_ENV || 'development']
    );
  }

  get<T>(path: DotenvSchemaKeys): T | undefined {
    return loGet(this.envConfig, path) as unknown as T | undefined;
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const { error, value: validatedEnvConfig } = DOTENV_SCHEMA.validate(
      envConfig,
      {
        allowUnknown: true,
        stripUnknown: true,
      }
    );
    if (error) {
      this.logger.error(
        'Missing configuration please provide followed variable!\n\n',
        'ConfigService'
      );
      this.logger.error(error.message, 'ConfigService');
      process.exit(2);
    }
    return validatedEnvConfig as EnvConfig;
  }
}
