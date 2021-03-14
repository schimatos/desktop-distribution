import type { QuadStream } from '@comunica/bus-query-operation';
import type { IActionRdfCombineQuads, IActorRdfCombineQuadsOutput, IQuadStreamUpdate } from '@comunica/bus-rdf-combine-quads';
import { ActorRdfCombineQuads } from '@comunica/bus-rdf-combine-quads';
import type { IActorArgs, IActorTest } from '@comunica/core';
import { AsyncIterator } from 'asynciterator';
import { sha1 } from 'hash.js';
import type * as RDF from 'rdf-js';
import { quadToStringQuad } from 'rdf-string';


/**
 * A comunica Hash, single iteration of each stream RDF Combine Quads Actor.
 */
export class ActorRdfCombineQuadsHashSingle extends ActorRdfCombineQuads {
  public constructor(args: IActorArgs<IActionRdfCombineQuads, IActorTest, IActorRdfCombineQuadsOutput>) {
    super(args);
  }

  protected canTrackChanges = true;
  protected canMaintainOrder = true;
  protected canAvoidDuplicates = true;
  protected limitInsertsMin = 0;
  protected limitInsertsMax = Infinity;
  protected limitDeletesMin = 0;
  protected limitDeletesMax = Infinity;

  /**
   * Create a string-based hash of the given object.
   * @param quad The quad to hash
   * @return {string} The object's hash.
   */
  public static hash(quad: RDF.Quad): string {
    return sha1()
      .update(require('canonicalize')(quadToStringQuad(quad)))
      .digest('hex');
  }

  /**
   * Gets the number of 'iterations' over streams required to complete
   * this operation. Insert operations are iterated (at most) twice and the delete
   * and base streams are iterated over once each.
   * @param inserts The number of insert operations
   * @param deletes The number of delete operations
   * @param hasBase Whether there is a base quad stream
   */
  public async getIterations(inserts: number, deletes: number, hasBase?: boolean): Promise<number> {
    // Odgy
    return inserts + deletes + (hasBase ? 1 : 0);
  }

  /**
   *
   * @param action
   */
  public async getOutput(quads: QuadStream, updates: IQuadStreamUpdate[]): Promise<IActorRdfCombineQuadsOutput> {
    // console.log('start of output', updates, quads)
    const deletions: (Record<string, boolean> | undefined)[] = [];
    const added: Record<string, boolean> = {};
    let quadStreamDeleted: QuadStream = new AsyncIterator<RDF.Quad>();
    let quadStreamInserted: QuadStream = new AsyncIterator<RDF.Quad>();

    for (const update of updates) {
      if (update.type === 'delete') {
        const hashes: Record<string, boolean> = {};
        update.quadStream.forEach(quad => {
          hashes[ActorRdfCombineQuadsHashSingle.hash(quad)] = true;
        });
      } else {
        // console.log('inside else')
        deletions.push(undefined);
      }
    }
    quads = quads.filter(quad => {
      if (deletions.every(hashes => !hashes?.[ActorRdfCombineQuadsHashSingle.hash(quad)])) {
        quadStreamDeleted = quadStreamDeleted.append([quad]);
        return false;
      } else {
        return true;
      };
    })

    for (const update of updates) {
      deletions.splice(0, 1);
      if (update.type === 'insert') {
        quadStreamInserted = quadStreamInserted.append(update.quadStream.filter(quad => {
          const hash = ActorRdfCombineQuadsHashSingle.hash(quad);
          if (!(hash in added) && deletions.every(hashes => !hashes?.[hash])) {
            added[hash] = true;
            return true;
          }
          return false;
        }))
      }
    }
    quads = quads.append(quadStreamInserted);
    // console.log('end of combine')
    // console.log('------------------------------------------------------------------------------------------------')
    // await new Promise((res, rej) => {
    //   quads.on('data', data => {console.log(data)});
    //   quads.on('end', () => {
    //     console.log('end');
    //     res(undefined);
    //   })
    // })
    // console.log('------------------------------------------------------------------------------------------------')
    return {
      quads,
      quadStreamDeleted,
      quadStreamInserted
    }
  }
}
