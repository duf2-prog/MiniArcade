import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useClickerLogic from "../../../games/clicker/UseClickerLogic";
import { AuthContext } from "../../../contexts/AuthContext";

vi.useFakeTimers();

vi.mock("uuid", () => ({
    v4: () => "uuid-123"
}));

vi.mock("../../../services/ScoreService", () => ({
    scoreService: {
        createScore: vi.fn()
    }
}));

function advanceSeconds(seconds: number) {
    for (let i = 0; i < seconds; i++) {
        act(() => vi.advanceTimersByTime(1000));
    }
}

const wrapperWithUser = (user: any) => {
    return ({ children }: any) => (
        <AuthContext.Provider value={{ user, loading: false, setUser: vi.fn() }}>
            {children}
        </AuthContext.Provider>
    );
};

describe("useClickerLogic", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("empieza en estado idle", () => {
        const { result } = renderHook(() => useClickerLogic(), {
            wrapper: wrapperWithUser(null)
        });

        expect(result.current.state).toBe("idle");
        expect(result.current.score).toBe(0);
        expect(result.current.timeLeft).toBe(10);
    });

    it("startGame inicia countdown correctamente", () => {
        const { result } = renderHook(() => useClickerLogic(), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());

        expect(result.current.state).toBe("countdown");
        expect(result.current.countdown).toBe(3);
    });

    it("countdown pasa de 3 → 2 → 1 → running", () => {
        const { result } = renderHook(() => useClickerLogic(), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());

        advanceSeconds(1);
        expect(result.current.countdown).toBe(2);

        advanceSeconds(1);
        expect(result.current.countdown).toBe(1);

        advanceSeconds(1);
        expect(result.current.state).toBe("running");
    });

    it("click suma puntos solo en running", () => {
        const { result } = renderHook(() => useClickerLogic(), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());
        advanceSeconds(3);

        act(() => result.current.click());
        act(() => result.current.click());

        expect(result.current.score).toBe(2);
    });

    it("timeLeft baja de 10 a 0 y termina el juego", () => {
        const { result } = renderHook(() => useClickerLogic(), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());
        advanceSeconds(3);

        for (let i = 10; i > 0; i--) {
            expect(result.current.timeLeft).toBe(i);
            advanceSeconds(1);
        }

        expect(result.current.state).toBe("finished");
    });

    it("guarda score cuando hay usuario", async () => {
        const { scoreService } = await import("../../../services/ScoreService");

        const user = { id: "u1", nombre: "Daniel" };

        const { result } = renderHook(() => useClickerLogic(), {
            wrapper: wrapperWithUser(user)
        });

        act(() => result.current.startGame());
        advanceSeconds(3);

        act(() => result.current.click());
        act(() => result.current.click());

        advanceSeconds(10);

        expect(scoreService.createScore).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "uuid-123",
                usuario: "Daniel",
                usuarioId: "u1",
                puntuacion: 2
            })
        );
    });

    it("llama a onFinish al terminar", () => {
        const onFinish = vi.fn();

        const { result } = renderHook(() => useClickerLogic(onFinish), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());
        advanceSeconds(3);
        advanceSeconds(10);

        expect(onFinish).toHaveBeenCalled();
    });
});
