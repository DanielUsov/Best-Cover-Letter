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
      },
    },
    async (request, reply): Promise<void> => {
      const vacancyURL = request.body.vacancyURL?.split('?')[0];

      if (!vacancyURL) {
        throw new Error(`No vacancy url: ${vacancyURL}`);
      }

      const vacancyData = await fastify.parser.parsingVacancy(vacancyURL);
      const geminiAnswear = await fastify.coverLatter.coverLatterGenerate(
        vacancyURL,
        fastify,
      );

      fastify.log.info(vacancyData);
      fastify.log.info(geminiAnswear);

      if (!vacancyData) {
        throw new Error(`No vacancy content found at: ${vacancyURL}`);
      }

      if (!geminiAnswear) {
        throw new Error(`Gemini Error`);
      }

      reply.code(200).send({
        vacancyURL,
        ...vacancyData,
        coverLatter: geminiAnswear,
        fetchedAt: new Date(),
      });
    },
  );
};

export default routes;
