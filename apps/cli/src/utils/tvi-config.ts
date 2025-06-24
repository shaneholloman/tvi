import path from "node:path";
import fs from "fs-extra";
import * as JSONC from "jsonc-parser";
import type { BetterTStackConfig, ProjectConfig } from "../types";
import { getLatestCLIVersion } from "./get-latest-cli-version";

const TVI_CONFIG_FILE = "tvi.jsonc";

export async function writeTviConfig(
	projectConfig: ProjectConfig,
): Promise<void> {
	const tviConfig: BetterTStackConfig = {
		version: getLatestCLIVersion(),
		createdAt: new Date().toISOString(),
		database: projectConfig.database,
		orm: projectConfig.orm,
		backend: projectConfig.backend,
		runtime: projectConfig.runtime,
		frontend: projectConfig.frontend,
		addons: projectConfig.addons,
		examples: projectConfig.examples,
		auth: projectConfig.auth,
		packageManager: projectConfig.packageManager,
		dbSetup: projectConfig.dbSetup,
		api: projectConfig.api,
	};

	const baseContent = {
		$schema: "https://tvi.dev/schema.json",
		version: tviConfig.version,
		createdAt: tviConfig.createdAt,
		database: tviConfig.database,
		orm: tviConfig.orm,
		backend: tviConfig.backend,
		runtime: tviConfig.runtime,
		frontend: tviConfig.frontend,
		addons: tviConfig.addons,
		examples: tviConfig.examples,
		auth: tviConfig.auth,
		packageManager: tviConfig.packageManager,
		dbSetup: tviConfig.dbSetup,
		api: tviConfig.api,
	};

	let configContent = JSON.stringify(baseContent);

	const formatResult = JSONC.format(configContent, undefined, {
		tabSize: 2,
		insertSpaces: true,
		eol: "\n",
	});

	configContent = JSONC.applyEdits(configContent, formatResult);

	const finalContent = `// tvi configuration file
// safe to delete

${configContent}`;
	const configPath = path.join(projectConfig.projectDir, TVI_CONFIG_FILE);
	await fs.writeFile(configPath, finalContent, "utf-8");
}

export async function readTviConfig(
	projectDir: string,
): Promise<BetterTStackConfig | null> {
	try {
		const configPath = path.join(projectDir, TVI_CONFIG_FILE);

		if (!(await fs.pathExists(configPath))) {
			return null;
		}

		const configContent = await fs.readFile(configPath, "utf-8");

		const errors: JSONC.ParseError[] = [];
		const config = JSONC.parse(configContent, errors, {
			allowTrailingComma: true,
			disallowComments: false,
		}) as BetterTStackConfig;

		if (errors.length > 0) {
			console.warn("Warning: Found errors parsing tvi.jsonc:", errors);
			return null;
		}

		return config;
	} catch (_error) {
		return null;
	}
}

export async function updateTviConfig(
	projectDir: string,
	updates: Partial<Pick<BetterTStackConfig, "addons">>,
): Promise<void> {
	try {
		const configPath = path.join(projectDir, TVI_CONFIG_FILE);

		if (!(await fs.pathExists(configPath))) {
			return;
		}

		const configContent = await fs.readFile(configPath, "utf-8");

		let modifiedContent = configContent;

		for (const [key, value] of Object.entries(updates)) {
			const editResult = JSONC.modify(modifiedContent, [key], value, {
				formattingOptions: {
					tabSize: 2,
					insertSpaces: true,
					eol: "\n",
				},
			});
			modifiedContent = JSONC.applyEdits(modifiedContent, editResult);
		}

		await fs.writeFile(configPath, modifiedContent, "utf-8");
	} catch (_error) {}
}
