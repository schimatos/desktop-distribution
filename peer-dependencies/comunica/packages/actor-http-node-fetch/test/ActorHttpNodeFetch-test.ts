import { ActorHttp, KEY_CONTEXT_INCLUDE_CREDENTIALS, KEY_CONTEXT_AUTH } from '@comunica/bus-http';
import { ActionContext, Bus, KEY_CONTEXT_LOG } from '@comunica/core';
import { LoggerVoid } from '@comunica/logger-void';
import { ActorHttpNodeFetch } from '../lib/ActorHttpNodeFetch';

// Mock fetch
(<any> global).fetch = (input: any, init: any) => {
  return Promise.resolve({ status: input.url === 'https://www.google.com/' ? 200 : 404 });
};

describe('ActorHttpNodeFetch', () => {
  let bus: any;

  beforeEach(() => {
    bus = new Bus({ name: 'bus' });
    jest.clearAllMocks();
  });

  describe('The ActorHttpNodeFetch module', () => {
    it('should be a function', () => {
      expect(ActorHttpNodeFetch).toBeInstanceOf(Function);
    });

    it('should be a ActorHttpNodeFetch constructor', () => {
      expect(new (<any> ActorHttpNodeFetch)({ name: 'actor', bus })).toBeInstanceOf(ActorHttpNodeFetch);
      expect(new (<any> ActorHttpNodeFetch)({ name: 'actor', bus })).toBeInstanceOf(ActorHttp);
    });

    it('should not be able to create new ActorHttpNodeFetch objects without \'new\'', () => {
      expect(() => { (<any> ActorHttpNodeFetch)(); }).toThrow();
    });
  });

  describe('#createUserAgent', () => {
    it('should create a user agent in the browser', () => {
      (<any> global).navigator = { userAgent: 'Dummy' };
      return expect(ActorHttpNodeFetch.createUserAgent())
        .toEqual(`Comunica/actor-http-node-fetch (Browser-${global.navigator.userAgent})`);
    });

    it('should create a user agent in Node.js', () => {
      delete (<any> global).navigator;
      return expect(ActorHttpNodeFetch.createUserAgent())
        .toEqual(`Comunica/actor-http-node-fetch (Node.js ${process.version}; ${process.platform})`);
    });
  });

  describe('An ActorHttpNodeFetch instance', () => {
    let actor: ActorHttpNodeFetch;

    beforeEach(() => {
      actor = new ActorHttpNodeFetch({ name: 'actor', bus });
    });

    it('should test', () => {
      return expect(actor.test({ input: <Request> { url: 'https://www.google.com/' }})).resolves
        .toEqual({ time: Infinity });
    });

    it('should run on an existing URI', () => {
      return expect(actor.run({ input: <Request> { url: 'https://www.google.com/' }})).resolves
        .toMatchObject({ status: 200 });
    });

    it('should run on an non-existing URI', () => {
      return expect(actor.run({ input: <Request> { url: 'https://www.google.com/notfound' }})).resolves
        .toMatchObject({ status: 404 });
    });

    it('should run for an input object and log', async() => {
      const spy = jest.spyOn(actor, <any> 'logInfo');
      await actor.run({ input: 'https://www.google.com/' });
      expect(spy).toHaveBeenCalledWith(undefined, 'Requesting https://www.google.com/', expect.anything());
    });

    it('should run for an input string and log', async() => {
      const spy = jest.spyOn(actor, <any> 'logInfo');
      await actor.run({ input: <Request> { url: 'https://www.google.com/' }});
      expect(spy).toHaveBeenCalledWith(undefined, 'Requesting https://www.google.com/', expect.anything());
    });

    it('should run without KEY_CONTEXT_INCLUDE_CREDENTIALS', async() => {
      const spy = jest.spyOn(global, 'fetch');
      await actor.run({
        input: <Request> { url: 'https://www.google.com/' },
        context: ActionContext({}),
      });
      expect(spy).toHaveBeenCalledWith({ url: 'https://www.google.com/' },
        { headers: new Headers({ 'user-agent': (<any> actor).userAgent }) });
    });

    it('should run with KEY_CONTEXT_INCLUDE_CREDENTIALS', async() => {
      const spy = jest.spyOn(global, 'fetch');
      await actor.run({
        input: <Request> { url: 'https://www.google.com/' },
        context: ActionContext({
          [KEY_CONTEXT_INCLUDE_CREDENTIALS]: true,
        }),
      });
      expect(spy).toHaveBeenCalledWith({ url: 'https://www.google.com/' }, {
        credentials: 'include',
        headers: new Headers({ 'user-agent': (<any> actor).userAgent }),
      });
    });

    it('should run with authorization', async() => {
      const spy = jest.spyOn(global, 'fetch');
      await actor.run({
        input: <Request> { url: 'https://www.google.com/' },
        context: ActionContext({
          [KEY_CONTEXT_AUTH]: 'user:password',
        }),
      });
      expect(spy).toHaveBeenCalledWith(
        { url: 'https://www.google.com/' },
        { headers: new Headers({
          Authorization: `Basic ${Buffer.from('user:password').toString('base64')}`,
          'user-agent': (<any> actor).userAgent,
        }) },
      );
    });

    it('should run with authorization and init.headers undefined', async() => {
      const spy = jest.spyOn(global, 'fetch');
      await actor.run({
        input: <Request> { url: 'https://www.google.com/' },
        init: {},
        context: ActionContext({
          [KEY_CONTEXT_AUTH]: 'user:password',
        }),
      });
      expect(spy).toHaveBeenCalledWith(
        { url: 'https://www.google.com/' },
        { headers: new Headers({
          Authorization: `Basic ${Buffer.from('user:password').toString('base64')}`,
          'user-agent': (<any> actor).userAgent,
        }) },
      );
    });

    it('should run with authorization and already header in init', async() => {
      const spy = jest.spyOn(global, 'fetch');

      await actor.run({
        input: <Request> { url: 'https://www.google.com/' },
        init: { headers: new Headers({ 'Content-Type': 'image/jpeg' }) },
        context: ActionContext({
          [KEY_CONTEXT_AUTH]: 'user:password',
        }),
      });
      expect(spy).toHaveBeenCalledWith(
        { url: 'https://www.google.com/' },
        { headers: new Headers({
          Authorization: `Basic ${Buffer.from('user:password').toString('base64')}`,
          'Content-Type': 'image/jpeg',
          'user-agent': (<any> actor).userAgent,
        }) },
      );
    });

    it('should run with a logger', async() => {
      const logger = new LoggerVoid();
      const spy = spyOn(logger, 'info');
      await actor.run({
        input: <Request> { url: 'https://www.google.com/' },
        init: { headers: new Headers({ a: 'b' }) },
        context: ActionContext({ [KEY_CONTEXT_LOG]: logger }),
      });
      expect(spy).toHaveBeenCalledWith('Requesting https://www.google.com/', {
        actor: 'actor',
        headers: { a: 'b', 'user-agent': (<any> actor).userAgent },
      });
    });

    it('should run with a logger without init', async() => {
      const logger = new LoggerVoid();
      const spy = spyOn(logger, 'info');
      await actor.run({
        input: <Request> { url: 'https://www.google.com/' },
        context: ActionContext({ [KEY_CONTEXT_LOG]: logger }),
      });
      expect(spy).toHaveBeenCalledWith('Requesting https://www.google.com/', {
        actor: 'actor',
        headers: { 'user-agent': (<any> actor).userAgent },
      });
    });

    it('should set no user agent if one has been set', async() => {
      const spy = jest.spyOn(global, 'fetch');
      await actor.run({
        input: <Request> { url: 'https://www.google.com/' },
        init: { headers: new Headers({ 'user-agent': 'b' }) },
      });
      expect(spy).toHaveBeenCalledWith({ url: 'https://www.google.com/' },
        { headers: new Headers({ 'user-agent': 'b' }) });
    });

    it('should set a user agent if none has been set', async() => {
      const spy = jest.spyOn(global, 'fetch');
      await actor.run({
        input: <Request> { url: 'https://www.google.com/' },
        init: { headers: new Headers({}) },
      });
      expect(spy).toHaveBeenCalledWith({ url: 'https://www.google.com/' },
        { headers: new Headers({ 'user-agent': (<any> actor).userAgent }) });
    });
  });
});
