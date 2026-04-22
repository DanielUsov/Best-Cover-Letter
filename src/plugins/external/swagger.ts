import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';
import { version, name, description } from '../../../package.json';

export default fp(async (fastify) => {
  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: name.toLocaleUpperCase(),
        description,
        version,
      },
      tags: [
        {
          name: 'User',
          description: 'Users endpoints',
        },
      ],
    },
  });

  fastify.register(fastifySwaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
      deepLinking: true,
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
  });
});
