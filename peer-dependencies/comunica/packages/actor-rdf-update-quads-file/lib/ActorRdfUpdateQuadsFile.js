"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorRdfUpdateQuadsFile = void 0;
const bus_rdf_update_quads_1 = require("@comunica/bus-rdf-update-quads");
const utils_datasource_1 = require("@comunica/utils-datasource");
const asynciterator_1 = require("asynciterator");
const streamToArray = require('arrayify-stream');
const N3 = __importStar(require("n3"));
const hash_js_1 = require("hash.js");
// import toQuad from 'rdf-quad';
const rdf_string_1 = require("rdf-string");
const fs = __importStar(require("fs"));
/**
 * A comunica File RDF Update Quads Actor.
 */
class ActorRdfUpdateQuadsFile extends bus_rdf_update_quads_1.ActorRdfUpdateQuads {
    constructor(args) {
        super(args);
    }
    async testOperation(action) {
        // TODO: Forward test results
        // console.log('test quads file');
        return true; // TODO implement
    }
    hash(quad) {
        return hash_js_1.sha1()
            .update(require('canonicalize')(rdf_string_1.quadToStringQuad(quad)))
            .digest('hex');
    }
    async runOperation(action) {
        // TODO: FIX
        // console.log("run quads file");
        const source = await utils_datasource_1.DataSourceUtils.getSingleSource(action.context);
        // console.log(source);
        const dereferenced = await this.mediatorRdfDereference.mediate({
            // @ts-ignore
            url: source === null || source === void 0 ? void 0 : source.value,
            context: action.context
        });
        // console.log(dereferenced);
        const { quads: dereferencedQuads, url } = dereferenced;
        // const parser = new N3.StreamParser();
        // parser.write()
        // // @ts-ignore
        // const quadStream: QuadStream = new AsyncIterator<RDF.Quad>();
        // console.log('looking at derefffed', await streamToArray(dereferencedQuads))
        // console.log('looking at derefffed', await streamToArray(action.quadStreamInsert))
        let quads = [...await streamToArray(dereferencedQuads), ...(action.quadStreamInsert ? await streamToArray(action.quadStreamInsert) : [])];
        const hashes = {};
        if (action.quadStreamDelete) {
            const deleted = await streamToArray(action.quadStreamDelete);
            for (const x of deleted) {
                hashes[this.hash(x)] = true;
            }
        }
        quads = quads.filter(quad => {
            const hash = this.hash(quad);
            return !(hash in hashes) && (hashes[hash] = true);
        });
        // dereferencedQuads.on('data', (quad: RDF.Quad) => {
        //   console.log('quad', quad)
        //   // quadStream.append([ quad ]);
        // })
        // console.log('after dereffed')
        // dereferencedQuads.on('end', () => {
        //   quadStream.close();
        // })
        // let quadStreamUpdates: IQuadStreamUpdate[] = [];
        // if (action.quadStreamInsert) {
        //   quadStreamUpdates.push({
        //     type: 'insert', quadStream: action.quadStreamInsert
        //   })
        // }
        // if (action.quadStreamDelete) {
        //   quadStreamUpdates.push({
        //     type: 'insert', quadStream: action.quadStreamDelete
        //   })
        // }
        // console.log(this.mediatorCombineQuads, 'combine')
        // console.log('before combine')
        // const { quads, quadStreamInserted, quadStreamDeleted } = await this.mediatorCombineQuads.mediate({
        //   quads: quadStream,
        //   quadStreamUpdates
        //   // quadStreamInsert: action.quadStreamInsert,
        //   // quadStreamDelete: action.quadStreamDelete,
        // });
        // console.log('after combine');
        // console.log(quads)
        // quads.on('data', quad => {
        //   console.log(quad);
        // })
        // await new Promise((res, rej) => {
        //   quads.on('end', () => {
        //     res(undefined);
        //   })
        // });
        // console.log('after promise');
        // new Promise((res, rej) => {
        //   setTimeout(() => {
        //     res(void);
        //   }, 10000);
        // })
        // const myTestQuads = new AsyncIterator<RDF.Quad>();
        // myTestQuads.append([
        //   // toQuad('http://example,org/1','http://example,org/2','http://example,org/3')
        //   // {
        //   //   subject: new namedNode(''),
        //   //   predicate: new namedNode(''),
        //   //   object: new namedNode('')
        //   // }
        // ])
        // TODO: Handle rejection of this operation and
        // remove quads that could not be serialized from quadStreamInserted
        // @ts-ignore
        // console.log(this)
        const writer = new N3.Writer();
        // writer.addQuads(quads);
        await new Promise((res, rej) => {
            const s = writer.quadsToString(quads);
            // console.log('file string');
            fs.writeFile(url, s, () => { res(undefined); });
        });
        // console.log('after writer');
        // writer.quadsToString(quads)
        // const writeStream = new StreamWriter({ format: mediaType }).import(new AsyncIterator<RDF.Quad>().append(quads));
        // fs.wr(writeStream)
        // await this.mediatorRdfWrite.mediate({
        //   url,
        //   quads: new AsyncIterator<RDF.Quad>().append(quads),
        // })
        // await (new ActorRdfWriteFile).run({
        //   url,
        //   quads
        // });
        // TODO: Fix based on above ammendments
        return {
            quadStreamInserted: new asynciterator_1.AsyncIterator(),
            quadStreamDeleted: new asynciterator_1.AsyncIterator()
        };
        // this.mediatorParse.mediate({
        // })
        // return true; // TODO implement
    }
}
exports.ActorRdfUpdateQuadsFile = ActorRdfUpdateQuadsFile;
//# sourceMappingURL=ActorRdfUpdateQuadsFile.js.map