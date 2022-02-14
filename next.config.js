const { Files, Log, chalk } = require('@mornya/cli-libs'); // command line spawn tool
const withImages = require('next-images');

// 프로덕션 모드 여부
const isProduction = process.env.NODE_ENV === 'production';
// 경로 선언
const appPath = {
  root: Files.resolvePath(),
  pages: Files.resolvePath('pages'),
  src: Files.resolvePath('src'),
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  webpack5: true,
  amp: false,
  esModule: true,
  inlineImageLimit: 16384,
  cssLoaderOptions: {
    importLoaders: 1,
    localIdentName: '[local]', // '[local]-[hash:base64:5]',
  },
  sassLoaderOptions: {
    sassOptions: {
      includePaths: ['src', 'node_modules'],
    },
    prependData: `
      @import "~@/assets/scss/variables";
    `.trim(),
  },
  eslint: false, // lintest 사용을 위해 Next.js 자체 린트기능 비활성화 (.eslintrc 파일제거로 해결)

  webpack(config, { isServer, buildId, webpack }) {
    // === COMMON BUILD ===

    config.resolve.alias['@'] = appPath.src;
    config.resolve.alias['~'] = appPath.root;
    config.resolve.alias['@@'] = appPath.src;
    config.resolve.alias['~~'] = appPath.root;
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs']; // .js, .jsx 누락시 오류발생함

    if (!isProduction) {
      config.watchOptions = {
        ignored: ['public', 'test', '**/.git/**', '**/node_modules/**', '**/.#*'],
        aggregateTimeout: 300,
        poll: 1000,
      };
      // npm link로 라이브러리 테스트시 false로 설정 필요
      config.resolve.symlinks = false;
    } else {
      Log.progress(`Launching ${isServer ? 'SERVER' : 'CLIENT'} with ${chalk.magentaBright(buildId)}`);
    }

    if (isServer) {
      // === SERVER BUILD ONLY ===
    } else {
      // === CLIENT BUILD ONLY ===
      if (!isProduction) {
        // 타입 체커 실행
        const eslintConfig = {};
        try {
          eslintConfig.eslintOptions = require('./node_modules/.cache/lintest/info.json').eslintOptions;
          eslintConfig.eslint = true;
        } catch (e) {
          Log.error('@lintest/cli was not installed or have to run "lintest install"!');
        }

        /** @type {import('fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPluginOptions').ForkTsCheckerWebpackPluginOptions} */
        const nextOption = {
          async: true,
          typescript: {
            enabled: true,
            configFile: `${appPath.root}/tsconfig.json`,
          },
          // dev 빌드시 eslint 룰셋 적용한 lint 실행
          eslint: !!eslintConfig ? {
            enabled: true,
            files: [
              `${appPath.pages}/**/*.{ts,tsx,js,jsx}`,
              `${appPath.src}/**/*.{ts,tsx,js,jsx}`,
            ],
            options: eslintConfig.eslintOptions || {},
          } : {},
        };
        const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

        config.plugins = config.plugins.filter(plugin => !(
          plugin instanceof ForkTsCheckerWebpackPlugin
        ));
        config.plugins.push(new ForkTsCheckerWebpackPlugin(nextOption));
      }
    }

    return config;
  },
};

module.exports = withImages(nextConfig);
