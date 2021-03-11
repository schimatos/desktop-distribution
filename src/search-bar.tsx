import React from 'react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import LazyFactory from '@jeswr/react-lazy-render';
// import { rdf, rdfs } from '../ontologies';
import rdf from '@ontologies/rdf';
import rdfs from '@ontologies/rdfs';

// @ts-ignore
function ToLabel({ target }) {
  return (
    <>
      <LazyImageDisplay src={target['http://xmlns.com/foaf/0.1/Image']} />
      <LazyTextDisplay text={target[rdfs.label.value]} fallback={`${target}`} />
      <LazyTypeDisplay type={target[rdf.type.value]} />
    </>
  );
}

const LazyImageDisplay = LazyFactory<{ src: Promise<string> | string }>(
  async ({ src }) => {
    const resolvedSrc = `${await src}`;
    // TODO: Check mime type here
    if (
      resolvedSrc !== 'undefined'
      && (await fetch(resolvedSrc, { method: 'HEAD' })).ok
    ) {
      return <img width="50px" style={{ padding: '5px' }} src={resolvedSrc} />;
    }
    return <></>;
  },
);

const LazyTextDisplay = LazyFactory<{ text: Promise<string> | string }>(
  async ({ text }) => {
    const resolvedText = `${await text}`;
    if (resolvedText !== 'undefined') {
      return <>{resolvedText}</>;
    }
    return <></>
  },
);

const LazyTypeDisplay = LazyFactory<{ type: Promise<string> | string }>(
  async ({ type }) => {
    const target = `${await type}`;
    if (target !== 'undefined') {
      return (
        <>
          Inside Lazy Type display
          {' '}
          (
          <LazyTextDisplay text={
            // @ts-ignore
            type[rdfs.label.value]
          } fallback={`${target}`} />
          )
        </>
      );
    }
    return <></>
  },
);

class PromiseOptions {
  private queryEngine

  private pathFactory

  private reject = () => {};

  private resolve = ([]) => {};
  // @ts-ignore
  constructor({ queryEngine, pathFactory }) {
    this.queryEngine = queryEngine;
    this.pathFactory = pathFactory;
  }

  promiseOptions = (
    input: string,
    offset = 0,
    limit = 10,
  ) => {
    // Cancel previous call
    // this.reject();
    // this.resolve([])
    const { queryEngine } = this;
    const { pathFactory } = this;
    return new Promise<{
      label: JSX.Element,
      labelString: string,
      value: string,
      termType: string
    }[]>(async (resolve, rej) => {
      // this.reject = rej;
      // this.resolve = resolve;
      const query = `SELECT DISTINCT ?target 
      WHERE { 
        ?target <${rdfs.label}> ?value . FILTER(regex(?value, '${input}', 'i')) 
      } OFFSET ${offset} LIMIT ${limit}`;
      // setTimeout(async () => {
      console.log('calling', query);
      const res = await (await queryEngine).execute(query);
      const optionList: {
            label: JSX.Element,
            labelString: string,
            value: string,
            termType: string,
          }[] = [];
      for await (const elem of res) {
        const target = await (await pathFactory).create({
          subject: elem.get('?target'),
        });
        optionList.push({
          label: <ToLabel target={target} />,
          labelString: 'test String',
          value: `${target}`,
          termType: target.termType,
        });
      }
      resolve(optionList);
      // }, 0);
    });
  }
}

export default function IRISelection({
  queryEngine,
  pathFactory,
  value,
  // label,
  // labelString,
  // termType,
  onChange,
}: {
  queryEngine: any;
  pathFactory: any;
  value?: {
    value: string;
    label: JSX.Element;
    labelString: string;
    termType: string;
  };
  onChange: (e: {
    value: string,
    label: JSX.Element,
    labelString: string,
    termType: string,
  }) => void;
}) {
  return (
    <AsyncCreatableSelect
      cacheOptions
      value={value}
      loadOptions={(input) => new PromiseOptions({ queryEngine, pathFactory }).promiseOptions(input)}

      onChange={(e) => {
        if (!Array.isArray(e)) {
          // @ts-ignore
          onChange(e);
        }
      }}
    />
  );
}
