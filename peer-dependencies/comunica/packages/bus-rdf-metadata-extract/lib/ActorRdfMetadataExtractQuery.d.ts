import type { ActorInitSparql } from '@comunica/actor-init-sparql';
import type { IActorArgs, IActorTest } from '@comunica/core';
import type * as RDF from 'rdf-js';
import type { IActionRdfMetadataExtract, IActorRdfMetadataExtractOutput } from './ActorRdfMetadataExtract';
import { ActorRdfMetadataExtract } from './ActorRdfMetadataExtract';
/**
 * An {@link ActorRdfMetadataExtract} that extracts metadata based on a GraphQL-LD query.
 *
 * It exposes the {@link #queryData} method using which a query can be applied over the metadata stream.
 * For efficiency reasons, the query (and JSON-LD context) must be passed via the actor constructor
 * so that these can be pre-compiled.
 *
 * @see ActorRdfMetadataExtract
 */
export declare abstract class ActorRdfMetadataExtractQuery extends ActorRdfMetadataExtract {
    private readonly queryEngine;
    private readonly graphqlClient;
    private readonly sparqlOperation;
    constructor(context: any, query: string, args: IActorArgs<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput>);
    /**
     * Execute the configured query on the given metadata stream.
     * @param {RDF.Stream} dataStream A quad stream to query on.
     * @return The GraphQL query results.
     */
    queryData(dataStream: RDF.Stream, initialBindings?: any): Promise<any>;
}
export interface IActorRdfMetadataExtractQueryArgs extends IActorArgs<IActionRdfMetadataExtract, IActorTest, IActorRdfMetadataExtractOutput> {
    queryEngine: ActorInitSparql;
}
