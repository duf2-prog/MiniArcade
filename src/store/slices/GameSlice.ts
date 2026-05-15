import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Game } from "../../entities/Entities";
import { gameService } from "../../services/GameService";

interface GameState {
    game: Game | null;
    games: Game[];
    loading: boolean;
    error: string | null;
}

const initialState: GameState = {
    game: null,
    games: [],
    loading: false,
    error: null
};

export const fetchGame = createAsyncThunk(
    "game/fetchGame",
    async (id: string, { rejectWithValue }) => {
        try {
            const game = await gameService.getGameById(id);
            return game;
        } catch (error: any) {
            return rejectWithValue(error.message ?? "Error al cargar el juego");
        }
    }
);

export const fetchAllGames = createAsyncThunk(
    "game/fetchAllGames",
    async (_, { rejectWithValue }) => {
        try {
            const games = await gameService.getAllGames();
            return games;
        } catch (error: any) {
            return rejectWithValue(error.message ?? "Error al cargar los juegos");
        }
    }
);

export const updateGame = createAsyncThunk(
    "game/updateGame",
    async ({ id, data }: { id: string; data: Partial<Game> }, { rejectWithValue }) => {
        try {
            await gameService.updateGame(id, data);
            return { id, data };
        } catch (error: any) {
            return rejectWithValue(error.message ?? "Error al actualizar el juego");
        }
    }
);

const gameSlice = createSlice({
    name: "game",
    initialState,
    reducers: {
        clearGame: (state) => {
            state.game = null;
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchGame.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGame.fulfilled, (state, action) => {
                state.loading = false;
                state.game = action.payload;
            })
            .addCase(fetchGame.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(fetchAllGames.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllGames.fulfilled, (state, action) => {
                state.loading = false;
                state.games = action.payload;
            })
            .addCase(fetchAllGames.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateGame.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateGame.fulfilled, (state, action) => {
                state.loading = false;

                const { id, data } = action.payload;

                if (state.game && state.game.id === id) {
                    state.game = { ...state.game, ...data };
                }

                state.games = state.games.map((g) =>
                    g.id === id ? { ...g, ...data } : g
                );
            })
            .addCase(updateGame.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearGame } = gameSlice.actions;
export default gameSlice.reducer;
