import reducer, { fetchGame, fetchAllGames, updateGame, clearGame } from "../../../store/slices/GameSlice";

import { describe, it, expect } from "vitest";

describe("GameSlice reducer", () => {
    const initialState = {
        game: null,
        games: [],
        loading: false,
        error: null
    };

    const mockGame = {
        id: "1",
        nombre: "test",
        descripcion: "desc",
        fechaRegistro: "2024-01-01",
        activo: true
    };

    const mockGame2 = {
        id: "2",
        nombre: "test2",
        descripcion: "desc2",
        fechaRegistro: "2024-01-01",
        activo: true
    };

    it("clearGame resetea el estado", () => {
        const prevState = {
            game: mockGame,
            games: [mockGame],
            loading: true,
            error: "error"
        };

        const state = reducer(prevState, clearGame());

        expect(state).toEqual({
            game: null,
            games: [mockGame],
            loading: false,
            error: null
        });
    });

    it("fetchGame.pending activa loading", () => {
        const action = { type: fetchGame.pending.type };

        const state = reducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("fetchGame.fulfilled guarda el juego", () => {
        const action = {
            type: fetchGame.fulfilled.type,
            payload: mockGame
        };

        const state = reducer(initialState, action);

        expect(state.game).toEqual(mockGame);
        expect(state.loading).toBe(false);
    });

    it("fetchGame.rejected guarda error", () => {
        const action = {
            type: fetchGame.rejected.type,
            payload: "error loading game"
        };

        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe("error loading game");
    });

    it("fetchAllGames.pending activa loading", () => {
        const action = { type: fetchAllGames.pending.type };

        const state = reducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("fetchAllGames.fulfilled guarda lista de juegos", () => {
        const action = {
            type: fetchAllGames.fulfilled.type,
            payload: [mockGame, mockGame2]
        };

        const state = reducer(initialState, action);

        expect(state.games).toEqual([mockGame, mockGame2]);
        expect(state.loading).toBe(false);
    });

    it("updateGame.pending activa loading", () => {
        const action = { type: updateGame.pending.type };

        const state = reducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });

    it("updateGame.fulfilled actualiza game y lista", () => {
        const prevState = {
            game: mockGame,
            games: [mockGame, mockGame2],
            loading: false,
            error: null
        };

        const action = {
            type: updateGame.fulfilled.type,
            payload: {
                id: "1",
                data: { activo: false }
            }
        };

        const state = reducer(prevState, action);

        expect(state.game).toEqual({
            ...mockGame,
            activo: false
        });

        expect(state.games).toEqual([
            { ...mockGame, activo: false },
            mockGame2
        ]);

        expect(state.loading).toBe(false);
    });
});