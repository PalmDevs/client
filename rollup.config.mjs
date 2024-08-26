import { execSync } from 'child_process';

// Plugins
import { typescriptPaths as paths } from 'rollup-plugin-typescript-paths';
import { nodeResolve as node } from '@rollup/plugin-node-resolve';
import { swc, minify } from 'rollup-plugin-swc3';
import hermes from '@unbound-mod/rollup-plugin';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';

const revision = (() => {
	try {
		return execSync('git rev-parse --short HEAD').toString().trim();
	} catch {
		return 'N/A';
	}
})();


/** @type {import('rollup').RollupOptions} */
const config = {
	input: 'src/index.ts',
	output: [
		{
			file: 'dist/unbound.js',
			format: 'esm',
			inlineDynamicImports: true,
			strict: false
		}
	],

	plugins: [
		paths({ preserveExtensions: true, nonRelative: process.platform === 'darwin' ? false : true }),
		node(),
		json(),
		replace({ preventAssignment: true, __VERSION__: revision }),
		swc({ tsconfig: false }),
		minify({ compress: true, mangle: true }),
		{
			name: 'iife',
			async generateBundle(options, bundle) {
				const out = options.file?.split('/');
				if (!out) return this.warn('(IIFE) - Output file not found.');

				const file = out.pop();

				const output = bundle[file];
				if (!output) return this.warn('(IIFE) - Output file not found.');

				output.code = `(() => {
					try {
						${output.code}
					} catch(error) {
						alert('Unbound failed to initialize: ' + error.stack);
					}
			 	})();`;
			}
		},
		hermes(),
	],

	onwarn(warning, warn) {
		if (warning.code === 'EVAL') return;
		warn(warning);
	}
};

export default config;