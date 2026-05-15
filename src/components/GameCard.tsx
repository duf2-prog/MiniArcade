import { lazy, Suspense, useContext, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router";
import { rankingService } from "../services/RankingService";
import { AuthContext } from "../contexts/AuthContext";
import type { Score } from "../entities/Entities";

const Table = lazy(() => import("./Table"));
const RegisterLoginModal = lazy(() => import("./RegisterLoginModal"));

interface GameCardProps {
    game: {
        id: string;
        nombre: string;
        descripcion: string;
    };
}

export default function GameCard({ game }: GameCardProps) {

    const { user } = useContext(AuthContext);
    const [ranking, setRanking] = useState<Score[]>([]);
    const [loading, setLoading] = useState(true);
    const [openAuthModal, setOpenAuthModal] = useState(false);

    const navigate = useNavigate();

    type RankingRow = Score & { pos: number };

    useEffect(() => {
        const load = async () => {
            setLoading(true);

            const data = await rankingService.getScoresByGame({
                juegoId: game.id,
                max: 50
            });

            const ranking: RankingRow[] = data.map((s, index) => ({
                ...s,
                pos: index + 1
            }));

            setRanking(ranking);
            setLoading(false);
        };

        load();
    }, []);


    return (
        <div className="card">
            <h2 className="card-title">
                <FormattedMessage id={`game.${game.nombre}`} />
            </h2>

            <p className="card-description">
                <FormattedMessage id={`game.${game.descripcion}`} />
            </p>

            <div className="card-table">
                <Suspense fallback={<div className="page-loading"><FormattedMessage id="common.loading" /></div>}>
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

            <button
                className="card-play-button"
                onClick={() => {
                    if (!user) setOpenAuthModal(true);
                    else navigate(`/games/${game.id}`);
                }}
            >
                <FormattedMessage id="game.play" />
            </button>

            <Suspense fallback={<div className="page-loading"><FormattedMessage id="common.loading" /></div>}>
                <RegisterLoginModal
                    isOpen={openAuthModal}
                    onClose={() => {
                        if (user && user.rol === "ADMIN") navigate("/admin");
                        setOpenAuthModal(false);
                    }}
                />
            </Suspense>
        </div>
    );
}