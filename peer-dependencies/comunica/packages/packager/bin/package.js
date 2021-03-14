#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-sync */
const fs = __importStar(require("fs"));
const Path = __importStar(require("path"));
const componentsjs_1 = require("componentsjs");
const minimist_1 = __importDefault(require("minimist"));
const args = minimist_1.default(process.argv.slice(2));
if (args._.length !== 1 || !args.o || args.h || args.help) {
    process.stderr.write(`comunica-package packages a Comunica config file into a new NPM package

Usage:
  comunica-package http://example.org/myInstance -c config.jsonld -o my-engine
  cat config.jsonld | compile-config http://example.org/myInstance -o my-engine

Options:
  -o      [Required] The package name to generate
  -c      Path to a Comunica config file, if not provided, the config must be provided via stdin
  -p      The main module path, if not provided, this defaults to the directory of the packager
  -g      If global modules should be included as well next to local modules.
  -e      The instance by config URI that will be exported, by default this is the provided instance URI.
  --help  print this help message
`);
    process.exit(1);
}
const configResourceUri = args._[0];
// Check if the package name is valid
const packageName = args.o;
if (!/^[\dA-Za-z-]*$/u.test(packageName)) {
    throw new Error(`Invalid package name: ${packageName}`);
}
// Make the target package directory if it does not exist yet.
let packageJson = {};
if (!fs.existsSync(packageName)) {
    fs.mkdirSync(packageName);
}
else if (!fs.statSync(packageName).isDirectory()) {
    throw new Error('The target package already exists, but it is not a directory!');
}
else if (fs.existsSync(`${packageName}/package.json`)) {
    // Reuse contents if a package.json file already exists
    packageJson = require(`${process.cwd()}/${packageName}/package.json`);
}
let configStreamRaw;
let configPath;
if (args.c) {
    configStreamRaw = fs.createReadStream(args.c, { encoding: 'utf8' });
    configPath = args.c;
}
else {
    configStreamRaw = process.stdin;
    configPath = '.';
}
let mainModulePath;
if (args.p) {
    mainModulePath = Path.resolve(process.cwd(), args.p);
}
else {
    mainModulePath = `${__dirname}/../`;
}
let exportVariableName;
if (args.e) {
    exportVariableName = args.e;
}
const scanGlobal = Boolean(args.g);
const dependencyRegex = /require\('([^']*)'\)/ug;
const referencePackageJson = require(`${__dirname}/../package.json`);
componentsjs_1.compileConfig({ mainModulePath, scanGlobal }, configPath, configStreamRaw, configResourceUri, exportVariableName)
    .then((document) => {
    // Find dependency package names
    const dependencies = {};
    let match;
    // eslint-disable-next-line no-cond-assign
    while (match = dependencyRegex.exec(document)) {
        const dependencyName = match[1];
        dependencies[dependencyName] = referencePackageJson.dependencies[dependencyName];
    }
    // Build our package.json file
    packageJson.name = packageName;
    packageJson.main = 'index.js';
    packageJson.dependencies = dependencies;
    // Write output files
    fs.writeFileSync(`${packageName}/index.js`, document);
    fs.writeFileSync(`${packageName}/package.json`, JSON.stringify(packageJson, null, '  '));
}).catch(error => process.stderr.write(`${error}\n`));
//# sourceMappingURL=package.js.map