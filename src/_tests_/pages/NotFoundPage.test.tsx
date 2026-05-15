import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import NotFoundPage from "../../pages/NotFoundPage";
import { IntlProvider } from "react-intl";

vi.mock("react-intl", async () => {
    const actual = await vi.importActual<any>("react-intl");
    return {
        ...actual,
        FormattedMessage: ({ id }: any) => <span>{id}</span>
    };
});

const backMock = vi.fn();
Object.defineProperty(window, "history", {
    value: { back: backMock },
    writable: true
});

const messages = {
    "notFound.title": "Page not found",
    "notFound.subtitle": "This page does not exist",
    "notFound.goBack": "Go back"
};

describe("NotFoundPage", () => {

    it("muestra los textos correctos", () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <NotFoundPage />
            </IntlProvider>
        );

        expect(screen.getByText("notFound.title")).toBeInTheDocument();
        expect(screen.getByText("notFound.subtitle")).toBeInTheDocument();
        expect(screen.getByText("notFound.goBack")).toBeInTheDocument();
    });

    it("llama a window.history.back al pulsar el botón", () => {
        render(
            <IntlProvider locale="es" messages={messages}>
                <NotFoundPage />
            </IntlProvider>
        );

        fireEvent.click(screen.getByText("notFound.goBack"));
        expect(backMock).toHaveBeenCalledTimes(1);
    });
});
