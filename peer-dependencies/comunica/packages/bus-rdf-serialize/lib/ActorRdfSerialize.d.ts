/// <reference types="node" />
import type { IActionAbstractMediaTyped, IActorArgsMediaTyped, IActorOutputAbstractMediaTyped, IActorTestAbstractMediaTyped } from '@comunica/actor-abstract-mediatyped';
import { ActorAbstractMediaTyped } from '@comunica/actor-abstract-mediatyped';
import type { IAction, IActorOutput, IActorTest } from '@comunica/core';
import type * as RDF from 'rdf-js';
/**
 * A comunica actor for RDF parse events.
 *
 * Actor types:
 * * Input:  IActionRdfSerialize:      A serialize input or a media type input.
 * * Test:   <none>
 * * Output: IActorRdfSerializeOutput: The serialized quads.
 *
 * @see IActionRdfSerialize
 * @see IActorRdfSerializeOutput
 */
export declare abstract class ActorRdfSerialize extends ActorAbstractMediaTyped<IActionRdfSerialize, IActorTest, IActorRdfSerializeOutput> {
    constructor(args: IActorArgsMediaTyped<IActionRdfSerialize, IActorTest, IActorRdfSerializeOutput>);
}
export declare type IActionRootRdfSerialize = IActionAbstractMediaTyped<IActionRdfSerialize>;
export declare type IActorTestRootRdfSerialize = IActorTestAbstractMediaTyped<IActorTest>;
export declare type IActorOutputRootRdfSerialize = IActorOutputAbstractMediaTyped<IActorRdfSerializeOutput>;
export interface IActionRdfSerialize extends IAction {
    /**
     * The stream of quads.
     */
    quadStream: RDF.Stream;
}
export interface IActorRdfSerializeOutput extends IActorOutput {
    /**
     * A readable string stream in a certain RDF serialization that was serialized.
     */
    data: NodeJS.ReadableStream;
    /**
     * An optional field indicating if the given output stream uses a triple-based serialization,
     * in which everything is serialized in the default graph.
     * If falsy, the quad stream contain actual quads, otherwise they should be interpreted as triples.
     */
    triples?: boolean;
}
