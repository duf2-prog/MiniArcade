import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GameReactionTestPage from "../../pages/GameReactionTestPage";
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

vi.mock("../../games/reaction/ReactionTests", () => ({
    __esModule: true,
    default: ({ onFinish }: { onFinish: () => void }) => (
        <button onClick={onFinish}>finish-reaction</button>
    )
}));

vi.mock("../../services/RankingService", () => ({
    rankingService: {
        getScoresByGame: vi.fn()
    }
}));

const mockedRanking = vi.mocked(rankingService.getScoresByGame);

const messages = {
    "game.reaction_test.name": "Reaction Test",
    "game.reaction_test.description": "Test your reaction speed",
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
        juegoId: "reaction_test",
        usuarioLowercase: usuario.toLowerCase(),
        puntuacion,
        fechaRegistro: "2024-01-01"
    };
}

describe("GameReactionTestPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("carga el ranking al montar", async () => {
        mockedRanking.mockResolvedValue([
            score("1", "Daniel", 150),
            score("2", "Alba", 120)
        ]);

        render(
            <IntlProvider locale="es" messages={messages}>
                <GameReactionTestPage />
            </IntlProvider>
        );

        expect(mockedRanking).toHaveBeenCalledWith({
            juegoId: "reaction_test",
            max: 50
        });

        await waitFor(() => {
            expect(screen.getByText("Daniel")).toBeInTheDocument();
            expect(screen.getByText("Alba")).toBeInTheDocument();
        });
    });

    it("muestra las posiciones correctamente", async () => {
        mockedRanking.mockResolvedValue([
            score("1", "Daniel", 150),
            score("2", "Alba", 120)
        ]);

        render(
            <IntlProvider locale="es" messages={messages}>
                <GameReactionTestPage />
            </IntlProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("1")).toBeInTheDocument();
            expect(screen.getByText("2")).toBeInTheDocument();
        });
    });

    it("vuelve a cargar el ranking cuando ReactionTest llama onFinish", async () => {
        mockedRanking.mockResolvedValue([score("1", "Daniel", 150)]);

        render(
            <IntlProvider locale="es" messages={messages}>
                <GameReactionTestPage />
            </IntlProvider>
        );

        const initialCalls = mockedRanking.mock.calls.length;

        fireEvent.click(screen.getByText("finish-reaction"));

        await waitFor(() => {
            expect(mockedRanking.mock.calls.length).toBeGreaterThan(initialCalls);
        });
    });
});
