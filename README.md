# Skeleton StoryBook for Next.js
___

Copyright 2022. mornya. All rights reserved.

## About
TypeScript + Next.js용 스토리북 설정이 조합된 스켈레톤 프로젝트

## Features
- [StoryBook@6](https://storybook.js.org/) supported.
- [Next.js](https://nextjs.org/) project bootstrapped with [create-next-app](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) .
- Code developed primarily of [TypeScript](https://www.typescriptlang.org) and ES6+.
- Using [Lintest CLI](https://npmjs.com/package/@lintest/cli), an integrated tool for code quality.

## Project Setup
```shell
$ npm install -g @lintest/cli

$ cd skeleton-storybook-next
$ npm install
$ lintest install

# IDE 내 Lint/test를 위한 *.config.json 파일 생성
$ lintest export
```

## Project Operating

### Runs in local for development
아래 명령으로 스토리북 로컬 서버를 기동한다.
```shell
$ npm run storybook
```
로컬 개발서버가 정상적으로 기동되면 자동으로 브라우저가 열리며 접속된다.

## Code Quality improvements

### Lints and fixes files
[Lintest CLI](https://www.npmjs.com/package/@lintest/cli) 를 이용하여 코드 린트 및 테스트케이스 수행.

## License
프로젝트 라이센스는 [LICENSE](https://mornya.github.io/documents/LICENSE-MIT) 참조.
