import path from "node:path";
import fs from "fs-extra";
import type { ProjectConfig } from "../../types";
import { readTviConfig } from "../../utils/tvi-config";

export async function detectProjectConfig(
	projectDir: string,
): Promise<Partial<ProjectConfig> | null> {
	try {
		const tviConfig = await readTviConfig(projectDir);
		if (tviConfig) {
			return {
				projectDir,
				projectName: path.basename(projectDir),
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
		}

		return null;
	} catch (_error) {
		return null;
	}
}

export async function isBetterTStackProject(
	projectDir: string,
): Promise<boolean> {
	try {
		return await fs.pathExists(path.join(projectDir, "tvi.jsonc"));
	} catch (_error) {
		return false;
	}
}
