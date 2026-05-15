import { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { scoreService } from "../../services/ScoreService";
import { v4 as uuid } from "uuid";

export default function useReactionLogic(onFinish?: () => void) {
    const { user } = useContext(AuthContext);

    const [score, setScore] = useState<number | null>(null);
    const [state, setState] = useState<"idle" | "countdown" | "waiting" | "ready" | "finished">("idle");
    const [countdown, setCountdown] = useState(0);

    const startTimeRef = useRef<number>(0);
    const timeoutRef = useRef<number | null>(null);

    const startGame = () => {
        setScore(null);
        setState("countdown");
        setCountdown(3);
    };

    useEffect(() => {
        if (countdown === 0) return;

        const timer = setTimeout(() => {
            if (countdown === 1) {
                setState("waiting");

                const delay = 1000 + Math.random() * 3000;

                timeoutRef.current = window.setTimeout(() => {
                    startTimeRef.current = performance.now();
                    setState("ready");
                }, delay);
            }

            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown]);

    const click = () => {
        if (state === "waiting") {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
            setScore(9999);
            setState("finished");
            return;
        }

        if (state === "ready") {
            const end = performance.now();
            const time = Math.round(end - startTimeRef.current);

            setScore(time);
            setState("finished");

            if (user) {
                const id = uuid();

                scoreService.createScore({
                    id,
                    juegoId: "reaction_test",
                    usuario: user.nombre,
                    usuarioLowercase: user.nombre.toLowerCase(),
                    usuarioId: user.id,
                    puntuacion: time,
                    fechaRegistro: new Date().toISOString()
                });
            }

            if (onFinish) onFinish();
        }
    };

    return {
        score,
        state,
        countdown,
        startGame,
        click
    };
}
