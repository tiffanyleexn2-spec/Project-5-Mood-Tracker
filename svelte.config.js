import adapter from "@sveltejs/adapter-static";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: "#svelte",
    adapter: adapter({ fallback: "index.html" }),
  },
  vite: {
    server: false,
    ssr: {
      external: ["@xstate/svelte"],
    },
  },
};

export default config;