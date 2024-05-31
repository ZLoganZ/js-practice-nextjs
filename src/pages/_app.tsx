import '@/styles/globals.css';
import { useState, type ReactElement, type ReactNode } from 'react';
import { HydrationBoundary, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useIsomorphicLayoutEffect } from 'react-use';

import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const [queryClient] = useState(() => new QueryClient());
  const getLayout = Component.getLayout ?? ((page) => page);

  useIsomorphicLayoutEffect(() => {
    document.body.className = cn('min-h-screen bg-background font-sans antialiased', inter.variable);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={pageProps.dehydratedState}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          {getLayout(<Component {...pageProps} />)}
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </HydrationBoundary>
    </QueryClientProvider>
  );
}
