import { describe, it, expect, vi, beforeEach } from "vitest";
import { FirebaseUserService } from "../../services/FirebaseUserService";
import { Role } from "../../entities/Entities";

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
        ref: vi.fn((_db, path) => ({ path })),
        get: vi.fn(),
        set: vi.fn(() => Promise.resolve()),
        update: vi.fn(() => Promise.resolve()),
        remove: vi.fn(() => Promise.resolve())
    };
});

import { get, set, update, remove } from "firebase/database";

describe("FirebaseUserService", () => {
    const service = new FirebaseUserService();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("getAllUsers devuelve usuarios", async () => {
        (get as any).mockResolvedValue({
            exists: () => true,
            val: () => ({
                u1: { id: "u1", nombre: "Daniel" }
            })
        });

        const result = await service.getAllUsers();

        expect(result).toEqual({
            u1: { id: "u1", nombre: "Daniel" }
        });
    });

    it("getAllUsers devuelve objeto vacío si no hay usuarios", async () => {
        (get as any).mockResolvedValue({
            exists: () => false
        });

        const result = await service.getAllUsers();

        expect(result).toEqual({});
    });

    it("getUserById devuelve usuario si existe", async () => {
        (get as any).mockResolvedValue({
            exists: () => true,
            val: () => ({
                id: "u1",
                nombre: "Daniel"
            })
        });

        const result = await service.getUserById("u1");

        expect(result).toEqual({
            id: "u1",
            nombre: "Daniel"
        });
    });

    it("getUserById lanza error si no existe", async () => {
        (get as any).mockResolvedValue({
            exists: () => false
        });

        await expect(service.getUserById("u1"))
            .rejects
            .toThrow("Usuario con ID u1 no encontrado");
    });

    it("createUser llama a set", async () => {
        const profile = {
            id: "u1"
        } as any;

        await service.createUser(profile);

        expect(set).toHaveBeenCalledWith(
            expect.any(Object),
            profile
        );
    });

    it("updateUserProfile llama a update", async () => {
        await service.updateUserProfile("u1", {
            nombre: "Nuevo"
        });

        expect(update).toHaveBeenCalledWith(
            expect.any(Object),
            { nombre: "Nuevo" }
        );
    });

    it("setUserRole actualiza el rol", async () => {
        await service.setUserRole("u1", Role.ADMIN);

        expect(update).toHaveBeenCalledWith(
            expect.any(Object),
            { rol: Role.ADMIN }
        );
    });

    it("deleteUser llama a remove", async () => {
        await service.deleteUser("u1");

        expect(remove).toHaveBeenCalledWith(
            expect.any(Object)
        );
    });
});