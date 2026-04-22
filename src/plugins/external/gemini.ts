import { GoogleGenAI } from '@google/genai';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import path from 'node:path';

declare module 'fastify' {
  interface FastifyInstance {
    geminiClient: ReturnType<typeof geminiClient>;
  }
}

async function initContextFiles(geminiClient: GoogleGenAI, fastify: FastifyInstance) {
  const uploadFile = async (filePath: string, mimeType: string, displayName: string) => {
    return geminiClient.files
      .upload({
        file: filePath,
        config: {
          mimeType,
          displayName,
        },
      })
      .then((data) => {
        fastify.log.info(`${displayName} Done`);
        return data;
      })
      .catch((error) => {
        fastify.log.error(`${displayName} Error`);
        fastify.log.error(error);
        throw new Error('Failed to initialize context files');
      });
  };

  const uploadFiles = await Promise.all([
    uploadFile(
      path.join(process.cwd(), 'public', 'resume.pdf'),
      'application/pdf',
      'Resume',
    ),
    uploadFile(
      path.join(process.cwd(), 'public', 'example.md'),
      'text/markdown',
      'Example Cover Letter',
    ),
  ]);
  return uploadFiles;
}

async function geminiClient(fastify: FastifyInstance) {
  const geminiClient = new GoogleGenAI({
    apiKey: fastify.config.GEMINI_API_KEY,
  });

  const uploadFiles = await initContextFiles(geminiClient, fastify);
  return {
    api: geminiClient,
    files: uploadFiles,
  };
}

export default fp(
  async (fastify): Promise<void> => {
    fastify.decorate('geminiClient', geminiClient(fastify));
    fastify.addHook('onClose', async (): Promise<void> => {
      const gemini = await geminiClient(fastify);
      const listResponse = await gemini.api.files.list({ config: { pageSize: 100 } });
      const files = [];

      for await (const file of listResponse) {
        if (file.name) files.push(file);
      }

      await Promise.all(
        files.map((f) => {
          if (f.name)
            gemini.api.files.delete({
              name: f.name,
            });
        }),
      );
    });
  },
  {
    name: 'gemini',
    dependencies: ['config'],
  },
);
