"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfResolveHypermediaQpf = void 0;
const bus_rdf_resolve_hypermedia_1 = require("@comunica/bus-rdf-resolve-hypermedia");
const RdfSourceQpf_1 = require("./RdfSourceQpf");
/**
 * A comunica QPF RDF Resolve Quad Pattern Actor.
 */
class ActorRdfResolveHypermediaQpf extends bus_rdf_resolve_hypermedia_1.ActorRdfResolveHypermedia {
    constructor(args) {
        super(args, 'qpf');
    }
    async testMetadata(action) {
        const { searchForm } = this.createSource(action.metadata, action.context);
        if (action.handledDatasets && action.handledDatasets[searchForm.dataset]) {
            throw new Error(`Actor ${this.name} can only be applied for the first page of a QPF dataset.`);
        }
        return { filterFactor: 1 };
    }
    /**
     * Look for the search form
     * @param {IActionRdfResolveHypermedia} the metadata to look for the form.
     * @return {Promise<IActorRdfResolveHypermediaOutput>} A promise resolving to a hypermedia form.
     */
    async run(action) {
        this.logInfo(action.context, `Identified as qpf source: ${action.url}`);
        const source = this.createSource(action.metadata, action.context, action.quads);
        return { source, dataset: source.searchForm.dataset };
    }
    createSource(metadata, context, quads) {
        return new RdfSourceQpf_1.RdfSourceQpf(this.mediatorMetadata, this.mediatorMetadataExtract, this.mediatorRdfDereference, this.subjectUri, this.predicateUri, this.objectUri, this.graphUri, metadata, context, quads);
    }
}
exports.ActorRdfResolveHypermediaQpf = ActorRdfResolveHypermediaQpf;
//# sourceMappingURL=ActorRdfResolveHypermediaQpf.js.map