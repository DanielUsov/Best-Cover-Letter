import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';

const routes: FastifyPluginAsyncJsonSchemaToTs = async (fastify): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            vacancyURL: {
              type: 'string',
            },
          },
        },
        tags: ['Cover-Letter'],
      },
    },
    async (request, reply): Promise<void> => {
      const vacancyURL = request.body.vacancyURL?.split('?')[0];
      if (!vacancyURL) {
        throw new Error(`No vacancy url: ${vacancyURL}`);
      }

      const vacancyData = await fastify.parser.parsingVacancy(vacancyURL);
      if (!vacancyData) {
        throw new Error(`No vacancy content found at: ${vacancyURL}`);
      }

      const geminiAnswear = await fastify.coverLetter.coverLetterGenerate(
        vacancyURL,
        fastify,
      );

      reply.code(200).send({
        vacancyURL,
        coverLetter: geminiAnswear,
      });
    },
  );
};

export default routes;
