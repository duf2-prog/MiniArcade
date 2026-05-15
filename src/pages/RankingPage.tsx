import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { rankingService } from "../services/RankingService";
import type { Score } from "../entities/Entities";

import { sortByField } from "../utils/SortByField";
import { useTableOrder } from "../hooks/UseTableOrder";
import { useDebounce } from "../hooks/UseDebounce";

import GameSelector from "../components/GameSelector";

const Table = lazy(() => import("../components/Table"));

export default function RankingPage() {

    const [scores, setScores] = useState<Score[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 300);

    const [gameFilter, setGameFilter] = useState("");

    const order = useTableOrder<"puntuacion" | "fechaRegistro" | "juegoId" | "usuario">("puntuacion");

    const intl = useIntl();

    const loadScores = useCallback(async () => {
        setLoading(true);


        let data: Score[];

        if (gameFilter) {
            data = await rankingService.getScoresByGame({
                juegoId: gameFilter,
                max: 50
            });
        } else {
            data = await rankingService.getScores({
                orderField: order.orderField,
                orderDirection: order.orderDirection,
                searchUser: debouncedSearch,
                max: 50
            });
        }

        const sorted = sortByField(data, order.orderField, order.orderDirection);
        setScores(sorted);

        setLoading(false);
    }, [order.orderField, order.orderDirection, debouncedSearch, gameFilter]);

    useEffect(() => {
        loadScores();
    }, [loadScores]);

    return (
        <div className="page-container">
            <h1 className="page-title">
                <FormattedMessage id="ranking.title" />
            </h1>

            <p className="page-subtitle">
                <FormattedMessage id="ranking.subtitle" />
            </p>

            <GameSelector value={gameFilter} onChange={setGameFilter} />

            <div className="mb-6">
                <input
                    type="text"
                    placeholder={intl.formatMessage({ id: "ranking.searchUser" })}
                    className="input-field"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                    }}
                />
            </div>

            <Suspense fallback={<p className="page-loading"><FormattedMessage id="common.loading" /></p>}>
                <Table
                    columns={[
                        {
                            key: "usuario",
                            label: "ranking.player",
                            onClick: () => order.toggleOrder("usuario"),
                            order: order.orderField === "usuario" ? order.orderDirection : null
                        },
                        {
                            key: "juegoId",
                            label: "ranking.game",
                            onClick: () => order.toggleOrder("juegoId"),
                            order: order.orderField === "juegoId" ? order.orderDirection : null,
                            render: (g) => <FormattedMessage id={`game.${g.juegoId}.name`} />
                        },
                        {
                            key: "puntuacion",
                            label: "ranking.score",
                            onClick: () => order.toggleOrder("puntuacion"),
                            order: order.orderField === "puntuacion" ? order.orderDirection : null
                        },
                        {
                            key: "fechaRegistro",
                            label: "ranking.date",
                            onClick: () => order.toggleOrder("fechaRegistro"),
                            order: order.orderField === "fechaRegistro" ? order.orderDirection : null,
                            render: (g) => <FormattedDate value={new Date(g.fechaRegistro)} />
                        }
                    ]}
                    data={scores}
                    loading={loading}
                />
            </Suspense>
        </div>
    );
}
