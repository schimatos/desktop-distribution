import { ActorRdfUpdateQuads, IActionRdfUpdateQuads, IActorRdfUpdateQuadsOutput } from '@comunica/bus-rdf-update-quads';
import { IActorArgs, IActorTest } from '@comunica/core';

/**
 * A comunica Hypermedia RDF Update Quads Actor.
 */
export class ActorRdfUpdateQuadsHypermedia extends ActorRdfUpdateQuads {
  public constructor(args: IActorArgs<IActionRdfUpdateQuads, IActorTest, IActorRdfUpdateQuadsOutput>) {
    super(args);
  }

  public async testOperation(action: IActionRdfUpdateQuads): Promise<IActorTest> {
    return true; // TODO implement
  }

  public async runOperation(action: IActionRdfUpdateQuads): Promise<IActorRdfUpdateQuadsOutput> {
    return {}; // TODO implement
  }
}
