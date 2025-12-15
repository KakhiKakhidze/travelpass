import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-4">
          <div className="alert alert-error">
            <h4>Oops! Something went wrong</h4>
            <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
            <button 
              className="btn btn-contained mt-2"
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
            >
              Reload Page
            </button>
            <details style={{ marginTop: '16px' }}>
              <summary style={{ cursor: 'pointer' }}>Error Details</summary>
              <pre style={{ marginTop: '8px', fontSize: '0.75rem', overflow: 'auto' }}>
                {this.state.error?.stack}
              </pre>
            </details>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

