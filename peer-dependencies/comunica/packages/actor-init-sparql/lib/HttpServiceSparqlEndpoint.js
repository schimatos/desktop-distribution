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
exports.HttpServiceSparqlEndpoint = void 0;
const http = __importStar(require("http"));
const querystring = __importStar(require("querystring"));
const url = __importStar(require("url"));
const core_1 = require("@comunica/core");
const asynciterator_1 = require("asynciterator");
const minimist_1 = __importDefault(require("minimist"));
const __1 = require("..");
const ActorInitSparql_1 = require("./ActorInitSparql");
const quad = require('rdf-quad');
/**
 * An HTTP service that exposes a Comunica engine as a SPARQL endpoint.
 */
class HttpServiceSparqlEndpoint {
    constructor(args) {
        var _a, _b;
        args = args !== null && args !== void 0 ? args : {};
        this.context = args.context || {};
        this.timeout = (_a = args.timeout) !== null && _a !== void 0 ? _a : 60000;
        this.port = (_b = args.port) !== null && _b !== void 0 ? _b : 3000;
        this.invalidateCacheBeforeQuery = Boolean(args.invalidateCacheBeforeQuery);
        this.engine = __1.newEngineDynamic(args);
    }
    /**
     * Starts the server
     * @param {string[]} argv The commandline arguments that the script was called with
     * @param {module:stream.internal.Writable} stdout The output stream to log to.
     * @param {module:stream.internal.Writable} stderr The error stream to log errors to.
     * @param {string} moduleRootPath The path to the invoking module.
     * @param {NodeJS.ProcessEnv} env The process env to get constants from.
     * @param {string} defaultConfigPath The path to get the config from if none is defined in the environment.
     * @param {(code: number) => void} exit The callback to invoke to stop the script.
     * @return {Promise<void>} A promise that resolves when the server has been started.
     */
    static async runArgsInProcess(argv, stdout, stderr, moduleRootPath, env, defaultConfigPath, exit) {
        const args = minimist_1.default(argv);
        const options = await HttpServiceSparqlEndpoint
            .generateConstructorArguments(args, moduleRootPath, env, defaultConfigPath, stderr, exit);
        return new Promise(resolve => {
            new HttpServiceSparqlEndpoint(options).run(stdout, stderr)
                .then(resolve)
                .catch(error => {
                stderr.write(error);
                exit(1);
                resolve();
            });
        });
    }
    /**
     * Takes parsed commandline arguments and turns them into an object used in the HttpServiceSparqlEndpoint constructor
     * @param {args: minimist.ParsedArgs} args The commandline arguments that the script was called with
     * @param {string} moduleRootPath The path to the invoking module.
     * @param {NodeJS.ProcessEnv} env The process env to get constants from.
     * @param {string} defaultConfigPath The path to get the config from if none is defined in the environment.
     */
    static async generateConstructorArguments(args, moduleRootPath, env, defaultConfigPath, stderr, exit) {
        // Allow both files as direct JSON objects for context
        let context;
        try {
            context = await ActorInitSparql_1.ActorInitSparql.buildContext(args, false, HttpServiceSparqlEndpoint.HELP_MESSAGE);
        }
        catch (error) {
            stderr.write(error.message);
            exit(1);
        }
        const invalidateCacheBeforeQuery = args.i;
        const port = Number.parseInt(args.p, 10) || 3000;
        const timeout = (Number.parseInt(args.t, 10) || 60) * 1000;
        const configResourceUrl = env.COMUNICA_CONFIG ? env.COMUNICA_CONFIG : defaultConfigPath;
        return {
            configResourceUrl,
            context,
            invalidateCacheBeforeQuery,
            mainModulePath: moduleRootPath,
            port,
            timeout,
        };
    }
    /**
     * Start the HTTP service.
     * @param {module:stream.internal.Writable} stdout The output stream to log to.
     * @param {module:stream.internal.Writable} stderr The error stream to log errors to.
     */
    async run(stdout, stderr) {
        const engine = await this.engine;
        // Determine the allowed media types for requests
        const mediaTypes = await engine.getResultMediaTypes();
        const variants = [];
        for (const type of Object.keys(mediaTypes)) {
            variants.push({ type, quality: mediaTypes[type] });
        }
        // Start the server
        const server = http.createServer(this.handleRequest.bind(this, engine, variants, stdout, stderr));
        server.listen(this.port);
        // Unreliable mechanism, set too high on purpose
        server.setTimeout(2 * this.timeout);
        stderr.write(`Server running on http://localhost:${this.port}/sparql\n`);
    }
    /**
     * Handles an HTTP request.
     * @param {ActorInitSparql} engine A SPARQL engine.
     * @param {{type: string; quality: number}[]} variants Allowed variants.
     * @param {module:stream.internal.Writable} stdout Output stream.
     * @param {module:stream.internal.Writable} stderr Error output stream.
     * @param {module:http.IncomingMessage} request Request object.
     * @param {module:http.ServerResponse} response Response object.
     */
    async handleRequest(engine, variants, stdout, stderr, request, response) {
        var _a;
        const negotiated = require('negotiate').choose(variants, request)
            .sort((first, second) => second.qts - first.qts);
        const variant = request.headers.accept ? negotiated[0] : null;
        // Require qts strictly larger than 2, as 1 and 2 respectively allow * and */* matching.
        // For qts 0, 1, and 2, we fallback to our built-in media type defaults, for which we pass null.
        const mediaType = variant && variant.qts > 2 ? variant.type : null;
        // Verify the path
        const requestUrl = url.parse((_a = request.url) !== null && _a !== void 0 ? _a : '', true);
        if (requestUrl.pathname === '/' || request.url === '/') {
            stdout.write('[301] Permanently moved. Redirected to /sparql.');
            response.writeHead(301, { 'content-type': HttpServiceSparqlEndpoint.MIME_JSON,
                'Access-Control-Allow-Origin': '*',
                Location: `http://localhost:${this.port}/sparql${requestUrl.search || ''}` });
            response.end(JSON.stringify({ message: 'Queries are accepted on /sparql. Redirected.' }));
            return;
        }
        if (requestUrl.pathname !== '/sparql') {
            stdout.write('[404] Resource not found. Queries are accepted on /sparql.\n');
            response.writeHead(404, { 'content-type': HttpServiceSparqlEndpoint.MIME_JSON,
                'Access-Control-Allow-Origin': '*' });
            response.end(JSON.stringify({ message: 'Resource not found. Queries are accepted on /sparql.' }));
            return;
        }
        if (this.invalidateCacheBeforeQuery) {
            // Invalidate cache
            await engine.invalidateHttpCache();
        }
        // Parse the query, depending on the HTTP method
        let sparql;
        switch (request.method) {
            case 'POST':
                sparql = await this.parseBody(request);
                await this.writeQueryResult(engine, stdout, stderr, request, response, sparql, mediaType, false);
                break;
            case 'HEAD':
            case 'GET':
                sparql = requestUrl.query.query || '';
                await this
                    .writeQueryResult(engine, stdout, stderr, request, response, sparql, mediaType, request.method === 'HEAD');
                break;
            default:
                stdout.write(`[405] ${request.method} to ${request.url}\n`);
                response.writeHead(405, { 'content-type': HttpServiceSparqlEndpoint.MIME_JSON, 'Access-Control-Allow-Origin': '*' });
                response.end(JSON.stringify({ message: 'Incorrect HTTP method' }));
        }
    }
    /**
     * Writes the result of the given SPARQL query.
     * @param {ActorInitSparql} engine A SPARQL engine.
     * @param {module:stream.internal.Writable} stdout Output stream.
     * @param {module:stream.internal.Writable} stderr Error output stream.
     * @param {module:http.IncomingMessage} request Request object.
     * @param {module:http.ServerResponse} response Response object.
     * @param {string} sparql The SPARQL query string.
     * @param {string} mediaType The requested response media type.
     * @param {boolean} headOnly If only the header should be written.
     */
    async writeQueryResult(engine, stdout, stderr, request, response, sparql, mediaType, headOnly) {
        if (!sparql) {
            return this.writeServiceDescription(engine, stdout, stderr, request, response, mediaType, headOnly);
        }
        let result;
        try {
            result = await engine.query(sparql, this.context);
        }
        catch (error) {
            stdout.write('[400] Bad request\n');
            response.writeHead(400, { 'content-type': HttpServiceSparqlEndpoint.MIME_PLAIN, 'Access-Control-Allow-Origin': '*' });
            response.end(error.message);
            return;
        }
        // Default to SPARQL JSON for bindings and boolean
        if (!mediaType) {
            switch (result.type) {
                case 'quads':
                    mediaType = 'application/trig';
                    break;
                default:
                    mediaType = 'application/sparql-results+json';
                    break;
            }
        }
        stdout.write(`[200] ${request.method} to ${request.url}\n`);
        stdout.write(`      Requested media type: ${mediaType}\n`);
        stdout.write(`      Received query: ${sparql}\n`);
        response.writeHead(200, { 'content-type': mediaType, 'Access-Control-Allow-Origin': '*' });
        if (headOnly) {
            response.end();
            return;
        }
        let eventEmitter;
        try {
            const { data } = await engine.resultToString(result, mediaType);
            data.on('error', (error) => {
                stdout.write(`[500] Server error in results: ${error.message} \n`);
                response.end('An internal server error occurred.\n');
            });
            data.pipe(response);
            eventEmitter = data;
        }
        catch (_a) {
            stdout.write('[400] Bad request, invalid media type\n');
            response.writeHead(400, { 'content-type': HttpServiceSparqlEndpoint.MIME_PLAIN, 'Access-Control-Allow-Origin': '*' });
            response.end('The response for the given query could not be serialized for the requested media type\n');
        }
        this.stopResponse(response, eventEmitter);
    }
    async writeServiceDescription(engine, stdout, stderr, request, response, mediaType, headOnly) {
        stdout.write(`[200] ${request.method} to ${request.url}\n`);
        stdout.write(`      Requested media type: ${mediaType}\n`);
        stdout.write('      Received query for service description.\n');
        response.writeHead(200, { 'content-type': mediaType, 'Access-Control-Allow-Origin': '*' });
        if (headOnly) {
            response.end();
            return;
        }
        // eslint-disable-next-line id-length
        const s = request.url;
        const sd = 'http://www.w3.org/ns/sparql-service-description#';
        const quads = [
            // Basic metadata
            quad(s, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', `${sd}Service`),
            quad(s, `${sd}endpoint`, '/sparql'),
            quad(s, `${sd}url`, '/sparql'),
            // Features
            quad(s, `${sd}feature`, `${sd}BasicFederatedQuery`),
            quad(s, `${sd}supportedLanguage`, `${sd}SPARQL10Query`),
            quad(s, `${sd}supportedLanguage`, `${sd}SPARQL11Query`),
        ];
        let eventEmitter;
        try {
            // Append result formats
            const formats = await engine.getResultMediaTypeFormats(core_1.ActionContext(this.context));
            for (const format in formats) {
                quads.push(quad(s, `${sd}resultFormat`, formats[format]));
            }
            // Flush results
            const { data } = await engine.resultToString({
                type: 'quads',
                quadStream: new asynciterator_1.ArrayIterator(quads),
            }, mediaType);
            data.on('error', (error) => {
                stdout.write(`[500] Server error in results: ${error.message} \n`);
                response.end('An internal server error occurred.\n');
            });
            data.pipe(response);
            eventEmitter = data;
        }
        catch (_a) {
            stdout.write('[400] Bad request, invalid media type\n');
            response.writeHead(400, { 'content-type': HttpServiceSparqlEndpoint.MIME_PLAIN, 'Access-Control-Allow-Origin': '*' });
            response.end('The response for the given query could not be serialized for the requested media type\n');
            return;
        }
        this.stopResponse(response, eventEmitter);
    }
    /**
     * Stop after timeout or if the connection is terminated
     * @param {module:http.ServerResponse} response Response object.
     * @param {NodeJS.ReadableStream} eventEmitter Query result stream.
     */
    stopResponse(response, eventEmitter) {
        // Note: socket or response timeouts seemed unreliable, hence the explicit timeout
        const killTimeout = setTimeout(killClient, this.timeout);
        response.on('close', killClient);
        function killClient() {
            if (eventEmitter) {
                // Remove all listeners so we are sure no more write calls are made
                eventEmitter.removeAllListeners();
                eventEmitter.emit('end');
            }
            try {
                response.end();
            }
            catch (_a) {
                // Do nothing
            }
            clearTimeout(killTimeout);
        }
    }
    /**
     * Parses the body of a SPARQL POST request
     * @param {module:http.IncomingMessage} request Request object.
     * @return {Promise<string>} A promise resolving to a query string.
     */
    parseBody(request) {
        return new Promise((resolve, reject) => {
            let body = '';
            request.setEncoding('utf8');
            request.on('error', reject);
            request.on('data', chunk => {
                body += chunk;
            });
            request.on('end', () => {
                const contentType = request.headers['content-type'];
                if (contentType && contentType.includes('application/sparql-query')) {
                    return resolve(body);
                }
                if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
                    return resolve(querystring.parse(body).query || '');
                }
                return resolve(body);
            });
        });
    }
}
exports.HttpServiceSparqlEndpoint = HttpServiceSparqlEndpoint;
HttpServiceSparqlEndpoint.MIME_PLAIN = 'text/plain';
HttpServiceSparqlEndpoint.MIME_JSON = 'application/json';
HttpServiceSparqlEndpoint.HELP_MESSAGE = `comunica-sparql-http exposes a Comunica engine as SPARQL endpoint

Usage:
  comunica-sparql-http http://fragments.dbpedia.org/2015/en
  comunica-sparql-http http://fragments.dbpedia.org/2015/en hypermedia@http://fragments.dbpedia.org/2016-04/en
  comunica-sparql-http -c context.json 
  comunica-sparql-http -c "{ \\"sources\\": [{ \\"type\\": \\"hypermedia\\", \\"value\\" : \\"http://fragments.dbpedia.org/2015/en\\" }]}" 

Options:
  -c            Context should be a JSON object or the path to such a JSON file.
  -p            The HTTP port to run on (default: 3000)
  -t            The query execution timeout in seconds (default: 60)
  -b            base IRI for the query (e.g., http://example.org/)
  -l            Sets the log level (e.g., debug, info, warn, ... defaults to warn)
  -i            A flag that enables cache invalidation before each query execution.
  --lenient     if failing requests and parsing errors should be logged instead of causing a hard crash
  --help        print this help message
  --version     prints version information
`;
//# sourceMappingURL=HttpServiceSparqlEndpoint.js.map