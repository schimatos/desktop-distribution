"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SortIterator = void 0;
const asynciterator_1 = require("asynciterator");
// Based on https://github.com/LinkedDataFragments/Client.js/blob/master/lib/sparql/SortIterator.js
class SortIterator extends asynciterator_1.TransformIterator {
    constructor(source, sort, options) {
        super(source, options);
        // The `window` parameter indicates the length of the sliding window to apply sorting
        const window = options && options.window;
        this.windowLength = Number.isFinite(window) && window > 0 ? window : Infinity;
        this.sort = sort;
        this.sorted = [];
    }
    // Reads the smallest item in the current sorting window
    _read(count, done) {
        let item;
        let { length } = this.sorted;
        // Try to read items until we reach the desired window length
        while (this.source && length !== this.windowLength) {
            item = this.source.read();
            if (item === null) {
                break;
            }
            // Insert the item in the sorted window (smallest last)
            let left = 0;
            let right = length - 1;
            let mid;
            let order;
            while (left <= right) {
                mid = Math.trunc((left + right) / 2);
                order = this.sort(item, this.sorted[mid]);
                if (order < 0) {
                    left = mid + 1;
                }
                else if (order > 0) {
                    right = mid - 1;
                }
                else {
                    left = mid;
                    right = -1;
                }
            }
            this.sorted.splice(left, 0, item);
            length++;
        }
        // Push the smallest item in the window
        if (length === this.windowLength) {
            this._push(this.sorted.pop());
        }
        done();
    }
    // Flushes remaining data after the source has ended
    _flush(done) {
        let { length } = this.sorted;
        while (length--) {
            this._push(this.sorted.pop());
        }
        done();
    }
}
exports.SortIterator = SortIterator;
//# sourceMappingURL=SortIterator.js.map