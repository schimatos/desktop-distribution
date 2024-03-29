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
exports.ActorInitSparql = exports.KEY_CONTEXT_LENIENT = exports.KEY_CONTEXT_QUERYFORMAT = exports.KEY_CONTEXT_INITIALBINDINGS = void 0;
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const OS = __importStar(require("os"));
const actor_http_memento_1 = require("@comunica/actor-http-memento");
const actor_http_proxy_1 = require("@comunica/actor-http-proxy");
const bus_http_1 = require("@comunica/bus-http");
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const core_1 = require("@comunica/core");
const logger_pretty_1 = require("@comunica/logger-pretty");
const minimist_1 = __importDefault(require("minimist"));
const ActorInitSparql_browser_1 = require("./ActorInitSparql-browser");
// eslint-disable-next-line no-duplicate-imports
var ActorInitSparql_browser_2 = require("./ActorInitSparql-browser");
Object.defineProperty(exports, "KEY_CONTEXT_INITIALBINDINGS", { enumerable: true, get: function () { return ActorInitSparql_browser_2.KEY_CONTEXT_INITIALBINDINGS; } });
Object.defineProperty(exports, "KEY_CONTEXT_QUERYFORMAT", { enumerable: true, get: function () { return ActorInitSparql_browser_2.KEY_CONTEXT_QUERYFORMAT; } });
Object.defineProperty(exports, "KEY_CONTEXT_LENIENT", { enumerable: true, get: function () { return ActorInitSparql_browser_2.KEY_CONTEXT_LENIENT; } });
/**
 * A comunica SPARQL Init Actor.
 */
