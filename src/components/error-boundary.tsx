import { useTranslation } from "@/components/i18n-context"; // 添加导入
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

const ErrorBoundaryContent = ({ error, onReset }: { error: Error | null; onReset: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="p-4 flex items-center justify-center min-h-[200px]">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTitle>{t("error_boundary_title")}</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error?.message || t("error_boundary_unknown")}</p>
          <Button variant="outline" size="sm" onClick={onReset} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {t("error_boundary_recover")}
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <ErrorBoundaryContent error={this.state.error} onReset={this.handleReset} />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
