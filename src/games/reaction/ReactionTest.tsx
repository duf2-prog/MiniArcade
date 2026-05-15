import { FormattedMessage } from "react-intl";
import useReactionLogic from "./UseReactionLogic";

export default function ReactionTest({ onFinish }: { onFinish: () => void }) {

    const {
        score,
        state,
        countdown,
        startGame,
        click
    } = useReactionLogic(onFinish);

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

            {state === "waiting" && (
                <div className="reaction-box waiting" onClick={click}>
                    <FormattedMessage id="game.reaction_test.wait" />
                </div>
            )}

            {state === "ready" && (
                <div className="reaction-box ready" onClick={click}>
                    <FormattedMessage id="game.click" />
                </div>
            )}

            {state === "finished" && (
                <div className="game-finished">
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
