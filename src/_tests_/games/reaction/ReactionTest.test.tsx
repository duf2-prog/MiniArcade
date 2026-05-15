import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import ReactionTest from "../../../games/reaction/ReactionTest";

const mockUseReactionLogic = vi.hoisted(() => vi.fn());

vi.mock("../../../games/reaction/UseReactionLogic", () => ({
    default: mockUseReactionLogic
}));

const messages = {
    "game.start": "Start",
    "game.reaction_test.wait": "Wait...",
    "game.click": "Click",
    "game.scoreSaved": "Score saved: {score}",
    "game.playAgain": "Play again"
};

const renderGame = () =>
    render(
        <IntlProvider locale="es" messages={messages}>
            <ReactionTest onFinish={vi.fn()} />
        </IntlProvider>
    );

describe("ReactionTest", () => {
    it("muestra botón Start cuando state = idle", () => {
        mockUseReactionLogic.mockReturnValue({
            state: "idle",
            score: 0,
            countdown: 0,
            startGame: vi.fn(),
            click: vi.fn()
        });

        renderGame();
        expect(screen.getByText("Start")).toBeInTheDocument();
    });

    it("muestra countdown cuando state = countdown", () => {
        mockUseReactionLogic.mockReturnValue({
            state: "countdown",
            score: 0,
            countdown: 3,
            startGame: vi.fn(),
            click: vi.fn()
        });

        renderGame();
        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("muestra waiting", () => {
        mockUseReactionLogic.mockReturnValue({
            state: "waiting",
            score: 0,
            countdown: 0,
            startGame: vi.fn(),
            click: vi.fn()
        });

        renderGame();
        expect(screen.getByText("Wait...")).toBeInTheDocument();
    });

    it("muestra ready y ejecuta click", () => {
        const click = vi.fn();

        mockUseReactionLogic.mockReturnValue({
            state: "ready",
            score: 0,
            countdown: 0,
            startGame: vi.fn(),
            click
        });

        renderGame();

        fireEvent.click(screen.getByText("Click"));
        expect(click).toHaveBeenCalled();
    });

    it("pantalla final", () => {
        const startGame = vi.fn();

        mockUseReactionLogic.mockReturnValue({
            state: "finished",
            score: 42,
            countdown: 0,
            startGame,
            click: vi.fn()
        });

        renderGame();

        expect(screen.getByText("Score saved: 42")).toBeInTheDocument();
        expect(screen.getByText("Play again")).toBeInTheDocument();
    });

    it("restart", () => {
        const startGame = vi.fn();

        mockUseReactionLogic.mockReturnValue({
            state: "finished",
            score: 10,
            countdown: 0,
            startGame,
            click: vi.fn()
        });

        renderGame();

        fireEvent.click(screen.getByText("Play again"));
        expect(startGame).toHaveBeenCalled();
    });
});