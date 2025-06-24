import path from "node:path";
import { cancel, intro, log, outro } from "@clack/prompts";
import fs from "fs-extra";
import pc from "picocolors";
import { DEFAULT_CONFIG } from "../../constants";
import { getAddonsToAdd } from "../../prompts/addons";
import { gatherConfig } from "../../prompts/config-prompts";
import { getProjectName } from "../../prompts/project-name";
import type { AddInput, CreateInput, ProjectConfig } from "../../types";
import { trackProjectCreation } from "../../utils/analytics";
import { displayConfig } from "../../utils/display-config";
import { generateReproducibleCommand } from "../../utils/generate-reproducible-command";
import {
	handleDirectoryConflict,
	setupProjectDirectory,
} from "../../utils/project-directory";
import { renderTitle } from "../../utils/render-title";
import { getProvidedFlags, processAndValidateFlags } from "../../validation";
import { addAddonsToProject } from "./add-addons";
import { createProject } from "./create-project";
import { detectProjectConfig } from "./detect-project-config";

export async function createProjectHandler(
	input: CreateInput & { projectName?: string },
) {
	const startTime = Date.now();

	try {
		renderTitle();
		intro(pc.magenta("Creating a new tvi project"));

		let currentPathInput: string;
		if (input.yes && input.projectName) {
			currentPathInput = input.projectName;
		} else if (input.yes) {
			let defaultName = DEFAULT_CONFIG.relativePath;
			let counter = 1;
			while (
				fs.pathExistsSync(path.resolve(process.cwd(), defaultName)) &&
				fs.readdirSync(path.resolve(process.cwd(), defaultName)).length > 0
			) {
				defaultName = `${DEFAULT_CONFIG.projectName}-${counter}`;
				counter++;
			}
			currentPathInput = defaultName;
		} else {
			currentPathInput = await getProjectName(input.projectName);
		}

		const { finalPathInput, shouldClearDirectory } =
			await handleDirectoryConflict(currentPathInput);

		const { finalResolvedPath, finalBaseName } = await setupProjectDirectory(
			finalPathInput,
			shouldClearDirectory,
		);

		const cliInput = {
			...input,
			projectDirectory: input.projectName,
		};

		const providedFlags = getProvidedFlags(cliInput);
		const flagConfig = processAndValidateFlags(
			cliInput,
			providedFlags,
			finalBaseName,
		);
		const { projectName: _projectNameFromFlags, ...otherFlags } = flagConfig;

		if (!input.yes && Object.keys(otherFlags).length > 0) {
			log.info(pc.yellow("Using these pre-selected options:"));
			log.message(displayConfig(otherFlags));
			log.message("");
		}

		let config: ProjectConfig;
		if (input.yes) {
			config = {
				...DEFAULT_CONFIG,
				...flagConfig,
				projectName: finalBaseName,
				projectDir: finalResolvedPath,
				relativePath: finalPathInput,
			};

			if (config.backend === "convex") {
				log.info(
					"Due to '--backend convex' flag, the following options have been automatically set: auth=false, database=none, orm=none, api=none, runtime=none, dbSetup=none, examples=todo",
				);
			} else if (config.backend === "none") {
				log.info(
					"Due to '--backend none', the following options have been automatically set: --auth=false, --database=none, --orm=none, --api=none, --runtime=none, --db-setup=none, --examples=none",
				);
			}

			log.info(
				pc.yellow("Using default/flag options (config prompts skipped):"),
			);
			log.message(displayConfig(config));
			log.message("");
		} else {
			config = await gatherConfig(
				flagConfig,
				finalBaseName,
				finalResolvedPath,
				finalPathInput,
			);
		}

		await createProject(config);

		const reproducibleCommand = generateReproducibleCommand(config);
		log.success(
			pc.blue(
				`You can reproduce this setup with the following command:\n${reproducibleCommand}`,
			),
		);

		await trackProjectCreation(config);

		const elapsedTimeInSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
		outro(
			pc.magenta(
				`Project created successfully in ${pc.bold(
					elapsedTimeInSeconds,
				)} seconds!`,
			),
		);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}

export async function addAddonsHandler(input: AddInput): Promise<void> {
	try {
		if (!input.addons || input.addons.length === 0) {
			const projectDir = input.projectDir || process.cwd();
			const detectedConfig = await detectProjectConfig(projectDir);

			if (!detectedConfig) {
				cancel(
					pc.red(
						"Could not detect project configuration. Please ensure this is a valid tvi project.",
					),
				);
				process.exit(1);
			}

			const addonsPrompt = await getAddonsToAdd(
				detectedConfig.frontend || [],
				detectedConfig.addons || [],
			);

			if (addonsPrompt.length === 0) {
				outro(
					pc.yellow(
						"No addons to add or all compatible addons are already present.",
					),
				);
				return;
			}

			input.addons = addonsPrompt;
		}

		if (!input.addons || input.addons.length === 0) {
			outro(pc.yellow("No addons specified to add."));
			return;
		}

		await addAddonsToProject({
			...input,
			addons: input.addons,
		});
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
}
