import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import * as GameSlice from "../../store/slices/GameSlice";
import gameReducer from "../../store/slices/GameSlice";

vi.mock("react-intl", async () => {
    const actual = await vi.importActual<any>("react-intl");
    return {
        ...actual,
        FormattedMessage: ({ id }: any) => <span>{id}</span>
    };
});

vi.spyOn(GameSlice, "fetchAllGames").mockReturnValue({ type: "games/fetchAllGames/mock" } as any);

vi.mock("react-redux", async () => {
    const actual = await vi.importActual<any>("react-redux");
    return {
        ...actual,
        useDispatch: () => () => { }
    };
});

vi.mock("../../components/GameCard", () => ({
    __esModule: true,
    default: ({ game }: any) => <div>game-card-{game.id}</div>
}));

import HomePage from "../../pages/HomePage";


const messages = {
    "home.welcome": "Welcome",
    "home.subtitle": "Choose a game",
    "home.noGames": "No games available",
    "common.loading": "Loading"
};

function createStore(games: any[], loading: boolean) {
    return configureStore({
        reducer: {
            games: gameReducer
        },
        preloadedState: {
            games: {
                games,
                loading,
                game: null,
                error: null
            }
        }
    });
}

describe("HomePage", () => {

    it("despacha fetchAllGames al montar", () => {
        const spy = vi.spyOn(GameSlice, "fetchAllGames");
        const store = createStore([], false);

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <HomePage />
                </IntlProvider>
            </Provider>
        );

        expect(spy).toHaveBeenCalledTimes(1);
    });

    it("muestra mensaje de carga cuando loading = true", () => {
        const store = createStore([], true);

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <HomePage />
                </IntlProvider>
            </Provider>
        );

        expect(screen.getByText("common.loading")).toBeInTheDocument();
    });

    it("muestra mensaje de no hay juegos cuando no hay juegos activos", () => {
        const store = createStore(
            [{ id: "1", nombre: "Test", activo: false }],
            false
        );

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <HomePage />
                </IntlProvider>
            </Provider>
        );

        expect(screen.getByText("home.noGames")).toBeInTheDocument();
    });

    it("muestra GameCard por cada juego activo", async () => {
        const store = createStore(
            [
                { id: "1", nombre: "Game 1", activo: true },
                { id: "2", nombre: "Game 2", activo: true },
                { id: "3", nombre: "Game 3", activo: false }
            ],
            false
        );

        render(
            <Provider store={store}>
                <IntlProvider locale="es" messages={messages}>
                    <HomePage />
                </IntlProvider>
            </Provider>
        );

        expect(await screen.findByText("game-card-1")).toBeInTheDocument();
        expect(await screen.findByText("game-card-2")).toBeInTheDocument();
        expect(screen.queryByText("game-card-3")).toBeNull();
    });
});
