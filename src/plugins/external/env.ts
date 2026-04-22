import env from '@fastify/env';
import fp from 'fastify-plugin';

declare module 'fastify' {
  export interface FastifyInstance {
    config: {
      SERVER_PORT: number;
      FASTIFY_CLOSE_GRACE_DELAY: number;
    };
  }
}

const schema = {
  type: 'object',
  required: [],
  properties: {
    // PSQL_HOST: {
    //   type: 'string',
    //   default: 'localhost',
    // },
    // PSQL_PORT: {
    //   type: 'number',
    //   default: 5432,
    // },
    // PSQL_DATABASE: {
    //   type: 'string',
    // },
    // PSQL_USER: {
    //   type: 'string',
    // },
    // PSQL_PASSWORD: {
    //   type: 'string',
    // },
    SERVER_PORT: {
      type: 'number',
      default: 3000,
    },
    // FRONTEND_HOST: {
    //   type: 'string',
    // },
    FASTIFY_CLOSE_GRACE_DELAY: {
      type: 'number',
      default: 500,
    },
    // RATE_LIMIT_MAX: {
    //   type: 'number',
    //   default: 3306,
    // },
    // ADMIN_START_EMAIL: {
    //   type: 'string',
    // },
    // ADMIN_START_PASSWORD: {
    //   type: 'string',
    // },
  },
};

export default fp(
  async (fastify) => {
    fastify.register(env, {
      confKey: 'config',
      schema,
      dotenv: true,
    });
  },
  {
    name: 'config',
  },
);
