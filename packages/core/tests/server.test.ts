import { rspack } from '@rspack/core';
import {
  mergeDevOptions,
  formatRoutes,
  printServerURLs,
} from '../src/server/helper';
import { isClientCompiler, setupServerHooks } from '@rsbuild/shared';

test('formatRoutes', () => {
  expect(
    formatRoutes(
      {
        index: 'src/index.ts',
        foo: 'src/index.ts',
        bar: 'src/index.ts',
      },
      undefined,
      undefined,
    ),
  ).toEqual([
    {
      entryName: 'index',
      pathname: '/',
    },
    {
      entryName: 'foo',
      pathname: '/foo',
    },
    {
      entryName: 'bar',
      pathname: '/bar',
    },
  ]);

  expect(
    formatRoutes(
      {
        index: 'src/index.ts',
        foo: 'src/index.ts',
      },
      '/hello',
      undefined,
    ),
  ).toEqual([
    {
      entryName: 'index',
      pathname: '/hello/',
    },
    {
      entryName: 'foo',
      pathname: '/hello/foo',
    },
  ]);

  expect(
    formatRoutes(
      {
        index: 'src/index.ts',
        foo: 'src/index.ts',
      },
      '/hello/',
      undefined,
    ),
  ).toEqual([
    {
      entryName: 'index',
      pathname: '/hello/',
    },
    {
      entryName: 'foo',
      pathname: '/hello/foo',
    },
  ]);

  expect(
    formatRoutes(
      {
        foo: 'src/index.ts',
        bar: 'src/index.ts',
        index: 'src/index.ts',
      },
      undefined,
      undefined,
    ),
  ).toEqual([
    {
      entryName: 'index',
      pathname: '/',
    },
    {
      entryName: 'foo',
      pathname: '/foo',
    },
    {
      entryName: 'bar',
      pathname: '/bar',
    },
  ]);

  expect(
    formatRoutes(
      {
        foo: 'src/index.ts',
      },
      undefined,
      undefined,
    ),
  ).toEqual([
    {
      entryName: 'foo',
      pathname: '/foo',
    },
  ]);

  expect(
    formatRoutes(
      {
        index: 'src/index.ts',
        foo: 'src/index.ts',
        bar: 'src/index.ts',
      },
      'html',
      undefined,
    ),
  ).toEqual([
    {
      entryName: 'index',
      pathname: '/html/',
    },
    {
      entryName: 'foo',
      pathname: '/html/foo',
    },
    {
      entryName: 'bar',
      pathname: '/html/bar',
    },
  ]);

  expect(
    formatRoutes(
      {
        index: 'src/index.ts',
      },
      'html',
      'nested',
    ),
  ).toEqual([
    {
      entryName: 'index',
      pathname: '/html/index',
    },
  ]);
});

test('printServerURLs', () => {
  let message: string | undefined;

  message = printServerURLs({
    port: 8080,
    protocol: 'http',
    urls: [
      {
        url: 'http://localhost:8080',
        label: 'local',
      },
      {
        url: 'http://10.94.62.193:8080/',
        label: 'network',
      },
    ],
    routes: [
      {
        entryName: 'index',
        pathname: '/',
      },
    ],
  });

  expect(message!).toMatchInlineSnapshot(`
    "  > local     http:/localhost:8080/
      > network   http:/10.94.62.193:8080/
    "
  `);

  message = printServerURLs({
    port: 8080,
    protocol: 'http',
    urls: [
      {
        url: 'http://localhost:8080',
        label: 'local',
      },
      {
        url: 'http://10.94.62.193:8080/',
        label: 'network',
      },
    ],
    routes: [
      {
        entryName: 'index',
        pathname: '/',
      },
      {
        entryName: 'foo',
        pathname: '/html/foo',
      },
      {
        entryName: 'bar',
        pathname: '/bar',
      },
    ],
  });

  expect(message!).toMatchInlineSnapshot(`
    "  > local
      - index    http:/localhost:8080/
      - foo      http:/localhost:8080/html/foo
      - bar      http:/localhost:8080/bar

      > network
      - index    http:/10.94.62.193:8080/
      - foo      http:/10.94.62.193:8080/html/foo
      - bar      http:/10.94.62.193:8080/bar
    "
  `);
});

describe('test dev server', () => {
  test('should setupServerHooks correctly', () => {
    const compiler = rspack({});
    const onDoneFn = vi.fn();
    const onInvalidFn = vi.fn();

    setupServerHooks(compiler, {
      onDone: onDoneFn,
      onInvalid: onInvalidFn,
    });

    const isOnDoneRegistered = compiler.hooks.done.taps.some(
      (tap) => tap.fn === onDoneFn,
    );

    expect(isOnDoneRegistered).toBeTruthy();

    const isCompileHookRegistered = compiler.hooks.compile.taps.some(
      (tap) => tap.fn === onInvalidFn,
    );

    expect(isCompileHookRegistered).toBeTruthy();

    const isInvalidHookRegistered = compiler.hooks.invalid.taps.some(
      (tap) => tap.fn === onInvalidFn,
    );

    expect(isInvalidHookRegistered).toBeTruthy();
  });
  test('should not setupServerHooks when compiler is server', () => {
    const compiler = rspack({
      name: 'server',
    });
    const onDoneFn = vi.fn();
    const onInvalidFn = vi.fn();

    setupServerHooks(compiler, {
      onDone: onDoneFn,
      onInvalid: onInvalidFn,
    });

    const isOnDoneRegistered = compiler.hooks.done.taps.some(
      (tap) => tap.fn === onDoneFn,
    );

    expect(isOnDoneRegistered).toBeFalsy();
  });

  test('check isClientCompiler', () => {
    expect(isClientCompiler(rspack({}))).toBeTruthy();

    expect(
      isClientCompiler(
        rspack({
          target: ['web', 'es5'],
        }),
      ),
    ).toBeTruthy();

    expect(
      isClientCompiler(
        rspack({
          target: 'node',
        }),
      ),
    ).toBeFalsy();

    expect(
      isClientCompiler(
        rspack({
          target: ['node'],
        }),
      ),
    ).toBeFalsy();
  });

  test('getDevServerOptions', async () => {
    expect(
      mergeDevOptions({
        rsbuildConfig: {},
        port: 8080,
      }),
    ).toMatchInlineSnapshot(`
      {
        "client": {
          "host": "",
          "path": "/rsbuild-hmr",
          "port": "8080",
          "protocol": "",
        },
        "writeToDisk": false,
      }
    `);

    expect(
      mergeDevOptions({
        rsbuildConfig: {
          dev: {
            hmr: false,
            client: {
              host: '',
              path: '',
            },
          },
        },
        port: 8081,
      }),
    ).toMatchInlineSnapshot(`
      {
        "client": {
          "host": "",
          "path": "",
          "port": "8081",
          "protocol": "",
        },
        "hmr": false,
        "writeToDisk": false,
      }
    `);
  });
});
