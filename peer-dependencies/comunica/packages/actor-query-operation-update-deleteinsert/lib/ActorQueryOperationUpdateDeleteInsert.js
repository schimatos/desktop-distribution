"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorQueryOperationUpdateDeleteInsert = void 0;
const actor_query_operation_construct_1 = require("@comunica/actor-query-operation-construct");
const bus_query_operation_1 = require("@comunica/bus-query-operation");
const asynciterator_1 = require("asynciterator");
/**
 * A comunica Update DeleteInsert Query Operation Actor.
 */
class ActorQueryOperationUpdateDeleteInsert extends bus_query_operation_1.ActorQueryOperationTypedMediated {
    constructor(args) {
        super(args, 'deleteinsert');
    }
    async testOperation(pattern, context) {
        return true;
    }
    async runOperation(pattern, context) {
        // Evaluate the where clause
        const whereBindings = pattern.where ?
            bus_query_operation_1.ActorQueryOperation.getSafeBindings(await this.mediatorQueryOperation
                .mediate({ operation: pattern.where, context })).bindingsStream :
            new asynciterator_1.SingletonIterator(bus_query_operation_1.Bindings({}));
        // Construct triples using the result based on the pattern.
        let quadStreamInsert;
        let quadStreamDelete;
        if (pattern.insert) {
            quadStreamInsert = new actor_query_operation_construct_1.BindingsToQuadsIterator(pattern.insert, whereBindings.clone());
        }
        if (pattern.delete) {
            quadStreamDelete = new actor_query_operation_construct_1.BindingsToQuadsIterator(pattern.delete, whereBindings.clone());
        }
        // quadStreamInsert?.on('data', quad => {
        //   console.log("Quad found in on")
        //   console.log(quad)
        // })
        // console.log("HO");
        // console.log("quadStreamInsert is ", quadStreamInsert)
        // const q = quadStreamInsert?.read();
        // console.log(q)
        // Evaluate the required modifications
        const { quadStreamInserted, quadStreamDeleted } = await this.mediatorRdfUpdateQuads.mediate({
            quadStreamInsert,
            quadStreamDelete,
            context,
        });
        // console.log("HI");
        quadStreamInserted === null || quadStreamInserted === void 0 ? void 0 : quadStreamInserted.on('data', quad => {
            // console.log(quad);
        });
        // console.log(quadStreamInserted);
        return {
            type: 'update',
            quadStreamInserted,
            quadStreamDeleted,
        };
    }
}
exports.ActorQueryOperationUpdateDeleteInsert = ActorQueryOperationUpdateDeleteInsert;
//# sourceMappingURL=ActorQueryOperationUpdateDeleteInsert.js.map