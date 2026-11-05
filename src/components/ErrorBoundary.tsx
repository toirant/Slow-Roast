import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Check if error is from third-party extension injection
    if (
      error.message?.includes('isZerion') ||
      error.stack?.includes('chrome-extension:')
    ) {
      // Ignored extension error
      return;
    }
    console.error('Unhandled UI error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#EFE7DA] flex items-center justify-center p-4">
          <div className="bg-[#FBF7F0] p-8 rounded-2xl border border-[#DDD2BF] text-center max-w-md shadow-lg">
            <h2
              className="text-2xl font-bold text-[#2B2B28] mb-2"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Something went wrong
            </h2>
            <p className="text-sm text-[#6F6A60] mb-6">
              We encountered an issue rendering this section. Please reload the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-full bg-[#24493A] text-white text-sm font-medium hover:bg-[#1B372C] transition-colors cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
