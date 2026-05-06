import { createPartFromUri, createUserContent } from '@google/genai/node';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import type { ParsingVacancy } from '../../@types/parser';
import { finalPrompt } from '../../consts/gemini';
import { loadMasterPrompt, loadSystemSkills } from '../../utils/skills';

declare module 'fastify' {
  interface FastifyInstance {
    coverLatter: ReturnType<typeof coverLatter>;
  }
}

async function coverLetterСonstructor(
  fastify: FastifyInstance,
  vacancyData: ParsingVacancy,
) {
  const masterPrompt = await loadMasterPrompt(fastify);
  return finalPrompt(
    masterPrompt,
    vacancyData.title,
    vacancyData.location,
    vacancyData.description,
  );
}

async function coverLatterGenerate(vacancyURL: string, fastify: FastifyInstance) {
  const vacancyData = await fastify.parser.parsingVacancy(vacancyURL);
  const text = await coverLetterСonstructor(fastify, vacancyData);

  const { files, api } = await fastify.geminiClient;

  const response = await api.models
    .generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [
        createUserContent([
          text,
          createPartFromUri(files[0]?.uri!, files[0]?.mimeType!),
          createPartFromUri(files[1]?.uri!, files[1]?.mimeType!),
        ]),
      ],
      config: {
        systemInstruction: await loadSystemSkills(fastify),
        temperature: 0.5,
      },
    })
    .then((data) => data.text);
  fastify.log.info(response);

  return response;
}

function coverLatter() {
  return {
    coverLatterGenerate,
  };
}

export default fp(
  async (fastify): Promise<void> => {
    fastify.decorate('coverLatter', coverLatter());
  },
  {
    name: 'coverLatter',
    dependencies: ['gemini', 'parser', 'config'],
  },
);
