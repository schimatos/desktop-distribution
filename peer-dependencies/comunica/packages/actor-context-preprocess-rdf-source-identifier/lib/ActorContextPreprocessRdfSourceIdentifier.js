"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorContextPreprocessRdfSourceIdentifier = void 0;
const bus_context_preprocess_1 = require("@comunica/bus-context-preprocess");
const bus_rdf_resolve_quad_pattern_1 = require("@comunica/bus-rdf-resolve-quad-pattern");
/**
 * A comunica RDF Source Identifier Context Preprocess Actor.
 */
class ActorContextPreprocessRdfSourceIdentifier extends bus_context_preprocess_1.ActorContextPreprocess {
    constructor(args) {
        super(args);
    }
    async test(action) {
        return true;
    }
    async run(action) {
        if (action.context) {
            if (action.context.get(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCE)) {
                let source = action.context.get(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCE);
                let { context } = action;
                if (source.type === 'auto') {
                    context = action.context.delete(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCE);
                    source = await this.identifySource(source, context);
                    context = context.set(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCE, source);
                }
                return { context };
            }
            if (action.context.get(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCES)) {
                const subContext = action.context.delete(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCES);
                const sources = action.context.get(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCES);
                const newSources = [];
                for (const source of sources) {
                    newSources.push(await this.identifySource(source, subContext));
                }
                return { context: action.context.set(bus_rdf_resolve_quad_pattern_1.KEY_CONTEXT_SOURCES, newSources) };
            }
        }
        return action;
    }
    async identifySource(source, context) {
        return this.mediatorRdfSourceIdentifier.mediate({ sourceValue: bus_rdf_resolve_quad_pattern_1.getDataSourceValue(source), context })
            .then(sourceIdentificationResult => {
            if (sourceIdentificationResult.sourceType) {
                source.type = sourceIdentificationResult.sourceType;
            }
            return source;
        });
    }
}
exports.ActorContextPreprocessRdfSourceIdentifier = ActorContextPreprocessRdfSourceIdentifier;
//# sourceMappingURL=ActorContextPreprocessRdfSourceIdentifier.js.map