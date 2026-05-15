import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, LanguageContext } from "../../contexts/LangContext";

vi.mock("../../lang/i18n", () => ({
    messages: {
        en: { hello: "Hello" },
        es: { hello: "Hola" }
    }
}));

const TestComponent = () => {
    return (
        <LanguageProvider>
            <LanguageContext.Consumer>
                {(value) => (
                    <div>
                        <span data-testid="locale">{value.locale}</span>

                        <button onClick={() => value.changeLanguage("es")}>
                            ES
                        </button>

                        <button onClick={() => value.changeLanguage("en")}>
                            EN
                        </button>
                    </div>
                )}
            </LanguageContext.Consumer>
        </LanguageProvider>
    );
};

describe("LanguageContext", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("inicializa con idioma por defecto del navegador", () => {
        Object.defineProperty(navigator, "language", {
            value: "en",
            configurable: true
        });

        render(<TestComponent />);

        expect(screen.getByTestId("locale")).toHaveTextContent("en");
    });

    it("cambia idioma a español", () => {
        render(<TestComponent />);

        fireEvent.click(screen.getByText("ES"));

        expect(screen.getByTestId("locale")).toHaveTextContent("es");
    });

    it("cambia idioma a inglés", () => {
        render(<TestComponent />);

        fireEvent.click(screen.getByText("ES"));
        fireEvent.click(screen.getByText("EN"));

        expect(screen.getByTestId("locale")).toHaveTextContent("en");
    });

    it("expone messages según locale", () => {
        render(<TestComponent />);

        expect(screen.getByText("ES")).toBeInTheDocument();
        expect(screen.getByText("EN")).toBeInTheDocument();
    });
});