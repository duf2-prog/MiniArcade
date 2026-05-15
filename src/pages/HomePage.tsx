import { FormattedMessage } from "react-intl";
import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllGames } from "../store/slices/GameSlice";
import type { RootState, AppDispatch } from "../store/Store";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const GameCard = lazy(() => import("../components/GameCard"));

export default function HomePage() {
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useContext(AuthContext);
    const games = useSelector((state: RootState) => state.games.games);
    const loading = useSelector((state: RootState) => state.games.loading);

    useEffect(() => {
        dispatch(fetchAllGames());
    }, [dispatch]);

    const activeGames = games.filter(g => g.activo);

    return (
        <div className="page-container">
            <h1 className="page-title">
                <FormattedMessage id="home.welcome" /> {user?.nombre}
            </h1>

            <p className="page-subtitle">
                <FormattedMessage id="home.subtitle" />
            </p>

            {loading && (
                <p className="page-loading">
                    <FormattedMessage id="common.loading" />
                </p>
            )}

            {!loading && activeGames.length === 0 && (
                <p className="page-empty">
                    <FormattedMessage id="home.noGames" />
                </p>
            )}

            {!loading && activeGames.length > 0 && (
                <div className="page-grid">
                    <Suspense fallback={<p className="page-loading"><FormattedMessage id="common.loading" /></p>}>
                        {activeGames.map(game => (
                            <GameCard key={game.id} game={game} />
                        ))}
                    </Suspense>
                </div>
            )}
        </div>
    );
}
