import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GameClickerChallengerPage from "../../pages/GameClickerChallengerPage";
import { IntlProvider } from "react-intl";
import { rankingService } from "../../services/RankingService";

vi.mock("../../components/Table", () => ({
    __esModule: true,
    default: ({ columns, data }: { columns: any[]; data: any[] }) => (
        <table>
            <thead>
                <tr>
                    {columns.map((c: any) => (
                        <th key={c.key}>{c.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row: any, i: number) => (
                    <tr key={i}>
                        {columns.map((c: any) => (
                            <td key={c.key}>{row[c.key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}));

vi.mock("../../games/clicker/ClickerChallenger", () => ({
    __esModule: true,
    default: ({ onFinish }: { onFinish: () => void }) => (
        <button onClick={onFinish}>finish-game</button>
    )
}));

vi.mock("../../services/RankingService", () => ({
    rankingService: {
        getScoresByGame: vi.fn()
    }
}));

const mockedRanking = vi.mocked(rankingService.getScoresByGame);

const messages = {
    "game.clicker_challenger.name": "Clicker Challenger",
    "game.clicker_challenger.description": "Click as fast as you can",
    "ranking.title": "Ranking",
    "ranking.position": "Position",
    "ranking.player": "Player",
    "ranking.score": "Score",
    "common.loading": "Loading"
};

function score(id: string, usuario: string, puntuacion: number) {
    return {
        id,
        usuario,
        usuarioId: "u_" + id,
        juegoId: "clicker_challenger",
        usuarioLowercase: usuario.toLowerCase(),
        puntuacion,
        fechaRegistro: "2024-01-01"
    };
}

describe("GameClickerChallengerPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("carga el ranking al montar", async () => {
        mockedRanking.mockResolvedValue([
            score("1", "Daniel", 100),
            score("2", "Alba", 80)
        ]);

        render(
            <IntlProvider locale="es" messages={messages}>
                <GameClickerChallengerPage />
            </IntlProvider>
        );

        expect(mockedRanking).toHaveBeenCalledWith({
            juegoId: "clicker_challenger",
            max: 50
        });

        await waitFor(() => {
            expect(screen.getByText("Daniel")).toBeInTheDocument();
            expect(screen.getByText("Alba")).toBeInTheDocument();
        });
    });

    it("muestra las posiciones correctamente", async () => {
        mockedRanking.mockResolvedValue([
            score("1", "Daniel", 100),
            score("2", "Alba", 80)
        ]);

        render(
            <IntlProvider locale="es" messages={messages}>
                <GameClickerChallengerPage />
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("1")).toBeInTheDocument();
            expect(screen.getByText("2")).toBeInTheDocument();
        });
    });

    it("vuelve a cargar el ranking cuando ClickerChallenger llama onFinish", async () => {
        mockedRanking.mockResolvedValue([score("1", "Daniel", 100)]);

        render(
            <IntlProvider locale="es" messages={messages}>
                <GameClickerChallengerPage />
            </IntlProvider>
        );

        const initialCalls = mockedRanking.mock.calls.length;

        fireEvent.click(screen.getByText("finish-game"));

        await waitFor(() => {
            expect(mockedRanking.mock.calls.length).toBeGreaterThan(initialCalls);
        });
    });
});
