import React from 'react';
import { ConfigProvider } from 'antd/lib';
import { AuthProvider, useAuth } from '@lib/authContext';
import type { AppProps } from 'next/app';
import Layout from '@components/Layout';
import theme from '@theme/themeConfig';
import { useRouter } from 'next/router';
import '@styles/reset.css';

const App = ({ Component, pageProps, router }: AppProps) => {
  return (
    <AuthProvider>
      <ConfigProvider theme={theme}>
        <AppContent
          Component={Component}
          pageProps={pageProps}
          router={router}
        />
      </ConfigProvider>
    </AuthProvider>
  );
};

const AppContent = ({ Component, pageProps }: AppProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && router.pathname !== '/login') {
    router.push('/login');
    return <div>Redirecting to login...</div>;
  }

  return user ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    <Component {...pageProps} />
  );
};

export default App;
