import { describe, it, expect, afterEach, vi } from "vitest";
import {
    cleanup,
    fireEvent,
    render,
    screen,
    waitFor
} from "@testing-library/react";

import GameCard from "../../components/GameCard";
import { AuthContext } from "../../contexts/AuthContext";
import { rankingService } from "../../services/RankingService";

import {
    MemoryRouter,
    Route,
    Routes
} from "react-router-dom";

import { IntlProvider } from "react-intl";

vi.mock("../../services/RankingService", () => ({
    rankingService: {
        getScoresByGame: vi.fn()
    }
}));

vi.mock("../../components/Table", () => ({
    __esModule: true,
    default: ({ data, loading }: any) => (
        <div>
            {loading && <span>table-loading</span>}

            {data.map((row: any) => (
                <span key={row.id}>
                    {row.pos}-{row.usuario}-{row.puntuacion}
                </span>
            ))}
        </div>
    )
}));

vi.mock("../../components/RegisterLoginModal", () => ({
    __esModule: true,
    default: ({ isOpen }: any) =>
        isOpen ? <div>Auth Modal</div> : null
}));

afterEach(() => {
    cleanup();
    vi.clearAllMocks();
});

const messages = {
    "game.clicker": "Clicker",
    "game.clicker.desc": "Descripción",
    "game.play": "Play",
    "common.loading": "Loading",
    "ranking.position": "Pos",
    "ranking.player": "Player",
    "ranking.score": "Score"
};

describe("GameCard", () => {

    const game = {
        id: "game1",
        nombre: "clicker",
        descripcion: "clicker.desc"
    };

    const renderWithProviders = (user: any) => {
        return render(
            <AuthContext.Provider
                value={{
                    user,
                    loading: false,
                    setUser: vi.fn()
                } as any}
            >
                <IntlProvider
                    locale="es"
                    messages={messages}
                >
                    <MemoryRouter initialEntries={["/"]}>
                        <Routes>

                            <Route
                                path="/"
                                element={
                                    <GameCard game={game} />
                                }
                            />

                            <Route
                                path="/games/:id"
                                element={<div>Game Loaded</div>}
                            />

                            <Route
                                path="/admin"
                                element={<div>Admin Loaded</div>}
                            />

                        </Routes>
                    </MemoryRouter>
                </IntlProvider>
            </AuthContext.Provider>
        );
    };

    it("llama a getScoresByGame correctamente", async () => {
        (rankingService as any)
            .getScoresByGame
            .mockResolvedValue([]);

        renderWithProviders(null);

        await waitFor(() => {
            expect(rankingService.getScoresByGame)
                .toHaveBeenCalledWith({
                    juegoId: "game1",
                    max: 50
                });
        });
    });

    it("muestra título y descripción", async () => {
        (rankingService as any)
            .getScoresByGame
            .mockResolvedValue([]);

        renderWithProviders(null);

        expect(
            screen.getByText("Clicker")
        ).toBeInTheDocument();

        expect(
            screen.getByText("Descripción")
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(rankingService.getScoresByGame)
                .toHaveBeenCalled();
        });
    });

    it("carga y muestra ranking con posiciones", async () => {
        (rankingService as any)
            .getScoresByGame
            .mockResolvedValue([
                {
                    id: "1",
                    usuario: "Daniel",
                    puntuacion: 100
                },
                {
                    id: "2",
                    usuario: "Ana",
                    puntuacion: 90
                }
            ]);

        renderWithProviders(null);

        expect(
            await screen.findByText("1-Daniel-100")
        ).toBeInTheDocument();

        expect(
            await screen.findByText("2-Ana-90")
        ).toBeInTheDocument();
    });

    it("abre modal si el usuario NO está logueado", async () => {
        (rankingService as any)
            .getScoresByGame
            .mockResolvedValue([]);

        renderWithProviders(null);

        fireEvent.click(
            screen.getByText(/play/i)
        );

        expect(
            await screen.findByText("Auth Modal")
        ).toBeInTheDocument();
    });

    it("navega al juego si el usuario está logueado", async () => {
        (rankingService as any)
            .getScoresByGame
            .mockResolvedValue([]);

        renderWithProviders({
            id: "u1",
            rol: "USER"
        });

        fireEvent.click(
            screen.getByText(/play/i)
        );

        expect(
            await screen.findByText("Game Loaded")
        ).toBeInTheDocument();
    });
});