import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { scoreService } from "../../services/ScoreService";
import { v4 as uuid } from "uuid";

export default function useClickerLogic(onFinish?: () => void) {
    const { user } = useContext(AuthContext);

    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [countdown, setCountdown] = useState(0);

    const [state, setState] = useState<"idle" | "countdown" | "running" | "finished">("idle");

    const startGame = () => {
        setScore(0);
        setTimeLeft(10);
        setCountdown(3);
        setState("countdown");
    };

    useEffect(() => {
        if (state !== "countdown") return;
        if (countdown === 0) return;

        const timer = setTimeout(() => {
            if (countdown === 1) {
                setState("running");
            }
            setCountdown(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [state, countdown]);

    const click = () => {
        if (state === "running") {
            setScore(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (state !== "running") return;

        if (timeLeft === 0) {
            setState("finished");

            if (user) {
                const id = uuid();

                scoreService.createScore({
                    id,
                    juegoId: "clicker_challenger",
                    usuario: user.nombre,
                    usuarioLowercase: user.nombre.toLowerCase(),
                    usuarioId: user.id,
                    puntuacion: score,
                    fechaRegistro: new Date().toISOString()
                });
            }

            if (onFinish) onFinish();
            return;
        }

        const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearTimeout(timer);

    }, [state, timeLeft]);

    return {
        score,
        timeLeft,
        countdown,
        state,
        startGame,
        click
    };
}
