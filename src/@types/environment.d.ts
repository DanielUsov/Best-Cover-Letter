declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SERVER_PORT: number;
      FASTIFY_CLOSE_GRACE_DELAY: number;
      GEMINI_API_KEY: string;
    }
  }
}

export {};
