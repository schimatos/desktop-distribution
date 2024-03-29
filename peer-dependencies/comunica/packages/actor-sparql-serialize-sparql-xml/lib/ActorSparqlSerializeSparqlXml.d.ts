import type { IActionSparqlSerialize, IActorSparqlSerializeFixedMediaTypesArgs, IActorSparqlSerializeOutput } from '@comunica/bus-sparql-serialize';
import { ActorSparqlSerializeFixedMediaTypes } from '@comunica/bus-sparql-serialize';
import type { ActionContext } from '@comunica/core';
import type * as RDF from 'rdf-js';
/**
 * A comunica sparql-results+xml Serialize Actor.
 */
export declare class ActorSparqlSerializeSparqlXml extends ActorSparqlSerializeFixedMediaTypes {
    constructor(args: IActorSparqlSerializeFixedMediaTypesArgs);
    /**
     * Converts an RDF term to its object-based XML representation.
     * @param {RDF.Term} value An RDF term.
     * @param {string} key A variable name, '?' must be included as a prefix.
     * @return {any} An object-based XML tag.
     */
    static bindingToXmlBindings(value: RDF.Term, key: string): any;
    testHandleChecked(action: IActionSparqlSerialize, context: ActionContext): Promise<boolean>;
    runHandle(action: IActionSparqlSerialize, mediaType: string, context: ActionContext): Promise<IActorSparqlSerializeOutput>;
}
