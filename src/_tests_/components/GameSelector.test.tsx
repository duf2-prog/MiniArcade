import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import GameSelector from "../../components/GameSelector";
import { IntlProvider } from "react-intl";
import { useSelector } from "react-redux";

vi.mock("react-redux", () => ({
    useSelector: vi.fn()
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

const messages = {
    "ranking.filterByGame": "Filter by game",
    "ranking.allGames": "All games",
    "game.game1.name": "Clicker",
    "game.game2.name": "Reaction"
};

describe("GameSelector", () => {

    const mockGames = [
        { id: "game1" },
        { id: "game2" }
    ];

    const renderSelector = (
        value: string,
        onChange = vi.fn()
    ) => {

        (useSelector as any).mockImplementation(
            (selector: any) =>
                selector({
                    games: {
                        games: mockGames
                    }
                })
        );

        return render(
            <IntlProvider
                locale="es"
                messages={messages}
            >
                <GameSelector
                    value={value}
                    onChange={onChange}
                />
            </IntlProvider>
        );
    };

    it("renderiza las opciones de juegos", () => {
        renderSelector("");

        expect(
            screen.getByText("Filter by game:")
        ).toBeInTheDocument();

        expect(
            screen.getByText("All games")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Clicker")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Reaction")
        ).toBeInTheDocument();
    });

    it("llama a onChange al seleccionar un juego", () => {
        const onChange = vi.fn();

        renderSelector("", onChange);

        fireEvent.change(
            screen.getByRole("combobox"),
            {
                target: {
                    value: "game1"
                }
            }
        );

        expect(onChange)
            .toHaveBeenCalledWith("game1");
    });

    it("muestra el valor seleccionado", () => {
        renderSelector("game1");

        expect(
            screen.getByRole("combobox")
        ).toHaveValue("game1");
    });
});