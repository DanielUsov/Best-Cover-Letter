import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify/types/instance';
import got from 'got';
import { parse, type HTMLElement } from 'node-html-parser';
import type { Parser, ParsingVacancy } from '../../@types/parser';
import { GOT_OPTIONS, VACANCY_SELECTORS } from '../../consts/request';

declare module 'fastify' {
  interface FastifyInstance {
    parser: ReturnType<typeof parser>;
  }
}

function extractReadableText(container: HTMLElement): string {
  const lines: string[] = [];

  for (const node of container.querySelectorAll('p, li, h1, h2, h3')) {
    const text = node.text.trim();
    if (!text) {
      continue;
    }
    lines.push(text);
  }

  return lines.join();
}

function extractVacancyDescription(
  root: HTMLElement,
  selectors: readonly string[],
): string {
  let sections: string = '';

  for (const selector of selectors) {
    const element = root.querySelector(selector);
    if (!element) {
      continue;
    }

    const text = extractReadableText(element);
    if (text) {
      sections += text;
    }
  }

  return sections;
}

async function parsingVacancy(vacancyURL: string): Promise<ParsingVacancy> {
  const response = await got.get(vacancyURL, GOT_OPTIONS);
  const html = parse(response.body);
  const vacancyTitle =
    html.querySelector('[data-qa="vacancy-title"]')?.textContent.trim() ?? '';
  const vacancyLocation =
    html
      .querySelector('[data-qa="vacancy-view-raw-address"]')
      ?.textContent.trim()
      .split(',')[0] ?? '';
  const vacancyDescription = extractVacancyDescription(html, VACANCY_SELECTORS);

  return {
    title: vacancyTitle,
    location: vacancyLocation,
    description: vacancyDescription,
  };
}

function parser(): Parser {
  return {
    parsingVacancy,
  };
}

export default fp(
  async (fastify: FastifyInstance): Promise<void> => {
    fastify.decorate('parser', parser());
  },
  {
    name: 'parser',
    dependencies: ['config'],
  },
);
