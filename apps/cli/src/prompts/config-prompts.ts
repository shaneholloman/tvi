import { cancel, group } from "@clack/prompts";
import pc from "picocolors";
import type {
	Addons,
	API,
	Backend,
	Database,
	DatabaseSetup,
	Examples,
	Frontend,
	ORM,
	PackageManager,
	ProjectConfig,
	Runtime,
} from "../types";
import { getAddonsChoice } from "./addons";
import { getApiChoice } from "./api";
import { getAuthChoice } from "./auth";
import { getBackendFrameworkChoice } from "./backend";
import { getDatabaseChoice } from "./database";
import { getDBSetupChoice } from "./database-setup";
import { getExamplesChoice } from "./examples";
import { getFrontendChoice } from "./frontend";
import { getGitChoice } from "./git";
import { getinstallChoice } from "./install";
import { getORMChoice } from "./orm";
import { getPackageManagerChoice } from "./package-manager";
import { getRuntimeChoice } from "./runtime";

type PromptGroupResults = {
	frontend: Frontend[];
	backend: Backend;
	runtime: Runtime;
	database: Database;
	orm: ORM;
	api: API;
	auth: boolean;
	addons: Addons[];
	examples: Examples[];
	dbSetup: DatabaseSetup;
	git: boolean;
	packageManager: PackageManager;
	install: boolean;
};

export async function gatherConfig(
	flags: Partial<ProjectConfig>,
	projectName: string,
	projectDir: string,
	relativePath: string,
): Promise<ProjectConfig> {
	const result = await group<PromptGroupResults>(
		{
			frontend: () => getFrontendChoice(flags.frontend, flags.backend),
			backend: ({ results }) =>
				getBackendFrameworkChoice(flags.backend, results.frontend),
			runtime: ({ results }) =>
				getRuntimeChoice(flags.runtime, results.backend),
			database: ({ results }) =>
				getDatabaseChoice(flags.database, results.backend, results.runtime),
			orm: ({ results }) =>
				getORMChoice(
					flags.orm,
					results.database !== "none",
					results.database,
					results.backend,
					results.runtime,
				),
			api: ({ results }) =>
				getApiChoice(flags.api, results.frontend, results.backend),
			auth: ({ results }) =>
				getAuthChoice(flags.auth, results.database !== "none", results.backend),
			addons: ({ results }) => getAddonsChoice(flags.addons, results.frontend),
			examples: ({ results }) =>
				getExamplesChoice(
					flags.examples,
					results.database,
					results.frontend,
					results.backend,
					results.api,
				),
			dbSetup: ({ results }) =>
				getDBSetupChoice(
					results.database ?? "none",
					flags.dbSetup,
					results.orm,
					results.backend,
					results.runtime,
				),
			git: () => getGitChoice(flags.git),
			packageManager: () => getPackageManagerChoice(flags.packageManager),
			install: () => getinstallChoice(flags.install),
		},
		{
			onCancel: () => {
				cancel(pc.red("Operation cancelled"));
				process.exit(0);
			},
		},
	);

	if (result.backend === "convex") {
		result.runtime = "none";
		result.database = "none";
		result.orm = "none";
		result.api = "none";
		result.auth = false;
		result.dbSetup = "none";
		result.examples = ["todo"];
	}

	if (result.backend === "none") {
		result.runtime = "none";
		result.database = "none";
		result.orm = "none";
		result.api = "none";
		result.auth = false;
		result.dbSetup = "none";
		result.examples = [];
	}

	return {
		projectName: projectName,
		projectDir: projectDir,
		relativePath: relativePath,
		frontend: result.frontend,
		backend: result.backend,
		runtime: result.runtime,
		database: result.database,
		orm: result.orm,
		auth: result.auth,
		addons: result.addons,
		examples: result.examples,
		git: result.git,
		packageManager: result.packageManager,
		install: result.install,
		dbSetup: result.dbSetup,
		api: result.api,
	};
}
