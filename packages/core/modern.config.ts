import { defineConfig } from '@modern-js/module-tools';
import { baseBuildConfig } from '../../scripts/modern.base.config';

export default defineConfig({
  ...baseBuildConfig,
  buildConfig: [
    {
      ...baseBuildConfig.buildConfig,
      input: ['src', '!src/client/hmr'],
    },
    {
      buildType: 'bundle',
      format: 'esm',
      target: 'es5',
      dts: false,
      input: {
        hmr: 'src/client/hmr/index.ts',
      },
      outDir: './dist/client',
      // fix `module.hot` not works (avoid inject module as local variable)
      esbuildOptions: (options) => {
        options.format = undefined;
        return options;
      },
      // bundle shared deps when used in client
      autoExternal: false,
    },
  ],
});
