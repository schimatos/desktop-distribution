import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import { ActorHttp } from '@comunica/bus-http';
import type { IActorArgs, IActorTest, Mediator } from '@comunica/core';
import 'cross-fetch/polyfill';
/**
 * A comunica Memento Http Actor.
 */
export declare class ActorHttpMemento extends ActorHttp {
    readonly mediatorHttp: Mediator<ActorHttp, IActionHttp, IActorTest, IActorHttpOutput>;
    constructor(args: IActorHttpMementoArgs);
    test(action: IActionHttp): Promise<IActorTest>;
    run(action: IActionHttp): Promise<IActorHttpOutput>;
}
export interface IActorHttpMementoArgs extends IActorArgs<IActionHttp, IActorTest, IActorHttpOutput> {
    mediatorHttp: Mediator<ActorHttp, IActionHttp, IActorTest, IActorHttpOutput>;
}
/**
 * @type {string} Context entry for the desired datetime.
 */
export declare const KEY_CONTEXT_DATETIME = "@comunica/actor-http-memento:datetime";
