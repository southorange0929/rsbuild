import { build } from '@e2e/helper';
import { expect, test } from '@playwright/test';
import { cases, shareTest, copyPkgToNodeModules, findEntry } from './helper';

test('should import with template config', async () => {
  copyPkgToNodeModules();

  const rsbuild = await build({
    cwd: __dirname,
    rsbuildConfig: {
      source: {
        transformImport: [
          {
            libraryName: 'foo',
            customName: 'foo/lib/{{ member }}',
          },
        ],
      },
      performance: {
        chunkSplit: {
          strategy: 'all-in-one',
        },
      },
    },
  });
  const files = await rsbuild.unwrapOutputJSON(false);
  const entry = findEntry(files);
  expect(files[entry]).toContain('transformImport test succeed');
});

cases.forEach((c) => {
  const [name, entry, config] = c;
  shareTest(`${name}-rspack`, entry, config);
});
