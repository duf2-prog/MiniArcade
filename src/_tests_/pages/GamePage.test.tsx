import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import GamePage from "../../pages/GamePage";
import { IntlProvider } from "react-intl";
import { useParams } from "react-router-dom";

vi.mock("react-router-dom", () => ({
    ...vi.importActual("react-router-dom"),
    useParams: vi.fn()
}));

vi.mock("../../pages/GameReactionTestPage", () => ({
    __esModule: true,
    default: () => <div>reaction-test-page</div>
}));

vi.mock("../../pages/GameClickerChallengerPage", () => ({
    __esModule: true,
    default: () => <div>clicker-challenger-page</div>
}));

const messages = {
    "common.notFound": "Not found",
    "common.loading": "Loading"
};

describe("GamePage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("muestra ReactionTestPage cuando gameId = reaction_test", async () => {
        vi.mocked(useParams).mockReturnValue({ gameId: "reaction_test" });

        render(
            <IntlProvider locale="es" messages={messages}>
                <GamePage />
            </IntlProvider>
        );

        expect(await screen.findByText("reaction-test-page")).toBeInTheDocument();
    });

    it("muestra ClickerChallengerPage cuando gameId = clicker_challenger", async () => {
        vi.mocked(useParams).mockReturnValue({ gameId: "clicker_challenger" });

        render(
            <IntlProvider locale="es" messages={messages}>
                <GamePage />
            </IntlProvider>
        );

        expect(await screen.findByText("clicker-challenger-page")).toBeInTheDocument();
    });

    it("muestra notFound cuando gameId no existe", () => {
        vi.mocked(useParams).mockReturnValue({ gameId: "unknown_game" });

        render(
            <IntlProvider locale="es" messages={messages}>
                <GamePage />
            </IntlProvider>
        );

        expect(screen.getByText("Not found")).toBeInTheDocument();
    });

    it("muestra notFound cuando no hay gameId", () => {
        vi.mocked(useParams).mockReturnValue({});

        render(
            <IntlProvider locale="es" messages={messages}>
                <GamePage />
            </IntlProvider>
        );

        expect(screen.getByText("Not found")).toBeInTheDocument();
    });
});
