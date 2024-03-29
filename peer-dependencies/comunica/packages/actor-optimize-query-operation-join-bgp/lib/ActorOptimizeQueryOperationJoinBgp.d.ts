import type { IActionOptimizeQueryOperation, IActorOptimizeQueryOperationOutput } from '@comunica/bus-optimize-query-operation';
import { ActorOptimizeQueryOperation } from '@comunica/bus-optimize-query-operation';
import type { IActorArgs, IActorTest } from '@comunica/core';
/**
 * A comunica Join BGP Optimize Query Operation Actor.
 */
export declare class ActorOptimizeQueryOperationJoinBgp extends ActorOptimizeQueryOperation {
    constructor(args: IActorArgs<IActionOptimizeQueryOperation, IActorTest, IActorOptimizeQueryOperationOutput>);
    test(action: IActionOptimizeQueryOperation): Promise<IActorTest>;
    run(action: IActionOptimizeQueryOperation): Promise<IActorOptimizeQueryOperationOutput>;
}
