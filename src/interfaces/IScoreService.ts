import type { Score } from "../entities/Entities";

export interface IScoreService {
    createScore(score: Score): Promise<void>;
    getScoreById(id: string): Promise<Score>;
    deleteScore(id: string): Promise<void>;
}