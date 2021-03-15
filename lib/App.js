import React, { useReducer } from 'react';
import ComunicaEngine from './ComunicaEngine';
// @ts-ignore
import { PathFactory } from 'ldflex';
import { namedNode } from '@rdfjs/data-model';
import { Form } from 'shacl-form-react';
import Input from '@ldfields/default-react';
import { RdfObjectProxy } from 'rdf-object-proxy';
import { RdfObjectLoader } from 'rdf-object';
import { termToString } from 'rdf-string-ttl';
import { Parser } from 'n3';
import * as fs from 'fs';
import dedent from 'dedent';
import Selection from 'sparql-search-bar';
async function getShacl(quads, _resource) {
    const loader = new RdfObjectLoader({ context });
    await loader.importArray(await quads);
    const resource = loader.resources[`${await _resource}`];
    return RdfObjectProxy(resource);
}
// The JSON-LD context for resolving properties
export const context = {
    "@context": {
        "@vocab": "http://www.w3.org/ns/shacl#",
        rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        sh$property: "property",
        mf: "http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#",
        include: "mf:include",
        entries: "mf:entries",
    },
};
export default () => {
    // @ts-ignore
    const [{ shaclEngine, shaclValue, dataEngine, dataValue, shacl, data, shaclPaths }, dispatch] = useReducer((s, a) => {
        console.log("use reducer called");
        const result = { ...s, ...a };
        let shacl = undefined;
        if (result.shaclEngine && result.shaclValue && (a.shaclEngine || a.shaclValue)) {
            console.log('pre create shacl object');
            let quads = [];
            const parser = new Parser();
            for (const path of result.shaclPaths) {
                // quads = [];
                quads = [...quads, ...parser.parse(fs.readFileSync(path).toString())];
            }
            shacl = getShacl(quads, result.shaclValue?.value);
        }
        let data = undefined;
        if (result.dataEngine && result.dataValue && (a.dataEngine || a.dataValue)) {
            console.log('pre create path factory');
            data = new PathFactory({ context: {}, queryEngine: result.dataEngine });
            // @ts-ignore
            data = data?.create({ subject: namedNode(result.dataValue.value) });
        }
        return { ...result, ...(shacl ? { shacl } : {}), ...(data ? { data } : {}), count: result.count + 1 };
    }, {
        // @ts-ignore
        dataEngine: new ComunicaEngine(),
        // @ts-ignore
        shaclEngine: new ComunicaEngine(),
        dataValue: undefined,
        shaclValue: undefined,
        shaclPaths: [],
        shacl: undefined,
        data: undefined,
        count: 0
    });
    // @ts-ignore
    const [{ validities, updates, count, my_data }, setValidities] = useReducer(
    // @ts-ignore
    (s, a) => {
        if (a === 'applyUpdate') {
            const additions = Object.values(s.updates).map(x => x.insert).flat();
            const deletions = Object.values(s.updates).map(x => x.delete).flat();
            const query = dedent `
      ${deletions.length > 0 ? `DELETE {
        ${deletions.map(quad => `${termToString(quad.subject)} ${termToString(quad.predicate)} ${termToString(quad.object)} .`).join('')}
      } ` : ''}
      ${additions.length > 0 ? `INSERT {
        ${additions.map(quad => `${termToString(quad.subject)} ${termToString(quad.predicate)} ${termToString(quad.object)} .`).join('')}
      } ` : ''}
      WHERE {}
      `;
            console.log(dataEngine, dataEngine._engine, dataEngine._sources, query);
            // @ts-ignore
            (async () => dataEngine._engine.query(query, { sources: await dataEngine._sources }).then(r => {
                console.log('query engine response on submit', r);
            }))();
            return { count: s.count + 1, validities: {}, updates: {} };
        }
        const updates = {
            ...s.updates,
            [a.path.map((x) => `${x.value}`).join("&")]: {
                insert: a.insert,
                delete: a.delete,
            },
        };
        return {
            validities: {
                ...s.validities,
                [`${a.path[a.path.length - 1].value}`]: a.valid,
            },
            updates,
            count: s.count,
            my_data: s.my_data //getData(data, dataNode, store),
        };
    }, { validities: {}, updates: {}, count: 0 });
    console.log("app data", validities, updates, count);
    return (React.createElement(React.Fragment, null,
        "Data File(s) Selection:",
        React.createElement("input", { type: "file", accept: ".ttl", multiple: true, onChange: (e) => {
                let paths = [];
                // @ts-ignore
                for (const file of e.target.files) {
                    paths.push(file.path);
                }
                dispatch({ dataEngine: new ComunicaEngine(paths) });
            } }),
        React.createElement(Selection, { queryEngine: dataEngine, pathFactory: new PathFactory({ context: {}, engine: dataEngine }), 
            // @ts-ignore
            value: {
                value: dataValue?.value,
                termType: dataValue?.termType
            }, onChange: e => { dispatch({ dataValue: e }); } }),
        React.createElement("br", null),
        "SHACL File(s) Selection:",
        React.createElement("input", { type: "file", accept: ".ttl", multiple: true, onChange: (e) => {
                let paths = [];
                // @ts-ignore
                for (const file of e.target.files) {
                    paths.push(file.path);
                }
                dispatch({ shaclEngine: new ComunicaEngine(paths), shaclPaths: paths });
            } }),
        React.createElement(Selection, { queryEngine: shaclEngine, pathFactory: new PathFactory({ context: {}, engine: shaclEngine }), 
            // @ts-ignore
            value: {
                value: shaclValue?.value,
                termType: shaclValue?.termType
            }, onChange: e => {
                dispatch({ shaclValue: e });
            } }),
        React.createElement("br", null),
        React.createElement(Form, { key: count, onChange: setValidities, queryEngine: dataEngine, pathFactory: new PathFactory({ context, queryEngine: dataEngine }), draggable: false, shape: shacl, data: data, Input: Input }),
        React.createElement("button", { type: 'button', onClick: e => {
                // @ts-ignore
                setValidities('applyUpdate');
            } }, "Submit")));
};
