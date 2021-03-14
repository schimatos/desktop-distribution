import type { IActionSparqlSerialize, IActorSparqlSerializeFixedMediaTypesArgs, IActorSparqlSerializeOutput } from '@comunica/bus-sparql-serialize';
import { ActorSparqlSerializeFixedMediaTypes } from '@comunica/bus-sparql-serialize';
import type { ActionContext } from '@comunica/core';
import type * as RDF from 'rdf-js';
/**
 * A comunica SPARQL TSV SPARQL Serialize Actor.
 */
export declare class ActorSparqlSerializeSparqlTsv extends ActorSparqlSerializeFixedMediaTypes {
    constructor(args: IActorSparqlSerializeFixedMediaTypesArgs);
    /**
     * Converts an RDF term to its TSV representation.
     * @param {RDF.Term} value An RDF term.
     * @return {string} A string representation of the given value.
     */
    static bindingToTsvBindings(value?: RDF.Term): string;
    testHandleChecked(action: IActionSparqlSerialize, context: ActionContext): Promise<boolean>;
    runHandle(action: IActionSparqlSerialize, mediaType?: string, context?: ActionContext): Promise<IActorSparqlSerializeOutput>;
}
