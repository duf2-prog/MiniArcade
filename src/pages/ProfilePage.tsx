import { useContext, useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useDispatch } from "react-redux";
import { FormattedDate, FormattedMessage } from "react-intl";
import { AuthContext } from "../contexts/AuthContext";
import { updateUserProfile } from "../store/slices/UserSlice";
import { rankingService } from "../services/RankingService";
import type { AppDispatch } from "../store/Store";

import { sortByField } from "../utils/SortByField";
import { useTableOrder } from "../hooks/UseTableOrder";

import GameSelector from "../components/GameSelector";

const Table = lazy(() => import("../components/Table"));

export default function ProfilePage() {

    const dispatch = useDispatch<AppDispatch>();
    const { user, setUser } = useContext(AuthContext);

    const [nombre, setNombre] = useState(user?.nombre ?? "");
    const [email] = useState(user?.email ?? "");
    const [avatar, setAvatar] = useState(user?.avatar ?? "");
    const [fechaRegistro] = useState(user?.fechaRegistro ?? "");

    const [scores, setScores] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [gameFilter, setGameFilter] = useState("");

    const order = useTableOrder<"juegoId" | "puntuacion" | "fechaRegistro">("fechaRegistro");

    if (!user) return null;

    useEffect(() => {
        if (user) {
            setNombre(user.nombre);
            setAvatar(user.avatar ?? "");
        }
    }, [user]);

    const saveProfile = () => {
        dispatch(updateUserProfile({
            uid: user.id,
            data: { nombre, avatar }
        }));
        setUser({
            ...user,
            nombre,
            avatar
        });
    };

    const loadInitial = useCallback(async () => {
        setLoading(true);

        let data;

        if (gameFilter) {
            data = await rankingService.getScoresByGame({
                juegoId: gameFilter,
                max: 999999
            });
            data = data.filter(s => s.usuarioId === user.id);
        } else {
            data = await rankingService.getScoresByUser({
                usuarioId: user.id,
                max: 999999
            });
        }

        const sorted = sortByField(data, order.orderField, order.orderDirection);
        setScores(sorted);

        setLoading(false);
    }, [user.id, order.orderField, order.orderDirection, gameFilter]);

    useEffect(() => {
        loadInitial();
    }, [loadInitial]);

    return (
        <div className="page-container">

            <h1 className="page-title">
                <FormattedMessage id="profile.title" />
            </h1>

            <h2 className="page-subtitle">
                <FormattedMessage id="profile.subtitle" />
            </h2>

            <div className="card mb-5">

                <div className="form-section">
                    <label className="text-white mb-1">
                        <FormattedMessage id="profile.username" />
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                </div>

                <div className="form-section">
                    <label className="text-white mb-1">
                        <FormattedMessage id="profile.email" />
                    </label>
                    <input
                        type="text"
                        className="input-field"
                        value={email}
                        disabled
                    />
                </div>

                <div className="form-section">
                    <label className="text-white mb-1">
                        <FormattedMessage id="profile.avatar" />
                    </label>

                    <div className="flex items-center gap-3">
                        <img
                            src={user.avatar}
                            alt="avatar"
                            className="profile-avatar"
                        />
                        <input
                            type="text"
                            className="input-field flex-1"
                            value={avatar}
                            onChange={(e) => setAvatar(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-section">
                    <label className="text-white mb-1">
                        <FormattedMessage id="profile.creationDate" />
                    </label>
                    <div className="input-field">
                        <FormattedDate
                            value={new Date(fechaRegistro)}
                        />
                    </div>
                </div>

                <button className="btn-primary" onClick={saveProfile}>
                    <FormattedMessage id="common.save" />
                </button>
            </div>

            <h2 className="section-title">
                <FormattedMessage id="profile.myScores" />
            </h2>

            <GameSelector value={gameFilter} onChange={setGameFilter} />

            <Suspense fallback={<div className="page-loading"><FormattedMessage id="common.loading" />...</div>}>
                <Table
                    columns={[
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
