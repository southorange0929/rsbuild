import path from 'node:path';
import {
  SCRIPT_REGEX,
  DEFAULT_BROWSERSLIST,
  applyScriptCondition,
  type RsbuildPlugin,
} from '@rsbuild/shared';
import type { PluginSwcOptions, TransformConfig } from './types';
import {
  applyPluginConfig,
  checkUseMinify,
  removeUselessOptions,
} from './utils';
import { SwcMinimizerPlugin } from './minimizer';

/**
 * In this plugin, we do:
 * - Remove Babel loader if exists
 * - Add our own swc loader
 * - Remove JS minifier
 * - Add swc minifier plugin
 */
export const pluginSwc = (options: PluginSwcOptions = {}): RsbuildPlugin => ({
  name: 'rsbuild-webpack:swc',

  setup(api) {
    if (api.context.bundlerType === 'rspack') {
      return;
    }

    api.modifyBundlerChain({
      order: 'pre',
      handler: async (chain, utils) => {
        const { CHAIN_ID, isProd } = utils;
        const rsbuildConfig = api.getNormalizedConfig();
        const { rootPath } = api.context;

        const swcConfigs = await applyPluginConfig(
          options,
          utils,
          rsbuildConfig,
          rootPath,
        );

        // If babel plugin is used, replace babel-loader
        if (chain.module.rules.get(CHAIN_ID.RULE.JS)) {
          chain.module.rule(CHAIN_ID.RULE.JS).uses.delete(CHAIN_ID.USE.BABEL);
          chain.module.delete(CHAIN_ID.RULE.TS);
        } else {
          applyScriptCondition({
            rule: chain.module.rule(CHAIN_ID.RULE.JS),
            config: rsbuildConfig,
            context: api.context,
            includes: [],
            excludes: [],
          });
        }

        for (let i = 0; i < swcConfigs.length; i++) {
          const { test, include, exclude, swcConfig } = swcConfigs[i];

          const ruleId =
            i > 0 ? CHAIN_ID.RULE.JS + i.toString() : CHAIN_ID.RULE.JS;
          const rule = chain.module.rule(ruleId);

          // Insert swc loader and plugin
          rule
            .test(test || SCRIPT_REGEX)
            .use(CHAIN_ID.USE.SWC)
            .loader(path.resolve(__dirname, './loader'))
            .options(removeUselessOptions(swcConfig) satisfies TransformConfig);

          if (include) {
            for (const extra of include) {
              rule.include.add(extra);
            }
          }

          if (exclude) {
            for (const extra of exclude) {
              rule.exclude.add(extra);
            }
          }
        }

        // first config is the main config
        const mainConfig = swcConfigs[0].swcConfig;

        if (chain.module.rules.get(CHAIN_ID.RULE.JS_DATA_URI)) {
          chain.module
            .rule(CHAIN_ID.RULE.JS_DATA_URI)
            .uses.delete(CHAIN_ID.USE.BABEL)
            .end();
        }

        chain.module
          .rule(CHAIN_ID.RULE.JS_DATA_URI)
          .mimetype({
            or: ['text/javascript', 'application/javascript'],
          })
          // compatible with legacy packages with type="module"
          // https://github.com/webpack/webpack/issues/11467
          .resolve.set('fullySpecified', false)
          .end()
          .use(CHAIN_ID.USE.SWC)
          .loader(path.resolve(__dirname, './loader'))
          .options(removeUselessOptions(mainConfig) satisfies TransformConfig);

        if (checkUseMinify(mainConfig, rsbuildConfig, isProd)) {
          // Insert swc minify plugin
          // @ts-expect-error webpack-chain missing minimizers type
          const minimizersChain = chain.optimization.minimizers;

          if (mainConfig.jsMinify !== false) {
            minimizersChain.delete(CHAIN_ID.MINIMIZER.JS).end();
          }

          if (mainConfig.cssMinify !== false) {
            minimizersChain.delete(CHAIN_ID.MINIMIZER.CSS).end();
          }

          minimizersChain
            .end()
            .minimizer(CHAIN_ID.MINIMIZER.SWC)
            .use(SwcMinimizerPlugin, [
              {
                jsMinify: mainConfig.jsMinify ?? mainConfig.jsc?.minify,
                cssMinify: mainConfig.cssMinify,
                rsbuildConfig,
              },
            ]);
        }
      },
    });
  },
});

/// default swc configuration
export function getDefaultSwcConfig(): TransformConfig {
  const cwd = process.cwd();
  return {
    cwd,
    jsc: {
      externalHelpers: true,
      parser: {
        tsx: true,
        syntax: 'typescript',
        decorators: true,
      },
      transform: {
        react: {
          runtime: 'automatic',
        },
      },
      // Avoid the webpack magic comment to be removed
      // https://github.com/swc-project/swc/issues/6403
      preserveAllComments: true,
    },
    sourceMaps: true,
    env: {
      targets: DEFAULT_BROWSERSLIST.web.join(', '),
    },
  };
}
