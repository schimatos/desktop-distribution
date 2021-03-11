#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actor_init_sparql_1 = require("@comunica/actor-init-sparql");
const defaultConfigPath = `${__dirname}/../config/config-default.json`;
actor_init_sparql_1.HttpServiceSparqlEndpoint.runArgsInProcess(process.argv.slice(2), process.stdout, process.stderr, `${__dirname}/../`, process.env, defaultConfigPath, () => process.exit(1))
    .catch(error => process.stderr.write(`${error.message}/n`));
//# sourceMappingURL=http.js.map