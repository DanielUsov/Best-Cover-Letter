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
  const { api } = await fastify.geminiClient;
  const files = fastify.fileManager.files;

  if (!fastify.fileManager.fileStatus || !files[0] || !files[1]) {
    const errorMessege = 'Files error';
    fastify.log.error(errorMessege);
    throw new Error(errorMessege);
  }

  const response = await api.models
    .generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [{ text }, files[0], files[1]],
      config: {
        systemInstruction: await loadSystemSkills(fastify),
        temperature: 0.5,
      },
    })
    .then((data) => data.text)
    .catch((error) => {
      fastify.log.error(`Gemini Error: ${error}`);
      throw new Error(`Gemini Error`);
    });

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
    dependencies: ['geminiClient', 'parser', 'config', 'fileManager'],
  },
);
