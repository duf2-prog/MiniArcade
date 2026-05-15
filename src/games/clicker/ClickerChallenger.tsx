import { FormattedMessage } from "react-intl";
import useClickerLogic from "./UseClickerLogic";

export default function ClickerChallenger({ onFinish }: { onFinish: () => void }) {
    const {
        score,
        timeLeft,
        countdown,
        state,
        startGame,
        click
    } = useClickerLogic(onFinish);

    return (
        <div className="game-container">

            {state === "idle" && (
                <button className="btn-primary" onClick={startGame}>
                    <FormattedMessage id="game.start" />
                </button>
            )}

            {state === "countdown" && (
                <div className="countdown">
                    <h2 className="countdown-number">{countdown}</h2>
                </div>
            )}

            {state === "running" && (
                <>
                    <p className="info-text">
                        <FormattedMessage id="game.time" /> {timeLeft}s
                    </p>

                    <p className="info-text">
                        <FormattedMessage id="game.score" />: {score}
                    </p>

                    <button className="clicker-button" onClick={click}>
                        <FormattedMessage id="game.click" />
                    </button>
                </>
            )}

            {state === "finished" && (
                <div className="game-finished">
                    <h3><FormattedMessage id="game.finished" /></h3>

                    <p>
                        <FormattedMessage id="game.scoreSaved" values={{ score }} />
                    </p>

                    <button className="btn-primary mt-4" onClick={startGame}>
                        <FormattedMessage id="game.playAgain" />
                    </button>
                </div>
            )}
        </div>
    );
}
