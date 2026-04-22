import fp from 'fastify-plugin';
import type { FastifyInstance } from 'fastify/types/instance';
import type { HTMLElement } from 'node-html-parser';

declare module 'fastify' {
  interface FastifyInstance {
    parser: ReturnType<typeof parser>;
  }
}

function extractReadableText(container: HTMLElement): string {
  const lines: string[] = [];

  for (const node of container.querySelectorAll('p, li, h1, h2, h3')) {
    if (
      node.tagName.toLowerCase() === 'p' &&
      node.parentNode?.tagName?.toLowerCase() === 'li'
    ) {
      continue;
    }

    const text = node.text.trim();
    if (!text) continue;

    // const line = node.tagName.toLowerCase() === 'li' ? `• ${text}` : text;
    lines.push(text);
  }

  return lines.join('\n');
}

export function parser() {
  return {
    extractVacancyText(root: HTMLElement, selectors: readonly string[]): string[] {
      const sections: string[] = [];

      for (const selector of selectors) {
        const element = root.querySelector(selector);
        if (!element) continue;

        const text = extractReadableText(element);
        if (text) sections.push(text);
      }

      return sections;
    },
  };
}

export default fp(
  async (fastify: FastifyInstance) => {
    fastify.decorate('parser', parser());
  },
  {
    name: 'parser',
    dependencies: ['config'],
  },
);
