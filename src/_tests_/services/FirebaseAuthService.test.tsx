import { describe, it, expect, vi, beforeEach } from "vitest";
import { FirebaseAuthService } from "../../services/FirebaseAuthService";
import Logging from "../../services/Logging";

vi.mock("firebase/auth", () => ({
    getAuth: () => ({
        currentUser: { uid: "123" }
    }),
    signInWithEmailAndPassword: vi.fn(),
    createUserWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChanged: vi.fn()
}));

vi.mock("../../services/FirebaseConfig", () => ({
    app: {}
}));

vi.mock("../../services/Logging", () => ({
    default: {
        info: vi.fn(),
        debug: vi.fn()
    }
}));

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from "firebase/auth";

describe("FirebaseAuthService", () => {
    let service: FirebaseAuthService;

    beforeEach(() => {
        vi.clearAllMocks();
        service = new FirebaseAuthService();
    });

    it("signIn llama a Firebase y loggea", async () => {
        vi.mocked(signInWithEmailAndPassword).mockResolvedValue({} as any);

        await service.signIn("test@mail.com", "1234");

        expect(Logging.info).toHaveBeenCalledWith(
            "Intento de login con email test@mail.com"
        );

        expect(signInWithEmailAndPassword).toHaveBeenCalled();
    });

    it("signUp llama a Firebase y loggea", async () => {
        vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({} as any);

        await service.signUp("test@mail.com", "1234");

        expect(Logging.info).toHaveBeenCalledWith(
            "Intento de registro con email test@mail.com"
        );

        expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    });

    it("signOut llama a Firebase y loggea", async () => {
        vi.mocked(firebaseSignOut).mockResolvedValue(undefined);

        await service.signOut();

        expect(Logging.info).toHaveBeenCalledWith(
            "Cierre de sesión solicitado"
        );

        expect(firebaseSignOut).toHaveBeenCalled();
    });

    it("onAuthStateChanged registra callback y loggea", () => {
        const callback = vi.fn();
        const unsubscribe = vi.fn();

        vi.mocked(onAuthStateChanged).mockReturnValue(unsubscribe);

        const result = service.onAuthStateChanged(callback);

        expect(Logging.debug).toHaveBeenCalledWith(
            "Suscripción a onAuthStateChanged"
        );

        expect(onAuthStateChanged).toHaveBeenCalled();

        expect(result).toBe(unsubscribe);
    });

    it("getCurrentUser devuelve usuario actual", () => {
        const service = new FirebaseAuthService();

        expect(service.getCurrentUser()).toEqual({ uid: "123" });
    });
});