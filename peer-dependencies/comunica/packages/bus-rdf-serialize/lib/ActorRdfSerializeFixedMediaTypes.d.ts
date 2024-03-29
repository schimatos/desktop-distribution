import type { IActorArgsMediaTypedFixed } from '@comunica/actor-abstract-mediatyped';
import { ActorAbstractMediaTypedFixed } from '@comunica/actor-abstract-mediatyped';
import type { IActorTest } from '@comunica/core';
import type { IActionRdfSerialize, IActorRdfSerializeOutput } from './ActorRdfSerialize';
/**
 * A base actor for listening to RDF serialize events that has fixed media types.
 *
 * Actor types:
 * * Input:  IActionRdfSerializeOrMediaType:      A serialize input or a media type input.
 * * Test:   <none>
 * * Output: IActorRdfSerializeOutputOrMediaType: The serialized quads.
 *
 * @see IActionInit
 */
export declare abstract class ActorRdfSerializeFixedMediaTypes extends ActorAbstractMediaTypedFixed<IActionRdfSerialize, IActorTest, IActorRdfSerializeOutput> implements IActorRdfSerializeFixedMediaTypesArgs {
    constructor(args: IActorRdfSerializeFixedMediaTypesArgs);
    testHandleChecked(action: IActionRdfSerialize): Promise<boolean>;
}
export interface IActorRdfSerializeFixedMediaTypesArgs extends IActorArgsMediaTypedFixed<IActionRdfSerialize, IActorTest, IActorRdfSerializeOutput> {
}
