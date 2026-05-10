import { GoogleGenAI } from '@google/genai';
import fp from 'fastify-plugin';

declare module 'fastify' {
  interface FastifyInstance {
    geminiClient: GoogleGenAI;
  }
}

export default fp(
  async (fastify): Promise<void> => {
    const geminiClient = new GoogleGenAI({
      apiKey: fastify.config.GEMINI_API_KEY,
    });
    fastify.decorate('geminiClient', geminiClient);
  },
  {
    name: 'geminiClient',
    dependencies: ['config'],
  },
);
