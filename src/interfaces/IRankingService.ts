import type { Score } from "../entities/Entities";

export type OrderableScoreField =
    | "puntuacion"
    | "fechaRegistro"
    | "juegoId"
    | "usuario";

export interface IRankingService {

    getScores(params?: {
        orderField?: OrderableScoreField;
        orderDirection?: "asc" | "desc";
        searchUser?: string;
        max?: number;
    }): Promise<Score[]>;

    getScoresByGame(params: {
        juegoId: string;
        max?: number;
    }): Promise<Score[]>;

    getScoresByUser(params: {
        usuarioId: string;
        max?: number;
    }): Promise<Score[]>;
}
