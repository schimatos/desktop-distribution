import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import LazyFactory from '@jeswr/react-lazy-render';
// import { rdf, rdfs } from '../ontologies';
import rdf from '@ontologies/rdf';
import rdfs from '@ontologies/rdfs';
// @ts-ignore
function ToLabel({ target }) {
    return (React.createElement(React.Fragment, null,
        React.createElement(LazyImageDisplay, { src: target['http://xmlns.com/foaf/0.1/Image'] }),
        React.createElement(LazyTextDisplay, { text: target[rdfs.label.value], fallback: `${target}` }),
        React.createElement(LazyTypeDisplay, { type: target[rdf.type.value] })));
}
const LazyImageDisplay = LazyFactory(async ({ src }) => {
    const resolvedSrc = `${await src}`;
    // TODO: Check mime type here
    if (resolvedSrc !== 'undefined'
        && (await fetch(resolvedSrc, { method: 'HEAD' })).ok) {
        return React.createElement("img", { width: "50px", style: { padding: '5px' }, src: resolvedSrc });
    }
    return React.createElement(React.Fragment, null);
});
const LazyTextDisplay = LazyFactory(async ({ text }) => {
    const resolvedText = `${await text}`;
    if (resolvedText !== 'undefined') {
        return React.createElement(React.Fragment, null, resolvedText);
    }
    return React.createElement(React.Fragment, null);
});
const LazyTypeDisplay = LazyFactory(async ({ type }) => {
    const target = `${await type}`;
    if (target !== 'undefined') {
        return (React.createElement(React.Fragment, null,
            "Inside Lazy Type display",
            ' ',
            "(",
            React.createElement(LazyTextDisplay, { text: 
                // @ts-ignore
                type[rdfs.label.value], fallback: `${target}` }),
            ")"));
    }
    return React.createElement(React.Fragment, null);
});
class PromiseOptions {
    // @ts-ignore
    constructor({ queryEngine, pathFactory }) {
        this.reject = () => { };
        this.resolve = ([]) => { };
        this.promiseOptions = (input, offset = 0, limit = 10) => {
            // Cancel previous call
            // this.reject();
            // this.resolve([])
            const { queryEngine } = this;
            const { pathFactory } = this;
            return new Promise(async (resolve, rej) => {
                // this.reject = rej;
                // this.resolve = resolve;
                const query = `SELECT DISTINCT ?target 
      WHERE { 
        ?target <${rdfs.label}> ?value . FILTER(regex(?value, '${input}', 'i')) 
      } OFFSET ${offset} LIMIT ${limit}`;
                // setTimeout(async () => {
                console.log('calling', query);
                const res = await (await queryEngine).execute(query);
                const optionList = [];
                for await (const elem of res) {
                    const target = await (await pathFactory).create({
                        subject: elem.get('?target'),
                    });
                    optionList.push({
                        label: React.createElement(ToLabel, { target: target }),
                        labelString: 'test String',
                        value: `${target}`,
                        termType: target.termType,
                    });
                }
                resolve(optionList);
                // }, 0);
            });
        };
        this.queryEngine = queryEngine;
        this.pathFactory = pathFactory;
    }
}
export default function IRISelection({ queryEngine, pathFactory, value, 
// label,
// labelString,
// termType,
onChange, }) {
    return (React.createElement(AsyncCreatableSelect, { cacheOptions: true, value: value, loadOptions: (input) => new PromiseOptions({ queryEngine, pathFactory }).promiseOptions(input), onChange: (e) => {
            if (!Array.isArray(e)) {
                // @ts-ignore
                onChange(e);
            }
        } }));
}
