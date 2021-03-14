/// <reference types="node" />
import type { IActionAbstractMediaTyped, IActionAbstractMediaTypedHandle, IActionAbstractMediaTypedMediaTypeFormats, IActionAbstractMediaTypedMediaTypes, IActorArgsMediaTyped, IActorOutputAbstractMediaTyped, IActorOutputAbstractMediaTypedHandle, IActorOutputAbstractMediaTypedMediaTypeFormats, IActorOutputAbstractMediaTypedMediaTypes, IActorTestAbstractMediaTyped, IActorTestAbstractMediaTypedHandle, IActorTestAbstractMediaTypedMediaTypeFormats, IActorTestAbstractMediaTypedMediaTypes } from '@comunica/actor-abstract-mediatyped';
import { ActorAbstractMediaTyped } from '@comunica/actor-abstract-mediatyped';
import type { IActorQueryOperationOutputBase } from '@comunica/bus-query-operation';
import type { IAction, IActorOutput, IActorTest } from '@comunica/core';
/**
 * A comunica actor for sparql-serialize events.
 *
 * Actor types:
 * * Input:  IActionSparqlSerialize:      SPARQL bindings or a quad stream.
 * * Test:   <none>
 * * Output: IActorSparqlSerializeOutput: A text stream.
 *
 * @see IActionSparqlSerialize
 * @see IActorSparqlSerializeOutput
 */
export declare abstract class ActorSparqlSerialize extends ActorAbstractMediaTyped<IActionSparqlSerialize, IActorTest, IActorSparqlSerializeOutput> {
    constructor(args: IActorArgsMediaTyped<IActionSparqlSerialize, IActorTest, IActorSparqlSerializeOutput>);
}
export declare type IActionRootSparqlParse = IActionAbstractMediaTyped<IActionSparqlSerialize>;
export declare type IActorTestRootSparqlParse = IActorTestAbstractMediaTyped<IActorTest>;
export declare type IActorOutputRootSparqlParse = IActorOutputAbstractMediaTyped<IActorSparqlSerializeOutput>;
export declare type IActionSparqlSerializeHandle = IActionAbstractMediaTypedHandle<IActionSparqlSerialize>;
export declare type IActorTestSparqlSerializeHandle = IActorTestAbstractMediaTypedHandle<IActorTest>;
export declare type IActorOutputSparqlSerializeHandle = IActorOutputAbstractMediaTypedHandle<IActorSparqlSerializeOutput>;
export declare type IActionSparqlSerializeMediaTypes = IActionAbstractMediaTypedMediaTypes;
export declare type IActorTestSparqlSerializeMediaTypes = IActorTestAbstractMediaTypedMediaTypes;
export declare type IActorOutputSparqlSerializeMediaTypes = IActorOutputAbstractMediaTypedMediaTypes;
export declare type IActionSparqlSerializeMediaTypeFormats = IActionAbstractMediaTypedMediaTypeFormats;
export declare type IActorTestSparqlSerializeMediaTypeFormats = IActorTestAbstractMediaTypedMediaTypeFormats;
export declare type IActorOutputSparqlSerializeMediaTypeFormats = IActorOutputAbstractMediaTypedMediaTypeFormats;
export interface IActionSparqlSerialize extends IAction, IActorQueryOperationOutputBase {
}
export interface IActorSparqlSerializeOutput extends IActorOutput {
    /**
     * A readable string stream in a certain SPARQL serialization that was serialized.
     */
    data: NodeJS.ReadableStream;
}
