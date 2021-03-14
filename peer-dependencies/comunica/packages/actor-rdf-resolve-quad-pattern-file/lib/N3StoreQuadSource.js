"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.N3StoreQuadSource = void 0;
const N3StoreIterator_1 = require("./N3StoreIterator");
class N3StoreQuadSource {
    constructor(store) {
        this.store = store;
    }
    match(subject, predicate, object, graph) {
        return new N3StoreIterator_1.N3StoreIterator(this.store, subject, predicate, object, graph);
    }
}
exports.N3StoreQuadSource = N3StoreQuadSource;
//# sourceMappingURL=N3StoreQuadSource.js.map