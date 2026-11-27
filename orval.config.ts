import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "./docs/openapi.yaml",
    },
    output: {
      mode: "tags",
      client: "react-query",
      target: "./api/generated.ts",
      schemas: "./api/model",
      clean: true,
      override: {
        useTypeOverInterfaces: false,
        mutator: {
          path: "./lib/api-fetcher.ts",
          name: "fetcher",
        },
      },
    },
  },
});
