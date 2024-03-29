"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationReducedHash = void 0;
const actor_abstract_bindings_hash_1 = require("@comunica/actor-abstract-bindings-hash");
const lru_cache_1 = __importDefault(require("lru-cache"));
/**
 * A comunica Reduced Hash Query Operation Actor.
 */
class ActorQueryOperationReducedHash extends actor_abstract_bindings_hash_1.AbstractBindingsHash {
    constructor(args) {
        super(args, 'reduced');
    }
    /**
     * Create a new distinct filter function for the given hash algorithm and digest algorithm.
     * This will maintain an internal hash datastructure so that every bindings object only returns true once.
     * @return {(bindings: Bindings) => boolean} A distinct filter for bindings.
     */
    newHashFilter() {
        const hashes = new lru_cache_1.default({ max: this.cacheSize });
        return (bindings) => {
            const hash = actor_abstract_bindings_hash_1.AbstractFilterHash.hash(bindings);
            return !hashes.has(hash) && hashes.set(hash, true);
        };
    }
}
exports.ActorQueryOperationReducedHash = ActorQueryOperationReducedHash;
//# sourceMappingURL=ActorQueryOperationReducedHash.js.map