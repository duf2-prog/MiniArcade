import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { AuthContext } from "../../../contexts/AuthContext";
import useReactionLogic from "../../../games/reaction/UseReactionLogic";

vi.useFakeTimers();

vi.mock("uuid", () => ({
    v4: () => "uuid-123"
}));

vi.mock("../../../services/ScoreService", () => ({
    scoreService: {
        createScore: vi.fn()
    }
}));

let currentTime = 1000;
vi.spyOn(performance, "now").mockImplementation(() => currentTime);
vi.spyOn(Math, "random").mockReturnValue(0);

function tick(ms: number) {
    act(() => {
        vi.advanceTimersByTime(ms);
    });
}

function advanceSeconds(seconds: number) {
    for (let i = 0; i < seconds; i++) tick(1000);
}

const wrapperWithUser = (user: any) => {
    return ({ children }: any) => (
        <AuthContext.Provider value={{ user, loading: false, setUser: vi.fn() }}>
            {children}
        </AuthContext.Provider>
    );
};

describe("useReactionLogic", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        currentTime = 1000;
    });

    it("empieza en idle", () => {
        const { result } = renderHook(() => useReactionLogic(), {
            wrapper: wrapperWithUser(null)
        });

        expect(result.current.state).toBe("idle");
        expect(result.current.score).toBe(null);
    });

    it("startGame inicia countdown", () => {
        const { result } = renderHook(() => useReactionLogic(), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());

        expect(result.current.state).toBe("countdown");
        expect(result.current.countdown).toBe(3);
    });

    it("countdown pasa 3 → 2 → 1 → waiting", () => {
        const { result } = renderHook(() => useReactionLogic(), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());

        advanceSeconds(1);
        expect(result.current.countdown).toBe(2);

        advanceSeconds(1);
        expect(result.current.countdown).toBe(1);

        advanceSeconds(1);
        expect(result.current.state).toBe("waiting");
    });

    it("waiting pasa a ready tras delay", () => {
        const { result } = renderHook(() => useReactionLogic(), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());
        advanceSeconds(3);

        tick(1000);

        expect(result.current.state).toBe("ready");
    });

    it("click demasiado pronto → penalización 9999", () => {
        const { result } = renderHook(() => useReactionLogic(), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());
        advanceSeconds(3);

        act(() => result.current.click());

        expect(result.current.state).toBe("finished");
        expect(result.current.score).toBe(9999);
    });

    it("click en ready calcula tiempo", () => {
        const { result } = renderHook(() => useReactionLogic(), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());
        advanceSeconds(3);

        tick(1000);

        currentTime = 1500;

        act(() => result.current.click());

        expect(result.current.state).toBe("finished");
        expect(result.current.score).toBe(500);
    });

    it("guarda score cuando hay usuario", async () => {
        const { scoreService } = await import("../../../services/ScoreService");

        const user = { id: "u1", nombre: "Daniel" };

        const { result } = renderHook(() => useReactionLogic(), {
            wrapper: wrapperWithUser(user)
        });

        act(() => result.current.startGame());
        advanceSeconds(3);
        tick(1000);

        currentTime = 2000;

        act(() => result.current.click());

        expect(scoreService.createScore).toHaveBeenCalledWith(
            expect.objectContaining({
                id: "uuid-123",
                usuario: "Daniel",
                usuarioId: "u1",
                puntuacion: 1000
            })
        );
    });

    it("llama a onFinish", () => {
        const onFinish = vi.fn();

        const { result } = renderHook(() => useReactionLogic(onFinish), {
            wrapper: wrapperWithUser(null)
        });

        act(() => result.current.startGame());
        advanceSeconds(3);
        tick(1000);

        currentTime = 3000;

        act(() => result.current.click());

        expect(onFinish).toHaveBeenCalled();
    });
});