class ActorInitSparql extends ActorInitSparql_browser_1.ActorInitSparql {
    constructor(args) {
        super(args);
    }
    static getScriptOutput(command, fallback) {
        return new Promise((resolve, reject) => {
            child_process_1.exec(command, (error, stdout, stderr) => {
                if (error) {
                    resolve(fallback);
                }
                resolve((stdout || stderr).trimEnd());
            });
        });
    }
    static isDevelopmentEnvironment() {
        return fs_1.existsSync(`${__dirname}/../test`);
    }
    /**
       * Converts an URL like 'hypermedia@http://user:passwd@example.com to an IDataSource
       * @param {string} sourceString An url with possibly a type and authorization.
       * @return {[id: string]: any} An IDataSource which represents the sourceString.
       */
    static getSourceObjectFromString(sourceString) {
        const source = {};
        const mediaTypeRegex = /^([^:]*)@/u;
        const mediaTypeMatches = mediaTypeRegex.exec(sourceString);
        if (mediaTypeMatches) {
            source.type = mediaTypeMatches[1];
            sourceString = sourceString.slice(source.type.length + 1);
        }
        const authRegex = /\/\/(.*:.*)@/u;
        const authMatches = authRegex.exec(sourceString);
        if (authMatches) {
            const credentials = authMatches[1];
            source.context = core_1.ActionContext({
                [bus_http_1.KEY_CONTEXT_AUTH]: decodeURIComponent(credentials),
            });
            sourceString = sourceString.slice(0, authMatches.index + 2) +
                sourceString.slice(authMatches.index + credentials.length + 3);
        }
        source.value = sourceString;
        return source;
    }
    static async buildContext(args, queryContext, helpMessage, queryString) {
        // Print version information
        if (args.v || args.version) {
            const comunicaVersion = require('../package.json').version;
            const dev = this.isDevelopmentEnvironment() ? '(dev)' : '';
            const nodeVersion = process.version;
            const npmVersion = await this.getScriptOutput('npm -v', '_NPM is unavailable_');
            const yarnVersion = await this.getScriptOutput('yarn -v', '_Yarn is unavailable_');
            const os = `${OS.platform()} (${OS.type()} ${OS.release()})`;
            const message = `| software            | version
| ------------------- | -------
| Comunica Init Actor | ${comunicaVersion} ${dev}
| node                | ${nodeVersion}
| npm                 | ${npmVersion}
| yarn                | ${yarnVersion}
| Operating System    | ${os}
`;
            return Promise.reject(new Error(message));
        }
        if (args.h || args.help || (queryContext &&
            (!args.listformats && (!queryString && (!(args.q || args.f) && args._.length < (args.c ? 1 : 2) ||
                args._.length < (args.c ? 0 : 1))))) ||
            (!queryContext && ((args.c && args._.length > 0) || (!args.c && args._.length === 0)))) {
            // Print command usage
            return Promise.reject(new Error(helpMessage));
        }
        // Define context
        let context = {};
        if (args.c) {
            context = JSON.parse(fs_1.existsSync(args.c) ? fs_1.readFileSync(args.c, 'utf8') : args.c);
            // For backwards compatibility http
        }
        else if (!queryContext && args._[0] && args._[0].startsWith('{')) {
            context = JSON.parse(args._[0]);
            args._.shift();
        }
        // Remove query so it does not become a source
        if (queryContext && !args.q && !args.f) {
            args._.pop();
        }
        // Add sources to context
        if (args._.length > 0) {
            context.sources = context.sources || [];
            args._.forEach((sourceValue) => {
                const source = this.getSourceObjectFromString(sourceValue);
                context.sources.push(source);
            });
        }
        // Set the logger
        if (!context.log || args.l) {
            context.log = new logger_pretty_1.LoggerPretty({ level: args.l || 'warn' });
        }
        // Define the base IRI
        if (args.b) {
            context[bus_query_operation_1.KEY_CONTEXT_BASEIRI] = args.b;
        }
        // Define lenient-mode
        if (args.lenient) {
            context[ActorInitSparql_browser_1.KEY_CONTEXT_LENIENT] = true;
        }
        return context;
    }
    async run(action) {
        const args = minimist_1.default(action.argv);
        // Print supported MIME types
        if (args.listformats) {
            const mediaTypes = await this.getResultMediaTypes();
            return { stdout: require('streamify-string')(`${Object.keys(mediaTypes).join('\n')}\n`) };
        }
        // Define query
        let query;
        if (args.q) {
            if (typeof args.q !== 'string') {
                throw new Error('The query option must be a string');
            }
            query = args.q;
        }
        else if (args.f) {
            query = fs_1.readFileSync(args.f, { encoding: 'utf8' });
        }
        else {
            if (args._.length > 0) {
                query = args._[args._.length - 1];
            }
            if (!query) {
                // If we get here, this.queryString will always be defined
                query = this.queryString;
            }
        }
        let context;
        try {
            context = await ActorInitSparql.buildContext(args, true, ActorInitSparql.HELP_MESSAGE, this.queryString);
        }
        catch (error) {
            return { stderr: require('streamify-string')(error.message) };
        }
        // Define the query format
        context[ActorInitSparql_browser_1.KEY_CONTEXT_QUERYFORMAT] = this.defaultQueryInputFormat;
        if (args.i) {
            context[ActorInitSparql_browser_1.KEY_CONTEXT_QUERYFORMAT] = args.i;
        }
        // Define the datetime
        if (args.d) {
            context[actor_http_memento_1.KEY_CONTEXT_DATETIME] = new Date(args.d);
        }
        // Set the proxy
        if (args.p) {
            context[actor_http_proxy_1.KEY_CONTEXT_HTTPPROXYHANDLER] = new actor_http_proxy_1.ProxyHandlerStatic(args.p);
        }
        // Evaluate query
        const queryResult = await this.query(query, context);
        // Serialize output according to media type
        const stdout = (await this.resultToString(queryResult, args.t, queryResult.context)).data;
        return { stdout };
    }
}
exports.ActorInitSparql = ActorInitSparql;
ActorInitSparql.HELP_MESSAGE = `comunica-sparql evaluates SPARQL queries

  Usage:
    comunica-sparql http://fragments.dbpedia.org/2016-04/en [-q] 'SELECT * WHERE { ?s ?p ?o }'
    comunica-sparql http://fragments.dbpedia.org/2016-04/en [-q] '{ hero { name friends { name } } }' -i graphql
    comunica-sparql http://fragments.dbpedia.org/2016-04/en [-f] query.sparql'
    comunica-sparql http://fragments.dbpedia.org/2016-04/en https://query.wikidata.org/sparql ...
    comunica-sparql hypermedia@http://fragments.dbpedia.org/2016-04/en sparql@https://query.wikidata.org/sparql ...

  Options:
    -q            evaluate the given SPARQL query string
    -f            evaluate the SPARQL query in the given file
    -c            use the given JSON configuration file (e.g., config.json)
    -t            the MIME type of the output (e.g., application/json)
    -i            the query input format (e.g., graphql, defaults to sparql)
    -b            base IRI for the query (e.g., http://example.org/)
    -l            sets the log level (e.g., debug, info, warn, ... defaults to warn)
    -d            sets a datetime for querying Memento-enabled archives
    -p            delegates all HTTP traffic through the given proxy (e.g. http://myproxy.org/?uri=)
    --lenient     if failing requests and parsing errors should be logged instead of causing a hard crash
    --help        print this help message
    --listformats prints the supported MIME types
    --version     prints version information
  `;
//# sourceMappingURL=ActorInitSparql.js.map