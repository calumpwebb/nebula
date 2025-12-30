import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Component stack:", errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen bg-black text-white p-8 font-mono">
          <h1 className="text-xl text-red-500 mb-4">Something went wrong</h1>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap break-words">
            {this.state.error?.message}
          </pre>
          <pre className="text-xs text-gray-500 mt-4 whitespace-pre-wrap break-words">
            {this.state.error?.stack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}
