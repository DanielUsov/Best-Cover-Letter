import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import closeWithGrace from 'close-with-grace';
import Fastify from 'fastify';
import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify/types/instance';
import serviceApp from './app';

function getLoggerOptions() {
  if (process.stdout.isTTY) {
    return {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
          colorize: true,
        },
      },
    };
  }

  return {
    level: 'silent',
  };
}

const fastify: FastifyInstance = Fastify({
  logger: getLoggerOptions(),
  connectionTimeout: 120_000,
  requestTimeout: 60_000,
  keepAliveTimeout: 10_000,
  http: {
    headersTimeout: 15_000,
  },
  ajv: {
    customOptions: {
      removeAdditional: 'all',
      useDefaults: true,
      coerceTypes: true,
      allErrors: true,
      strict: true,
    },
  },
  pluginTimeout: 20000,
}).withTypeProvider<JsonSchemaToTsProvider>();

(async function () {
  await fastify.register(fp(serviceApp));
  closeWithGrace({ delay: fastify.config.FASTIFY_CLOSE_GRACE_DELAY }, async ({ err }) => {
    if (err != null) {
      fastify.log.error(err);
    }
    await fastify.close();
  });

  await fastify.ready();
  try {
    await fastify.listen({ port: fastify.config.SERVER_PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
})();
