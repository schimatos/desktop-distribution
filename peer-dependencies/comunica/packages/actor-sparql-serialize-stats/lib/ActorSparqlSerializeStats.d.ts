/// <reference types="node" />
import { Readable } from 'stream';
import type { IActionSparqlSerialize, IActorSparqlSerializeFixedMediaTypesArgs, IActorSparqlSerializeOutput } from '@comunica/bus-sparql-serialize';
import { ActorSparqlSerializeFixedMediaTypes } from '@comunica/bus-sparql-serialize';
import type { ActionContext } from '@comunica/core';
import type { ActionObserverHttp } from './ActionObserverHttp';
/**
 * Serializes SPARQL results for testing and debugging.
 */
export declare class ActorSparqlSerializeStats extends ActorSparqlSerializeFixedMediaTypes {
    readonly httpObserver: ActionObserverHttp;
    constructor(args: IActorSparqlSerializeStatsArgs);
    testHandleChecked(action: IActionSparqlSerialize, context: ActionContext): Promise<boolean>;
    pushHeader(data: Readable): void;
    pushStat(data: Readable, startTime: [number, number], result: number): void;
    pushFooter(data: Readable, startTime: [number, number]): void;
    runHandle(action: IActionSparqlSerialize, mediaType: string, context: ActionContext): Promise<IActorSparqlSerializeOutput>;
    delay(startTime: [number, number]): number;
}
export interface IActorSparqlSerializeStatsArgs extends IActorSparqlSerializeFixedMediaTypesArgs {
    httpObserver: ActionObserverHttp;
}
