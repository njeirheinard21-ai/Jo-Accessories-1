import { useEffect } from 'react';
import { AppRouter } from './routes';
import { HelmetProvider } from 'react-helmet-async';
import { Providers } from './providers';
import { authService } from './services/authService';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  useEffect(() => {
    const unsubscribe = authService.init();
    return () => unsubscribe();
  }, []);

  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Providers>
          <AppRouter />
        </Providers>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
