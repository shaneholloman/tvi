import gradient from "gradient-string";

export const TITLE_TEXT = `
 TVI TypeScript Initializer
 A CLI tool to quickly scaffold TypeScript projects with popular frameworks and libraries.
 `;

const catppuccinTheme = {
	pink: "#F5C2E7",
	mauve: "#CBA6F7",
	red: "#F38BA8",
	maroon: "#E78284",
	peach: "#FAB387",
	yellow: "#F9E2AF",
	green: "#A6E3A1",
	teal: "#94E2D5",
	sky: "#89DCEB",
	sapphire: "#74C7EC",
	lavender: "#B4BEFE",
};

export const renderTitle = () => {
	const terminalWidth = process.stdout.columns || 80;
	const titleLines = TITLE_TEXT.split("\n");
	const titleWidth = Math.max(...titleLines.map((line) => line.length));

	if (terminalWidth < titleWidth) {
		const simplifiedTitle = `
    ╔══════════════════╗
    ║  TVI             ║
    ╚══════════════════╝
    `;
		console.log(
			gradient(Object.values(catppuccinTheme)).multiline(simplifiedTitle),
		);
	} else {
		console.log(gradient(Object.values(catppuccinTheme)).multiline(TITLE_TEXT));
	}
};
