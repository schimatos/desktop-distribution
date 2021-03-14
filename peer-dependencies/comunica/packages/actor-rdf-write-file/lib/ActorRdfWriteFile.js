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
exports.ActorRdfWriteFile = void 0;
const fs = __importStar(require("fs"));
const url_1 = require("url");
const bus_rdf_write_1 = require("@comunica/bus-rdf-write");
const util_1 = require("util");
const n3_1 = require("n3");
/**
 * A comunica File RDF Write Actor.
 */
class ActorRdfWriteFile extends bus_rdf_write_1.ActorRdfWrite {
    constructor(args) {
        super(args);
    }
    async test(action) {
        // console.log("Test file write");
        try {
            await util_1.promisify(fs.access)(action.url.startsWith('file://') ? new url_1.URL(action.url) : action.url, fs.constants.W_OK);
        }
        catch (error) {
            throw new Error(`This actor only works on existing local files. (${error})`);
        }
        return true;
    }
    async run(action) {
        // console.log("run file write", action.url);
        let { mediaType } = action;
        // console.log(1);
        // Deduce media type from file extension if possible
        if (!mediaType) {
            mediaType = this.getMediaTypeFromExtension(action.url);
        }
        // console.log(2);
        // TODO: Emit quads that were not serialized.
        // console.log(this);
        const serializedStream = await this.mediatorRdfSerialize.mediate(Object.assign({ quadStream: action.quads, context: action.context, mediaType, 
            // @ts-ignore
            mediaTypes: ['text/turtle'] }, action
        // @ts-ignore
        // mediaType: 'text/turtle'
        ));
        // console.log(3);
        // TODO: Handle this promise properly.
        // console.log(serializedStream);
        // console.log(3.5);
        const writer = new n3_1.StreamWriter({ format: 'text/turtle' }).import(action.quads);
        const file = fs.createWriteStream(action.url.startsWith('file://') ? new url_1.URL(action.url) : action.url);
        writer.on('data', data => {
            file.write(data);
        });
        await new Promise((res, rej) => {
            writer.on('end', data => {
                file.end();
                res(undefined);
            });
        });
        // await promisify(fs.writeFile)(action.url.startsWith('file://') ? new URL(action.url) : action.url, writer);
        // console.log(4)
        // TODO: Add the correct parameters here.
        return {
            url: action.url
        };
    }
}
exports.ActorRdfWriteFile = ActorRdfWriteFile;
// /**
//  * A comunica File RDF Dereference Actor.
//  */
// export class ActorRdfDereferenceFile extends ActorRdfDereferenceMediaMappings {
//   public readonly mediatorRdfParse: Mediator<
//   Actor<IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>,
//   IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>;
//   public constructor(args: IActorRdfDereferenceFileArgs) {
//     super(args);
//   }
//   public async test(action: IActionRdfDereference): Promise<IActorTest> {
//     try {
//       await promisify(fs.access)(
//         action.url.startsWith('file://') ? new URL(action.url) : action.url, fs.constants.F_OK,
//       );
//     } catch (error: unknown) {
//       throw new Error(
//         `This actor only works on existing local files. (${error})`,
//       );
//     }
//     return true;
//   }
//   public async run(action: IActionRdfDereference): Promise<IActorRdfDereferenceOutput> {
//     let { mediaType } = action;
//     // Deduce media type from file extension if possible
//     if (!mediaType) {
//       mediaType = this.getMediaTypeFromExtension(action.url);
//     }
//     const parseAction: IActionHandleRdfParse = {
//       context: action.context,
//       handle: {
//         baseIRI: action.url,
//         input: fs.createReadStream(action.url.startsWith('file://') ? new URL(action.url) : action.url),
//       },
//     };
//     if (mediaType) {
//       parseAction.handleMediaType = mediaType;
//     }
//     let parseOutput: IActorRdfParseOutput;
//     try {
//       parseOutput = (await this.mediatorRdfParse.mediate(parseAction)).handle;
//     } catch (error: unknown) {
//       return this.handleDereferenceError(action, error);
//     }
//     return {
//       headers: {},
//       quads: this.handleDereferenceStreamErrors(action, parseOutput.quads),
//       triples: parseOutput.triples,
//       url: action.url,
//     };
//   }
// }
// export interface IActorRdfDereferenceFileArgs extends IActorRdfDereferenceMediaMappingsArgs {
//   /**
//    * Mediator used for parsing the file contents.
//    */
//   mediatorRdfParse: Mediator<
//   Actor<IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>,
//   IActionHandleRdfParse, IActorTestHandleRdfParse, IActorOutputHandleRdfParse>;
// }
//# sourceMappingURL=ActorRdfWriteFile.js.map