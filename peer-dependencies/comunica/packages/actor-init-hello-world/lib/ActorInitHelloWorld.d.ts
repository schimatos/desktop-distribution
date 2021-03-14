import type { IActionInit, IActorOutputInit } from '@comunica/bus-init';
import { ActorInit } from '@comunica/bus-init';
import type { IActorArgs, IActorTest } from '@comunica/core';
/**
 * A Hello World actor that listens on the 'init' bus.
 *
 * It takes an optional `hello` parameter, which defaults to 'Hello'.
 * When run, it will print the `hello` parameter to the console,
 * followed by all arguments it received.
 */
export declare class ActorInitHelloWorld extends ActorInit implements IActorInitHelloWorldArgs {
    readonly hello: string;
    constructor(args: IActorInitHelloWorldArgs);
    test(action: IActionInit): Promise<IActorTest>;
    run(action: IActionInit): Promise<IActorOutputInit>;
}
export interface IActorInitHelloWorldArgs extends IActorArgs<IActionInit, IActorTest, IActorOutputInit> {
    hello: string;
}
