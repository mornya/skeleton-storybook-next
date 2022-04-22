import * as NextImage from 'next/image';
import * as NextLink from 'next/link';
import '@/assets/scss/globals.scss';

/**
 * "next/image" 비정상 로드 처리
 * @see https://dev.to/jonasmerlin/how-to-use-the-next-js-image-component-in-storybook-1415
 */
const OriginalNextImage = NextImage.default;
Object.defineProperty(NextImage, 'default', {
  configurable: true,
  value: (props) => (
    <OriginalNextImage
      {...props}
      unoptimized
      blurDataURL="data:image/jpeg;base64,/9j/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAADAAQDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAbEAADAAMBAQAAAAAAAAAAAAABAgMABAURUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAFxEAAwEAAAAAAAAAAAAAAAAAAAECEf/aAAwDAQACEQMRAD8Anz9voy1dCI2mectSE5ioFCqia+KCwJ8HzGMZPqJb1oPEf//Z"
    />
  ),
});

/**
 * Mocking "next/link"
 */
Object.defineProperty(NextLink, 'default', {
  configurable: true,
  value: (props) => {
    // 라우트 이동시 알럿 출력 및 이동 무시
    return (
      <span
        onClick={(e) => {
          e.preventDefault();
          window.alert(`실제 페이지에서는 "${props.href}" 경로로 이동합니다.`);
          return false;
        }}
      >
        {props.children}
      </span>
    );
  },
});

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}
