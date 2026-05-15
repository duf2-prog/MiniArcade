import { get, getDatabase, ref, set, update, remove } from "firebase/database";
import type { Game } from "../entities/Entities";
import { app } from "./FirebaseConfig";
import Logging from "../services/Logging";
import type { IGameService } from "../interfaces/IGameService";

export class FirebaseGameService implements IGameService {

    async createGame(game: Game): Promise<void> {
        Logging.info(`Creando juego ${game.id}`);
        const db = getDatabase(app);
        await set(ref(db, `games/${game.id}`), game);
        Logging.debug(`Juego ${game.id} creado`);
    }

    async getGameById(id: string): Promise<Game> {
        Logging.debug(`Obteniendo juego ${id}`);
        const db = getDatabase(app);
        const snapshot = await get(ref(db, `games/${id}`));

        if (!snapshot.exists()) {
            Logging.warn(`Juego ${id} no encontrado`);
            throw new Error(`Juego con ID ${id} no encontrado`);
        }

        Logging.info(`Juego ${id} obtenido`);
        return snapshot.val() as Game;
    }

    async getAllGames(): Promise<Game[]> {
        Logging.debug("Obteniendo todos los juegos");
        const db = getDatabase(app);
        const snapshot = await get(ref(db, "games"));

        if (!snapshot.exists()) {
            Logging.warn("No existen juegos en la base de datos");
            return [];
        }

        const games = Object.values(snapshot.val()) as Game[];
        Logging.info(`Juegos obtenidos: ${games.length}`);
        return games;
    }

    async updateGame(id: string, data: Partial<Game>): Promise<void> {
        Logging.info(`Actualizando juego ${id}`);
        const db = getDatabase(app);
        await update(ref(db, `games/${id}`), data);
        Logging.debug(`Juego ${id} actualizado`);
    }

    async deleteGame(id: string): Promise<void> {
        Logging.warn(`Eliminando juego ${id}`);
        const db = getDatabase(app);
        await remove(ref(db, `games/${id}`));
        Logging.info(`Juego ${id} eliminado`);
    }
}
