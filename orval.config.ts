import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './openapi.yaml',
    },
    output: {
      mode: 'tags',
      client: 'react-query',
      target: './src/api/generated.ts',
      schemas: './src/api/model',
      clean: true,
      override: {
        useTypeOverInterfaces: false,
      },
    },
  },
});
