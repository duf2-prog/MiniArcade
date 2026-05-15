import { getDatabase, ref, query, orderByChild, get, startAt, endAt } from "firebase/database";
import { app } from "./FirebaseConfig";
import Logging from "../services/Logging";
import type { Score } from "../entities/Entities";
import type { IRankingService } from "../interfaces/IRankingService";

type OrderableScoreField =
    | "puntuacion"
    | "fechaRegistro"
    | "juegoId"
    | "usuario";

export class FirebaseRankingService implements IRankingService {

    async getScores(params?: {
        orderField?: OrderableScoreField;
        orderDirection?: "asc" | "desc";
        searchUser?: string;
        max?: number;
    }): Promise<Score[]> {

        const {
            orderField = "puntuacion",
            orderDirection = "desc",
            searchUser = "",
            max = 999999
        } = params ?? {};

        Logging.debug(`getScores: orderField=${orderField}, direction=${orderDirection}, search=${searchUser}, max=${max}`);

        const db = getDatabase(app);
        const scoresRef = ref(db, "scores");

        let q;

        if (searchUser) {
            const lower = searchUser.toLowerCase();
            Logging.info(`Filtrando puntuaciones por usuario: ${lower}`);

            q = query(
                scoresRef,
                orderByChild("usuarioLowercase"),
                startAt(lower),
                endAt(lower + "\uf8ff")
            );
        } else {
            Logging.info(`Ordenando puntuaciones por ${orderField}`);
            q = query(scoresRef, orderByChild(orderField));
        }

        const snapshot = await get(q);
        if (!snapshot.exists()) {
            Logging.warn("No se encontraron puntuaciones");
            return [];
        }

        let results = Object.values(snapshot.val()) as Score[];

        if (orderDirection === "desc") {
            results = results.sort((a, b) => {
                if (a[orderField] < b[orderField]) return 1;
                if (a[orderField] > b[orderField]) return -1;
                return 0;
            });
        }

        Logging.info(`Puntuaciones obtenidas: ${results.length}`);
        return results.slice(0, max);
    }

    async getScoresByGame({ juegoId, max = 999999 }: { juegoId: string; max?: number; }): Promise<Score[]> {
        Logging.debug(`getScoresByGame: juegoId=${juegoId}, max=${max}`);

        const db = getDatabase(app);
        const scoresRef = ref(db, "scores");

        const q = query(
            scoresRef,
            orderByChild("juegoId"),
            startAt(juegoId),
            endAt(juegoId + "\uf8ff")
        );

        const snapshot = await get(q);
        if (!snapshot.exists()) {
            Logging.warn(`No hay puntuaciones para el juego ${juegoId}`);
            return [];
        }

        const results = Object.values(snapshot.val()) as Score[];
        Logging.info(`Puntuaciones encontradas para juego ${juegoId}: ${results.length}`);

        return results
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .slice(0, max);
    }

    async getScoresByUser({ usuarioId, max = 999999 }: { usuarioId: string; max?: number; }): Promise<Score[]> {
        Logging.debug(`getScoresByUser: usuarioId=${usuarioId}, max=${max}`);

        const db = getDatabase(app);
        const scoresRef = ref(db, "scores");

        const q = query(
            scoresRef,
            orderByChild("usuarioId"),
            startAt(usuarioId),
            endAt(usuarioId + "\uf8ff")
        );

        const snapshot = await get(q);
        if (!snapshot.exists()) {
            Logging.warn(`No hay puntuaciones para el usuario ${usuarioId}`);
            return [];
        }

        const results = Object.values(snapshot.val()) as Score[];
        Logging.info(`Puntuaciones encontradas para usuario ${usuarioId}: ${results.length}`);

        return results
            .sort((a, b) => b.puntuacion - a.puntuacion)
            .slice(0, max);
    }
}

export const firebaseRankingService = new FirebaseRankingService();
