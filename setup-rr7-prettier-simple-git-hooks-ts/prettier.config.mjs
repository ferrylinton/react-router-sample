// prettier.config.js, .prettierrc.js, prettier.config.mjs, or .prettierrc.mjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	trailingComma: 'es5',
	tabWidth: 4,
	useTabs: true,
	printWidth: 100,
	semi: true,
	singleQuote: true,
	quoteProps: 'consistent',
	arrowParens: 'avoid',
};

export default config;
