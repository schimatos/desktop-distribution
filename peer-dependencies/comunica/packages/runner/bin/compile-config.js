#!/usr/bin/env node
"use strict";
// Compiles a configuration to a module (single file) that exports the instantiated instance,
// where all dependencies are injected.
// This is a simplified version of components-compile-config that is shipped with Components.js.
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const componentsjs_1 = require("componentsjs");
const args = process.argv.slice(2);
if (args.length === 0) {
    process.stderr.write('Usage: comunica-compile-config path/to/config.json [urn:of:init:actor]\n');
    process.exit(1);
}
const mainModulePath = process.cwd();
const configResourceUri = 'urn:comunica:my';
const configPath = args[0];
const configStreamRaw = fs_1.createReadStream(configPath, { encoding: 'utf8' });
let exportVariableName = 'urn:comunica:sparqlinit';
if (args.length > 1) {
    exportVariableName = args[1];
}
// Hack our require path so that compilation in a monorepo dev environment always works properly
// Otherwise, Components.js will think that we are running inside the 'runner' package,
// and it will use its node_modules.
if (require.main) {
    require.main.paths = [];
    const pathParts = mainModulePath.split(path_1.sep);
    for (let i = pathParts.length; i > 0; i--) {
        require.main.paths.push(`${pathParts.slice(0, i).join(path_1.sep) + path_1.sep}node_modules`);
    }
}
componentsjs_1.compileConfig({ mainModulePath }, configPath, configStreamRaw, configResourceUri, exportVariableName)
    .then(out => process.stdout.write(`${out}\n`)).catch(error => {
    process.stderr.write(`${error.stack}\n`);
    process.exit(1);
});
//# sourceMappingURL=compile-config.js.map