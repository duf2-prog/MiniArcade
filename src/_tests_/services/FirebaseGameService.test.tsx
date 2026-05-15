import { describe, it, expect, vi, beforeEach } from "vitest";
import { FirebaseGameService } from "../../services/FirebaseGameService";

vi.mock("../../services/Logging", () => ({
    default: {
        info: vi.fn(),
        debug: vi.fn(),
        warn: vi.fn()
    }
}));

vi.mock("../../services/FirebaseConfig", () => ({
    app: {}
}));

vi.mock("firebase/database", () => {
    return {
        getDatabase: vi.fn(() => ({})),
        ref: vi.fn((_db, path) => ({ path })),
        set: vi.fn(() => Promise.resolve()),
        get: vi.fn(),
        update: vi.fn(() => Promise.resolve()),
        remove: vi.fn(() => Promise.resolve())
    };
});

import { get, set, update, remove } from "firebase/database";

describe("FirebaseGameService", () => {
    const service = new FirebaseGameService();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("createGame llama a set con la ruta correcta", async () => {
        const game = { id: "g1" } as any;

        await service.createGame(game);

        expect(set).toHaveBeenCalledWith(
            expect.any(Object),
            game
        );
    });

    it("getGameById devuelve juego si existe", async () => {
        (get as any).mockResolvedValue({
            exists: () => true,
            val: () => ({ id: "g1", nombre: "test" })
        });

        const result = await service.getGameById("g1");

        expect(result).toEqual({ id: "g1", nombre: "test" });
    });

    it("getGameById lanza error si no existe", async () => {
        (get as any).mockResolvedValue({
            exists: () => false
        });

        await expect(service.getGameById("g1"))
            .rejects
            .toThrow("Juego con ID g1 no encontrado");
    });

    it("getAllGames devuelve array vacío si no hay datos", async () => {
        (get as any).mockResolvedValue({
            exists: () => false
        });

        const result = await service.getAllGames();

        expect(result).toEqual([]);
    });

    it("getAllGames devuelve lista de juegos", async () => {
        (get as any).mockResolvedValue({
            exists: () => true,
            val: () => ({
                g1: { id: "g1" },
                g2: { id: "g2" }
            })
        });

        const result = await service.getAllGames();

        expect(result).toEqual([
            { id: "g1" },
            { id: "g2" }
        ]);
    });

    it("updateGame llama a update con datos correctos", async () => {
        await service.updateGame("g1", { nombre: "nuevo" } as any);

        expect(update).toHaveBeenCalledWith(
            expect.any(Object),
            { nombre: "nuevo" }
        );
    });

    it("deleteGame llama a remove", async () => {
        await service.deleteGame("g1");

        expect(remove).toHaveBeenCalledWith(expect.any(Object));
    });
});