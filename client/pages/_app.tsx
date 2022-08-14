import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function MyApp({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()

  return (
    <>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <NotificationsProvider>
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
          </QueryClientProvider>
        </NotificationsProvider>
      </MantineProvider>
    </>
  )
}

export default MyApp
