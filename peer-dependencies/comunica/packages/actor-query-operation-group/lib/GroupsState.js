"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsState = void 0;
const actor_abstract_bindings_hash_1 = require("@comunica/actor-abstract-bindings-hash");
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const rdf_string_1 = require("rdf-string");
const sparqlee_1 = require("sparqlee");
/**
 * A state manager for the groups constructed by consuming the bindings-stream.
 */
class GroupsState {
    constructor(pattern, sparqleeConfig) {
        this.pattern = pattern;
        this.sparqleeConfig = sparqleeConfig;
        this.groups = new Map();
        this.groupVariables = new Set(this.pattern.variables.map(x => rdf_string_1.termToString(x)));
        this.distinctHashes = pattern.aggregates.some(({ distinct }) => distinct) ?
            new Map() :
            null;
    }
    /**
     * - Consumes a stream binding
     * - Find the corresponding group and create one if need be
     * - Feeds the binding to the group's aggregators
     *
     * @param {Bindings} bindings - The Bindings to consume
     */
    consumeBindings(bindings) {
        // Select the bindings on which we group
        const grouper = bindings
            .filter((_, variable) => this.groupVariables.has(variable))
            .toMap();
        const groupHash = this.hashBindings(grouper);
        // First member of group -> create new group
        let group = this.groups.get(groupHash);
        if (!group) {
            // Initialize state for all aggregators for new group
            const aggregators = {};
            for (const aggregate of this.pattern.aggregates) {
                const key = rdf_string_1.termToString(aggregate.variable);
                aggregators[key] = new sparqlee_1.AggregateEvaluator(aggregate, this.sparqleeConfig);
                aggregators[key].put(bindings);
            }
            group = { aggregators, bindings: grouper };
            this.groups.set(groupHash, group);
            if (this.distinctHashes) {
                const bindingsHash = this.hashBindings(bindings);
                this.distinctHashes.set(groupHash, new Set([bindingsHash]));
            }
        }
        else {
            // Group already exists
            // Update all the aggregators with the input binding
            for (const aggregate of this.pattern.aggregates) {
                // If distinct, check first wether we have inserted these values already
                if (aggregate.distinct) {
                    const hash = this.hashBindings(bindings);
                    if (this.distinctHashes.get(groupHash).has(hash)) {
                        continue;
                    }
                    else {
                        this.distinctHashes.get(groupHash).add(hash);
                    }
                }
                const variable = rdf_string_1.termToString(aggregate.variable);
                group.aggregators[variable].put(bindings);
            }
        }
    }
    /**
     * Collect the result of the current state. This returns a Bindings per group,
     * and a (possibly empty) Bindings in case the no Bindings have been consumed yet.
     */
    collectResults() {
        // Collect groups
        let rows = [...this.groups].map(([_, group]) => {
            const { bindings: groupBindings, aggregators } = group;
            // Collect aggregator bindings
            // If the aggregate errorred, the result will be undefined
            const aggBindings = {};
            for (const variable in aggregators) {
                const value = aggregators[variable].result();
                if (value !== undefined) {
                    // Filter undefined
                    aggBindings[variable] = value;
                }
            }
            // Merge grouping bindings and aggregator bindings
            return groupBindings.merge(aggBindings);
        });
        // Case: No Input
        // Some aggregators still define an output on the empty input
        // Result is a single Bindings
        if (rows.length === 0 && this.groupVariables.size === 0) {
            const single = {};
            for (const aggregate of this.pattern.aggregates) {
                const key = rdf_string_1.termToString(aggregate.variable);
                const value = sparqlee_1.AggregateEvaluator.emptyValue(aggregate);
                if (value !== undefined) {
                    single[key] = value;
                }
            }
            rows = [bus_query_operation_1.Bindings(single)];
        }
        return rows;
    }
    /**
     * @param {Bindings} bindings - Bindings to hash
     */
    hashBindings(bindings) {
        return actor_abstract_bindings_hash_1.AbstractFilterHash.hash(bindings);
    }
}
exports.GroupsState = GroupsState;
//# sourceMappingURL=GroupsState.js.map