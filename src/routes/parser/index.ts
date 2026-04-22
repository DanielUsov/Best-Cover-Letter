import type { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import got from 'got';
import { parse } from 'node-html-parser';
import { GOT_OPTIONS, VACANCY_SELECTORS } from '../../consts/request';

const routes: FastifyPluginAsyncJsonSchemaToTs = async (fastify) => {
  fastify.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            vacunceURL: {
              type: 'string',
            },
          },
        },
      },
    },
    async (request, reply) => {
      const { vacunceURL } = request.body;

      if (!vacunceURL) {
        throw new Error(`No vacancy url: ${vacunceURL}`);
      }

      const html = await got.get(vacunceURL, GOT_OPTIONS);
      const vacancyDescription = fastify.parser.extractVacancyText(
        parse(html.body),
        VACANCY_SELECTORS,
      );

      if (!vacancyDescription.length) {
        throw new Error(`No vacancy content found at: ${vacunceURL}`);
      }

      reply.code(200).send({
        vacunceURL,
        vacancyDescription,
        fetchedAt: new Date(),
      });
    },
  );
};

export default routes;
