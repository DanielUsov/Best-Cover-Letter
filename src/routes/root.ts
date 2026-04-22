import type { FastifyInstance, FastifyPluginAsync } from 'fastify';

const root: FastifyPluginAsync = async (fastify: FastifyInstance): Promise<void> => {
  fastify.get('/', async function ({ protocol, hostname }) {
    return {
      message: `Hello! See documentation at ${protocol}://${hostname}/api/docs`,
    };
  });
};

export default root;
