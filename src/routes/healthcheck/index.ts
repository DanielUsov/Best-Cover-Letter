import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

const routes: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.get(
    '/',
    {
      schema: {
        response: {
          200: {
            type: 'object',
            properties: {
              status: {
                type: 'string',
                example: 'ok',
              },
            },
          },
        },
        tags: ['Healthcheck'],
      },
    },
    async (_request, reply): Promise<void> => {
      reply.code(200).send({
        status: 'ok',
      });
    },
  );
};

export default routes;
