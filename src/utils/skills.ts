import { readdirSync } from 'node:fs';
import type { FastifyInstance } from 'fastify';
import { promises as fs } from 'fs';
import path from 'node:path';

const ROOT_DIR = process.cwd();
const SKILLS_DIR = path.join(ROOT_DIR, 'src', 'skills');

export async function loadSystemSkills(fastify: FastifyInstance): Promise<string> {
  try {
    const files = readdirSync(SKILLS_DIR);
    const filteredFiles = files.filter((file) => file !== 'master.md');
    const readFiles = filteredFiles.map((file) =>
      fs.readFile(path.join(SKILLS_DIR, file), 'utf-8'),
    );
    const skills = await Promise.all(readFiles);
    fastify.log.info(`Skills loaded`);
    return skills.join('\n\n');
  } catch (error) {
    fastify.log.error(`Ошибка при сборке skills: \n${error}`);
    throw error;
  }
}

export async function loadMasterPrompt(fastify: FastifyInstance) {
  const filePath = path.join(SKILLS_DIR, 'master.md');

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    fastify.log.error(`Ошибка при чтении master.md: \n${error}`);
    throw error;
  }
}
