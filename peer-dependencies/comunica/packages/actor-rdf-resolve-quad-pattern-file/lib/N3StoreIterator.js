"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N3StoreIterator = void 0;
const asynciterator_1 = require("asynciterator");
class N3StoreIterator extends asynciterator_1.BufferedIterator {
    constructor(store, subject, predicate, object, graph) {
        super({ autoStart: false });
        this.store = store;
        this.subject = N3StoreIterator.nullifyVariables(subject);
        this.predicate = N3StoreIterator.nullifyVariables(predicate);
        this.object = N3StoreIterator.nullifyVariables(object);
        this.graph = N3StoreIterator.nullifyVariables(graph);
        const totalItems = store.countQuads(N3StoreIterator.nullifyVariables(subject), N3StoreIterator.nullifyVariables(predicate), N3StoreIterator.nullifyVariables(object), N3StoreIterator.nullifyVariables(graph));
        this.setProperty('metadata', { totalItems });
    }
    static nullifyVariables(term) {
        return !term || term.termType === 'Variable' ? null : term;
    }
    _read(count, done) {
        this.store.forEach((quad) => this._push(quad), this.subject, this.predicate, this.object, this.graph);
        done();
        this.close();
    }
}
exports.N3StoreIterator = N3StoreIterator;
//# sourceMappingURL=N3StoreIterator.js.map