import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import ClickerChallenger from "../../../games/clicker/ClickerChallenger";
import useClickerLogic from "../../../games/clicker/UseClickerLogic";

vi.mock("../../../games/clicker/UseClickerLogic", () => ({
    default: vi.fn()
}));

const messages = {
    "game.start": "Start",
    "game.time": "Time",
    "game.score": "Score",
    "game.click": "Click",
    "game.finished": "Finished",
    "game.scoreSaved": "Score saved: {score}",
    "game.playAgain": "Play again"
};

const renderGame = () =>
    render(
        <IntlProvider locale="es" messages={messages}>
            <ClickerChallenger onFinish={vi.fn()} />
        </IntlProvider>
    );

describe("ClickerChallenger", () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("muestra botón Start cuando state = idle", () => {
        vi.mocked(useClickerLogic).mockReturnValue({
            state: "idle",
            score: 0,
            timeLeft: 10,
            countdown: 3,
            startGame: vi.fn(),
            click: vi.fn()
        });

        renderGame();

        expect(screen.getByText("Start")).toBeInTheDocument();
    });

    it("muestra countdown cuando state = countdown", () => {
        vi.mocked(useClickerLogic).mockReturnValue({
            state: "countdown",
            score: 0,
            timeLeft: 10,
            countdown: 3,
            startGame: vi.fn(),
            click: vi.fn()
        });

        renderGame();

        expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("muestra tiempo, score y botón Click cuando state = running", () => {
        vi.mocked(useClickerLogic).mockReturnValue({
            state: "running",
            score: 5,
            timeLeft: 7,
            countdown: 0,
            startGame: vi.fn(),
            click: vi.fn()
        });

        renderGame();

        expect(screen.getByText(/Time/i)).toBeInTheDocument();
        expect(screen.getByText(/Score/i)).toBeInTheDocument();
        expect(screen.getByText("Click")).toBeInTheDocument();
    });

    it("ejecuta click() cuando se pulsa el botón Click", () => {
        const click = vi.fn();

        vi.mocked(useClickerLogic).mockReturnValue({
            state: "running",
            score: 0,
            timeLeft: 10,
            countdown: 0,
            startGame: vi.fn(),
            click
        });

        renderGame();

        fireEvent.click(screen.getByText("Click"));

        expect(click).toHaveBeenCalled();
    });

    it("muestra pantalla final cuando state = finished", () => {
        vi.mocked(useClickerLogic).mockReturnValue({
            state: "finished",
            score: 42,
            timeLeft: 0,
            countdown: 0,
            startGame: vi.fn(),
            click: vi.fn()
        });

        renderGame();

        expect(screen.getByText("Finished")).toBeInTheDocument();
        expect(screen.getByText("Score saved: 42")).toBeInTheDocument();
        expect(screen.getByText("Play again")).toBeInTheDocument();
    });

    it("ejecuta startGame cuando se pulsa Play again", () => {
        const startGame = vi.fn();

        vi.mocked(useClickerLogic).mockReturnValue({
            state: "finished",
            score: 10,
            timeLeft: 0,
            countdown: 0,
            startGame,
            click: vi.fn()
        });

        renderGame();

        fireEvent.click(screen.getByText("Play again"));

        expect(startGame).toHaveBeenCalled();
    });
});