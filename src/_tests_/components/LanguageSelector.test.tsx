import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import LanguageSelector from "../../components/LanguageSelector";
import { IntlProvider } from "react-intl";
import { LanguageContext } from "../../contexts/LangContext";

class ResizeObserverMock {
    observe() { }
    unobserve() { }
    disconnect() { }
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

const messages = {
    "navbar.spanish": "ES",
    "navbar.english": "EN"
};

describe("LanguageSelector", () => {

    const renderSelector = (
        locale: "es" | "en" = "es"
    ) => {

        const changeLanguage = vi.fn();

        render(
            <LanguageContext.Provider
                value={{
                    locale,
                    changeLanguage
                } as any}
            >
                <IntlProvider
                    locale={locale}
                    messages={messages}
                >
                    <LanguageSelector locale={locale} />
                </IntlProvider>
            </LanguageContext.Provider>
        );

        return {
            changeLanguage
        };
    };

    it("muestra el idioma actual", () => {
        renderSelector("es");

        expect(
            screen.getByRole("button")
        ).toHaveTextContent("ES");
    });

    it("muestra las opciones al abrir el selector", () => {
        renderSelector("es");

        fireEvent.click(
            screen.getByRole("button")
        );

        expect(
            screen.getAllByText("EN")[0]
        ).toBeInTheDocument();

        expect(
            screen.getAllByText("ES")[0]
        ).toBeInTheDocument();
    });

    it("llama a changeLanguage al seleccionar idioma", () => {
        const { changeLanguage } =
            renderSelector("es");

        fireEvent.click(
            screen.getByRole("button")
        );

        fireEvent.click(
            screen.getAllByText("EN")[0]
        );

        expect(changeLanguage)
            .toHaveBeenCalledWith("en");
    });
});