import type { QuadStream } from '@comunica/bus-query-operation';
import type { IActionRdfCombineQuads, IActorRdfCombineQuadsOutput, IQuadStreamUpdate } from '@comunica/bus-rdf-combine-quads';
import { ActorRdfCombineQuads } from '@comunica/bus-rdf-combine-quads';
import type { IActorArgs, IActorTest } from '@comunica/core';
import type * as RDF from 'rdf-js';
/**
 * A comunica Hash, stream RDF Combine Quads Actor.
 */
export declare class ActorRdfCombineQuadsHash extends ActorRdfCombineQuads {
    constructor(args: IActorArgs<IActionRdfCombineQuads, IActorTest, IActorRdfCombineQuadsOutput>);
    protected canTrackChanges: boolean;
    protected canMaintainOrder: boolean;
    protected canAvoidDuplicates: boolean;
    protected limitInsertsMin: number;
    protected limitInsertsMax: number;
    protected limitDeletesMin: number;
    protected limitDeletesMax: number;
    /**
     * Create a string-based hash of the given object.
     * @param quad The quad to hash
     * @return {string} The object's hash.
     */
    static hash(quad: RDF.Quad): string;
    /**
     * Gets the number of 'iterations' over streams required to complete
     * this operation. Insert operations are iterated (at most) twice and the delete
     * and base streams are iterated over once each.
     * @param inserts The number of insert operations
     * @param deletes The number of delete operations
     * @param hasBase Whether there is a base quad stream
     */
    getIterations(inserts: number, deletes: number, hasBase?: boolean): Promise<number>;
    getOutput(quads: QuadStream, updates: IQuadStreamUpdate[]): Promise<IActorRdfCombineQuadsOutput>;
}
