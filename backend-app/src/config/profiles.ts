export const Profiles = {
  development: {
    nodeEnv: process.env.NODE_ENV,
    server: {
      port: process.env.PORT,
    },
    jwt: {
      secret: process.env.JWT_SECRET_KEY,
      expiredTime: process.env.JWT_EXPIRED_TIME,
    },
    openApi: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  },
  production: {
    nodeEnv: process.env.NODE_ENV,
    server: {
      port: process.env.PORT,
    },
    jwt: {
      secret: process.env.JWT_SECRET_KEY,
      expiredTime: process.env.JWT_EXPIRED_TIME,
    },
    openApi: {
      apiKey: process.env.OPENAI_API_KEY,
    },
  },
};
