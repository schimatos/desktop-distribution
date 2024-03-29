import type { Bindings, IActorQueryOperationOutput, IActorQueryOperationOutputBindings } from '@comunica/bus-query-operation';
import type { IActionRdfJoin } from '@comunica/bus-rdf-join';
import { ActorRdfJoin } from '@comunica/bus-rdf-join';
import type { IActorArgs } from '@comunica/core';
import type { IMediatorTypeIterations } from '@comunica/mediatortype-iterations';
/**
 * A comunica Hash RDF Join Actor.
 */
export declare class ActorRdfJoinSymmetricHash extends ActorRdfJoin {
    constructor(args: IActorArgs<IActionRdfJoin, IMediatorTypeIterations, IActorQueryOperationOutput>);
    /**
     * Creates a hash of the given bindings by concatenating the results of the given variables.
     * This function will not sort the variables and expects them to be in the same order for every call.
     * @param {Bindings} bindings
     * @param {string[]} variables
     * @returns {string}
     */
    static hash(bindings: Bindings, variables: string[]): string;
    getOutput(action: IActionRdfJoin): Promise<IActorQueryOperationOutputBindings>;
    protected getIterations(action: IActionRdfJoin): Promise<number>;
}
