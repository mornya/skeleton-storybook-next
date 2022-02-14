import React from 'react';
import type { AppProps } from 'next/app'
import '@/assets/scss/globals.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps}/>;
}

export default MyApp;
