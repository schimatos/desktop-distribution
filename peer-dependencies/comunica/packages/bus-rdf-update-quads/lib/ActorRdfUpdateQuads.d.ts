import { QuadStream } from '@comunica/bus-query-operation';
import { IActionRdfUpdateQuadStream, IActorRdfUpdateQuadStreamOutput } from '@comunica/bus-rdf-update-quad-stream';
import { ActionContext, Actor, IAction, IActorArgs, IActorOutput, IActorTest, Mediator } from '@comunica/core';
/**
 * A comunica actor for rdf-update-quads events.
 *
 * Actor types:
 * * Input:  IActionRdfUpdateQuads:      Streams of quads to be inserted and deleted.
 * * Test:   <none>
 * * Output: IActorRdfUpdateQuadsOutput: Streams of quads that were inserted and deleted.
 *
 * @see IActionRdfUpdateQuads
 * @see IActorRdfUpdateQuadsOutput
 */
export declare abstract class ActorRdfUpdateQuads extends Actor<IActionRdfUpdateQuads, IActorTest, IActorRdfUpdateQuadsOutput> {
    readonly mediatorUpdateQuadStream: Mediator<Actor<IActionRdfUpdateQuadStream, IActorTest, IActorRdfUpdateQuadStreamOutput>, IActionRdfUpdateQuadStream, IActorTest, IActorRdfUpdateQuadStreamOutput>;
    constructor(args: IActorArgs<IActionRdfUpdateQuads, IActorTest, IActorRdfUpdateQuadsOutput>);
    abstract runOperation(action: IActionRdfUpdateQuads): Promise<IActorRdfUpdateQuadsOutput>;
    abstract testOperation(action: IActionRdfUpdateQuads): Promise<IActorTest>;
    /**
     * Test function for update quad stream actors.
     */
    test(action: IActionRdfUpdateQuads): Promise<IActorTest>;
    /**
     * Run function for update quad stream actors.
     */
    run(action: IActionRdfUpdateQuads): Promise<IActorRdfUpdateQuadsOutput>;
}
export interface IActionRdfUpdateQuads extends IAction {
    /**
     * The stream of quads that have been inserted into the main stream
     */
    quadStreamInsert?: QuadStream;
    /**
     * The stream of quads that have been deleted from the main stream
     */
    quadStreamDelete?: QuadStream;
    /**
     * A convenience constructor for {@link ActionContext} based on a given hash.
     * @param {{[p: string]: any}} hash A hash that maps keys to values.
     * @return {ActionContext} The immutable action context from the hash.
     * @constructor
     */
    context?: ActionContext;
}
export interface IActorRdfUpdateQuadsOutput extends IActorOutput {
    /**
     * The stream of quads that were inserted.
     * Undefined if the operation did not have to insert anything.
     */
    quadStreamInserted?: QuadStream;
    /**
     * The stream of quads that were deleted.
     * Undefined if the operation did not have to delete anything.
     */
    quadStreamDeleted?: QuadStream;
}
