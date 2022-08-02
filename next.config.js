const { Files, Log, chalk } = require('@mornya/cli-libs'); // command line spawn tool
const withImages = require('next-images'); // importable images to variable

// Node.js 환경변수 선언 값
const { NODE_ENV, BASE_PATH } = process.env;
/**
 * 프로덕션 모드 여부
 * @type {boolean}
 */
const isProduction = NODE_ENV === 'production';
/**
 * 경로 선언
 * @type {Record<'root'|'pages'|'src'|'scss', string>}
 */
const appPath = {
  root: Files.resolvePath(),
  pages: Files.resolvePath('pages'),
  src: Files.resolvePath('src'),
  scss: Files.resolvePath('src', 'assets', 'scss'),
};

/**
 * Next.js Configuration
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH,
  compress: isProduction, // gzip compression for rendered content and static files
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  reactStrictMode: true,
  images: {
    disableStaticImages: true,
    domains: [
      'mornya.github.io',
    ],
  },
  sassOptions: {
    includePaths: [appPath.scss],
  },
  eslint: { ignoreDuringBuilds: true }, // lintest 사용을 위해 Next.js 자체 린트기능 비활성화 (.eslintrc 파일제거로 해결)
  swcMinify: isProduction, // minification by using SWC

  webpack(config, { isServer, buildId /*, webpack*/ }) {
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
        try {
          const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
          const totalMem = Math.floor(require('os').totalmem() / 1048576); // get OS mem size as MB (totalMem/1024/1024)
          /** @type {import('fork-ts-checker-webpack-plugin/lib/ForkTsCheckerWebpackPluginOptions').ForkTsCheckerWebpackPluginOptions} */
          const nextOption = {
            async: true,
            typescript: {
              enabled: !isProduction,
              configFile: `${appPath.root}/tsconfig.json`,
              memoryLimit: totalMem > 4096 ? undefined : 1024,
            },
            // dev 빌드시 eslint 룰셋 적용한 lint 실행
            eslint: !isProduction
              ? {
                enabled: true,
                files: [`${appPath.pages}/**/*.{ts,tsx,js,jsx}`, `${appPath.src}/**/*.{ts,tsx,js,jsx}`],
                options: require('./node_modules/.cache/lintest/info.json').eslintOptions ?? {},
                memoryLimit: totalMem > 4096 ? undefined : 1024,
              }
              : {},
          };
          config.plugins = config.plugins.filter((plugin) => !(plugin instanceof ForkTsCheckerWebpackPlugin));
          config.plugins.push(new ForkTsCheckerWebpackPlugin(nextOption));
        } catch (e) {
          Log.error('@lintest/cli was not installed or have to run "lintest install"!');
        }
      }
    }

    return config;
  },
};

module.exports = withImages(nextConfig);
