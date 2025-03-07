import type { RsbuildTarget } from './types';

// Defaults
export const DEFAULT_PORT = 8080;
export const DEFAULT_DATA_URL_SIZE = 10000;
export const DEFAULT_MOUNT_ID = 'root';
export const DEFAULT_DEV_HOST = '0.0.0.0';

const DEFAULT_WEB_BROWSERSLIST = [
  'chrome >= 87',
  'edge >= 88',
  'firefox >= 78',
  'safari >= 14',
];

export const DEFAULT_BROWSERSLIST = {
  web: DEFAULT_WEB_BROWSERSLIST,
  'web-worker': DEFAULT_WEB_BROWSERSLIST,
  'service-worker': DEFAULT_WEB_BROWSERSLIST,
  node: ['node >= 16'],
};

// Paths
export const ROOT_DIST_DIR = 'dist';
export const HTML_DIST_DIR = '/';
export const SERVER_DIST_DIR = 'server';
export const SERVER_WORKER_DIST_DIR = 'worker';
export const JS_DIST_DIR = 'static/js';
export const CSS_DIST_DIR = 'static/css';
export const SVG_DIST_DIR = 'static/svg';
export const FONT_DIST_DIR = 'static/font';
export const WASM_DIST_DIR = 'static/wasm';
export const IMAGE_DIST_DIR = 'static/image';
export const MEDIA_DIST_DIR = 'static/media';

// Extensions
export const FONT_EXTENSIONS = ['woff', 'woff2', 'eot', 'ttf', 'otf', 'ttc'];
export const IMAGE_EXTENSIONS = [
  'png',
  'jpg',
  'jpeg',
  'pjpeg',
  'pjp',
  'gif',
  'bmp',
  'webp',
  'ico',
  'apng',
  'avif',
  'tif',
  'tiff',
  'jfif',
];
export const VIDEO_EXTENSIONS = ['mp4', 'webm', 'ogg', 'mov'];
export const AUDIO_EXTENSIONS = ['mp3', 'wav', 'flac', 'aac', 'm4a', 'opus'];
export const DEFAULT_ASSET_PREFIX = '/';

// RegExp
export const HTML_REGEX = /\.html$/;
export const JSON_REGEX = /\.json$/;
export const JS_REGEX = /\.(?:js|mjs|cjs|jsx)$/;
export const TS_REGEX = /\.(?:ts|mts|cts|tsx)$/;
export const SCRIPT_REGEX = /\.(?:js|jsx|mjs|cjs|ts|tsx|mts|cts)$/;
export const TS_AND_JSX_REGEX = /\.(?:ts|tsx|jsx|mts|cts)$/;
export const SVG_REGEX = /\.svg$/;
export const CSS_REGEX = /\.css$/;
export const LESS_REGEX = /\.less$/;
export const SASS_REGEX = /\.s(?:a|c)ss$/;
export const CSS_MODULES_REGEX = /\.module\.\w+$/i;
export const NODE_MODULES_REGEX = /[\\/]node_modules[\\/]/;

export const TS_CONFIG_FILE = 'tsconfig.json';

export const TARGET_ID_MAP: Record<RsbuildTarget, string> = {
  web: 'Client',
  node: 'Server',
  'web-worker': 'Web Worker',
  'service-worker': 'Service Worker',
};
