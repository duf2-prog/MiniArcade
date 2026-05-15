import { describe, it, expect, vi, beforeEach } from "vitest";
import { FirebaseScoreService } from "../../services/FirebaseScoreService";

vi.mock("../../services/FirebaseConfig", () => ({
    app: {}
}));

vi.mock("firebase/database", () => {
    return {
        getDatabase: vi.fn(() => ({})),
        ref: vi.fn((_db, path) => ({ path })),
        set: vi.fn(() => Promise.resolve()),
        get: vi.fn(),
        remove: vi.fn(() => Promise.resolve())
    };
});

import { set, get, remove } from "firebase/database";

describe("FirebaseScoreService", () => {
    const service = new FirebaseScoreService();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("createScore guarda la puntuación", async () => {
        const score = { id: "s1" } as any;

        await service.createScore(score);

        expect(set).toHaveBeenCalledWith(
            expect.any(Object),
            score
        );
    });

    it("getScoreById devuelve score si existe", async () => {
        (get as any).mockResolvedValue({
            exists: () => true,
            val: () => ({ id: "s1", puntuacion: 100 })
        });

        const result = await service.getScoreById("s1");

        expect(result).toEqual({ id: "s1", puntuacion: 100 });
    });

    it("getScoreById lanza error si no existe", async () => {
        (get as any).mockResolvedValue({
            exists: () => false
        });

        await expect(service.getScoreById("s1"))
            .rejects
            .toThrow("Puntuación con ID s1 no encontrada");
    });

    it("deleteScore llama a remove", async () => {
        await service.deleteScore("s1");

        expect(remove).toHaveBeenCalledWith(expect.any(Object));
    });
});