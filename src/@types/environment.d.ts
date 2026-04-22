declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PSQL_HOST: string;
      PSQL_PORT: number;
      PSQL_DATABASE: string;
      PSQL_USER: string;
      PSQL_PASSWORD: string;
      SERVER_PORT: number;
      FRONTEND_HOST: string;
      FASTIFY_CLOSE_GRACE_DELAY: number;
      RATE_LIMIT_MAX: number;
      ADMIN_START_EMAIL: string;
      ADMIN_START_PASSWORD: string;
    }
  }
}

export {};
