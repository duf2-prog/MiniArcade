import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../../services/ErrorBoundary";
import logger from "../../services/Logging";
import React from "react";

vi.mock("../../services/Logging", () => ({
    default: {
        warn: vi.fn(),
        debug: vi.fn()
    }
}));

function BrokenComponent(): React.ReactElement {
    throw new Error("Boom");
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => { });
});

describe("ErrorBoundary", () => {
    it("renderiza children cuando no hay error", () => {
        render(
            <ErrorBoundary fallback={<div>fallback</div>}>
                <div>ok</div>
            </ErrorBoundary>
        );

        expect(screen.getByText("ok")).toBeInTheDocument();
    });

    it("muestra fallback cuando hay error", () => {
        render(
            <ErrorBoundary fallback={<div>fallback</div>}>
                <BrokenComponent />
            </ErrorBoundary>
        );

        expect(screen.getByText("fallback")).toBeInTheDocument();
    });

    it("llama al logger cuando ocurre un error", () => {
        render(
            <ErrorBoundary fallback={<div>fallback</div>}>
                <BrokenComponent />
            </ErrorBoundary>
        );

        expect(logger.warn).toHaveBeenCalled();
        expect(logger.debug).toHaveBeenCalled();
    });
});