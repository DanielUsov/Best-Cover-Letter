import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async function ({ protocol, hostname, port }) {
    return {
      message: `Hello! See documentation at ${protocol}://${hostname}:${port}/api/docs`,
    };
  });
};

export default root;
