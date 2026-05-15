import { describe, it, expect, vi, beforeEach } from "vitest";
import { FirebaseRankingService } from "../../services/FirebaseRankingService";

vi.mock("../../services/FirebaseConfig", () => ({
    app: {}
}));

vi.mock("../../services/Logging", () => ({
    default: {
        debug: vi.fn(),
        info: vi.fn(),
        warn: vi.fn()
    }
}));

vi.mock("firebase/database", () => {
    return {
        getDatabase: vi.fn(() => ({})),
        ref: vi.fn(() => ({})),
        query: vi.fn((_ref, ...args) => ({ args })),
        orderByChild: vi.fn((field) => field),
        startAt: vi.fn((v) => v),
        endAt: vi.fn((v) => v),
        get: vi.fn()
    };
});

import { get } from "firebase/database";

describe("FirebaseRankingService", () => {
    const service = new FirebaseRankingService();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getScores devuelve array vacío si no hay datos", async () => {
        (get as any).mockResolvedValue({
            exists: () => false
        });

        const result = await service.getScores();

        expect(result).toEqual([]);
    });

    it("getScores ordena desc por puntuacion", async () => {
        (get as any).mockResolvedValue({
            exists: () => true,
            val: () => ({
                a: { puntuacion: 10 },
                b: { puntuacion: 20 }
            })
        });

        const result = await service.getScores({
            orderField: "puntuacion",
            orderDirection: "desc"
        });

        expect(result[0].puntuacion).toBe(20);
    });

    it("getScores aplica filtro de usuario", async () => {
        const getMock = get as any;

        getMock.mockResolvedValue({
            exists: () => true,
            val: () => ({
                u1: { usuarioLowercase: "daniel", puntuacion: 10 }
            })
        });

        const result = await service.getScores({
            searchUser: "Daniel"
        });

        expect(result.length).toBe(1);
    });

    it("getScores limita resultados con max", async () => {
        (get as any).mockResolvedValue({
            exists: () => true,
            val: () => ({
                a: { puntuacion: 1 },
                b: { puntuacion: 2 },
                c: { puntuacion: 3 }
            })
        });

        const result = await service.getScores({ max: 2 });

        expect(result.length).toBe(2);
    });

    it("getScoresByGame ordena por puntuacion desc", async () => {
        (get as any).mockResolvedValue({
            exists: () => true,
            val: () => ({
                a: { puntuacion: 10 },
                b: { puntuacion: 30 }
            })
        });

        const result = await service.getScoresByGame({
            juegoId: "game1"
        });

        expect(result[0].puntuacion).toBe(30);
    });

    it("getScoresByUser devuelve vacío si no hay datos", async () => {
        (get as any).mockResolvedValue({
            exists: () => false
        });

        const result = await service.getScoresByUser({
            usuarioId: "u1"
        });

        expect(result).toEqual([]);
    });
});