import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-serif mb-4">Something went wrong</h2>
          <p className="text-ash-muted mb-6 max-w-md text-sm">
            We apologize for the inconvenience. An unexpected error has occurred.
          </p>
          <button
            className="bg-ash text-white px-6 py-3 text-xs uppercase tracking-widest font-semibold hover:bg-ash/90 transition-colors"
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
