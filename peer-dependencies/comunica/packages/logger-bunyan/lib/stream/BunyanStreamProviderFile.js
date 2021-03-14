"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BunyanStreamProviderFile = void 0;
const url_1 = require("url");
const BunyanStreamProvider_1 = require("./BunyanStreamProvider");
/**
 * A file bunyan stream provider.
 */
class BunyanStreamProviderFile extends BunyanStreamProvider_1.BunyanStreamProvider {
    constructor(args) {
        super(args);
    }
    createStream() {
        return { type: 'file', name: this.name, path: new url_1.URL(this.path), level: this.level };
    }
}
exports.BunyanStreamProviderFile = BunyanStreamProviderFile;
//# sourceMappingURL=BunyanStreamProviderFile.js.map