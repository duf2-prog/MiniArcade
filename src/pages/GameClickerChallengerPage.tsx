import { lazy, Suspense, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import ClickerChallenger from "../games/clicker/ClickerChallenger";
import { rankingService } from "../services/RankingService";
import type { Score } from "../entities/Entities";

const Table = lazy(() => import("../components/Table"));

export default function GameClickerChallengerPage() {
    const [ranking, setRanking] = useState<Score[]>([]);
    const [loading, setLoading] = useState(true);

    const loadRanking = async () => {
        setLoading(true);

        const data = await rankingService.getScoresByGame({
            juegoId: "clicker_challenger",
            max: 50
        });

        const ranking = data.map((s, index) => ({
            ...s,
            pos: index + 1
        }));

        setRanking(ranking);
        setLoading(false);
    };

    useEffect(() => {
        loadRanking();
    }, []);

    return (
        <div className="page-container">

            <h1 className="page-title">
                <FormattedMessage id="game.clicker_challenger.name" />
            </h1>

            <p className="page-subtitle">
                <FormattedMessage id="game.clicker_challenger.description" />
            </p>

            <ClickerChallenger onFinish={loadRanking} />

            <h2 className="section-title mt-8">
                <FormattedMessage id="ranking.title" />
            </h2>

            <Suspense fallback={<p className="page-loading"><FormattedMessage id="common.loading" /></p>}>
                <Table
                    columns={[
                        { key: "pos", label: "ranking.position", order: null },
                        { key: "usuario", label: "ranking.player", order: null },
                        { key: "puntuacion", label: "ranking.score", order: null },
                    ]}
                    data={ranking}
                    loading={loading}
                />
            </Suspense>
        </div>
    );
}
