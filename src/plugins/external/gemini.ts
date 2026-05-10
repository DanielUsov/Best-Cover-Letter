import { GoogleGenAI } from '@google/genai';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    geminiClient: ReturnType<typeof geminiClient>;
  }
}

async function geminiClient(fastify: FastifyInstance) {
  const geminiClient = new GoogleGenAI({
    apiKey: fastify.config.GEMINI_API_KEY,
  });

  return {
    api: geminiClient,
  };
}

export default fp(
  async (fastify): Promise<void> => {
    fastify.decorate('geminiClient', geminiClient(fastify));
  },
  {
    name: 'geminiClient',
    dependencies: ['config'],
  },
);
