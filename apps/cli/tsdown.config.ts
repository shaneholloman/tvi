import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	clean: true,
	shims: true,
	outDir: "dist",
	outputOptions: {
		banner: "#!/usr/bin/env node",
	},
	env: {
		POSTHOG_API_KEY: process.env.POSTHOG_API_KEY || "lol",
		POSTHOG_HOST: process.env.POSTHOG_HOST || "lool",
		TELEMETRY: process.env.TELEMETRY || "false", // wierd trick i know
	},
});
