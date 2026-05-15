import { get, getDatabase, ref, set, remove } from "firebase/database";
import type { Score } from "../entities/Entities";
import { app } from "./FirebaseConfig";
import type { IScoreService } from "../interfaces/IScoreService";

export class FirebaseScoreService implements IScoreService {

    async createScore(score: Score): Promise<void> {
        const db = getDatabase(app);
        await set(ref(db, `scores/${score.id}`), score);
    }

    async getScoreById(id: string): Promise<Score> {
        const db = getDatabase(app);
        const snapshot = await get(ref(db, `scores/${id}`));

        if (!snapshot.exists()) {
            throw new Error(`Puntuación con ID ${id} no encontrada`);
        }

        return snapshot.val() as Score;
    }

    async deleteScore(id: string): Promise<void> {
        const db = getDatabase(app);
        await remove(ref(db, `scores/${id}`));
    }
}
