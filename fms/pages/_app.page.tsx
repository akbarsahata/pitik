import NavigationBar from "@components/molecules/NavigationBar/NavigationBar";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "antd/dist/antd.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/globals.css";

function MyApp({ Component, pageProps, ...appProps }: AppProps) {
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  const getContent = () => {
    if ([`/login`].includes(appProps.router.pathname))
      return (
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""}
        >
          <QueryClientProvider client={queryClient}>
            <>
              <Component {...pageProps} />
            </>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </GoogleOAuthProvider>
      );

    return (
      <QueryClientProvider client={queryClient}>
        <NavigationBar router={router} />
        <Component {...pageProps} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    );
  };

  return getContent();
}

export default MyApp;
