import { lazy, Suspense, type JSX } from "react";
import { FormattedMessage } from "react-intl";
import { useParams } from "react-router-dom"

const ReactionTestPage = lazy(() => import("./GameReactionTestPage"));
const ClickerChallengerPage = lazy(() => import("./GameClickerChallengerPage"));

const gamesMap: Record<string, JSX.Element> = {
    "reaction_test": <ReactionTestPage />,
    "clicker_challenger": <ClickerChallengerPage />
};

const GamePage = () => {

    const { gameId } = useParams();
    const game = gameId ? gamesMap[gameId] : null;

    if (!game) return <div><FormattedMessage id="common.notFound" /></div>;

    return <Suspense fallback={<p className="page-loading"><FormattedMessage id="common.loading" /></p>}>{game}</Suspense>;
};

export default GamePage;