import type { IActionRdfParse, IActorRdfParseFixedMediaTypesArgs,
  IActorRdfParseOutput } from '@comunica/bus-rdf-parse';
import { ActorRdfParseFixedMediaTypes } from '@comunica/bus-rdf-parse';
import type { ActionContext } from '@comunica/core';
import { StreamParser } from 'n3';

/**
 * An N3 RDF Parse actor that listens on the 'rdf-parse' bus.
 *
 * It is able to parse N3-based RDF serializations and announce the presence of them by media type.
 */
export class ActorRdfParseN3 extends ActorRdfParseFixedMediaTypes {
  public constructor(args: IActorRdfParseFixedMediaTypesArgs) {
    super(args);
  }

  public async runHandle(action: IActionRdfParse, mediaType: string, context: ActionContext):
  Promise<IActorRdfParseOutput> {
    action.input.on('error', error => quads.emit('error', error));
    // console.log('before n3 parse')
    const quads = action.input.pipe(new StreamParser({ baseIRI: action.baseIRI }));
    // console.log('after n3 parse')
    return {
      quads,
      triples: mediaType === 'text/turtle' ||
      mediaType === 'application/n-triples' ||
      mediaType === 'text/n3',
    };
  }
}
