import type { IActionSparqlParse, IActorSparqlParseOutput } from '@comunica/bus-sparql-parse';
import { ActorSparqlParse } from '@comunica/bus-sparql-parse';
import type { IActorArgs, IActorTest } from '@comunica/core';
/**
 * A comunica GraphQL SPARQL Parse Actor.
 */
export declare class ActorSparqlParseGraphql extends ActorSparqlParse {
    private readonly graphqlToSparql;
    constructor(args: IActorArgs<IActionSparqlParse, IActorTest, IActorSparqlParseOutput>);
    test(action: IActionSparqlParse): Promise<IActorTest>;
    run(action: IActionSparqlParse): Promise<IActorSparqlParseOutput>;
}
