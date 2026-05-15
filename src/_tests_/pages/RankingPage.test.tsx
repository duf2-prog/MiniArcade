import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import RankingPage from "../../pages/RankingPage";
import gameReducer from "../../store/slices/GameSlice";
import userReducer from "../../store/slices/UserSlice";

vi.mock("react-intl", async () => {
    const actual = await vi.importActual<any>("react-intl");
    return {
        ...actual,
        FormattedMessage: ({ id }: any) => <span>{id}</span>,
        FormattedDate: ({ value }: any) => <span>{value.toISOString()}</span>
    };
});

vi.mock("../../components/Table", () => ({
    __esModule: true,
    default: () => <div>mock-table</div>
}));

vi.mock("../../components/GameSelector", () => ({
    __esModule: true,
    default: () => <div>mock-game-selector</div>
}));

vi.mock("../../services/RankingService", () => ({
    rankingService: {
        getScores: vi.fn().mockResolvedValue([
            {
                usuario: "Daniel",
                juegoId: "1",
                puntuacion: 200,
                fechaRegistro: new Date().toISOString()
            }
        ]),
        getScoresByGame: vi.fn().mockResolvedValue([])
    }
}));

function createStore() {
    return configureStore({
        reducer: {
            user: userReducer,
            games: gameReducer
        },
        preloadedState: {
            user: {
                profile: null,
                users: [],
                loading: false,
                error: null
            },
            games: {
                games: [],
                loading: false,
                game: null,
                error: null
            }
        }
    });
}

const messages = {
    "ranking.title": "Ranking",
    "ranking.subtitle": "Top players",
    "ranking.searchUser": "Search user",
    "common.loading": "Loading"
};

describe("RankingPage", () => {

    it("renderiza y carga la tabla", async () => {

        const store = createStore();

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <RankingPage />
                </IntlProvider>
            </Provider>
        );

        expect(await screen.findByText("mock-table")).toBeInTheDocument();

        expect(screen.getByText("ranking.title")).toBeInTheDocument();
        expect(screen.getByText("ranking.subtitle")).toBeInTheDocument();

        expect(screen.getByText("mock-game-selector")).toBeInTheDocument();
    });
});
