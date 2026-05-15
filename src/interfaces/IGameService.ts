import type { Game } from "../entities/Entities";

export interface IGameService {
    createGame(game: Game): Promise<void>
    getGameById(id: string): Promise<Game>;
    getAllGames(): Promise<Game[]>;
    updateGame(id: string, data: Partial<Game>): Promise<void>;
    deleteGame(id: string): Promise<void>;
}