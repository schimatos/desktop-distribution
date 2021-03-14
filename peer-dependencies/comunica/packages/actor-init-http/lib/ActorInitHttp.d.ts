import type { IActionHttp, IActorHttpOutput } from '@comunica/bus-http';
import type { IActionInit, IActorOutputInit } from '@comunica/bus-init';
import { ActorInit } from '@comunica/bus-init';
import type { Actor, IActorArgs, IActorTest, Mediator } from '@comunica/core';
/**
 * A http actor that listens on the 'init' bus.
 *
 * It will call `this.mediatorHttp.mediate`.
 */
export declare class ActorInitHttp extends ActorInit implements IActorInitHttpArgs {
    readonly mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
    readonly url?: string;
    readonly method?: string;
    readonly headers?: string[];
    constructor(args: IActorInitHttpArgs);
    test(action: IActionInit): Promise<IActorTest>;
    run(action: IActionInit): Promise<IActorOutputInit>;
}
export interface IActorInitHttpArgs extends IActorArgs<IActionInit, IActorTest, IActorOutputInit> {
    mediatorHttp: Mediator<Actor<IActionHttp, IActorTest, IActorHttpOutput>, IActionHttp, IActorTest, IActorHttpOutput>;
    url?: string;
    method?: string;
    headers?: string[];
}
