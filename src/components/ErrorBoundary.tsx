import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
          <div className="bg-white border-4 border-red-500 rounded-lg p-8 max-w-md w-full shadow-lg">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="text-red-500" size={64} />
            </div>
            <h1 className="text-3xl font-bold text-purple-600 text-center mb-4">
              Oops! Something went wrong
            </h1>
            <p className="text-gray-700 text-center mb-6">
              Don't worry, even cats knock things over sometimes! 🐱
            </p>
            {this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300"
            >
              <RefreshCw size={20} />
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors duration-300"
            >
              Go Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
