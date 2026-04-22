import env from '@fastify/env';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    config: {
      SERVER_PORT: number;
      FASTIFY_CLOSE_GRACE_DELAY: number;
      GEMINI_API_KEY: string;
    };
  }
}

const schema = {
  type: 'object',
  required: [],
  properties: {
    SERVER_PORT: {
      type: 'number',
      default: 3000,
    },
    FASTIFY_CLOSE_GRACE_DELAY: {
      type: 'number',
      default: 500,
    },
    GEMINI_API_KEY: {
      type: 'string',
    },
  },
};

export default fp(
  async (fastify): Promise<void> => {
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
