import { expect, test } from '@playwright/test';
import { build } from '@e2e/helper';

test('should resolve relative asset correctly in SCSS file', async () => {
  const rsbuild = await build({
    cwd: __dirname,
  });
  const files = await rsbuild.unwrapOutputJSON();

  const content =
    files[Object.keys(files).find((file) => file.endsWith('.css'))!];

  expect(content).toContain('background-image:url(/static/image/icon');
});
