# 引用静态资源

Rsbuild 支持在代码中引用图片、字体、媒体类型的静态资源。

:::tip 什么是静态资源
静态资源是指 Web 应用中不会发生变化的文件。常见的静态资源包括图片、字体、视频、样式表和 JavaScript 文件。这些资源通常存储在服务器或 CDN 上，当用户访问 Web 应用时会被传送到用户的浏览器。由于它们不会发生变化，静态资源可以被浏览器缓存，从而提高 Web 应用的性能。
:::

## 静态资源格式

以下是 Rsbuild 默认支持的静态资源格式：

- **图片**：png、jpg、jpeg、gif、svg、bmp、webp、ico、apng、avif、tif、tiff、jfif、pjpeg、pjp。
- **字体**：woff、woff2、eot、ttf、otf、ttc。
- **音频**：mp3、wav、flac、aac、m4a、opus。
- **视频**：mp4、webm、ogg、mov。

如果你需要引用其他格式的静态资源，请参考 [扩展静态资源类型](#扩展静态资源类型)。

:::tip SVG 图片
SVG 图片是一种特殊情况，Rsbuild 提供了 SVG 转 React 组件的能力，对 SVG 进行单独处理，详见 [SVGR 插件](/plugins/list/plugin-svgr)。
:::

## 在 JS 文件中引用

在 JS 文件中，可以直接通过 `import` 的方式引用相对路径下的静态资源：

```tsx
// 引用 static 目录下的 logo.png 图片
import logo from './static/logo.png';

export default = () => <img src={logo} />;
```

也支持使用[路径别名](/guide/advanced/alias)来引用：

```tsx
import logo from '@/static/logo.png';

export default = () => <img src={logo} />;
```

## 在 CSS 文件中引用

在 CSS 文件中，可以引用相对路径下的静态资源：

```css
.logo {
  background-image: url('../static/logo.png');
}
```

也支持使用[路径别名](/guide/advanced/alias)来引用：

```css
.logo {
  background-image: url('@/static/logo.png');
}
```

## 引用结果

引用静态资源的结果取决于文件体积：

- 当文件体积大于 10KB 时，会返回一个 URL，同时文件会被输出到构建产物目录下。
- 当文件体积小于 10KB 时，会自动被内联为 Base64 格式。

```js
import largeImage from './static/largeImage.png';
import smallImage from './static/smallImage.png';

console.log(largeImage); // "/static/largeImage.6c12aba3.png"
console.log(smallImage); // "data:image/png;base64,iVBORw0KGgo..."
```

关于资源内联的更详细介绍，请参考 [静态资源内联](/guide/optimization/inline-assets) 章节。

## 构建产物

当静态资源被引用后，会自动被输出到构建产物的目录下，你可以：

- 通过 [output.filename](/config/output/filename) 来修改产物的文件名。
- 通过 [output.distPath](/config/output/dist-path) 来修改产物的输出路径。

请阅读 [构建产物目录](/guide/basic/output-files) 来了解更多细节。

## URL 前缀

引用静态资源后返回的 URL 中会自动包含路径前缀：

- 在开发环境下，通过 [dev.assetPrefix](/config/dev/asset-prefix) 设置路径前缀。
- 在生产环境下，通过 [output.assetPrefix](/config/output/asset-prefix) 设置路径前缀。

比如将 `output.assetPrefix` 设置为 `https://modern.com`：

```js
import logo from './static/logo.png';

console.log(logo); // "https://modern.com/static/logo.6c12aba3.png"
```

## 类型声明

当你在 TypeScript 代码中引用静态资源时，TypeScript 可能会提示该模块缺少类型定义：

```
TS2307: Cannot find module './logo.png' or its corresponding type declarations.
```

此时你需要为静态资源添加类型声明文件，请在项目中创建 `src/env.d.ts` 文件，并添加相应的类型声明。

- 方法一：如果项目里安装了 `@rsbuild/core` 包，你可以直接引用 `@rsbuild/core` 提供的类型声明：

```ts
/// <reference types="@rsbuild/core/types" />
```

- 方法二：手动添加需要的类型声明：

```ts title="src/env.d.ts"
// 以 png 图片为例
declare module '*.png' {
  const content: string;
  export default content;
}
```

添加类型声明后，如果依然存在上述错误提示，请尝试重启当前 IDE，或者调整 `env.d.ts` 所在的目录，使 TypeScript 能够正确识别类型定义。

## 扩展静态资源类型

如果 Rsbuild 内置的静态资源类型不能满足你的需求，那么你可以通过 [tools.rspack](/config/tools/rspack) 来修改内置的 Rspack 配置，并扩展你需要的静态资源类型。

比如，你需要把 `*.pdf` 文件当做静态资源直接输出到产物目录，可以添加以下配置：

```ts title="rsbuild.config.ts"
export default {
  tools: {
    rspack(config, { addRules }) {
      addRules([
        {
          test: /\.pdf$/,
          // 将资源转换为单独的文件，并且导出产物地址
          type: 'asset/resource',
        },
      ]);
    },
  },
};
```

添加以上配置后，你就可以在代码里引用 `*.pdf` 文件了，比如：

```js
import myFile from './static/myFile.pdf';

console.log(myFile); // "/static/myFile.6c12aba3.pdf"
```

关于 asset modules 的更多介绍，请参考 [Rspack - Asset modules](https://rspack.dev/guide/asset-module#asset-modules)。

## 自定义规则

在某些场景下，你可能需要跳过 Rsbuild 内置的静态资源处理规则，并添加一些自定义规则。

以 PNG 图片为例，你需要：

1. 通过 [tools.bundlerChain](/config/tools/bundler-chain) 来修改内置的 Rspack 配置，通过 `exclude` 排除 `.png` 文件。
2. 通过 [tools.rspack](/config/tools/rspack) 来添加自定义的静态资源处理规则。

```ts title="rsbuild.config.ts"
export default {
  tools: {
    bundlerChain(chain, { CHAIN_ID }) {
      chain.module
        // 通过 `CHAIN_ID.RULE.IMAGE` 来定位到内置的图片规则
        .rule(CHAIN_ID.RULE.IMAGE)
        .exclude.add(/\.png$/);
    },
    rspack(config, { addRules }) {
      addRules([
        {
          test: /\.png$/,
          // 添加一个自定义的 loader 来处理 png 图片
          loader: 'custom-png-loader',
        },
      ]);
    },
  },
};
```

## 图片格式

在使用图片资源时，你可以根据下方表格中图片的优缺点以及适用场景，来选择合适的图片格式。

| 格式 | 优点                                                             | 缺点                                   | 适用场景                                                                     |
| ---- | ---------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------- |
| PNG  | 无损压缩，不会丢失图片细节，不失真，支持半透明                   | 不适合色表复杂的图片                   | 适合颜色数量少，边界层次分明的图片，适合用在 logo、icon、透明图等场景        |
| JPG  | 颜色丰富                                                         | 有损压缩，会导致图片失真，不支持透明度 | 适合颜色数量多，颜色带有渐变、过度复杂的图片，适合用在人像照片、风景图等场景 |
| WebP | 同时支持有损压缩与无损压缩，支持透明度，体积比 PNG 和 JPG 小很多 | iOS 兼容性不好                         | 几乎任何场景的像素图片，支持 WebP 的宿主环境，都应该首选 WebP 图片格式       |
| SVG  | 无损格式，不失真,支持透明度                                      | 不适合复杂图形                         | 适合矢量图,适合用于 icon                                                     |
