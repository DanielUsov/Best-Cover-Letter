import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify/types/instance';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

declare module 'fastify' {
  interface FastifyInstance {
    fileManager: ReturnType<typeof fileManager>;
  }
}

const contextFileNames: string[] = ['resume.md', 'example.md'];
const publicFiles = readdirSync(path.join(process.cwd(), 'public'));

function checkFiles(): boolean {
  return contextFileNames.every((name) => publicFiles.includes(name));
}

function filesLoading() {
  return publicFiles.map((file) => {
    return {
      inlineData: {
        mimeType: 'text/markdown',
        data: readFileSync(path.join(process.cwd(), 'public', file)).toString('base64'),
      },
    };
  });
}

function fileManager() {
  return {
    fileStatus: checkFiles(),
    files: filesLoading(),
  };
}

export default fp(
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.decorate('fileManager', fileManager());
  },
  {
    name: 'fileManager',
    dependencies: ['config'],
  },
);
