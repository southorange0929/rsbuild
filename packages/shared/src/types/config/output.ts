import type { RspackConfig } from '../rspack';
import type { RsbuildTarget } from '../rsbuild';
import type { CopyRspackPluginOptions, Externals } from '@rspack/core';

export type DistPathConfig = {
  /** The root directory of all files. */
  root?: string;
  /** The output directory of JavaScript files. */
  js?: string;
  /** The output directory of CSS style files. */
  css?: string;
  /** The output directory of SVG images. */
  svg?: string;
  /** The output directory of font files. */
  font?: string;
  /** The output directory of HTML files. */
  html?: string;
  /** The output directory of Wasm files. */
  wasm?: string;
  /** The output directory of non-SVG images. */
  image?: string;
  /** The output directory of media resources, such as videos. */
  media?: string;
  /** The output directory of server bundles when target is `node`. */
  server?: string;
  /** The output directory of service worker bundles when target is `service-worker`. */
  worker?: string;
};

export type FilenameConfig = {
  /** The name of the JavaScript file. */
  js?: string;
  /** The name of the CSS style file. */
  css?: string;
  /** The name of the SVG image. */
  svg?: string;
  /** The name of the font file. */
  font?: string;
  /** The name of a non-SVG image. */
  image?: string;
  /** The name of a media resource, such as a video. */
  media?: string;
};

export type DataUriLimit = {
  /** The data URI limit of the SVG image. */
  svg?: number;
  /** The data URI limit of the font file. */
  font?: number;
  /** The data URI limit of non-SVG images. */
  image?: number;
  /** The data URI limit of media resources such as videos. */
  media?: number;
};

export type Charset = 'ascii' | 'utf8';

export type LegalComments = 'none' | 'inline' | 'linked';

export type NormalizedDataUriLimit = Required<DataUriLimit>;

export type Polyfill = 'usage' | 'entry' | 'ua' | 'off';

export type SourceMap = {
  js?: RspackConfig['devtool'];
  css?: boolean;
};

export type CssModuleLocalsConvention =
  | 'asIs'
  | 'camelCase'
  | 'camelCaseOnly'
  | 'dashes'
  | 'dashesOnly';

export type CssModules = {
  auto?: boolean | RegExp | ((resourcePath: string) => boolean);
  /**
   * Set the local ident name of CSS modules.
   */
  localIdentName?: string;
  exportLocalsConvention?: CssModuleLocalsConvention;
};

export type CopyPluginOptions = CopyRspackPluginOptions;

export type InlineChunkTestFunction = (params: {
  size: number;
  name: string;
}) => boolean;

export type InlineChunkTest = RegExp | InlineChunkTestFunction;

export interface OutputConfig {
  /**
   * Specify build targets to run in different target environments.
   */
  targets?: RsbuildTarget[];
  /**
   * At build time, prevent some `import` dependencies from being packed into bundles in your code, and instead fetch them externally at runtime.
   * For more information, please see: [webpack Externals](https://webpack.js.org/configuration/externals/)
   */
  externals?: Externals;
  /**
   * Set the directory of the dist files.
   * Rsbuild will output files to the corresponding subdirectory according to the file type.
   */
  distPath?: DistPathConfig;
  /**
   * Sets the filename of dist files.
   */
  filename?: FilenameConfig;
  /**
   * By default, Rsbuild's output is ASCII-only and will escape all non-ASCII characters.
   * If you want to output the original characters without using escape sequences,
   * you can set `output.charset` to `utf8`.
   */
  charset?: Charset;
  /**
   * Configure how the polyfill is injected.
   */
  polyfill?: Polyfill;
  /**
   * When using CDN in the production environment,
   * you can use this option to set the URL prefix of static assets,
   * similar to the output.publicPath config of webpack.
   */
  assetPrefix?: string;
  /**
   * Set the size threshold to inline static assets such as images and fonts.
   * By default, static assets will be Base64 encoded and inline into the page if the size is less than 10KB.
   */
  dataUriLimit?: number | DataUriLimit;
  /**
   * Configure how to handle the legal comment.
   * A "legal comment" is considered to be any statement-level comment in JS or rule-level
   * comment in CSS that contains @license or @preserve or that starts with //! or /\*!.
   * These comments are preserved in output files by default since that follows the intent
   * of the original authors of the code.
   */
  legalComments?: LegalComments;
  /**
   * Whether to clean all files in the dist path before starting compilation.
   */
  cleanDistPath?: boolean;
  /**
   * Allow to custom CSS Modules options.
   */
  cssModules?: CssModules;
  /**
   * Whether to disable code minification in production build.
   */
  disableMinimize?: boolean;
  /**
   * Whether to generate source map files, and which format of source map to generate
   */
  sourceMap?: SourceMap;
  /**
   * Remove the hash from the name of static files after production build.
   */
  disableFilenameHash?: boolean;
  /**
   * Whether to generate a TypeScript declaration file for CSS modules.
   */
  enableCssModuleTSDeclaration?: boolean;
  /**
   * Whether to inline output scripts files (.js files) into HTML with `<script>` tags.
   */
  inlineScripts?: boolean | InlineChunkTest;
  /**
   * Whether to inline output style files (.css files) into html with `<style>` tags.
   */
  inlineStyles?: boolean | InlineChunkTest;
  /**
   * Whether to inject styles into the DOM via `style-loader`.
   */
  injectStyles?: boolean;
  /**
   * Specifies the range of target browsers that the project is compatible with.
   * This value will be used by [@babel/preset-env](https://babeljs.io/docs/en/babel-preset-env) and
   * [autoprefixer](https://github.com/postcss/autoprefixer) to identify the JavaScript syntax that
   * need to be transformed and the CSS browser prefixes that need to be added.
   */
  overrideBrowserslist?: string[] | Partial<Record<RsbuildTarget, string[]>>;
  /**
   * Copies the specified file or directory to the dist directory.
   */
  copy?: CopyPluginOptions | CopyPluginOptions['patterns'];
}

export type OverrideBrowserslist =
  | string[]
  | Partial<Record<RsbuildTarget, string[]>>;

export interface NormalizedOutputConfig extends OutputConfig {
  targets: RsbuildTarget[];
  filename: FilenameConfig;
  distPath: DistPathConfig;
  polyfill: Polyfill;
  sourceMap: {
    js?: RspackConfig['devtool'];
    css: boolean;
  };
  assetPrefix: string;
  dataUriLimit: NormalizedDataUriLimit;
  disableMinimize: boolean;
  disableFilenameHash: boolean;
  enableCssModuleTSDeclaration: boolean;
  inlineScripts: boolean | InlineChunkTest;
  inlineStyles: boolean | InlineChunkTest;
  injectStyles: boolean;
  cssModules: {
    localIdentName?: string;
    exportLocalsConvention: CssModuleLocalsConvention;
    auto?: CssModules['auto'];
  };
}
