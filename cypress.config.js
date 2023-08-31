import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "zkwv4m",

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
