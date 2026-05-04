import { Component, type ErrorInfo, type ReactNode } from "react";
import { RotateCw } from "lucide-react";
import { Button } from "./Button";
import { CopyButton } from "./CopyButton";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  error: Error | null;
  errorId: string | null;
};

function createErrorId(): string {
  return `ots-${Date.now().toString(36)}`;
}

function getErrorSummary(error: Error | null, errorId: string | null): string {
  return JSON.stringify(
    {
      errorId,
      message: error?.message ?? "Unknown runtime error",
      name: error?.name ?? "Error",
      project: "open-tools-starter",
    },
    null,
    2,
  );
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    error: null,
    errorId: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      error,
      errorId: createErrorId(),
    };
  }

  componentDidCatch(_error: Error, _info: ErrorInfo): void {
    // Intentionally avoid logging environment details in the UI or persisted storage.
  }

  private reloadPage = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.error) {
      return (
        <div data-error-boundary="ready" data-testid="error-boundary-root">
          {this.props.children}
        </div>
      );
    }

    const summary = getErrorSummary(this.state.error, this.state.errorId);

    return (
      <main
        className="error-boundary"
        data-error-boundary="fallback"
        data-testid="error-boundary-fallback"
      >
        <section className="error-boundary__panel" role="alert">
          <p className="eyebrow">Runtime Guard</p>
          <h1>Something went wrong</h1>
          <p>
            The starter caught a runtime error. You can refresh the page or copy
            a short error summary for debugging.
          </p>
          <p className="error-boundary__id">Error ID: {this.state.errorId}</p>
          <div className="error-boundary__actions">
            <Button icon={<RotateCw size={17} />} onClick={this.reloadPage} variant="primary">
              Refresh page
            </Button>
            <CopyButton copiedLabel="Copied" label="Copy error summary" text={summary} />
          </div>
        </section>
      </main>
    );
  }
}
