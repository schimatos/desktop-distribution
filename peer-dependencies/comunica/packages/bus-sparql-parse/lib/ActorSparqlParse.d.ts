import type { IAction, IActorArgs, IActorOutput, IActorTest } from '@comunica/core';
import { Actor } from '@comunica/core';
import type { Algebra } from 'sparqlalgebrajs';
/**
 * A comunica actor for sparql-parse events.
 *
 * Actor types:
 * * Input:  IActionSparqlParse:      A SPARQL query string.
 * * Test:   <none>
 * * Output: IActorSparqlParseOutput: A parsed query in SPARQL query algebra.
 *
 * @see IActionSparqlParse
 * @see IActorSparqlParseOutput
 */
export declare abstract class ActorSparqlParse extends Actor<IActionSparqlParse, IActorTest, IActorSparqlParseOutput> {
    constructor(args: IActorArgs<IActionSparqlParse, IActorTest, IActorSparqlParseOutput>);
}
export interface IActionSparqlParse extends IAction {
    /**
     * A query.
     */
    query: string;
    /**
     * The query format.
     */
    queryFormat?: string;
    /**
     * The query's default base IRI.
     */
    baseIRI?: string;
}
export interface IActorSparqlParseOutput extends IActorOutput {
    /**
     * A parsed query in SPARQL algebra.
     */
    operation: Algebra.Operation;
    /**
     * An optionally overridden base IRI.
     */
    baseIRI?: string;
}
