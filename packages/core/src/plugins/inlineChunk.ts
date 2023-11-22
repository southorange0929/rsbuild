import {
  pick,
  JS_REGEX,
  CSS_REGEX,
  isHtmlDisabled,
  type InlineChunkTest,
} from '@rsbuild/shared';
import type { RsbuildPlugin } from '../types';

export const pluginInlineChunk = (): RsbuildPlugin => ({
  name: 'rsbuild:inline-chunk',

  setup(api) {
    api.modifyBundlerChain(
      async (chain, { target, CHAIN_ID, isProd, HtmlPlugin }) => {
        const config = api.getNormalizedConfig();

        if (isHtmlDisabled(config, target) || !isProd) {
          return;
        }

        const { InlineChunkHtmlPlugin } = await import('@rsbuild/shared');

        const {
          inlineStyles,
          // todo: not support inlineScripts in Rspack yet, which will take unknown build error
          inlineScripts,
        } = config.output;

        const scriptTests: InlineChunkTest[] = [];
        const styleTests: InlineChunkTest[] = [];

        if (inlineScripts) {
          scriptTests.push(inlineScripts === true ? JS_REGEX : inlineScripts);
        }

        if (inlineStyles) {
          styleTests.push(inlineStyles === true ? CSS_REGEX : inlineStyles);
        }

        if (!scriptTests.length && !styleTests.length) {
          return;
        }

        chain.plugin(CHAIN_ID.PLUGIN.INLINE_HTML).use(InlineChunkHtmlPlugin, [
          HtmlPlugin,
          {
            styleTests,
            scriptTests,
            distPath: pick(config.output.distPath, ['js', 'css']),
          },
        ]);
      },
    );
  },
});
