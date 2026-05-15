import logger from "./Logging";
import React from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
    /** Fallback UI to display when an error is caught */
    fallback: ReactNode;
    /** Components that the ErrorBoundary wraps */
    children?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error): Partial<ErrorBoundaryState> {
        // Update state so the next render shows the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        logger.warn(`Error capturado por ErrorBoundary: ${error.message}`);
        logger.debug(`Información del error: ${info.componentStack}`);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;