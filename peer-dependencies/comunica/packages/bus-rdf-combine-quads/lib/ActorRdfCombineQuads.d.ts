import type { QuadStream } from '@comunica/bus-query-operation';
import type { IAction, IActorArgs, IActorOutput, IActorTest } from '@comunica/core';
import { Actor } from '@comunica/core';
import type { IMediatorTypeIterations } from '@comunica/mediatortype-iterations';
/**
 * A comunica actor for rdf-combine-quads events including joining and diffing quad streams
 *
 * Actor types:
 * * Input:  IActionRdfCombineQuads:      The streams to be inserted/deleted and (optionally) a base stream
 * * Test:   <none>
 * * Output: IActorRdfCombineQuadsOutput: The resultant quad stream of the combine operation and (optionally)
 *                                        the insertions/deletions with respect to the base stream
 *
 * @see IActionRdfCombineQuads
 * @see IActorRdfCombineQuadsOutput
 */
export declare abstract class ActorRdfCombineQuads extends Actor<IActionRdfCombineQuads, IActorTest, IActorRdfCombineQuadsOutput> {
    constructor(args: IActorArgs<IActionRdfCombineQuads, IActorTest, IActorRdfCombineQuadsOutput>);
    /**
     * If this actor can track and return changes
     * with respect to a primary stream
     */
    protected canTrackChanges: boolean;
    /**
     * If this actor can ensure that the order in
     * which insertions and deletions are applied
     * will be respected
     */
    protected canMaintainOrder: boolean;
    /**
     * If this actor ensures that insertions will
     * not cause duplicate
     */
    protected canAvoidDuplicates: boolean;
    /**
     * The max/min number of insertion/deletion
     * streams that an actor can handle.
     *
     * Note that the quads parameter - if defined
     * is considered an insert stream
     */
    protected limitInsertsMin: number;
    protected limitInsertsMax: number;
    protected limitDeletesMin: number;
    protected limitDeletesMax: number;
    /**
     * If there is no 'base stream' to compare to, we can search remove all 'delete'
     * streams before the first update stream.
     */
    private simplify;
    /**
     * Counts the number of streams that insert quads and the number of streams that delete
     * quads. Note that base stream is counted as an *insertion* stream.
     */
    private counters;
    /**
     * Returns default input for 0 input entries, or 1 input entry with no deletions.
     * Calls the getOutput function otherwise
     * @param {IActionRdfCombineQuads} action
     * @returns {Promise<IActorRdfCombineQuadsOutput>}
     */
    run(action: IActionRdfCombineQuads): Promise<IActorRdfCombineQuadsOutput>;
    /**
     * Returns the result of combining quad streams
     */
    protected abstract getOutput(quads: QuadStream, quadStreamUpdates: IQuadStreamUpdate[]): Promise<IActorRdfCombineQuadsOutput>;
    /**
     * Returns the number of 'combine' operations required to complete
     * the operation
     * @param inserts The number of streams to be inserted
     * @param deletes The number of streams use for deletion
     * @param hasBase True if there is a base stream to compare to
     */
    abstract getIterations(inserts: number, deletes: number, hasBase?: boolean): Promise<number>;
    /**
     * Default test function for combine actors.
     */
    test(action: IActionRdfCombineQuads): Promise<IMediatorTypeIterations>;
}
/**
 * A quad stream and annotation of whether it is to be
 * used to insert or delete Quads
 */
export interface IQuadStreamUpdate {
    /**
     * Whether the quads are to be inserted into
     * or deleted from the main stream
     */
    type: 'insert' | 'delete';
    /**
     * Stream of Quads
     */
    quadStream: QuadStream;
}
export interface IActionRdfCombineQuads extends IAction {
    /**
     * Return changes with respect to a primary stream
     * Default: true
     */
    trackChanges?: boolean;
    /**
     * Ensure that having multiple insertion streams will
     * not cause duplication of quads
     * Default: true
     */
    maintainOrder?: boolean;
    /**
     * If this actor can ensure that the order in
     * which insertions and deletions are applied
     * is respected
     * Default: true
     */
    avoidDuplicates?: boolean;
    /**
     * Base quad stream (if applicable)
     */
    quads?: QuadStream;
    /**
     * Updates to apply to the base quad stream
     * or new stream if no base stream is supplied
     */
    quadStreamUpdates: IQuadStreamUpdate[];
}
export interface IActorRdfCombineQuadsOutput extends IActorOutput {
    /**
     * The resultant quad stream of the combine operation
     */
    quads: QuadStream;
    /**
     * The quads inserted with respect to the primary stream
     * (if applicable)
     */
    quadStreamInserted?: QuadStream;
    /**
     * The quads deleted with respect to the primary stream
     * (if applicable)
     */
    quadStreamDeleted?: QuadStream;
}
