import type { IActionInit, IActorOutputInit } from '@comunica/bus-init';
import minimist from 'minimist';
import type { IActorInitSparqlArgs } from './ActorInitSparql-browser';
import { ActorInitSparql as ActorInitSparqlBrowser } from './ActorInitSparql-browser';
export { KEY_CONTEXT_INITIALBINDINGS, KEY_CONTEXT_QUERYFORMAT, KEY_CONTEXT_LENIENT, } from './ActorInitSparql-browser';
/**
 * A comunica SPARQL Init Actor.
 */
export declare class ActorInitSparql extends ActorInitSparqlBrowser {
    static readonly HELP_MESSAGE = "comunica-sparql evaluates SPARQL queries\n\n  Usage:\n    comunica-sparql http://fragments.dbpedia.org/2016-04/en [-q] 'SELECT * WHERE { ?s ?p ?o }'\n    comunica-sparql http://fragments.dbpedia.org/2016-04/en [-q] '{ hero { name friends { name } } }' -i graphql\n    comunica-sparql http://fragments.dbpedia.org/2016-04/en [-f] query.sparql'\n    comunica-sparql http://fragments.dbpedia.org/2016-04/en https://query.wikidata.org/sparql ...\n    comunica-sparql hypermedia@http://fragments.dbpedia.org/2016-04/en sparql@https://query.wikidata.org/sparql ...\n\n  Options:\n    -q            evaluate the given SPARQL query string\n    -f            evaluate the SPARQL query in the given file\n    -c            use the given JSON configuration file (e.g., config.json)\n    -t            the MIME type of the output (e.g., application/json)\n    -i            the query input format (e.g., graphql, defaults to sparql)\n    -b            base IRI for the query (e.g., http://example.org/)\n    -l            sets the log level (e.g., debug, info, warn, ... defaults to warn)\n    -d            sets a datetime for querying Memento-enabled archives\n    -p            delegates all HTTP traffic through the given proxy (e.g. http://myproxy.org/?uri=)\n    --lenient     if failing requests and parsing errors should be logged instead of causing a hard crash\n    --help        print this help message\n    --listformats prints the supported MIME types\n    --version     prints version information\n  ";
    constructor(args: IActorInitSparqlArgs);
    static getScriptOutput(command: string, fallback: string): Promise<string>;
    static isDevelopmentEnvironment(): boolean;
    /**
       * Converts an URL like 'hypermedia@http://user:passwd@example.com to an IDataSource
       * @param {string} sourceString An url with possibly a type and authorization.
       * @return {[id: string]: any} An IDataSource which represents the sourceString.
       */
    static getSourceObjectFromString(sourceString: string): Record<string, any>;
    static buildContext(args: minimist.ParsedArgs, queryContext: boolean, helpMessage: string, queryString?: string): Promise<any>;
    run(action: IActionInit): Promise<IActorOutputInit>;
}
